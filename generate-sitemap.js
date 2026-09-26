#!/usr/bin/env node
/**
 * Rebuilds sitemap.xml from scratch by scanning every directory that has an index.html.
 * Deterministic — no duplicates. Run LAST: node generate-sitemap.js
 *
 * lastmod = the file's last git commit date, or today for files changed since then,
 * so Google gets an honest freshness signal instead of one frozen date.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { normalizeNav } = require('./site-nav');

const ROOT = __dirname;
const today = new Date().toISOString().slice(0, 10);

// Top-level dirs that are never pages
const SKIP = new Set(['node_modules', '.git', '.claude', '_before', 'assets']);

function walk(rel, out) {
  const abs = path.join(ROOT, rel);
  for (const d of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!d.isDirectory() || SKIP.has(d.name) || d.name.startsWith('.')) continue;
    const child = rel ? `${rel}/${d.name}` : d.name;
    if (fs.existsSync(path.join(ROOT, child, 'index.html'))) out.push(child);
    walk(child, out);
  }
  return out;
}

function lastmod(file) {
  try {
    const dirty = execSync(`git status --porcelain -- "${file}"`, { cwd: ROOT }).toString().trim();
    if (dirty) return today;
    const d = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT }).toString().trim();
    return d || today;
  } catch { return today; }
}

function priority(p) {
  if (p === '' || p === 'resizer') return '1.0';
  if (p === 'resizer/photo-signature-size-chart') return '0.9';
  if (/^resizer\/[^/]+-(photo|signature)-resize$/.test(p)) return '0.8';
  if (/-photo-signature-size$/.test(p) || p === 'resizer/size') return '0.8';
  if (p === 'privacy' || p === 'terms') return '0.3';
  return '0.7';
}

const pagesList = ['', ...walk('', [])].sort((a, b) => priority(b) - priority(a) || a.localeCompare(b));
const entries = pagesList.map(p => {
  const file = p ? `${p}/index.html` : 'index.html';
  const loc = `https://ilovexams.in/${p ? p + '/' : ''}`;
  return `  <url><loc>${loc}</loc><lastmod>${lastmod(file)}</lastmod><priority>${priority(p)}</priority></url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');

// Section sitemaps (optional extra submissions in Search Console → per-section indexing reports).
// sitemap.xml above stays the complete list.
const SECTIONS = {
  'sitemap-exam-pages.xml': p => /^resizer\/[^/]+-resize$/.test(p) || /^[a-z0-9-]+-photo-size$/.test(p),
  'sitemap-pixel-sizes.xml': p => p.startsWith('resizer/size'),
  'sitemap-exam-calculators.xml': p => /score-calculator|rank-predictor|typing-test|exam-calculators|^age-calculator/.test(p),
  'sitemap-pdf-image-tools.xml': p => /pdf|jpg|png|heic|webp|image|photo|signature|resize-|compress|marksheet|certificate/.test(p) && !p.startsWith('resizer/'),
};
const used = new Set();
const sectionFiles = [];
for (const [file, test] of Object.entries(SECTIONS)) {
  const list = pagesList.filter(p => p && !used.has(p) && test(p));
  list.forEach(p => used.add(p));
  const body = list.map(p => entries[pagesList.indexOf(p)]).join('\n');
  fs.writeFileSync(path.join(ROOT, file), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, 'utf8');
  sectionFiles.push(`${file} (${list.length})`);
}
const rest = pagesList.filter(p => !used.has(p));
fs.writeFileSync(path.join(ROOT, 'sitemap-core.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rest.map(p => entries[pagesList.indexOf(p)]).join('\n')}\n</urlset>\n`, 'utf8');
sectionFiles.push(`sitemap-core.xml (${rest.length})`);

// Site-wide post-processing. AdSense site verification: every page (incl. hand-written and older generated
// ones) must carry the account meta tag. Idempotent.
const ADS_META = '<meta name="google-adsense-account" content="ca-pub-9837613085159910">';
let tagged = 0, navFixed = 0;
const crypto = require('crypto');
const ASSET_V = {};
(function hashAssets(dir, rel) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${d.name}` : d.name;
    if (d.isDirectory()) hashAssets(path.join(dir, d.name), r);
    else if (/\.(css|js)$/.test(d.name)) ASSET_V[r] = crypto.createHash('md5').update(fs.readFileSync(path.join(dir, d.name))).digest('hex').slice(0, 8);
  }
})(path.join(ROOT, 'assets'), '');
for (const p of [...pagesList.map(p => p ? `${p}/index.html` : 'index.html'), '404.html']) {
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8');
  let out = h.includes('google-adsense-account') ? h : h.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n  ${ADS_META}`);
  if (out !== h) tagged++;
  // Cache-busting: /assets/x.css → /assets/x.css?v=<content hash>
  out = out.replace(/(["'])\/assets\/([\w\/.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?\1/g, (m, q, file) => ASSET_V[file] ? `${q}/assets/${file}?v=${ASSET_V[file]}${q}` : m);
  // Same top-bar menu on every page (see site-nav.js)
  const navved = normalizeNav(out);
  if (navved !== out) navFixed++;
  if (navved !== h) fs.writeFileSync(f, navved, 'utf8');
}
if (tagged) console.log(`✅ Added AdSense account meta to ${tagged} pages`);
if (navFixed) console.log(`✅ Normalised top menu on ${navFixed} pages`);
console.log(`✅ Sitemap rebuilt: ${entries.length} URLs · sections: ${sectionFiles.join(', ')}`);
