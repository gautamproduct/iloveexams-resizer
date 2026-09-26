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

const ROOT = __dirname;
const today = new Date().toISOString().slice(0, 10);

// Top-level dirs that are never pages
const SKIP = new Set(['node_modules', '.git', '.claude']);

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

// AdSense site verification: every page (incl. hand-written and older generated
// ones) must carry the account meta tag. Idempotent.
const ADS_META = '<meta name="google-adsense-account" content="ca-pub-9837613085159910">';
let tagged = 0;
for (const p of [...pagesList.map(p => p ? `${p}/index.html` : 'index.html'), '404.html']) {
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8');
  if (h.includes('google-adsense-account')) continue;
  const out = h.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n  ${ADS_META}`);
  if (out !== h) { fs.writeFileSync(f, out, 'utf8'); tagged++; }
}
if (tagged) console.log(`✅ Added AdSense account meta to ${tagged} pages`);
console.log(`✅ Sitemap rebuilt: ${entries.length} URLs`);
