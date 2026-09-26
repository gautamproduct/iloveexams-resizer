#!/usr/bin/env node
/**
 * Generates the SEO "hub" layer around the exam landing pages:
 *   /resizer/photo-signature-size-chart/        master chart of every exam
 *   /resizer/{category-hub}/                     one hub per exam category
 *   /resizer/{bank-exam}-thumb-impression-resize/, -declaration-resize/
 *   /resizer/size/ and /resizer/size/{W}x{H}-pixels/   generic pixel-size resizers
 *   /llms.txt                                    summary for AI answer engines
 * and rewrites the size table inside resizer/index.html from exams-data.js.
 *
 * Run after generate-pages.js:  node generate-seo-hubs.js
 */

const fs = require('fs');
const path = require('path');

const D = require('./exams-data');
const { EXAMS, seoOf, CATEGORIES, BANK_EXTRA_EXAMS, BANK_EXTRA_DOCS, DECLARATION_TEXT, EXTRA_SIZES, NEET_POSTCARD } = D;
const S = require('./seo-shell');
const { SITE, YEARS: YEAR, MONTH_YEAR, esc } = S;

const ROOT = __dirname;
const write = (rel, html) => {
  const dir = path.join(ROOT, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
};
const px = sp => `${sp.w}×${sp.h}`;
const kb = sp => `${sp.min}–${sp.max} KB`;
const mode = arr => { const c = {}; arr.forEach(x => c[x] = (c[x] || 0) + 1); return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]; };
const presetURL = ({ slug, w, h, min, max, title, canon, unit, dpi }) =>
  `/resizer/?preset=${encodeURIComponent(slug)}&w=${w}&h=${h}&minkb=${min}&maxkb=${max}&fmt=JPG&title=${encodeURIComponent(title)}&canon=${encodeURIComponent(canon)}${unit ? `&unit=${unit}&dpi=${dpi}` : ''}&embed=1`;

let pages = 0;

// ─── 0. Guard: engine data must match exams-data.js ───────────────────────────
const enginePath = path.join(ROOT, 'resizer', 'index.html');
let engine = fs.readFileSync(enginePath, 'utf8');
{
  const i = engine.indexOf('const EXAMS = [');
  const j = engine.indexOf('\n];', i);
  const engineExams = eval('(' + engine.slice(i + 14, j + 2) + ')');
  const bad = EXAMS.filter(a => {
    const b = engineExams.find(x => x.slug === a.slug);
    return !b || JSON.stringify([a.photo, a.sig]) !== JSON.stringify([b.photo, b.sig]);
  });
  if (bad.length || engineExams.length !== EXAMS.length) {
    console.error('❌ Spec mismatch between exams-data.js and resizer/index.html:', bad.map(e => e.slug).join(', '));
    process.exit(1);
  }
}

// ─── Shared: exam table rows ─────────────────────────────────────────────────
const examTable = (list, { showCat = false } = {}) => `<div class="tbl-wrap"><table class="grid">
  <thead><tr><th>Exam</th>${showCat ? '<th>Category</th>' : ''}<th>Photo (px)</th><th>Photo KB</th><th>Signature (px)</th><th>Signature KB</th></tr></thead>
  <tbody>
  ${list.map(e => `<tr><td><strong>${esc(seoOf(e).short)}</strong></td>${showCat ? `<td>${esc(e.cat)}</td>` : ''}<td class="m"><a href="/resizer/${e.slug}-photo-resize/">${px(e.photo)}</a></td><td class="m">${kb(e.photo)}</td><td class="m"><a href="/resizer/${e.slug}-signature-resize/">${px(e.sig)}</a></td><td class="m">${kb(e.sig)}</td></tr>`).join('\n  ')}
  </tbody></table></div>`;

// ─── 1. Category hubs ─────────────────────────────────────────────────────────
for (const [catName, cat] of Object.entries(CATEGORIES)) {
  const list = EXAMS.filter(e => e.cat === catName);
  if (!list.length) continue;
  const canonical = `${SITE}/resizer/${cat.hub}/`;
  const title = `${cat.title.replace(/\s*\(.*\)/, '')} Photo & Signature Size ${YEAR} – ${list.length} Exams`;
  const desc = `Photo and signature size for ${list.length} ${cat.title.replace(/\s*\(.*\)/, '')} in ${YEAR}: pixels, KB and format for ${list.slice(0, 4).map(e => seoOf(e).short).join(', ')} and more. Resize free in one click.`;
  const mp = mode(list.map(e => `${px(e.photo)} px, ${kb(e.photo)}`));
  const ms = mode(list.map(e => `${px(e.sig)} px, ${kb(e.sig)}`));
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: cat.title, url: canonical }];
  const faqs = [
    { q: `What is the most common photo size for ${cat.title.replace(/\s*\(.*\)/, '')}?`, a: `Most ${esc(cat.title.replace(/\s*\(.*\)/, ''))} ask for a photo of <strong>${mp}</strong> and a signature of <strong>${ms}</strong>, in JPG format. Check the table for each exam's exact size.` },
    ...list.slice(0, 6).map(e => ({ q: `What is the ${seoOf(e).short} photo and signature size?`,
      a: `${esc(e.name)} photo: ${px(e.photo)} px, ${kb(e.photo)}. Signature: ${px(e.sig)} px, ${kb(e.sig)}. Both ${e.photo.fmt}. <a href="/resizer/${e.slug}-photo-resize/">Resize ${esc(seoOf(e).short)} photo</a>.` })),
  ];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.faqSchema(faqs),
    { '@context': 'https://schema.org', '@type': 'ItemList', name: title, itemListElement: list.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/resizer/${e.slug}-photo-resize/`, name: `${e.name} photo size` })) }] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>${esc(cat.title)} Photo &amp; Signature Size ${YEAR}</h1>
  <p class="lede">Exact photo and signature dimensions, KB limits and format for <strong>${list.length} ${esc(cat.title.replace(/\s*\(.*\)/, ''))}</strong>. Tap any size to open that exam's free resizer.</p>
  <p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>
</div></header>
<main class="wrap">
  <div class="answer"><p>Most ${esc(cat.title.replace(/\s*\(.*\)/, ''))} require a <strong>photo of ${mp}</strong> and a <strong>signature of ${ms}</strong> in JPG format. The exact requirement for every exam is in the table below.</p></div>
  <section class="card"><h2>${esc(cat.title)} — Size Chart ${YEAR}</h2>${examTable(list)}</section>
  ${catName === 'Banking' ? `<section class="card"><h2>Thumb impression &amp; handwritten declaration</h2><p>IBPS, SBI, RBI, NIACL and LIC AAO forms also need a <strong>left thumb impression (240×240px, 20–50 KB)</strong> and a <strong>handwritten declaration (800×400px, 50–100 KB)</strong>.</p><ul class="links">${BANK_EXTRA_EXAMS.map(s => EXAMS.find(e => e.slug === s)).map(e => `<li><a href="/resizer/${e.slug}-declaration-resize/">${esc(seoOf(e).short)} declaration</a></li><li><a href="/resizer/${e.slug}-thumb-impression-resize/">${esc(seoOf(e).short)} thumb</a></li>`).join('')}</ul></section>` : ''}
  <section class="card"><h2>How to get your ${esc(cat.title.replace(/\s*\(.*\)/, ''))} photo &amp; signature accepted</h2>
    <ol style="margin:0;padding-left:20px">
      <li><strong>Find your exam's exact size</strong> in the table above — sizes differ even between exams from the same body, and the portal checks them strictly.</li>
      <li><strong>Start from a good original.</strong> Take a fresh photo against a plain white wall in daylight, and sign in black ink on white paper. <a href="/resizer/guides/take-exam-photo-with-phone/">Photo guide</a> · <a href="/resizer/guides/scan-signature-for-online-form/">Signature guide</a>.</li>
      <li><strong>Crop to the required shape before resizing</strong>, so your face or signature is not stretched. Every resizer here locks the crop to the right ratio.</li>
      <li><strong>Hit the KB window, not just the pixels.</strong> Files below the minimum are rejected just like files above the maximum — the tool handles both.</li>
      <li><strong>Save as JPG</strong> and check the preview before you submit. If something goes wrong, see <a href="/resizer/guides/photo-upload-rejected-reasons/">12 reasons uploads get rejected</a>.</li>
    </ol>
  </section>
  ${S.adSlot()}
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <section class="card"><h2>Other exam categories</h2><ul class="links">${Object.values(CATEGORIES).filter(c => c !== cat).map(c => `<li><a href="/resizer/${c.hub}/">${esc(c.title)}</a></li>`).join('')}<li><a href="/resizer/photo-signature-size-chart/">All exams chart</a></li></ul></section>
  <p class="note">Compiled from recent official notifications (last review: ${MONTH_YEAR}). Always verify against the latest notification — the resizer lets you edit width, height and KB if a size changes.</p>
</main>
${S.footer()}`;
  write(`resizer/${cat.hub}`, html); pages++;
}

// ─── 2. Master chart ──────────────────────────────────────────────────────────
{
  const canonical = `${SITE}/resizer/photo-signature-size-chart/`;
  const title = `Photo & Signature Size for All Govt Exams ${YEAR} (${EXAMS.length}+ Exams Chart)`;
  const desc = `Photo and signature size chart ${YEAR} for ${EXAMS.length}+ Indian exams — UPSC, SSC, IBPS, SBI, RRB, NEET, JEE, CAT, State PSC and Police: pixels, KB and format, with a free one-click resizer.`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: `Size Chart ${YEAR}`, url: canonical }];
  const ordered = Object.keys(CATEGORIES).flatMap(c => EXAMS.filter(e => e.cat === c));
  const faqs = [
    { q: 'What is the standard photo size for government exams in India?', a: `There is no single standard. The most common sizes are <strong>200×230 px (20–50 KB)</strong> for bank exams (IBPS, SBI, RBI) and <strong>275×354 px (20–50 KB)</strong> for SSC, NTA and many State PSC exams. Always use your exam's exact size from the chart.` },
    { q: 'What is the standard signature size for government exams?', a: `Bank exams usually ask for <strong>140×60 px, 10–20 KB</strong>. SSC CGL/CPO/JE use <strong>236×79 px, 10–20 KB</strong>, and NTA exams (JEE, NEET) use <strong>275×118 px</strong>.` },
    { q: 'How do I resize my photo to the exact exam size?', a: 'Tap your exam\'s size in the chart. The resizer opens with the exact width, height and KB range preset — upload, crop and download. Images never leave your device.' },
    { q: 'What format should exam photos and signatures be in?', a: 'Almost every Indian exam portal accepts only JPG/JPEG. Convert PNG, HEIC or WEBP images to JPG — the resizer does this automatically.' },
    { q: 'How can I reduce a photo to 50 KB or 20 KB?', a: 'Use the exam resizer or the <a href="/resize-image-to-50kb/">resize to 50 KB</a> and <a href="/resize-image-to-20kb/">resize to 20 KB</a> tools. They lower JPG quality step by step until the file fits.' },
  ];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.faqSchema(faqs),
    { '@context': 'https://schema.org', '@type': 'Dataset', name: `Indian exam photo and signature size requirements ${YEAR}`, description: desc, url: canonical, dateModified: S.ISO_DATE, creator: { '@type': 'Organization', name: 'ILoveExams', url: `${SITE}/` }, license: `${SITE}/terms/`, isAccessibleForFree: true, variableMeasured: ['Photo width (px)', 'Photo height (px)', 'Photo file size (KB)', 'Signature width (px)', 'Signature height (px)', 'Signature file size (KB)'] }] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>Photo &amp; Signature Size Chart ${YEAR} — ${EXAMS.length}+ Indian Exams</h1>
  <p class="lede">Every size in one place: <strong>pixels, KB and format</strong> for UPSC, SSC, IBPS, SBI, RRB, NEET, JEE, CAT, State PSC, Police and Judiciary exams. Tap a size to resize free.</p>
  <p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>
</div></header>
<main class="wrap">
  <div class="answer"><p>The most common exam photo sizes are <strong>200×230 px, 20–50 KB</strong> (bank exams) and <strong>275×354 px, 20–50 KB</strong> (SSC, NTA, State PSC). The most common signature size is <strong>140×60 px, 10–20 KB</strong>. All exams accept <strong>JPG</strong>. Find your exam below.</p></div>
  <section class="card"><h2>Browse by category</h2><ul class="links">${Object.values(CATEGORIES).map(c => `<li><a href="/resizer/${c.hub}/">${esc(c.title)}</a></li>`).join('')}<li><a href="/resizer/size/">Resize by pixel size</a></li></ul></section>
  <section class="card"><h2>All Exams — Photo &amp; Signature Size ${YEAR}</h2>${examTable(ordered, { showCat: true })}</section>
  ${S.adSlot()}
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <p class="note">Compiled from recent official notifications (last review: ${MONTH_YEAR}). Sizes can change between exam cycles — always verify against the latest notification.</p>
</main>
${S.footer()}`;
  write('resizer/photo-signature-size-chart', html); pages++;
}

// ─── 3. Bank thumb impression + handwritten declaration pages ────────────────
for (const slug of BANK_EXTRA_EXAMS) {
  const exam = EXAMS.find(e => e.slug === slug);
  const short = seoOf(exam).short;
  for (const [key, doc] of Object.entries(BANK_EXTRA_DOCS)) {
    const dirName = `${slug}-${key}-resize`;
    const canonical = `${SITE}/resizer/${dirName}/`;
    const isDecl = key === 'declaration';
    const title = `${short} ${doc.short} Size ${YEAR}: ${doc.w}×${doc.h}px, ${doc.min}–${doc.max}KB`;
    const desc = `${short} ${doc.label.toLowerCase()} size ${YEAR}: ${doc.w}×${doc.h} pixels, ${doc.min}–${doc.max} KB, JPG.${isDecl ? ' Declaration text included.' : ''} Resize free online — no upload, works on mobile.`;
    const cat = CATEGORIES[exam.cat];
    const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: cat.title, url: `${SITE}/resizer/${cat.hub}/` }, { name: `${short} ${doc.label}`, url: canonical }];
    const faqs = [
      { q: `What is the ${short} ${doc.label.toLowerCase()} size?`, a: `${doc.w}×${doc.h} pixels, ${doc.min}–${doc.max} KB, JPG format.` },
      ...(isDecl ? [{ q: `What is the ${short} handwritten declaration text?`, a: `Write in English, in your own handwriting: “${DECLARATION_TEXT}” Use the exact text given in your official notification if it differs.` },
                    { q: 'Can I write the declaration in capital letters?', a: 'No. The declaration must be in your normal running handwriting — text in CAPITAL letters is not accepted.' }]
                 : [{ q: 'Which thumb should I use?', a: 'Use your LEFT thumb. If it is not available, the notification usually allows the right thumb — check your exam notification.' }]),
      { q: `How do I reduce the ${doc.label.toLowerCase()} to under ${doc.max} KB?`, a: `Upload it in the tool on this page — it resizes to ${doc.w}×${doc.h}px and compresses to ${doc.min}–${doc.max} KB automatically, in your browser.` },
      { q: `What are the ${short} photo and signature sizes?`, a: `Photo ${px(exam.photo)} px, ${kb(exam.photo)}; signature ${px(exam.sig)} px, ${kb(exam.sig)}. <a href="/resizer/${slug}-photo-resize/">Photo resizer</a> · <a href="/resizer/${slug}-signature-resize/">Signature resizer</a>.` },
    ];
    const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.appSchema({ url: canonical, name: `${short} ${doc.label} Resizer`, desc }), S.faqSchema(faqs)] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>${esc(short)} ${doc.label} Size ${YEAR} &amp; Free Resizer</h1>
  <p class="lede">Resize your ${esc(exam.name)} ${doc.label.toLowerCase()} to <strong>${doc.w}×${doc.h} px</strong> and <strong>${doc.min}–${doc.max} KB</strong> (JPG) — free, instant, private.</p>
  <div class="chips"><span class="chip">📐 ${doc.w}×${doc.h} px</span><span class="chip">💾 ${doc.min}–${doc.max} KB</span><span class="chip">🖼 JPG</span><span class="chip ok">✓ No upload</span></div>
  <p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>
</div></header>
<main class="wrap">
  <div class="answer"><p>The <strong>${esc(exam.name)} ${doc.label.toLowerCase()}</strong> must be <strong>${doc.w} × ${doc.h} pixels</strong>, between <strong>${doc.min} and ${doc.max} KB</strong>, in <strong>JPG</strong> format. ${doc.tip}</p></div>
  ${isDecl ? `<section class="card"><h2>${esc(short)} Handwritten Declaration Text</h2><p>Copy this text in your own handwriting (English, running letters, black ink, white paper):</p><p class="decl">${esc(DECLARATION_TEXT)}</p><p class="note">Use the exact wording in your official notification if it differs.</p></section>` : ''}
  ${S.toolFrame(presetURL({ slug: dirName, ...doc, title: `${short} ${doc.label}`, canon: canonical }), `${short} ${doc.label} Resizer — ${doc.w}×${doc.h}px, ${doc.min}–${doc.max} KB`)}
  ${S.adSlot()}
  <section class="card"><h2>How to make the ${esc(short)} ${doc.label.toLowerCase()}</h2>
    <ol style="margin:0;padding-left:20px">${doc.steps.map(x => `<li>${x}</li>`).join('')}</ol>
    <h3>Common mistakes that get it rejected</h3>
    <ul class="check x">${doc.mistakes.map(x => `<li>${x}</li>`).join('')}</ul>
    <p style="margin:12px 0 0;font-size:14px">📖 Full guide: <a href="/resizer/guides/ibps-thumb-impression-handwritten-declaration/">thumb impression &amp; handwritten declaration</a></p>
  </section>
  <section class="card"><h2>All ${esc(short)} document sizes</h2>
    <div class="tbl-wrap"><table class="grid"><thead><tr><th>Document</th><th>Dimensions</th><th>File size</th><th></th></tr></thead><tbody>
      <tr><td>Photo</td><td class="m">${px(exam.photo)}px</td><td class="m">${kb(exam.photo)}</td><td><a href="/resizer/${slug}-photo-resize/">Resize →</a></td></tr>
      <tr><td>Signature</td><td class="m">${px(exam.sig)}px</td><td class="m">${kb(exam.sig)}</td><td><a href="/resizer/${slug}-signature-resize/">Resize →</a></td></tr>
      ${Object.entries(BANK_EXTRA_DOCS).map(([k, d]) => `<tr><td>${d.label}</td><td class="m">${d.w}×${d.h}px</td><td class="m">${d.min}–${d.max} KB</td><td>${k === key ? '<em>this page</em>' : `<a href="/resizer/${slug}-${k}-resize/">Resize →</a>`}</td></tr>`).join('')}
    </tbody></table></div>
  </section>
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <section class="card"><h2>${doc.label} for other bank exams</h2><ul class="links">${BANK_EXTRA_EXAMS.filter(s => s !== slug).map(s => `<li><a href="/resizer/${s}-${key}-resize/">${esc(seoOf(EXAMS.find(e => e.slug === s)).short)}</a></li>`).join('')}</ul></section>
  <p class="note">Standard IBPS-pattern specification (last review: ${MONTH_YEAR}). Always verify against the latest official notification.</p>
</main>
${S.footer([{ href: `/resizer/${cat.hub}/`, t: cat.title }])}`;
    write(`resizer/${dirName}`, html); pages++;
  }
}

// ─── 3b. NEET postcard-size photo ─────────────────────────────────────────────
{
  const doc = NEET_POSTCARD, exam = EXAMS.find(e => e.slug === doc.exam);
  const dirName = `${exam.slug}-${doc.key}-resize`;
  const canonical = `${SITE}/resizer/${dirName}/`;
  const cat = CATEGORIES[exam.cat];
  const title = `NEET Postcard Size Photo ${YEAR}: ${doc.inches}, ${doc.min}–${doc.max}KB | Resize Free`;
  const desc = `NEET ${YEAR} postcard size photo: ${doc.inches} (${doc.w}×${doc.h} px at 150 DPI), ${doc.min}–${doc.max} KB, JPG. Resize free online — no upload, works on mobile.`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: cat.title, url: `${SITE}/resizer/${cat.hub}/` }, { name: 'NEET Postcard Photo', url: canonical }];
  const faqs = [
    { q: 'What is the NEET postcard size photo?', a: `A ${doc.inches} colour photo (width × height) uploaded as a JPG of ${doc.min}–${doc.max} KB, in addition to the passport-size photo.` },
    { q: 'How many pixels is a 4×6 inch photo?', a: '600×900 px at 150 DPI, 800×1200 px at 200 DPI or 1200×1800 px at 300 DPI. The NEET portal checks the file size (10–200 KB) and format; this tool uses 600×900 px so the file fits easily.' },
    { q: 'Is the NEET postcard photo different from the passport photo?', a: `Both should be the same recent photo. The passport-size photo is 3.5×4.5 cm (${px(exam.photo)} px, ${kb(exam.photo)}); the postcard photo is ${doc.inches}. <a href="/resizer/neet-ug-photo-resize/">Resize the passport-size photo</a>.` },
    { q: `What is the NEET signature size?`, a: `${px(exam.sig)} px, ${kb(exam.sig)}, JPG. <a href="/resizer/neet-ug-signature-resize/">Resize NEET signature</a>.` },
  ];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.appSchema({ url: canonical, name: 'NEET Postcard Photo Resizer', desc }), S.faqSchema(faqs)] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>NEET Postcard Size Photo ${YEAR} &amp; Free Resizer</h1>
  <p class="lede">Resize your NEET postcard photo to <strong>${doc.inches}</strong> and <strong>${doc.min}–${doc.max} KB</strong> (JPG) — free, instant, private.</p>
  <div class="chips"><span class="chip">📐 ${doc.inches}</span><span class="chip">${doc.w}×${doc.h} px</span><span class="chip">💾 ${doc.min}–${doc.max} KB</span><span class="chip ok">✓ No upload</span></div>
  <p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>
</div></header>
<main class="wrap">
  <div class="answer"><p>The <strong>NEET-UG postcard size photo</strong> is <strong>${doc.inches}</strong> (${doc.w}×${doc.h} px at 150 DPI), uploaded as a <strong>JPG of ${doc.min}–${doc.max} KB</strong>. ${doc.tip}</p></div>
  ${S.toolFrame(presetURL({ slug: dirName, ...doc, title: 'NEET Postcard Size Photo (4×6 inch)', canon: canonical, unit: 'inch', dpi: 150 }), `NEET Postcard Photo Resizer — ${doc.inches}, ${doc.min}–${doc.max} KB`)}
  ${S.adSlot()}
  <section class="card"><h2>How to prepare the NEET postcard photo</h2>
    <ol style="margin:0;padding-left:20px">
      <li>Use the <strong>same recent photo</strong> as your passport-size upload — colour, white background, face clearly visible.</li>
      <li>Keep the <strong>portrait 4×6 shape</strong> (2:3). If your photo is wider, crop it in the tool rather than stretching it.</li>
      <li>Frame from the head to below the shoulders, face centred, with a little space above the head.</li>
      <li>Do not use filters, beauty mode or background blur — NTA asks for an unaltered photo.</li>
      <li>Keep a few printed postcard-size copies: you may be asked to bring them to the exam centre.</li>
    </ol>
    <p style="margin:12px 0 0;font-size:14px">📖 <a href="/resizer/guides/take-exam-photo-with-phone/">How to take an exam photo with your phone</a></p>
  </section>
  <section class="card"><h2>All NEET ${YEAR} upload sizes</h2>
    <div class="tbl-wrap"><table class="grid"><thead><tr><th>Document</th><th>Size</th><th>File size</th><th></th></tr></thead><tbody>
      <tr><td>Passport size photo</td><td class="m">3.5×4.5 cm (${px(exam.photo)}px)</td><td class="m">${kb(exam.photo)}</td><td><a href="/resizer/neet-ug-photo-resize/">Resize →</a></td></tr>
      <tr><td>Postcard size photo</td><td class="m">${doc.inches}</td><td class="m">${doc.min}–${doc.max} KB</td><td><em>this page</em></td></tr>
      <tr><td>Signature</td><td class="m">${px(exam.sig)}px</td><td class="m">${kb(exam.sig)}</td><td><a href="/resizer/neet-ug-signature-resize/">Resize →</a></td></tr>
    </tbody></table></div>
  </section>
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <p class="note">Based on the NTA NEET-UG information bulletin (last review: ${MONTH_YEAR}). Always verify against the latest bulletin.</p>
</main>
${S.footer([{ href: `/resizer/${cat.hub}/`, t: cat.title }])}`;
  write(`resizer/${dirName}`, html); pages++;
}

// ─── 4. Pixel-size pages (no ad slots: short template pages — keep AdSense to content-rich pages) ──────────────────────────────────────────────────────
const sizes = new Map(); // "WxH" -> { w, h, users: [{exam, doc, spec}] }
const addSize = (w, h) => { const k = `${w}x${h}`; if (!sizes.has(k)) sizes.set(k, { w, h, users: [], extraMax: null }); return sizes.get(k); };
EXAMS.forEach(e => {
  addSize(e.photo.w, e.photo.h).users.push({ e, doc: 'photo', sp: e.photo });
  addSize(e.sig.w, e.sig.h).users.push({ e, doc: 'signature', sp: e.sig });
});
EXTRA_SIZES.forEach(x => { const s = addSize(x.w, x.h); if (!s.users.length) s.extraMax = x.max; });

const sizeList = [...sizes.values()].sort((a, b) => a.w - b.w || a.h - b.h);
for (const s of sizeList) {
  const { w, h, users } = s;
  const slug = `${w}x${h}-pixels`;
  const canonical = `${SITE}/resizer/size/${slug}/`;
  const photoUse = users.filter(u => u.doc === 'photo').length, sigUse = users.length - photoUse;
  const noun = sigUse > photoUse ? 'Signature' : 'Photo';
  const kbs = users.length ? users.map(u => `${u.sp.min}–${u.sp.max}`) : [`0–${s.extraMax}`];
  const [min, max] = mode(kbs).split('–').map(Number);
  const kbLabel = min ? `${min}–${max} KB` : `under ${max} KB`;
  const title = `Resize ${noun} to ${w}×${h} Pixels Online (${kbLabel}) – Free`;
  const desc = `Resize any ${noun.toLowerCase()} to exactly ${w}×${h} px (${w}x${h}) and ${kbLabel} in JPG, free and in your browser.${users.length ? ` Used by ${[...new Set(users.map(u => seoOf(u.e).short))].slice(0, 3).join(', ')} and more.` : ''}`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'By Pixel Size', url: `${SITE}/resizer/size/` }, { name: `${w}×${h} px`, url: canonical }];
  const cm = d => `${S.toCm(w, d)} × ${S.toCm(h, d)} cm`;
  const faqs = [
    { q: `How do I resize a photo to ${w}×${h} pixels?`, a: `Upload it in the tool on this page. The crop box is locked to ${w}:${h}; tap Process and the image is saved as a ${w}×${h} px JPG within ${kbLabel}. You can change the KB range in the tool.` },
    { q: `What is ${w}×${h} pixels in cm?`, a: `It depends on DPI: ${cm(96)} at 96 DPI, ${cm(200)} at 200 DPI and ${cm(300)} at 300 DPI. Exam portals check pixels, not cm.` },
    { q: `Is ${w}×${h} width × height or height × width?`, a: `Width first: ${w} px wide and ${h} px tall${w === h ? ' (a square image)' : w < h ? ' (portrait)' : ' (landscape)'}.` },
    ...(users.length ? [{ q: `Which exams need a ${w}×${h} ${noun.toLowerCase()}?`, a: users.slice(0, 12).map(u => `${esc(seoOf(u.e).short)} ${u.doc} (${u.sp.min}–${u.sp.max} KB)`).join(', ') + (users.length > 12 ? ` and ${users.length - 12} more.` : '.') }] : []),
  ];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.appSchema({ url: canonical, name: `${w}×${h} px Image Resizer`, desc }), S.faqSchema(faqs)] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>Resize ${noun} to ${w}×${h} Pixels Online</h1>
  <p class="lede">Make any image exactly <strong>${w} px wide × ${h} px tall</strong> and <strong>${kbLabel}</strong> in JPG — free, instant, never uploaded.</p>
  <div class="chips"><span class="chip">📐 ${w}×${h} px</span><span class="chip">💾 ${kbLabel}</span><span class="chip">📏 ${cm(200)} @200 DPI</span></div>
</div></header>
<main class="wrap">
  <div class="answer"><p>To resize a ${noun.toLowerCase()} to <strong>${w}×${h} pixels</strong>, upload it below, crop to the locked ${S.ratio(w, h)} frame and tap Process — you get a ${w}×${h} px JPG ${min ? `between ${min} and ${max} KB` : `under ${max} KB`}. ${w}×${h} px equals <strong>${cm(200)}</strong> at 200 DPI.</p></div>
  ${S.toolFrame(presetURL({ slug: `size-${w}x${h}`, w, h, min, max, title: `Resize to ${w}×${h} px`, canon: canonical }), `${w}×${h} px Resizer`)}
  <section class="card"><h2>${w}×${h} pixels in cm and inches</h2>
    <div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>DPI</th><th>Centimetres</th><th>Inches</th></tr></thead><tbody>
      ${[96, 200, 300].map(d => `<tr><td>${d} DPI</td><td class="m">${cm(d)}</td><td class="m">${(w / d).toFixed(2)} × ${(h / d).toFixed(2)} in</td></tr>`).join('')}
    </tbody></table></div>
  </section>
  ${users.length ? `<section class="card"><h2>Exams that require ${w}×${h} px</h2>
    <div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Exam</th><th>Document</th><th>File size</th></tr></thead><tbody>
      ${users.map(u => `<tr><td><a href="/resizer/${u.e.slug}-${u.doc}-resize/">${esc(seoOf(u.e).short)}</a></td><td>${u.doc === 'photo' ? 'Photo' : 'Signature'}</td><td class="m">${u.sp.min}–${u.sp.max} KB</td></tr>`).join('')}
    </tbody></table></div></section>` : ''}
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(faqs)}</section>
  <section class="card"><h2>Other popular sizes</h2><ul class="links">${sizeList.filter(x => x !== s).slice(0, 40).map(x => `<li><a href="/resizer/size/${x.w}x${x.h}-pixels/">${x.w}×${x.h} px</a></li>`).join('')}</ul></section>
</main>
${S.footer()}`;
  write(`resizer/size/${slug}`, html); pages++;
}

// Size index
{
  const canonical = `${SITE}/resizer/size/`;
  const title = `Resize Photo & Signature by Pixel Size – ${sizeList.length} Exam Sizes (Free)`;
  const desc = `Resize photos and signatures to exact pixel sizes used by Indian exams — 200×230, 275×354, 150×200, 140×60 and more. Free, in your browser, with KB limits.`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'By Pixel Size', url: canonical }];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs })] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Resize by Pixel Size</h1><p class="lede">Pick the exact width × height you need. Each size shows which exams use it and its size in cm.</p></div></header>
<main class="wrap">
  <section class="card"><h2>All sizes (width × height)</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Size</th><th>Used by</th></tr></thead><tbody>
  ${sizeList.map(x => `<tr><td class="m"><a href="/resizer/size/${x.w}x${x.h}-pixels/">${x.w}×${x.h} px</a></td><td>${x.users.length ? esc([...new Set(x.users.map(u => seoOf(u.e).short))].slice(0, 6).join(', ')) + (x.users.length > 6 ? '…' : '') : 'General use'}</td></tr>`).join('\n  ')}
  </tbody></table></div></section>
</main>
${S.footer()}`;
  write('resizer/size', html); pages++;
}

// ─── 5. Engine size table (resizer/index.html) from exams-data.js ────────────
{
  const START = '<!-- SIZE-TABLE:START (generated by generate-seo-hubs.js) -->';
  const END = '<!-- SIZE-TABLE:END -->';
  const ordered = Object.keys(CATEGORIES).flatMap(c => EXAMS.filter(e => e.cat === c));
  const rows = ordered.map((e, i) => `          <tr style="background:${i % 2 ? '#f8fafc' : '#fff'};border-bottom:1px solid #f1f5f9"><td style="padding:9px 14px;font-weight:600;color:#0f172a"><a href="/resizer/${e.slug}-photo-resize/" style="color:#0f172a;text-decoration:none">${esc(e.name)}</a></td><td style="padding:9px 14px;text-align:center;color:#475569;font-family:monospace">${px(e.photo)}</td><td style="padding:9px 14px;text-align:center;color:#475569">${kb(e.photo)}</td><td style="padding:9px 14px;text-align:center;color:#475569;font-family:monospace"><a href="/resizer/${e.slug}-signature-resize/" style="color:#475569">${px(e.sig)}</a></td><td style="padding:9px 14px;text-align:center;color:#475569">${kb(e.sig)}</td></tr>`).join('\n');
  const block = `${START}\n${rows}\n          ${END}`;
  if (engine.includes(START)) {
    engine = engine.slice(0, engine.indexOf(START)) + block + engine.slice(engine.indexOf(END) + END.length);
  } else {
    const sec = engine.indexOf('<section id="seo-specs"');
    const a = engine.indexOf('<tbody>', sec) + '<tbody>'.length;
    const b = engine.indexOf('</tbody>', a);
    engine = engine.slice(0, a) + '\n' + block + '\n        ' + engine.slice(b);
  }
  engine = engine.replace(
    /Click any exam name above to auto-load its specifications and start resizing instantly\.\s*All 80\+ exams supported — <a href="#exam-grid-section"[^>]*>browse the full list ↑<\/a>/,
    `Tap any exam for its full size guide and resizer. <a href="/resizer/photo-signature-size-chart/" style="color:#3b82f6;text-decoration:none">Printable size chart ${YEAR} →</a>`);
  engine = engine.replace(/(<title>Exam Photo &amp; Signature Resizer )\d{4}(?:-\d{4})?/, `$1${YEAR}`);
  fs.writeFileSync(enginePath, engine, 'utf8');
}

// ─── 6. llms.txt (answer-engine friendly summary) ─────────────────────────────
{
  const ordered = Object.keys(CATEGORIES).flatMap(c => EXAMS.filter(e => e.cat === c));
  const txt = `# ILoveExams

> Free, private (in-browser) photo and signature resizer for Indian government and entrance exams. Exact pixel and KB sizes for ${EXAMS.length}+ exams, updated ${MONTH_YEAR}.

Images are processed in the user's browser and never uploaded. All tools are free with no sign-up.

## Key pages
- [Photo & signature size chart ${YEAR} (all exams)](${SITE}/resizer/photo-signature-size-chart/)
- [Exam photo & signature resizer](${SITE}/resizer/)
- [Resize by pixel size](${SITE}/resizer/size/)
${Object.values(CATEGORIES).map(c => `- [${c.title} photo & signature size](${SITE}/resizer/${c.hub}/)`).join('\n')}

## Exam photo and signature sizes (width×height px, KB, JPG)
${ordered.map(e => `- ${e.name}: photo ${px(e.photo)} px, ${kb(e.photo)}; signature ${px(e.sig)} px, ${kb(e.sig)} — ${SITE}/resizer/${e.slug}-photo-resize/`).join('\n')}

## Bank exam extra documents (IBPS pattern)
- Left thumb impression: 240×240 px, 20–50 KB, JPG
- Handwritten declaration: 800×400 px, 50–100 KB, JPG. Text: "${DECLARATION_TEXT}"

## Free tools (run in the browser, no upload)
- PDF: compress PDF to 100/200/300/500 KB, 1/2 MB (${SITE}/compress-pdf/), merge, split, rotate, organise pages, PDF to JPG, watermark, page numbers, PDF to text — ${SITE}/pdf-tools/
- Images: HEIC to JPG, WEBP to JPG, JPG resize, compress image, photo with name and date, join photo and signature
- Exam calculators with marking schemes: NEET (+4/−1), JEE Main (+4/−1), CUET (+5/−1), SSC CGL/CHSL Tier 1 (+2/−0.5), IBPS/SBI prelims (+1/−0.25), RRB NTPC (+1/−1/3), UPSC Prelims, CAT — ${SITE}/exam-calculators/
- JEE Main percentile to rank predictor, typing speed test (WPM, KDPH)

## NEET-UG postcard size photo
- ${NEET_POSTCARD.inches}, ${NEET_POSTCARD.min}–${NEET_POSTCARD.max} KB, JPG — ${SITE}/resizer/neet-ug-postcard-photo-resize/

Sizes are compiled from official notifications; users should verify against the latest notification.
`;
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), txt, 'utf8');
}

// ─── 7. Custom 404 (GitHub Pages serves /404.html with a 404 status) ─────────
{
  const popular = ['post-gds', 'ibps-rrb-clerk', 'ukpsc', 'cat', 'niacl', 'ssc-cgl', 'neet-ug', 'upsc'].map(s => EXAMS.find(e => e.slug === s)).filter(Boolean);
  const html = `${S.head({ title: 'Page not found | ILoveExams', desc: 'This page does not exist. Find your exam photo and signature resizer here.', canonical: `${SITE}/404.html` }).replace('content="index, follow, max-snippet:-1, max-image-preview:large"', 'content="noindex, follow"')}
<header class="hero"><div class="hero-in"><h1>Page not found</h1><p class="lede" style="display:block">This link may be old or mistyped. Find your exam below — every resizer is free and runs in your browser.</p></div></header>
<main class="wrap">
  <section class="card"><h2>Popular exam resizers</h2><ul class="links">${popular.map(e => `<li><a href="/resizer/${e.slug}-photo-resize/">${esc(seoOf(e).short)} Photo</a></li><li><a href="/resizer/${e.slug}-signature-resize/">${esc(seoOf(e).short)} Signature</a></li>`).join('')}</ul></section>
  <section class="card"><h2>Browse</h2><ul class="links"><li><a href="/resizer/">All 80+ exams</a></li><li><a href="/resizer/photo-signature-size-chart/">Size chart ${YEAR}</a></li><li><a href="/resizer/size/">Resize by pixels</a></li>${Object.values(CATEGORIES).map(c => `<li><a href="/resizer/${c.hub}/">${esc(c.title)}</a></li>`).join('')}<li><a href="/">All tools</a></li></ul></section>
</main>
${S.footer()}`;
  fs.writeFileSync(path.join(ROOT, '404.html'), html, 'utf8');
}

console.log(`✅ Generated ${pages} hub/size/document pages, updated engine size table, wrote llms.txt`);
console.log('ℹ️  Run "node generate-sitemap.js" next');
