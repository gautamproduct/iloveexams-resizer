#!/usr/bin/env node
/**
 * Generates individual SEO landing pages for every exam × document type.
 * Run: node generate-pages.js
 * Output: /resizer/{slug}-photo-resize/index.html and /resizer/{slug}-signature-resize/index.html
 *
 * Page layout is answer-first (for featured snippets / AI answers), with the
 * resizer embedded right below the answer so users never leave the page.
 */

const fs = require('fs');
const path = require('path');

const { EXAMS, seoOf, CATEGORIES, BANK_EXTRA_EXAMS, BANK_EXTRA_DOCS, GUIDES } = require('./exams-data');
const S = require('./seo-shell');
const { SITE, YEARS: YEAR, MONTH_YEAR, esc } = S;

const specStr = sp => `${sp.w}×${sp.h}px, ${sp.min}–${sp.max} KB`;
const sameSpec = (a, b) => a.w === b.w && a.h === b.h && a.min === b.min && a.max === b.max && a.fmt === b.fmt;

const PHOTO_DO = [
  'Recent colour passport-style photo (taken within the last 3–6 months)',
  'Plain white or light-coloured background',
  'Face centred and clearly visible, covering about 50–70% of the frame',
  'Eyes open, neutral expression, looking straight at the camera',
  'Even lighting — no shadows on the face or background',
];
const PHOTO_DONT = [
  'Caps, hats or dark sunglasses (religious headwear is usually allowed)',
  'Selfies with beauty filters, heavy edits or tilted angles',
  'Group photos, cropped ID-card photos or photos of a printed photo',
  'Blurred, pixelated or over-exposed images',
];
const SIG_DO = [
  'Sign on plain white paper with a black or blue ink pen',
  'Use your usual full signature — the same one you will sign at the exam centre',
  'Crop tightly around the signature with a little white margin',
  'Scan or photograph in good light so the strokes are sharp and dark',
];
const SIG_DONT = [
  'Signature in CAPITAL letters (rejected by most bank and SSC exams)',
  'Pencil, sketch pen or a digital signature drawn on the phone',
  'Lined or coloured paper, shadows or fingers in the frame',
  'Signing on the photo or a signature that is too faint to read',
];

function generatePage(exam, docType) {
  const seo    = seoOf(exam);
  const short  = seo.short;
  const spec   = docType === 'photo' ? exam.photo : exam.sig;
  const label  = docType === 'photo' ? 'Photo' : 'Signature';
  const lc     = label.toLowerCase();
  const other  = docType === 'photo' ? 'signature' : 'photo';
  const otherL = docType === 'photo' ? 'Signature' : 'Photo';
  const otherSpec = docType === 'photo' ? exam.sig : exam.photo;
  const slugDir   = `${exam.slug}-${docType}-resize`;
  const canonical = `${SITE}/resizer/${slugDir}/`;
  const otherURL  = `/resizer/${exam.slug}-${other}-resize/`;
  const cat       = CATEGORIES[exam.cat];
  const isBank    = BANK_EXTRA_EXAMS.includes(exam.slug);

  const nd = docType === 'photo' && seo.nameDate;   // exam needs name + date printed on the photo
  const title = nd
    ? `${short} Photo with Name & Date ${YEAR}: ${spec.w}×${spec.h}px, ${spec.min}–${spec.max}KB`
    : (t => t.length <= 64 ? t : `${short} ${label} Size ${YEAR}: ${spec.w}×${spec.h}px, ${spec.min}–${spec.max}KB`)(`${short} ${label} Size ${YEAR} & Resizer: ${spec.w}×${spec.h}px, ${spec.min}–${spec.max}KB`);
  const desc  = nd
    ? `${short} photo with name & date ${YEAR}: ${spec.w}×${spec.h} px, ${spec.min}–${spec.max} KB JPG. Add your name and photo date, resize and compress in one step — free, no upload.`
    : `${short} ${lc} size ${YEAR}: ${spec.w}×${spec.h} pixels, ${spec.min}–${spec.max} KB, ${spec.fmt}. Resize & compress your ${lc} online in seconds — free, no upload, works on mobile.`;
  const answer = `The <strong>${esc(exam.name)} ${lc}</strong> must be <strong>${spec.w} × ${spec.h} pixels</strong> (width × height), with a file size between <strong>${spec.min} KB and ${spec.max} KB</strong>, in <strong>${spec.fmt}/JPEG</strong> format. Upload your ${lc} in the tool below and it is resized and compressed to exactly this size in one click.`;

  const crumbs = [
    { name: 'Home', url: `${SITE}/` },
    { name: 'Exam Resizer', url: `${SITE}/resizer/` },
    { name: cat.title, url: `${SITE}/resizer/${cat.hub}/` },
    { name: `${short} ${label} Size`, url: canonical },
  ];

  const sameSize = EXAMS.filter(e => e.slug !== exam.slug && sameSpec(docType === 'photo' ? e.photo : e.sig, spec));
  const catPeers = EXAMS.filter(e => e.cat === exam.cat && e.slug !== exam.slug);

  const faqs = [
    { q: `What is the ${short} ${lc} size in ${YEAR}?`,
      a: `The ${esc(exam.name)} ${lc} must be ${spec.w}×${spec.h} pixels (width × height) in ${spec.fmt} format, with a file size between ${spec.min} KB and ${spec.max} KB.` },
    { q: `What is the ${short} ${lc} size in KB?`,
      a: `Between <strong>${spec.min} KB and ${spec.max} KB</strong>. Files below ${spec.min} KB or above ${spec.max} KB are usually rejected by the application portal.` },
    { q: `How do I reduce my ${short} ${lc} to under ${spec.max} KB?`,
      a: `Upload it in the free tool on this page. It resizes the image to ${spec.w}×${spec.h}px and automatically adjusts JPG quality until the file is inside the ${spec.min}–${spec.max} KB range. No app or sign-up is needed.` },
    { q: `My ${lc} is smaller than ${spec.min} KB. How do I increase the size?`,
      a: `The tool raises the JPG quality to bring a small file up into the ${spec.min}–${spec.max} KB range without changing the ${spec.w}×${spec.h}px dimensions. Start from the original, un-compressed ${lc} for the best result.` },
    docType === 'photo'
      ? { q: `What background is required for the ${short} photo?`,
          a: `Use a recent colour photo with a plain white or light background, face clearly visible and no cap or dark glasses. Crop it in the tool so your face is centred.` }
      : { q: `How should I sign for the ${short} signature upload?`,
          a: `Sign on white paper with a black or blue ink pen, photograph or scan it in good light, then crop tightly around the signature in the tool. ${isBank || exam.cat === 'SSC' ? 'Signatures in CAPITAL letters are not accepted.' : 'Avoid capital letters and faint pens.'}` },
    { q: `Can I resize the ${short} ${lc} on my mobile phone?`,
      a: `Yes. The tool works in Chrome or Safari on Android and iPhone. Pick the ${lc} from your gallery or camera, crop it, and download the resized JPG straight to your phone.` },
    { q: `Is it safe to resize my ${lc} on ILoveExams?`,
      a: `Yes. Your image is processed entirely inside your browser and is never uploaded to any server, so nobody else can see it.` },
    { q: `What is the ${short} ${other} size?`,
      a: `The ${esc(exam.name)} ${other} must be ${otherSpec.w}×${otherSpec.h} pixels, ${otherSpec.min}–${otherSpec.max} KB, ${otherSpec.fmt}. <a href="${otherURL}">Resize your ${short} ${other} here</a>.` },
  ];
  if (nd) faqs.unshift({ q: `Does the ${short} photo need name and date?`, a: `Yes. ${nd.rule} The tool on this page adds both and resizes the photo to ${spec.w}×${spec.h} px, ${spec.min}–${spec.max} KB.` });
  if (S.SPAN_NEXT) {
    faqs.splice(2, 0, { q: `What is the ${short} ${lc} size for ${S.NEXT_YEAR}?`,
      a: `Use ${spec.w}×${spec.h} pixels, ${spec.min}–${spec.max} KB, ${spec.fmt} — the size in recent ${esc(exam.name)} notifications. It rarely changes between years; if the ${S.NEXT_YEAR} notification changes it we update this page, and you can edit width, height and KB in the tool.` });
  }
  if (isBank) {
    const t = BANK_EXTRA_DOCS['thumb-impression'], d = BANK_EXTRA_DOCS['declaration'];
    faqs.push({ q: `What are the ${short} thumb impression and handwritten declaration sizes?`,
      a: `Left thumb impression: ${t.w}×${t.h}px, ${t.min}–${t.max} KB. Handwritten declaration: ${d.w}×${d.h}px, ${d.min}–${d.max} KB. Both in JPG. <a href="/resizer/${exam.slug}-thumb-impression-resize/">Thumb resizer</a> · <a href="/resizer/${exam.slug}-declaration-resize/">Declaration resizer</a>.` });
  }

  const name = `${short} ${label} Resizer`;
  const schema = [
    S.webPageSchema({ url: canonical, name: `${short} ${label} Size ${YEAR}`, desc, crumbs }),
    S.appSchema({ url: canonical, name, desc }),
    S.faqSchema(faqs),
    { '@context': 'https://schema.org', '@type': 'HowTo', name: `How to resize the ${exam.name} ${lc} to ${spec.w}×${spec.h}px and ${spec.min}–${spec.max} KB`,
      totalTime: 'PT1M', estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
      step: [
        { '@type': 'HowToStep', position: 1, name: `Upload your ${lc}`, text: `Tap the upload box in the tool on this page and pick your ${lc} (JPG, PNG, HEIC or WEBP).` },
        { '@type': 'HowToStep', position: 2, name: 'Crop', text: `Adjust the crop box. It is locked to the ${spec.w}×${spec.h} aspect ratio required by ${exam.name}.` },
        { '@type': 'HowToStep', position: 3, name: 'Process', text: `Tap Process Image. The ${lc} is resized to ${spec.w}×${spec.h}px and compressed to ${spec.min}–${spec.max} KB.` },
        { '@type': 'HowToStep', position: 4, name: 'Download', text: `Download the JPG and upload it on the ${exam.name} application form.` },
      ] },
  ];

  const bankCard = isBank ? `
  <section class="card">
    <h2>Other documents for the ${esc(short)} application</h2>
    <p>Bank exam forms also ask for a <strong>left thumb impression</strong> and a <strong>handwritten declaration</strong>:</p>
    <div class="tbl-wrap"><table class="grid"><thead><tr><th>Document</th><th>Dimensions</th><th>File size</th><th></th></tr></thead><tbody>
      <tr><td>Photo</td><td class="m">${exam.photo.w}×${exam.photo.h}px</td><td class="m">${exam.photo.min}–${exam.photo.max} KB</td><td><a href="/resizer/${exam.slug}-photo-resize/">Resize →</a></td></tr>
      <tr><td>Signature</td><td class="m">${exam.sig.w}×${exam.sig.h}px</td><td class="m">${exam.sig.min}–${exam.sig.max} KB</td><td><a href="/resizer/${exam.slug}-signature-resize/">Resize →</a></td></tr>
      ${Object.entries(BANK_EXTRA_DOCS).map(([k, d]) => `<tr><td>${d.label}</td><td class="m">${d.w}×${d.h}px</td><td class="m">${d.min}–${d.max} KB</td><td><a href="/resizer/${exam.slug}-${k}-resize/">Resize →</a></td></tr>`).join('\n      ')}
    </tbody></table></div>
    <p style="margin:12px 0 0;font-size:14px">📖 <a href="/resizer/guides/ibps-thumb-impression-handwritten-declaration/">How to make the thumb impression and handwritten declaration</a></p>
  </section>` : '';

  const html = `${S.head({ title, desc, canonical, schema, extraHead: nd ? '<link rel="stylesheet" href="/assets/ilx-apps.css">' : '', ogTitle: `${short} ${label} Size ${YEAR} – ${spec.w}×${spec.h}px, ${spec.min}–${spec.max}KB` })}

<header class="hero">
  <div class="hero-in">
    ${S.crumbsHtml(crumbs)}
    <h1>${nd ? `${esc(short)} Photo with Name &amp; Date ${YEAR} — Size &amp; Free Maker` : `${esc(short)} ${label} Size ${YEAR} &amp; Free Online Resizer`}</h1>
    <p class="lede">Resize your ${esc(exam.name)} ${lc} to exactly <strong>${spec.w}×${spec.h} pixels</strong> and <strong>${spec.min}–${spec.max} KB</strong> (${spec.fmt}) in one click — free, instant and private.</p>
    <div class="chips">
      <span class="chip">📐 ${spec.w}×${spec.h} px</span>
      <span class="chip">💾 ${spec.min}–${spec.max} KB</span>
      <span class="chip">🖼 ${spec.fmt}</span>
      <span class="chip ok">✓ No upload · Works on mobile</span>
    </div>
    <p class="updated">✓ Checked against the official notification · Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time>${seo.alt.length ? ` · Also searched as: ${seo.alt.map(esc).join(', ')}` : ''}</p>
  </div>
</header>

<main class="wrap">
  <div class="answer" id="answer"><p>${answer}</p></div>

  ${nd ? `<div class="answer" style="background:linear-gradient(135deg,#fff7ed,#fef3c7);border-color:#fde68a"><p>⚠️ ${nd.rule} Use the tool below — it prints them for you and keeps the file in ${spec.min}–${spec.max} KB.</p></div>
  <section id="app" class="app" data-tool="photo-name-date" data-size="${spec.w}x${spec.h}" data-max="${spec.max}" data-min="${spec.min}" data-strip="${nd.strip}" style="min-height:190px"><noscript>Please enable JavaScript to use this tool.</noscript></section>
  <p style="font-size:13.5px;margin:-8px 0 20px">Notification doesn't need name &amp; date? <a href="/resizer/?exam=${exam.slug}&amp;document=photo">Use the plain ${esc(short)} photo resizer →</a></p>`
      : S.toolFrame(`/resizer/?exam=${exam.slug}&document=${docType}&embed=1`, `${short} ${label} Resizer — ${specStr(spec)}`)}
  ${seo.note ? `<p class="note" style="margin:0 0 20px">${seo.note}</p>` : ''}

  ${S.adSlot()}

  <div class="cols">
    <section class="card">
      <h2>${esc(short)} ${label} Requirements</h2>
      <table class="spec">
        <tr><th scope="row">Width</th><td>${spec.w} px</td></tr>
        <tr><th scope="row">Height</th><td>${spec.h} px</td></tr>
        <tr><th scope="row">File size</th><td>${spec.min} – ${spec.max} KB</td></tr>
        <tr><th scope="row">Format</th><td>${spec.fmt} / JPEG</td></tr>
        <tr><th scope="row">Aspect ratio</th><td>${S.ratio(spec.w, spec.h)}</td></tr>
        <tr><th scope="row">Print size @200 DPI</th><td>${S.toCm(spec.w, 200)} × ${S.toCm(spec.h, 200)} cm</td></tr>
      </table>
    </section>
    <section class="card">
      <h2>${esc(short)} ${otherL} Requirements</h2>
      <table class="spec">
        <tr><th scope="row">Width</th><td>${otherSpec.w} px</td></tr>
        <tr><th scope="row">Height</th><td>${otherSpec.h} px</td></tr>
        <tr><th scope="row">File size</th><td>${otherSpec.min} – ${otherSpec.max} KB</td></tr>
        <tr><th scope="row">Format</th><td>${otherSpec.fmt} / JPEG</td></tr>
      </table>
      <p style="margin:14px 0 0"><a class="btn alt" href="${otherURL}">Resize ${esc(short)} ${otherL} →</a></p>
    </section>
  </div>
  ${bankCard}
  ${GUIDES[exam.slug] ? `<section class="card"><h2>Where &amp; how to upload your ${esc(short)} ${lc}</h2>
    <p>You upload it on the official <strong>${esc(GUIDES[exam.slug].body)}</strong> website: <a href="${GUIDES[exam.slug].url}" target="_blank" rel="noopener">${GUIDES[exam.slug].url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a> (always use the link in the official notification).</p>
    <ul class="check">${GUIDES[exam.slug].tips.map(t => `<li>${t}</li>`).join('')}</ul>
  </section>` : ''}
  ${exam.slug === 'neet-ug' ? `<section class="card"><h2>NEET also needs a postcard size photo</h2><p>Along with the passport-size photo, NEET asks for a <strong>4×6 inch postcard size photo (10–200 KB, JPG)</strong>.</p><p style="margin:12px 0 0"><a class="btn" href="/resizer/neet-ug-postcard-photo-resize/">Resize NEET postcard photo →</a></p></section>` : ''}

  <section class="card">
    <h2>${esc(short)} ${label} Guidelines — Do's &amp; Don'ts</h2>
    <div class="cols">
      <div><h3>✅ Do</h3><ul class="check">${(docType === 'photo' ? PHOTO_DO : SIG_DO).map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div><h3>❌ Avoid</h3><ul class="check x">${(docType === 'photo' ? PHOTO_DONT : SIG_DONT).map(x => `<li>${x}</li>`).join('')}</ul></div>
    </div>
  </section>

  <section class="card">
    <h2>How to Resize the ${esc(short)} ${label} (4 Steps)</h2>
    <ol style="margin:0;padding-left:20px">
      <li><strong>Upload</strong> your ${lc} in the tool above (JPG, PNG, HEIC or WEBP, from gallery or camera).</li>
      <li><strong>Crop</strong> — the box is locked to the ${S.ratio(spec.w, spec.h)} ratio required by ${esc(exam.name)}. Zoom, rotate or remove the background if needed.</li>
      <li><strong>Process</strong> — the ${lc} is resized to ${spec.w}×${spec.h}px and compressed into ${spec.min}–${spec.max} KB automatically.</li>
      <li><strong>Download</strong> the JPG and upload it on the ${esc(exam.name)} application form.</li>
    </ol>
    <h3>Common reasons the ${lc} upload is rejected</h3>
    <ul>
      <li>File is larger than ${spec.max} KB or smaller than ${spec.min} KB.</li>
      <li>Dimensions are not ${spec.w}×${spec.h}px, or the image is stretched.</li>
      <li>Wrong format — PNG, HEIC or PDF instead of ${spec.fmt}.</li>
      <li>${docType === 'photo' ? 'Dark, blurred or non-white background, or face not clearly visible.' : 'Faint, blurred or cut-off signature, or signature in capital letters.'}</li>
    </ul>
    <p style="margin:12px 0 0;font-size:14px">📖 ${docType === 'photo' ? '<a href="/resizer/guides/take-exam-photo-with-phone/">How to take an exam photo with your phone</a>' : '<a href="/resizer/guides/scan-signature-for-online-form/">How to scan your signature for online forms</a>'} · <a href="/resizer/guides/photo-upload-rejected-reasons/">12 reasons uploads get rejected</a></p>
  </section>

  ${sameSize.length ? `<section class="card">
    <h2>Other exams with the same ${lc} size (${spec.w}×${spec.h}px, ${spec.min}–${spec.max} KB)</h2>
    <p>A ${lc} resized here can also be used for:</p>
    <ul class="links">${sameSize.map(e => `<li><a href="/resizer/${e.slug}-${docType}-resize/">${esc(seoOf(e).short)} ${label}</a></li>`).join('')}</ul>
  </section>` : ''}

  <section style="margin:0 0 20px">
    <h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">${esc(short)} ${label} Size — FAQs</h2>
    ${S.faqHtml(faqs)}
  </section>

  <section class="card">
    <h2>More ${esc(cat.title)}</h2>
    <ul class="links">${catPeers.map(e => `<li><a href="/resizer/${e.slug}-${docType}-resize/">${esc(seoOf(e).short)} ${label} Size</a></li>`).join('')}</ul>
    <p style="margin:14px 0 0;font-size:14px"><a href="/resizer/${cat.hub}/">All ${esc(cat.title)} photo &amp; signature sizes →</a> · <a href="/resizer/photo-signature-size-chart/">Full exam size chart ${YEAR} →</a> · <a href="/resizer/size/${spec.w}x${spec.h}-pixels/">Resize any image to ${spec.w}×${spec.h}px →</a></p>
  </section>

  <p class="note">Specifications on this page are compiled from recent official ${esc(exam.name)} notifications and checked regularly (last review: ${MONTH_YEAR}). Always cross-check with the latest official notification before submitting — if the size has changed, you can edit width, height and KB directly in the tool. Spotted a change? <a href="mailto:gautamcoder@gmail.com?subject=${encodeURIComponent(`Size update: ${exam.name} ${lc}`)}">Tell us</a> and we will update this page.</p>

  ${S.adSlot()}
</main>

${S.footer([{ href: `/resizer/${cat.hub}/`, t: cat.title }])}${nd ? '\n<script src="/assets/ilx-apps.js" defer></script><script src="/assets/apps/image-tools.js" defer></script>' : ''}`;

  const dir = path.join(__dirname, 'resizer', slugDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// Generate all pages
let count = 0;
EXAMS.forEach(exam => {
  ['photo', 'signature'].forEach(docType => { generatePage(exam, docType); count++; });
});

console.log(`✅ Generated ${count} pages`);
console.log('ℹ️  Run "node generate-seo-hubs.js" then "node generate-sitemap.js"');
