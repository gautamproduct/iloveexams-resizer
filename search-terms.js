#!/usr/bin/env node
/**
 * Search Console queries → the exact words people type, printed on the page they belong to.
 *
 *   node search-terms.js ~/Downloads/<export>/Queries.csv [more Queries.csv …]
 *
 * Merges every export into search-terms.json ({ "/resizer/…/": [{ q, imp }] }, impressions summed
 * per query, max per export so overlapping 7/28-day exports don't double count).
 * generate-sitemap.js then adds a "People also search" card with those exact phrases to each page.
 * Queries it can't place are listed so a page or rule can be added for them.
 */
const fs = require('fs');
const path = require('path');
const { EXAMS, seoOf, BANK_EXTRA_EXAMS, EXTRA_SIZES } = require('./exams-data');
const { FIXES } = require('./error-fixes');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'search-terms.json');

// ─── CSV (Search Console wraps long queries over several lines inside quotes) ────
function parseCsv(txt) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// ─── Page targets ────────────────────────────────────────────────────────────
const sizes = new Set();
EXAMS.forEach(e => { sizes.add(`${e.photo.w}x${e.photo.h}`); sizes.add(`${e.sig.w}x${e.sig.h}`); });
EXTRA_SIZES.forEach(x => sizes.add(`${x.w}x${x.h}`));
const sizePage = (a, b) => sizes.has(`${a}x${b}`) ? `/resizer/size/${a}x${b}-pixels/` : sizes.has(`${b}x${a}`) ? `/resizer/size/${b}x${a}-pixels/` : null;

// Exam names as people type them, longest first so "ibps rrb po" wins over "ibps"
const examAlias = [];
EXAMS.forEach(e => {
  const s = seoOf(e);
  [e.slug.replace(/-/g, ' '), s.short, ...(s.alt || [])].forEach(a => examAlias.push([a.toLowerCase(), e.slug]));
});
[['rrb po', 'ibps-rrb-po'], ['rrb clerk', 'ibps-rrb-clerk'], ['ibps', 'ibps-po'], ['sbi', 'sbi-po'], ['csir', 'csir-net'],
 ['neet', 'neet-ug'], ['ssc', 'ssc-cgl'], ['nda', 'upsc-nda'], ['cds', 'upsc-cds'], ['ugc net', 'ugc-net'], ['jee', 'jee-main']]
  .forEach(x => examAlias.push(x));
examAlias.sort((a, b) => b[0].length - a[0].length);
const examIn = q => { for (const [a, slug] of examAlias) if (new RegExp(`(^|[^a-z])${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(q)) return slug; return null; };

const missingSizes = {};
function target(q) {
  // Portal error messages people paste into Google
  for (const f of FIXES) if (f.match.test(q)) return `/resizer/fix/${f.slug}/`;
  if (/must be|your file is|should be less than|size of sign/.test(q)) return '/resizer/guides/upload-error-messages-explained/';
  if (/post ?card|postal size/.test(q)) return /neet/.test(q) ? '/resizer/neet-ug-postcard-photo-resize/' : '/resizer/postcard-size-photo-resize/';
  const exam = examIn(q);
  if (/declaration|thumb/.test(q)) {
    const doc = /thumb/.test(q) ? 'thumb-impression' : 'declaration';
    let slug = exam && BANK_EXTRA_EXAMS.includes(exam) ? exam : /rrb/.test(q) ? 'ibps-rrb-po' : /bank|ibps/.test(q) ? 'ibps-po' : null;
    return slug ? `/resizer/${slug}-${doc}-resize/` : '/resizer/guides/ibps-thumb-impression-handwritten-declaration/';
  }
  // "250 pixel width and height", "less than 250 pixel width and height" → square
  let m = q.match(/(\d{2,4})\s*(?:px|pixels?)\s*(?:width and height|height and width)/);
  if (m) return sizePage(+m[1], +m[1]);
  // "width 300 height 100", "100 width * 120 height", "height 450px and width 350px"
  m = q.match(/width\D{0,4}(\d{2,4})\D{1,12}height\D{0,4}(\d{2,4})/) || q.match(/(\d{2,4})\s*(?:px)?\s*width\D{1,6}(\d{2,4})\s*(?:px)?\s*height/);
  if (m) return sizePage(+m[1], +m[2]) || (missingSizes[`${m[1]}x${m[2]}`] = 1, null);
  m = q.match(/height\D{0,4}(\d{2,4})\D{1,12}width\D{0,4}(\d{2,4})/);
  if (m) return sizePage(+m[2], +m[1]) || (missingSizes[`${m[2]}x${m[1]}`] = 1, null);
  // "60px 140px", "140 x 60", "250*250", "300-120", "250 + 250", "320/400", "413 531"
  m = q.match(/(?:^|[^\d.])(\d{2,4})\s*(?:px|pixels?)?\s*(?:[x×*+\-\/]|\s|\sto\s|\sby\s)\s*(\d{2,4})(?!\s*(?:kb|dpi|%|\d))/);
  if (m && +m[1] >= 20 && +m[2] >= 20) {
    const p = sizePage(+m[1], +m[2]);
    if (p) return p;
    missingSizes[`${m[1]}x${m[2]}`] = (missingSizes[`${m[1]}x${m[2]}`] || 0) + 1;
  }
  // One number: "jpg 250 pixel", "250px image" → that square size if it exists
  m = q.match(/(?:^|\D)(\d{2,4})\s*(?:px|pixels?)(?!\s*\d)/) || q.match(/pixels?\s*(\d{2,4})(?!\s*kb)/);
  if (m && !exam && sizes.has(`${m[1]}x${m[1]}`)) return sizePage(+m[1], +m[1]);
  if (exam) {
    if (/sign/.test(q) && !/photo|image|pic/.test(q)) return `/resizer/${exam}-signature-resize/`;
    return `/resizer/${exam}-photo-resize/`;
  }
  if (/psc/.test(q)) return '/resizer/state-psc-photo-signature-size/';
  if (/size chart|government exam|govt exam/.test(q)) return '/resizer/photo-signature-size-chart/';
  if (/scan/.test(q) && /sign/.test(q)) return '/resizer/guides/scan-signature-for-online-form/';
  if (/reject/.test(q)) return '/resizer/guides/photo-upload-rejected-reasons/';
  // Only a KB target: "photo resize 50 kb", "signature 20 kb"
  m = q.match(/(\d{1,3})\s*kb/);
  if (m) {
    const kind = /sign/.test(q) ? 'signature' : 'photo';
    for (const u of [`/resize-${kind}-to-${m[1]}kb/`, `/resize-image-to-${m[1]}kb/`]) if (fs.existsSync(path.join(ROOT, u, 'index.html'))) return u;
  }
  return null;
}

// ─── Merge exports ───────────────────────────────────────────────────────────
const files = process.argv.slice(2);
if (!files.length) { console.error('Usage: node search-terms.js <Queries.csv> [...]'); process.exit(1); }
const imp = {}; // query -> max impressions seen in any one export
for (const f of files) {
  const rows = parseCsv(fs.readFileSync(f, 'utf8')).slice(1).filter(r => r.length >= 3);
  for (const r of rows) {
    const q = r[0].replace(/\s+/g, ' ').trim().toLowerCase();
    if (q) imp[q] = Math.max(imp[q] || 0, +r[2] || 0);
  }
}
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const all = {};
for (const list of Object.values(prev)) for (const { q, imp: n } of list) all[q] = Math.max(all[q] || 0, n);
for (const [q, n] of Object.entries(imp)) all[q] = Math.max(all[q] || 0, n);

const out = {}, unplaced = [];
for (const [q, n] of Object.entries(all)) {
  const t = target(q);
  if (t && fs.existsSync(path.join(ROOT, t, 'index.html'))) (out[t] = out[t] || []).push({ q, imp: n });
  else if (t && t.startsWith('/resizer/size/')) (out[t] = out[t] || []).push({ q, imp: n }); // page is built from EXTRA_SIZES on the next build
  else unplaced.push([n, q, t]);
}
for (const k of Object.keys(out)) out[k].sort((a, b) => b.imp - a.imp || a.q.localeCompare(b.q));
fs.writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(out).sort()), null, 1) + '\n', 'utf8');

const placed = Object.values(out).reduce((s, l) => s + l.length, 0);
console.log(`✅ ${placed} queries placed on ${Object.keys(out).length} pages → search-terms.json`);
const ms = Object.entries(missingSizes).sort((a, b) => b[1] - a[1]).slice(0, 25);
if (ms.length) console.log(`📐 Sizes searched with no page (add to EXTRA_SIZES): ${ms.map(([k, n]) => `${k}(${n})`).join(' ')}`);
unplaced.sort((a, b) => b[0] - a[0]);
console.log(`… ${unplaced.length} not placed; top:`); unplaced.slice(0, 30).forEach(([n, q, t]) => console.log(`   ${n}\t${q.slice(0, 90)}${t ? `  (→ ${t} missing)` : ''}`));
