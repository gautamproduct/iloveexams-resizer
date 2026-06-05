#!/usr/bin/env node
/**
 * Rebuilds sitemap.xml from scratch by scanning generated directories.
 * Deterministic — no duplicates. Run LAST: node generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const today = '2026-06-05';
const ROOT = __dirname;

function hasIndex(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}
function dirsWithIndex(base) {
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory() && hasIndex(path.join(base, d.name)))
    .map(d => d.name)
    .sort();
}

const url = (loc, priority, freq = 'monthly') =>
  `  <url><loc>https://ilovexams.in/${loc}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;

// Top-level dirs that are NOT tool pages
const NON_TOOL = new Set(['resizer', 'privacy', 'terms', 'node_modules', '.git', '.claude']);

const examSlugs = dirsWithIndex(path.join(ROOT, 'resizer'));
const toolSlugs = dirsWithIndex(ROOT).filter(d => !NON_TOOL.has(d));

const entries = [];
entries.push(url('', '1.0', 'weekly'));
entries.push(url('resizer/', '1.0', 'weekly'));
entries.push('  <!-- Legal -->');
entries.push(url('privacy/', '0.3', 'yearly'));
entries.push(url('terms/', '0.3', 'yearly'));
entries.push('  <!-- Tool landing pages -->');
toolSlugs.forEach(s => entries.push(url(`${s}/`, '0.8')));
entries.push('  <!-- Exam landing pages -->');
examSlugs.forEach(s => entries.push(url(`resizer/${s}/`, '0.8')));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
const realUrls = entries.filter(e => e.includes('<loc>')).length;
console.log(`✅ Sitemap rebuilt: ${realUrls} URLs (${toolSlugs.length} tools, ${examSlugs.length} exam pages)`);
