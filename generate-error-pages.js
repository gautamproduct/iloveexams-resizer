#!/usr/bin/env node
/**
 * One page per real upload error people paste into Google (from Search Console):
 *   /resizer/fix/{slug}/  — what the message means + the resizer preset that passes it.
 * The FIXES list is shared with search-terms.js (`match`) so those exact queries land here.
 * Run: node generate-error-pages.js
 */
const fs = require('fs');
const path = require('path');
const S = require('./seo-shell');
const { FIXES } = require('./error-fixes');
const { SITE, MONTH_YEAR, esc } = S;

const ROOT = __dirname;
const write = (rel, html) => {
  fs.mkdirSync(path.join(ROOT, rel), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel, 'index.html'), html, 'utf8');
};
const presetURL = ({ slug, w, h, min, max, title, canon }) =>
  `/resizer/?preset=${encodeURIComponent(slug)}&w=${w}&h=${h}&minkb=${min}&maxkb=${max}&fmt=JPG&title=${encodeURIComponent(title)}&canon=${encodeURIComponent(canon)}&embed=1`;

for (const f of FIXES) {
  const canonical = `${SITE}/resizer/fix/${f.slug}/`;
  const p = f.preset;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'Upload errors', url: `${SITE}/resizer/fix/` }, { name: f.short, url: canonical }];
  const faqs = [
    { q: `What does “${f.error}” mean?`, a: f.means },
    { q: 'How do I fix it?', a: `Use the tool on this page: it is preset to <strong>${p.w}×${p.h} px, ${p.min}–${p.max} KB, JPG</strong>, which passes this check. Upload your file, adjust the crop and download.` },
    { q: 'Why does the form still reject my file?', a: 'Re-check the exact numbers in your notification (width × height and KB). Portals also reject PNG/HEIC files renamed to .jpg — this tool always saves a real JPG. <a href="/resizer/guides/upload-error-messages-explained/">More upload errors explained</a>.' },
    ...(f.faq || []),
  ];
  const title = `Fix “${f.titleText}” – Free Resizer (${p.w}×${p.h})`;
  const desc = `${f.short}: ${f.means.replace(/<[^>]+>/g, '')}`.slice(0, 300);
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.faqSchema(faqs)] })}
<header class="hero lt"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>Fix: “${esc(f.titleText)}”</h1>
  <p class="lede">Got this error on an exam or job form? Resize your ${f.doc} to <strong>${p.w}×${p.h} px, ${p.min}–${p.max} KB</strong> below — it passes this check. Free, nothing uploaded.</p>
  <p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>
</div></header>
<main class="wrap">
  <div class="answer"><p><strong>Error:</strong> “${esc(f.error)}”</p><p>${f.means}</p></div>
  ${S.toolFrame(presetURL({ slug: `fix-${f.slug}`, ...p, title: f.short, canon: canonical }), `${f.short} — ${p.w}×${p.h}px, ${p.min}–${p.max} KB`)}
  <section class="card"><h2>Fix it in 3 steps</h2><ol>
    <li>Upload your ${f.doc} in the tool above (photo, scan or screenshot — JPG, PNG or HEIC).</li>
    <li>Adjust the crop. The tool saves exactly <strong>${p.w}×${p.h} px</strong> within <strong>${p.min}–${p.max} KB</strong>${p.note ? ` — ${p.note}` : ''}.</li>
    <li>Download and upload it to the form again. If your notification gives different numbers, change the size and KB in the tool.</li>
  </ol></section>
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <section class="card"><h2>Other upload errors</h2><ul class="links">${FIXES.filter(x => x !== f).map(x => `<li><a href="/resizer/fix/${x.slug}/">${esc(x.short)}</a></li>`).join('')}<li><a href="/resizer/guides/upload-error-messages-explained/">All errors explained</a></li></ul></section>
</main>
${S.footer()}`;
  write(`resizer/fix/${f.slug}`, html);
}

// Index
{
  const canonical = `${SITE}/resizer/fix/`;
  const title = `Photo & Signature Upload Errors – Exact Fix for Each (${S.YEAR})`;
  const desc = 'Exam and job portals reject photos and signatures with messages like “must be at least 300px width”. Find your exact error and fix it with a preset resizer — free.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'Upload errors', url: canonical }];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs })] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Upload Error? Find Your Exact Message</h1><p class="lede">Each page explains one real error message from exam and job portals and gives you a resizer preset that passes it.</p></div></header>
<main class="wrap">
  <section class="card"><h2>Error messages</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Error message</th><th>Fix</th></tr></thead><tbody>
  ${FIXES.map(f => `<tr><td>“${esc(f.error)}”</td><td class="m"><a href="/resizer/fix/${f.slug}/">${f.preset.w}×${f.preset.h} px, ${f.preset.min}–${f.preset.max} KB</a></td></tr>`).join('\n  ')}
  </tbody></table></div></section>
  <section class="card"><h2>Still stuck?</h2><p><a href="/resizer/guides/upload-error-messages-explained/">Upload errors explained</a> · <a href="/resizer/guides/photo-upload-rejected-reasons/">Why photos get rejected</a> · <a href="/resizer/">Pick your exam</a></p></section>
</main>
${S.footer()}`;
  write('resizer/fix', html);
}
console.log(`✅ Generated ${FIXES.length} upload-error fix pages + index`);
