#!/usr/bin/env node
/**
 * SEO / AdSense / sitemap audit over the built site. Run after ./build.sh:
 *   node audit-seo.js        → prints "NO ISSUES" or a list of problems
 */
const fs = require('fs'), path = require('path');
process.chdir(__dirname);
const SITE = 'https://ilovexams.in/';
const locs = [...fs.readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/ilovexams\.in\/([^<]*)<\/loc>/g)].map(m => m[1]);
const K = l => l.replace(/\/$/, '');
const issues = {}, inbound = {}, pages = {};
const add = (k, v) => (issues[k] = issues[k] || []).push(v);

for (const l of locs) {
  const h = fs.readFileSync(path.join(l || '.', 'index.html'), 'utf8');
  pages[l] = h;
  const canon = (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canon !== SITE + l) add('canonical ≠ URL', `${l} → ${canon}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(h)) add('noindex in sitemap', l);
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) add('h1 count ≠ 1', `${l}: ${h1}`);
  const title = ((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&');
  if (!title) add('missing title', l); else if (title.length > 72) add('title > 72', `${title.length} ${l}`);
  const desc = ((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').replace(/&amp;/g, '&');
  if (!desc) add('missing description', l); else if (desc.length > 175 || desc.length < 60) add('description length', `${desc.length} ${l}`);
  if (!/property="og:image"/.test(h)) add('missing og:image', l);
  if (!/<html lang=/.test(h)) add('missing html lang', l);
  if (/(?:href|src)="http:\/\//.test(h)) add('http:// link', l);
  if ([...h.matchAll(/<img\b[^>]*>/g)].some(m => !/\balt=/.test(m[0]))) add('img without alt', l);
  const ads = (h.match(/<ins class="adsbygoogle"/g) || []).length;
  if (ads > 3) add('more than 3 ad units', `${l}: ${ads}`);
  if (ads && /^(about|contact|privacy|terms|resizer\/guides)\/?$/.test(l)) add('ads on non-content page', l);
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]); } catch (e) { add('invalid JSON-LD', l); return null; } }).filter(Boolean);
  const faq = ld.find(x => x['@type'] === 'FAQPage');
  if (faq) {
    const visible = (h.match(/<details class="faq">|class="faq-item"|<details style="border:1px solid #e2e8f0/g) || []).length;
    if (!visible) add('FAQ schema without visible FAQ', l);
    else if (visible !== faq.mainEntity.length) add('FAQ schema ≠ visible FAQs', `${l}: ${faq.mainEntity.length} vs ${visible}`);
  }
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) {
    const key = K(m[1].replace(/^\//, ''));
    if (key !== K(l)) inbound[key] = (inbound[key] || 0) + 1;
    const t = m[1].endsWith('/') ? path.join('.', m[1], 'index.html') : path.join('.', m[1]);
    if (!fs.existsSync(t)) add('broken internal link', `${m[1]} ← ${l}`);
  }
}
const orphans = locs.filter(l => l && !inbound[K(l)]);
if (orphans.length) issues['orphan (no internal links)'] = orphans;
const dupe = (re, name) => { const m = {}; for (const l of locs) { const v = (pages[l].match(re) || [])[1]; if (v) (m[v] = m[v] || []).push(l); } Object.values(m).filter(v => v.length > 1).forEach(v => add(name, v.join(', '))); };
dupe(/<title>([^<]*)<\/title>/, 'duplicate title');
dupe(/<meta name="description" content="([^"]*)"/, 'duplicate description');
for (const f of [...fs.readdirSync('.').filter(f => /^sitemap.*\.xml$/.test(f)), ...fs.readdirSync('resizer').filter(f => /^sitemap.*\.xml$/.test(f)).map(f => 'resizer/' + f)]) {
  const x = fs.readFileSync(f, 'utf8');
  if (!x.startsWith('<?xml') || !/<\/urlset>\s*$/.test(x)) add('bad sitemap file', f);
  const all = [...x.matchAll(/<loc>([^<]+)/g)].map(m => m[1]);
  if (new Set(all).size !== all.length) add('duplicate loc in sitemap', f);
  if (f.startsWith('resizer/') && all.some(u => !u.startsWith(SITE + 'resizer/'))) add('URL outside /resizer/ in /resizer/ sitemap', f);
}
console.log(`Audited ${locs.length} sitemap URLs`);
console.log(Object.keys(issues).length ? JSON.stringify(issues, null, 1) : 'NO ISSUES');
