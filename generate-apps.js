#!/usr/bin/env node
/**
 * In-browser tool pages: PDF tools, image converters, exam document tools,
 * exam score calculators (with exam pattern), JEE rank predictor, typing test,
 * plus the /pdf-tools/ and /exam-calculators/ hubs.
 * Tool logic lives in /assets/apps/*.js (loaded with defer; heavy libraries load
 * only when a file is picked). Run: node generate-apps.js
 */

const fs = require('fs');
const path = require('path');
const S = require('./seo-shell');
const { EXAMS, seoOf } = require('./exams-data');
const { SITE, YEAR, YEARS, MONTH_YEAR, esc } = S;

const ROOT = __dirname;
const write = (rel, html) => { fs.mkdirSync(path.join(ROOT, rel), { recursive: true }); fs.writeFileSync(path.join(ROOT, rel, 'index.html'), html, 'utf8'); };
const ex = slug => EXAMS.find(e => e.slug === slug);
const APP_CSS = '<link rel="stylesheet" href="/assets/ilx-apps.css">';
const SCRIPTS = { pdf: 'pdf-tools', image: 'image-tools', exam: 'exam-tools' };
let count = 0;

// ─── Shared guidance blocks (real help for form-fillers, shown under each tool) ─
const TIPS = {
  pdf: `<section class="card"><h2>Getting documents right for online forms</h2><ul>
    <li><strong>Check the exact limit first.</strong> Portals state the format (PDF or JPG) and a maximum size such as 100 KB, 200 KB or 1 MB. A file even 1 KB over is rejected.</li>
    <li><strong>Scan at 150–200 DPI.</strong> That is sharp enough to read and keeps files small. 600 DPI scans only make files bigger.</li>
    <li><strong>Upload only the pages asked for.</strong> Remove blank or extra pages with <a href="/organize-pdf/">Organise PDF</a> before compressing.</li>
    <li><strong>Password-protected PDFs</strong> (for example e-Aadhaar or bank statements) must be opened and saved without a password before most portals — and these tools — can use them.</li>
    <li><strong>Name files clearly</strong>, e.g. <code>10th_marksheet.pdf</code>, and open the final file once to check every page is readable.</li></ul></section>`,
  image: `<section class="card"><h2>Photo tips for exam and job forms</h2><ul>
    <li><strong>JPG is the safe format.</strong> Almost every Indian portal accepts only JPG/JPEG — HEIC, WEBP and PNG are commonly rejected.</li>
    <li><strong>Match pixels and KB.</strong> Portals check both the dimensions (e.g. 200×230) and the file size (e.g. 20–50 KB). The <a href="/resizer/">exam resizer</a> presets both for 80+ exams.</li>
    <li><strong>Use a recent photo</strong> with a plain light background, your face clearly visible and no filters.</li>
    <li><strong>Keep the original.</strong> Save the full-quality photo — many exams ask you to bring a printed copy of the same photo later.</li></ul></section>`,
};
const withTips = (kind, body) => (body || '') + (TIPS[kind] || '');

// ─── Page template ────────────────────────────────────────────────────────────
function page(p) {
  const canonical = `${SITE}/${p.slug}/`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, ...(p.hub ? [{ name: p.hub.name, url: `${SITE}/${p.hub.slug}/` }] : []), { name: p.crumb || p.h1, url: canonical }];
  const schema = [S.webPageSchema({ url: canonical, name: p.title, desc: p.desc, crumbs }), S.appSchema({ url: canonical, name: p.appName || p.h1, desc: p.desc }), ...(p.faqs && p.faqs.length ? [S.faqSchema(p.faqs)] : [])];
  if (p.steps) schema.push({ '@context': 'https://schema.org', '@type': 'HowTo', name: `How to ${p.howto || p.h1.toLowerCase()}`, totalTime: 'PT1M',
    step: p.steps.map((t, i) => ({ '@type': 'HowToStep', position: i + 1, text: t.replace(/<[^>]+>/g, '') })) });
  const toolBlock = !p.tool && !p.frame ? '' : p.tool
    ? `<section id="app" class="app" data-tool="${p.tool}"${p.data ? Object.entries(p.data).map(([k, v]) => ` data-${k}="${esc(typeof v === 'string' ? v : JSON.stringify(v))}"`).join('') : ''} style="min-height:190px"><noscript>Please enable JavaScript to use this tool — it runs entirely in your browser.</noscript></section>`
    : S.toolFrame(p.frame.src, p.frame.title);
  const html = `${S.head({ title: p.title, desc: p.desc, canonical, schema, extraHead: p.tool ? APP_CSS : '' })}
<header class="hero lt"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>${esc(p.h1)}</h1>
  <p class="lede">${p.lede}</p>
  <div class="trust">${(p.chips || ['✔ Free', '✔ Nothing uploaded', '✔ Works on mobile']).map(c => `<span>${c.replace(/^✓/, '✔')}</span>`).join('')}</div>
  ${p.dated ? `<p class="updated">Last updated: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time></p>` : ''}
</div></header>
<main class="wrap">
  ${toolBlock ? toolBlock : ''}
  ${p.answer ? `<div class="answer"><p>${p.answer}</p></div>` : ''}
  ${withTips(p.tips, p.body)}
  ${S.adSlot()}
  ${p.steps ? `<section class="card"><h2>How to ${esc(p.howto || p.h1.replace(/ Online.*$/, '').toLowerCase())}</h2><ol style="margin:0;padding-left:20px">${p.steps.map(s => `<li>${s}</li>`).join('')}</ol></section>` : ''}
  ${p.faqs && p.faqs.length ? `<section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(p.faqs)}</section>` : ''}
  ${p.related && p.related.length ? `<section class="card"><h2>Related tools</h2><ul class="links">${p.related.map(r => `<li><a href="${r[0]}">${esc(r[1])}</a></li>`).join('')}</ul></section>` : ''}
  ${p.note ? `<p class="note">${p.note}</p>` : ''}
</main>
${S.footer()}
${p.tool ? `<script src="/assets/ilx-apps.js" defer></script><script src="/assets/apps/${SCRIPTS[p.kind]}.js" defer></script>` : ''}`;
  write(p.slug, html); count++;
}

const PRIVACY_FAQ = { q: 'Are my files uploaded to a server?', a: 'No. The tool runs entirely in your browser using JavaScript — your files never leave your phone or computer, so they stay private.' };
const PDF_HUB = { name: 'PDF Tools', slug: 'pdf-tools' };
const IMG_HUB = { name: 'All Tools', slug: '' };
const CALC_HUB = { name: 'Exam Calculators', slug: 'exam-calculators' };
const PDF_RELATED = [['/compress-pdf/', 'Compress PDF'], ['/merge-pdf/', 'Merge PDF'], ['/split-pdf/', 'Split PDF'], ['/pdf-to-jpg/', 'PDF to JPG'], ['/image-to-pdf/', 'JPG to PDF'], ['/unlock-pdf/', 'Unlock PDF'], ['/sign-pdf/', 'Sign PDF'], ['/organize-pdf/', 'Organise PDF pages'], ['/pdf-tools/', 'All PDF tools']];
const rel = (list, self) => list.filter(r => r[0] !== `/${self}/`);

// ─── 1. PDF tools ─────────────────────────────────────────────────────────────
const KB_TARGETS = [100, 200, 300, 500, 1024, 2048];
const kbName = k => (k >= 1024 ? `${k / 1024} MB` : `${k} KB`);
const kbSlug = k => (k >= 1024 ? `${k / 1024}mb` : `${k}kb`);

page({
  slug: 'compress-pdf', kind: 'pdf', tips: 'pdf', tool: 'compress-pdf', hub: PDF_HUB, crumb: 'Compress PDF',
  title: 'Compress PDF Online Free – Reduce PDF Size to 100 KB, 200 KB, 500 KB',
  h1: 'Compress PDF – Reduce PDF File Size Online',
  desc: 'Reduce PDF size to 100 KB, 200 KB, 500 KB or 1 MB for exam and job application forms. Free, no upload — the PDF is compressed on your device.',
  lede: 'Shrink scanned certificates, mark sheets and documents to the <strong>exact KB limit</strong> of your application form — free, private and instant.',
  answer: 'To compress a PDF, choose the file below, pick a target size such as <strong>200 KB</strong>, and tap Compress. Each page is re-saved as an optimised image until the file fits the target, then you download the smaller PDF. Nothing is uploaded.',
  steps: ['Tap <strong>Choose PDF</strong> and select your file.', 'Pick a target size (100 KB, 200 KB, 500 KB…) or type your own.', 'For scanned mark sheets, tick <strong>Black &amp; white</strong> to reach small sizes with sharper text.', 'Tap <strong>Compress PDF</strong> and download the result.'],
  howto: 'compress a PDF',
  body: `<section class="card"><h2>Compress PDF to an exact size</h2><p>Application portals usually cap uploads at a fixed size. Jump straight to your limit:</p><ul class="links">${KB_TARGETS.map(k => `<li><a href="/compress-pdf-to-${kbSlug(k)}/">Compress PDF to ${kbName(k)}</a></li>`).join('')}</ul>
  <h3>How the compression works</h3><p>Most PDFs uploaded to exam forms are scans — each page is already a photo. The tool renders every page, then re-saves it as a JPEG at the highest quality that still fits your target, trying smaller page resolutions only if needed. Text in the result is not selectable, which is fine for certificates and scans. If your PDF is already smaller than the target, it is left unchanged.</p></section>`,
  faqs: [
    { q: 'How do I reduce a PDF to 200 KB?', a: 'Choose the PDF, select the 200 KB target and tap Compress. The tool lowers image quality step by step until the file is under 200 KB, keeping it as readable as possible.' },
    { q: 'Why can\'t my PDF reach 100 KB?', a: 'A PDF with many pages needs more space. Tick Black &amp; white, or split the PDF and upload only the required pages. As a rule of thumb, 100 KB fits about 1–3 scanned pages.' },
    { q: 'Will the text stay sharp?', a: 'Pages are re-saved as images, so text is not selectable, but at 200 KB and above scanned pages stay clearly readable. Preview the result before uploading.' },
    PRIVACY_FAQ,
  ],
  related: rel(PDF_RELATED, 'compress-pdf').concat([['/resize-marksheet-for-online-form/', 'Resize mark sheet'], ['/compress-image/', 'Compress image']]),
});

for (const k of KB_TARGETS) {
  const n = kbName(k), s = `compress-pdf-to-${kbSlug(k)}`;
  const pagesFit = k <= 100 ? '1–3' : k <= 300 ? '3–8' : k <= 500 ? '6–12' : k <= 1024 ? '12–25' : '25–50';
  page({
    slug: s, kind: 'pdf', tips: 'pdf', tool: 'compress-pdf', data: { 'target-kb': k }, hub: PDF_HUB, crumb: `Compress PDF to ${n}`,
    title: `Compress PDF to ${n} Online Free – Reduce PDF Size Under ${n}`,
    h1: `Compress PDF to ${n}`,
    desc: `Reduce your PDF to under ${n} for exam, job and admission forms. Free and private — compressed on your device, never uploaded.`,
    lede: `Get your PDF <strong>under ${n}</strong> in one tap — ideal for certificates, mark sheets and ID proofs on application portals.`,
    answer: `Choose your PDF below — the <strong>${n}</strong> target is already selected — and tap Compress. The tool finds the best quality that fits under ${n}. A ${n} PDF typically holds about <strong>${pagesFit} scanned pages</strong> at readable quality.`,
    steps: ['Choose your PDF.', `Keep the <strong>${n}</strong> target (or change it).`, 'Tick Black &amp; white for scanned documents to keep text sharp at small sizes.', 'Tap Compress PDF and download.'],
    howto: `compress a PDF to ${n}`,
    body: `<section class="card"><h2>Tips to fit a PDF under ${n}</h2><ul>
      <li><strong>Upload only the pages asked for</strong> — use <a href="/split-pdf/">Split PDF</a> to extract them first.</li>
      <li><strong>Black &amp; white</strong> makes scanned text sharper and files much smaller.</li>
      <li><strong>Scan at 150–200 DPI</strong>, not 600 DPI — higher resolution only adds size.</li>
      <li>Documents are photos? <a href="/image-to-pdf/">Convert JPG to PDF</a> first, then compress.</li></ul>
      <p>Other sizes: ${KB_TARGETS.filter(x => x !== k).map(x => `<a href="/compress-pdf-to-${kbSlug(x)}/">${kbName(x)}</a>`).join(' · ')}</p></section>`,
    faqs: [
      { q: `How can I compress a PDF to ${n} for free?`, a: `Use this page: pick the PDF and tap Compress with the ${n} target. It is free, needs no sign-up and works on mobile.` },
      { q: `How many pages fit in a ${n} PDF?`, a: `About ${pagesFit} scanned A4 pages at readable quality. Black &amp; white mode fits more.` },
      { q: 'Is the compressed PDF accepted by exam portals?', a: 'Yes — it is a standard PDF. Portals check the file type and size; always preview it to make sure the text is readable before you upload.' },
      PRIVACY_FAQ,
    ],
    related: [['/compress-pdf/', 'Compress PDF (any size)'], ['/split-pdf/', 'Split PDF'], ['/image-to-pdf/', 'JPG to PDF'], ['/merge-pdf/', 'Merge PDF'], ['/resize-certificate-for-online-form/', 'Resize certificate']],
  });
}

const PDF_TOOLS = [
  { slug: 'merge-pdf', tool: 'merge-pdf', crumb: 'Merge PDF', title: 'Merge PDF Online Free – Combine PDF Files into One', h1: 'Merge PDF Files into One',
    desc: 'Combine several PDFs into one file in any order. Free and private — PDFs are merged on your device, never uploaded.',
    lede: 'Join certificates, mark sheets and forms into <strong>one PDF</strong> — reorder files before merging.',
    answer: 'Choose two or more PDFs, arrange them with ▲ ▼, and tap <strong>Merge PDFs</strong>. You get one combined PDF with every page in the order you chose.',
    steps: ['Choose the PDFs (you can add more later).', 'Reorder them with ▲ ▼ or remove any with ✕.', 'Tap Merge PDFs — the combined file downloads.'],
    faqs: [{ q: 'How do I merge PDFs on my phone?', a: 'Open this page in Chrome or Safari, choose your PDFs, put them in order and tap Merge. The merged file downloads to your phone.' },
      { q: 'Is there a limit on files?', a: 'No fixed limit. Very large files depend on your device memory; for exam forms, merging a few documents is instant.' },
      { q: 'The merged PDF is too big for the form — what now?', a: 'Run it through <a href="/compress-pdf/">Compress PDF</a> with your form\'s KB limit.' }, PRIVACY_FAQ] },
  { slug: 'split-pdf', tool: 'split-pdf', crumb: 'Split PDF', title: 'Split PDF Online Free – Extract Pages from PDF', h1: 'Split PDF – Extract Pages',
    desc: 'Extract selected pages from a PDF or split every page into a separate PDF. Free, private, no upload.',
    lede: 'Pull out just the pages a form asks for — or split a PDF into <strong>single-page files</strong>.',
    answer: 'Choose a PDF, type the pages you want (for example <strong>1-3, 5</strong>) and tap Split to get a new PDF with only those pages. Or choose "Split every page" to get each page as its own PDF in a ZIP.',
    steps: ['Choose the PDF.', 'Enter page numbers like 1-3, 5 — or pick "Split every page".', 'Tap Split PDF and download.'],
    faqs: [{ q: 'How do I extract one page from a PDF?', a: 'Type that page number (e.g. 2) in the pages box and tap Split PDF. You get a one-page PDF.' },
      { q: 'Can I split a PDF into single pages?', a: 'Yes — choose "Split every page" and you get a ZIP containing one PDF per page.' }, PRIVACY_FAQ] },
  { slug: 'rotate-pdf', tool: 'rotate-pdf', crumb: 'Rotate PDF', title: 'Rotate PDF Online Free – Rotate PDF Pages Permanently', h1: 'Rotate PDF Pages',
    desc: 'Rotate all or selected PDF pages by 90° or 180° and save permanently. Free, private, no upload.',
    lede: 'Fix sideways or upside-down scans before you upload them.',
    answer: 'Choose a PDF, pick 90° clockwise, 180° or 90° anti-clockwise, optionally type the page numbers, and tap <strong>Rotate PDF</strong>. The rotation is saved in the file.',
    steps: ['Choose the PDF.', 'Choose the angle.', 'Leave pages blank for all pages, or enter e.g. 2, 4-6.', 'Tap Rotate PDF and download.'],
    faqs: [{ q: 'Is the rotation permanent?', a: 'Yes — the new orientation is saved in the PDF, so it opens correctly everywhere.' }, PRIVACY_FAQ] },
  { slug: 'organize-pdf', tool: 'organize-pdf', crumb: 'Organise PDF', title: 'Organise PDF Pages – Reorder, Delete & Rotate Pages Online', h1: 'Organise PDF Pages – Reorder, Delete, Rotate',
    desc: 'See every page of your PDF, then reorder, delete or rotate pages and save a new PDF. Free and private.',
    lede: 'Remove blank pages, fix page order and rotate scans — with a visual page view.',
    answer: 'Choose a PDF to see page thumbnails. Use ◀ ▶ to move a page, ⟳ to rotate it and ✕ to delete it, then tap <strong>Save new PDF</strong>.',
    steps: ['Choose the PDF — thumbnails of every page appear.', 'Move pages with ◀ ▶, rotate with ⟳, delete with ✕.', 'Tap Save new PDF.'],
    faqs: [{ q: 'How do I delete a page from a PDF?', a: 'Tap ✕ on that page\'s thumbnail (tap again to restore), then Save new PDF.' }, PRIVACY_FAQ] },
  { slug: 'pdf-to-jpg', tool: 'pdf-to-jpg', crumb: 'PDF to JPG', title: 'PDF to JPG Converter Online Free – Convert PDF Pages to Images', h1: 'PDF to JPG – Convert PDF to Images',
    desc: 'Convert every PDF page to a high-quality JPG image (up to 300 DPI). Free, private, works on mobile.',
    lede: 'Turn PDF pages into JPG images — handy when a form accepts only images.',
    answer: 'Choose a PDF, pick the quality (150 DPI is best for forms) and tap <strong>Convert to JPG</strong>. One page downloads as a JPG; several pages download as a ZIP, and you can tap any page to save it alone.',
    steps: ['Choose the PDF.', 'Pick quality and, optionally, page numbers.', 'Tap Convert to JPG and download.'],
    faqs: [{ q: 'The JPG is too large for my form — what next?', a: 'Use <a href="/resize-image-to-100kb/">Resize image to 100 KB</a> or the <a href="/resizer/">exam resizer</a> to fit the exact pixels and KB.' },
      { q: 'Which DPI should I choose?', a: '150 DPI gives sharp, readable pages at a reasonable size. Use 300 DPI only if you need to print.' }, PRIVACY_FAQ] },
  { slug: 'add-watermark-to-pdf', tool: 'watermark-pdf', crumb: 'Add watermark', title: 'Add Watermark to PDF Online Free – Text Watermark', h1: 'Add Watermark to PDF',
    desc: 'Stamp a text watermark like "For Verification Only" on every PDF page. Choose size, colour and opacity. Free and private.',
    lede: 'Protect copies of your ID and certificates — mark them <strong>"Only for [purpose]"</strong> before sharing.',
    answer: 'Choose a PDF, type the watermark text (for example <strong>ONLY FOR SSC APPLICATION</strong>), pick size, colour and opacity, and tap <strong>Add watermark</strong>.',
    steps: ['Choose the PDF.', 'Type the watermark text.', 'Pick size, opacity, colour and style.', 'Tap Add watermark and download.'],
    faqs: [{ q: 'Why watermark documents I share?', a: 'A watermark such as "Only for passport verification" makes a copy of your Aadhaar or certificate harder to misuse elsewhere.' },
      { q: 'Can I use Hindi text?', a: 'Currently the watermark supports English letters, numbers and basic symbols.' }, PRIVACY_FAQ] },
  { slug: 'add-page-numbers-to-pdf', tool: 'page-numbers-pdf', crumb: 'Page numbers', title: 'Add Page Numbers to PDF Online Free', h1: 'Add Page Numbers to PDF',
    desc: 'Number PDF pages as "1", "Page 1" or "Page 1 of N" at the bottom or top. Free, private, no upload.',
    lede: 'Number your assignment, project report or document set in seconds.',
    answer: 'Choose a PDF, pick the position and format (such as <strong>Page 1 of 10</strong>), and tap <strong>Add page numbers</strong>.',
    steps: ['Choose the PDF.', 'Pick position, format and starting number.', 'Tap Add page numbers and download.'],
    faqs: [{ q: 'Can I skip the cover page?', a: 'Yes — tick "Skip first page" and numbering starts from the second page.' }, PRIVACY_FAQ] },
  { slug: 'extract-text-from-pdf', tool: 'pdf-to-text', crumb: 'PDF to text', title: 'Extract Text from PDF Online Free – PDF to Text', h1: 'Extract Text from PDF',
    desc: 'Copy all text from a PDF or download it as a .txt file. Free, private, works on mobile.',
    lede: 'Get the text out of notes, notifications and question papers to copy or search.',
    answer: 'Choose a PDF — its text appears below, page by page. Tap <strong>Copy text</strong> or download it as a .txt file. Scanned PDFs (images only) have no text to extract.',
    steps: ['Choose the PDF.', 'Wait a moment while pages are read.', 'Copy the text or download .txt.'],
    faqs: [{ q: 'Why is no text found?', a: 'Scanned PDFs are just images of pages, so there is no text layer to extract.' }, PRIVACY_FAQ] },
  { slug: 'unlock-pdf', tool: 'unlock-pdf', crumb: 'Unlock PDF', title: 'Unlock PDF – Remove Password from PDF Online Free (e-Aadhaar)', h1: 'Unlock PDF – Remove PDF Password',
    desc: 'Remove the password from a PDF you own — e-Aadhaar, bank statements, salary slips — so exam and job portals accept it. Free, runs on your device.',
    lede: 'Portals reject <strong>password-protected PDFs</strong>. Enter the password once and save an unlocked copy.',
    answer: 'Choose the locked PDF, type its password and tap <strong>Unlock PDF</strong>. You get a copy that opens without a password. For e-Aadhaar, the password is the first 4 letters of your name in CAPITALS followed by your birth year (for example <strong>RAHU1998</strong>).',
    steps: ['Choose the password-protected PDF.', 'Enter its password.', 'Tap Unlock PDF and download the unlocked copy.'],
    faqs: [{ q: 'Can this unlock a PDF without the password?', a: 'No. You must know the password — this tool removes it from a document you already have access to, such as your own e-Aadhaar or bank statement.' },
      { q: 'What is the e-Aadhaar PDF password?', a: 'The first 4 letters of your name (as on Aadhaar) in CAPITAL letters, followed by your year of birth — e.g. RAHU1998.' },
      { q: 'Why is the unlocked PDF larger?', a: 'Pages are re-saved as images to remove the protection. Use <a href="/compress-pdf/">Compress PDF</a> to bring it under your portal\'s limit.' }, PRIVACY_FAQ] },
  { slug: 'sign-pdf', tool: 'sign-pdf', crumb: 'Sign PDF', title: 'Sign PDF Online Free – Add Your Signature to a PDF', h1: 'Sign PDF – Add Your Signature',
    desc: 'Draw or upload your signature and place it on a PDF — last page, first page or every page, with an optional date. Free, private, no upload.',
    lede: 'Sign undertakings, declarations and forms without printing — <strong>draw with your finger</strong> or upload a signature photo.',
    answer: 'Choose the PDF, draw your signature (or upload a photo of it — the white background is removed), pick the page and position, and tap <strong>Sign PDF</strong>.',
    steps: ['Choose the PDF.', 'Draw your signature or upload a signature image.', 'Pick page, position and size — optionally add today\'s date.', 'Tap Sign PDF and download.'],
    faqs: [{ q: 'Is a signature added this way legally valid?', a: 'It is an image of your signature, suitable for most forms and undertakings that ask for a signed copy. It is not a certificate-based digital signature (DSC).' },
      { q: 'Can I sign every page?', a: 'Yes — choose "Every page" in the page option.' }, PRIVACY_FAQ] },
  { slug: 'pdf-to-black-and-white', tool: 'pdf-black-white', crumb: 'PDF to black & white', title: 'Convert PDF to Black and White Online Free – Grayscale PDF', h1: 'PDF to Black & White (Grayscale)',
    desc: 'Convert a colour PDF to grayscale or high-contrast black & white — sharper scanned text and smaller files. Free, private, no upload.',
    lede: 'Make scans of mark sheets and certificates <strong>crisp and readable</strong> — and smaller.',
    answer: 'Choose a PDF, pick <strong>Grayscale</strong> or <strong>High-contrast black &amp; white</strong>, and tap Convert. High contrast whitens the paper and darkens the text — ideal for photographed documents.',
    steps: ['Choose the PDF.', 'Pick Grayscale or High-contrast.', 'Tap Convert and download.'],
    faqs: [{ q: 'Will it make my PDF smaller?', a: 'Usually yes. For an exact limit, run the result through <a href="/compress-pdf/">Compress PDF</a>.' }, PRIVACY_FAQ] },
  { slug: 'resize-pdf-to-a4', tool: 'resize-pdf-a4', crumb: 'Resize PDF to A4', title: 'Resize PDF to A4 Online Free – Change PDF Page Size', h1: 'Resize PDF to A4 Page Size',
    desc: 'Fit every page of a PDF onto A4, Letter or Legal paper without cropping — text stays sharp. Free, private, no upload.',
    lede: 'Mixed page sizes or phone-sized scans? Put every page on a <strong>standard A4 sheet</strong>.',
    answer: 'Choose a PDF, pick A4 (or Letter/Legal) and a margin, and tap <strong>Resize pages</strong>. Each page is scaled to fit and centred — nothing is cropped, and text stays selectable.',
    steps: ['Choose the PDF.', 'Pick the page size and margin.', 'Tap Resize pages and download.'],
    faqs: [{ q: 'Does resizing to A4 reduce quality?', a: 'No. Pages are scaled as vector content, so text and lines stay sharp.' }, PRIVACY_FAQ] },
];
for (const t of PDF_TOOLS) page({ kind: 'pdf', tips: 'pdf', hub: PDF_HUB, related: rel(PDF_RELATED, t.slug), ...t });

// PDF hub
{
  const all = [['/compress-pdf/', 'Compress PDF', 'Reduce PDF size to any KB'], ...KB_TARGETS.map(k => [`/compress-pdf-to-${kbSlug(k)}/`, `Compress PDF to ${kbName(k)}`, `Fit forms with a ${kbName(k)} limit`]),
    ['/merge-pdf/', 'Merge PDF', 'Combine PDFs into one'], ['/split-pdf/', 'Split PDF', 'Extract pages or split every page'], ['/organize-pdf/', 'Organise PDF', 'Reorder, delete, rotate pages'],
    ['/rotate-pdf/', 'Rotate PDF', 'Fix sideways pages'], ['/pdf-to-jpg/', 'PDF to JPG', 'Convert pages to images'], ['/image-to-pdf/', 'JPG to PDF', 'Turn photos into a PDF'],
    ['/add-watermark-to-pdf/', 'Add watermark', 'Stamp text on every page'], ['/unlock-pdf/', 'Unlock PDF', 'Remove a password you know (e-Aadhaar)'], ['/sign-pdf/', 'Sign PDF', 'Draw or upload your signature'], ['/pdf-to-black-and-white/', 'PDF to black & white', 'Grayscale or high contrast'], ['/resize-pdf-to-a4/', 'Resize PDF to A4', 'Fit pages to A4/Letter'], ['/add-page-numbers-to-pdf/', 'Page numbers', 'Number PDF pages'], ['/extract-text-from-pdf/', 'PDF to text', 'Copy text from a PDF']];
  page({ slug: 'pdf-tools', crumb: 'PDF Tools', title: 'Free PDF Tools – Compress, Merge, Split, Convert (No Upload)', h1: 'Free PDF Tools for Exam & Job Forms',
    desc: 'Compress PDF to 100/200/500 KB, merge, split, rotate, organise and convert PDFs — free, and every tool runs on your device.',
    lede: 'Every PDF task an application form needs — <strong>private by design</strong>: files never leave your device.',
    frame: null, tool: null,
    body: `<section class="card"><h2>All PDF tools</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><tbody>${all.map(a => `<tr><td><a href="${a[0]}"><strong>${esc(a[1])}</strong></a></td><td>${esc(a[2])}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card"><h2>Why our PDF tools are different</h2><p>Most online PDF sites upload your file to their servers. Ours use your browser's own processing power — your mark sheets, ID proofs and certificates never leave your phone or laptop. That makes them fast, free and safe for sensitive documents.</p></section>`,
    faqs: [PRIVACY_FAQ, { q: 'Do the PDF tools work on mobile?', a: 'Yes — they work in Chrome, Safari and other modern browsers on Android and iPhone.' }],
    related: [['/compress-image/', 'Compress image'], ['/resizer/', 'Exam photo resizer'], ['/image-to-pdf/', 'JPG to PDF']] });
}

// ─── 2. Image tools ───────────────────────────────────────────────────────────
const IMG_TOOLS = [
  { slug: 'heic-to-jpg', tool: 'heic-to-jpg', title: 'HEIC to JPG Converter Online Free – Convert iPhone Photos', h1: 'HEIC to JPG Converter',
    desc: 'Convert iPhone HEIC/HEIF photos to JPG in your browser — batch convert, no upload. Exam portals accept only JPG.',
    lede: 'iPhone photos are saved as <strong>HEIC</strong>, which exam and job portals reject. Convert them to JPG in seconds.',
    answer: 'Choose one or more HEIC photos and they are converted to <strong>JPG</strong> automatically. Download each one, or all of them as a ZIP.',
    steps: ['Choose your HEIC photos.', 'Wait a few seconds (the converter loads on first use).', 'Download the JPGs.'],
    faqs: [{ q: 'Why do forms reject my iPhone photo?', a: 'iPhones save photos in HEIC format, while almost every Indian exam portal accepts only JPG/JPEG. Convert it here first.' },
      { q: 'How do I stop my iPhone saving HEIC?', a: 'Settings → Camera → Formats → Most Compatible. New photos will be saved as JPG.' }, PRIVACY_FAQ] },
  { slug: 'webp-to-jpg', tool: 'webp-to-jpg', title: 'WEBP to JPG Converter Online Free – Convert WEBP, PNG to JPG', h1: 'WEBP to JPG Converter',
    desc: 'Convert WEBP (and PNG, GIF, BMP) images to JPG instantly in your browser. Batch convert, no upload.',
    lede: 'Downloaded a <strong>.webp</strong> image that a form won\'t accept? Turn it into JPG instantly.',
    answer: 'Choose your WEBP (or PNG, GIF, BMP) images and they are converted to <strong>JPG</strong> right away. Download each, or all as a ZIP.',
    steps: ['Choose the images.', 'Pick the quality.', 'Download the JPGs.'],
    faqs: [{ q: 'Does converting reduce quality?', a: 'At High quality the difference is invisible. Choose "Smaller file" if you need a lower KB.' }, PRIVACY_FAQ] },
  { slug: 'photo-with-name-and-date', tool: 'photo-name-date', title: 'Add Name and Date on Photo Online – Exam Photo with Name & Date', h1: 'Photo with Name and Date – Free Online Maker',
    desc: 'Add your name and the date of the photo below your passport photo, resized to exam size and KB. Free, no upload, works on mobile.',
    lede: 'Some exam and recruitment forms ask for a photo with your <strong>name and date printed below it</strong>. Make it here in one step.',
    answer: 'Choose your photo, type your name and the date it was taken, pick the size, and tap <strong>Create photo</strong>. Your name and date are printed in a white strip below the photo, and the file is compressed to your KB limit.',
    steps: ['Choose a recent passport-style photo.', 'Type your name exactly as on the form and the photo date.', 'Pick the pixel size and KB limit from your notification.', 'Tap Create photo, check spelling, and download.'],
    faqs: [{ q: 'Which exams need a photo with name and date?', a: 'The requirement appears in some exam and recruitment notifications. Only add name and date if your notification asks for it — otherwise upload a plain photo.' },
      { q: 'What date should I write?', a: 'The date the photo was taken, in the format your notification shows (usually DD/MM/YYYY). It must be recent, typically within 3–6 months.' },
      { q: 'Can I set an exact size?', a: 'Yes — choose 200×230, 275×354, 413×531 or keep your own size, and set the maximum and minimum KB.' }, PRIVACY_FAQ] },
  { slug: 'join-photo-and-signature', tool: 'join-photo-signature', title: 'Join Photo and Signature Online – Combine into One Image', h1: 'Join Photo and Signature into One Image',
    desc: 'Combine your photo and signature into a single JPG — signature below or beside the photo — and compress to your KB limit. Free, no upload.',
    lede: 'For forms that want your <strong>photo and signature in a single image</strong>.',
    answer: 'Choose your photo and your signature, pick "signature below photo" or "side by side", set the width and KB limit, and tap <strong>Join images</strong>.',
    steps: ['Choose your photo.', 'Choose your signature.', 'Pick layout, width and maximum KB.', 'Tap Join images and download.'],
    faqs: [{ q: 'What size should the combined image be?', a: 'Follow your notification. If it gives none, 300 px wide and under 100 KB works for most portals.' }, PRIVACY_FAQ] },
];
for (const t of IMG_TOOLS) page({ kind: 'image', tips: 'image', hub: IMG_HUB.slug ? IMG_HUB : null, related: [['/resizer/', 'Exam photo resizer'], ['/compress-image/', 'Compress image'], ['/heic-to-jpg/', 'HEIC to JPG'], ['/webp-to-jpg/', 'WEBP to JPG'], ['/photo-with-name-and-date/', 'Photo with name & date'], ['/join-photo-and-signature/', 'Join photo & signature'], ['/png-to-jpg/', 'PNG to JPG']].filter(r => r[0] !== `/${t.slug}/`), ...t });

// ─── 3. Document resizers (idea: mark sheets & certificates) + JPG resize ────
const docPage = (slug, what, whatL, examples) => page({
  slug, hub: null, crumb: `Resize ${what}`,
  title: `Resize ${what} for Online Form – Reduce to 100 KB, 200 KB, 500 KB`,
  h1: `Resize ${what} for Online Application Forms`,
  desc: `Reduce a scanned ${whatL} (photo or PDF) to the KB limit of your exam or admission form — 100 KB, 200 KB or 500 KB. Free, no upload.`,
  lede: `Portals often ask for ${examples} under a strict size limit. Shrink your ${whatL} here, keeping it readable.`,
  answer: `For a <strong>photo/scan</strong> of your ${whatL}, use the tool below: it keeps the document's dimensions and compresses it under the KB you set (200 KB is preset). For a <strong>PDF</strong>, use <a href="/compress-pdf/">Compress PDF</a>.`,
  frame: { src: `/resizer/?preset=resize-${slug}&free=1&maxkb=200&title=${encodeURIComponent('Resize ' + what)}&canon=${encodeURIComponent(`${SITE}/${slug}/`)}&embed=1`, title: `${what} resizer — compress to your KB limit` },
  body: `<section class="card"><h2>Common size limits</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Form asks for</th><th>Use</th></tr></thead><tbody>
    <tr><td>JPG under 100 KB</td><td><a href="/resize-image-to-100kb/">Resize image to 100 KB</a></td></tr>
    <tr><td>JPG under 200 KB</td><td><a href="/resize-image-to-200kb/">Resize image to 200 KB</a></td></tr>
    <tr><td>JPG under 500 KB</td><td><a href="/resize-image-to-500kb/">Resize image to 500 KB</a></td></tr>
    <tr><td>PDF under 100 / 200 / 500 KB</td><td><a href="/compress-pdf-to-100kb/">100 KB</a> · <a href="/compress-pdf-to-200kb/">200 KB</a> · <a href="/compress-pdf-to-500kb/">500 KB</a></td></tr>
    <tr><td>Photo of a document → PDF</td><td><a href="/image-to-pdf/">JPG to PDF</a>, then compress</td></tr></tbody></table></div>
    <h3>Scanning tips</h3><ul><li>Place the ${whatL} flat on a table in daylight and photograph from directly above.</li><li>Crop away the table so only the document is visible.</li><li>Check that marks, names and stamps are readable after compressing — zoom in on the preview.</li></ul></section>`,
  steps: [`Photograph or scan your ${whatL}.`, 'Upload it in the tool and crop to the page edges.', 'Keep or change the KB limit (200 KB preset).', 'Process, check readability, and download.'],
  howto: `resize a ${whatL} for an online form`,
  faqs: [{ q: `What size should a ${whatL} be for an online form?`, a: 'It depends on the portal — commonly 100 KB to 500 KB, as JPG or PDF. Always follow your notification.' },
    { q: 'Should I upload a JPG or a PDF?', a: 'Upload whatever the form asks for. If it accepts both, a PDF is better for multi-page documents; a JPG is fine for a single page.' }, PRIVACY_FAQ],
  related: [['/compress-pdf/', 'Compress PDF'], ['/image-to-pdf/', 'JPG to PDF'], ['/merge-pdf/', 'Merge PDF'], ['/resize-image-to-200kb/', 'Resize to 200 KB'], ['/resizer/', 'Exam photo resizer']],
});
docPage('resize-marksheet-for-online-form', 'Mark Sheet', 'mark sheet', '10th/12th mark sheets and degree certificates');
docPage('resize-certificate-for-online-form', 'Certificate', 'certificate', 'caste, EWS, domicile, income and experience certificates');

page({
  slug: 'jpg-resize', hub: null, crumb: 'JPG Resize', tips: 'image',
  title: 'JPG Resize Online – Resize JPG to Exact Pixels & KB (Free)',
  h1: 'JPG Resize – Resize JPG Images Online',
  desc: 'Resize a JPG to exact width × height in pixels, cm or inches, and compress it to a KB limit. Free, fast and private — no upload.',
  lede: 'Set the exact <strong>width, height and KB</strong> you need — perfect for exam forms, ID cards and job portals.',
  answer: 'Upload your JPG in the tool below, type the width and height you need (in px, cm, mm or inches), set the maximum KB, crop, and download. It works for PNG, HEIC and WEBP too, and always saves a JPG.',
  frame: { src: `/resizer/?preset=jpg-resize&w=600&h=600&minkb=0&maxkb=500&fmt=JPG&title=${encodeURIComponent('JPG Resize')}&canon=${encodeURIComponent(`${SITE}/jpg-resize/`)}&embed=1`, title: 'JPG resize — set width, height and KB' },
  body: `<section class="card"><h2>Popular JPG sizes</h2><ul class="links">${[[200, 230], [275, 354], [150, 200], [140, 60], [300, 300], [413, 531], [600, 600], [250, 250]].map(([w, h]) => `<li><a href="/resizer/size/${w}x${h}-pixels/">${w}×${h} px</a></li>`).join('')}</ul>
    <h3>Resize JPG by file size</h3><ul class="links">${[10, 20, 30, 50, 100, 200, 300, 500].map(k => `<li><a href="/resize-image-to-${k}kb/">JPG to ${k} KB</a></li>`).join('')}<li><a href="/resize-image-to-1mb/">JPG to 1 MB</a></li><li><a href="/resize-photo-to-50kb/">Photo to 50 KB</a></li><li><a href="/resize-photo-to-100kb/">Photo to 100 KB</a></li><li><a href="/resize-signature-to-10kb/">Signature to 10 KB</a></li><li><a href="/resize-signature-to-20kb/">Signature to 20 KB</a></li></ul></section>`,
  steps: ['Upload the JPG.', 'Enter width and height (choose px, cm, mm or inch).', 'Set the maximum KB.', 'Crop and download.'],
  howto: 'resize a JPG',
  faqs: [{ q: 'How do I resize a JPG without losing quality?', a: 'Resize to the exact size you need in one step and keep the KB limit as high as the form allows — quality drops only when the file must be very small.' },
    { q: 'Can I resize a JPG in cm?', a: 'Yes — switch the unit to cm, mm or inch and choose the DPI; the tool converts it to pixels.' }, PRIVACY_FAQ],
  related: [['/resize-image-custom-size/', 'Custom size'], ['/resize-image-in-cm/', 'Resize in cm'], ['/compress-image/', 'Compress image'], ['/resizer/', 'Exam photo resizer'], ['/resizer/size/', 'All pixel sizes']],
});

// ─── 4. Exam score calculators (+ exam pattern) ──────────────────────────────
const sec = (name, q, pos, neg, tita) => ({ name, q, pos, neg, ...(tita ? { tita: true } : {}) });
const CALCS = [
  { slug: 'neet-score-calculator', exam: 'NEET UG', data: 'neet-ug', age: '/age-calculator-for-neet/', mode: 'Pen and paper (OMR)', dur: '3 hours',
    papers: [{ name: 'NEET UG', sections: [sec('Physics', 45, 4, 1), sec('Chemistry', 45, 4, 1), sec('Botany', 45, 4, 1), sec('Zoology', 45, 4, 1)] }],
    extra: 'All 180 questions are compulsory — there is no optional section. NTA publishes the tie-breaking rules in each year\'s information bulletin.' },
  { slug: 'jee-main-score-calculator', exam: 'JEE Main', data: 'jee-main', mode: 'Computer-based test', dur: '3 hours',
    papers: [{ name: 'JEE Main Paper 1 (B.E./B.Tech)', sections: [sec('Physics', 25, 4, 1), sec('Chemistry', 25, 4, 1), sec('Mathematics', 25, 4, 1)] }],
    extra: 'Each subject has 20 MCQs (Section A) and 5 numerical questions (Section B), all compulsory. Wrong answers lose 1 mark in both MCQs and numerical questions. Your raw score is converted to an NTA percentile — see the <a href="/jee-main-rank-predictor/">JEE Main rank predictor</a>.' },
  { slug: 'cuet-score-calculator', exam: 'CUET UG', data: null, mode: 'Computer-based test', dur: '60 minutes per subject',
    papers: [{ name: 'CUET UG (one subject paper)', sections: [sec('Subject paper', 50, 5, 1)] }],
    extra: 'Each subject paper has 50 compulsory questions for 250 marks. Calculate each subject separately; universities use subject-wise normalised scores.' },
  { slug: 'ssc-cgl-score-calculator', exam: 'SSC CGL', data: 'ssc-cgl', age: '/age-calculator-for-ssc-cgl/', mode: 'Computer-based test (Tier 1)', dur: '60 minutes',
    papers: [{ name: 'SSC CGL Tier 1', sections: [sec('General Intelligence & Reasoning', 25, 2, 0.5), sec('General Awareness', 25, 2, 0.5), sec('Quantitative Aptitude', 25, 2, 0.5), sec('English Comprehension', 25, 2, 0.5)] }],
    extra: 'Tier 1 is qualifying for Tier 2. SSC normalises scores across shifts, so your final score can differ slightly from the raw score.' },
  { slug: 'ssc-chsl-score-calculator', exam: 'SSC CHSL', data: 'ssc-chsl', mode: 'Computer-based test (Tier 1)', dur: '60 minutes',
    papers: [{ name: 'SSC CHSL Tier 1', sections: [sec('English Language', 25, 2, 0.5), sec('General Intelligence', 25, 2, 0.5), sec('Quantitative Aptitude', 25, 2, 0.5), sec('General Awareness', 25, 2, 0.5)] }],
    extra: 'Scores are normalised across shifts by SSC. The typing/skill test is separate — practise with the <a href="/typing-test/">typing test</a>.' },
  { slug: 'ibps-po-score-calculator', exam: 'IBPS PO', data: 'ibps-po', age: '/age-calculator-for-ibps-po/', mode: 'Computer-based test (Prelims)', dur: '60 minutes',
    papers: [{ name: 'IBPS PO Prelims', sections: [sec('All sections (English, Quant, Reasoning)', 100, 1, 0.25)] }],
    extra: 'The prelims has sectional timing and sectional cut-offs, so also check your score in each section against previous cut-offs.' },
  { slug: 'ibps-clerk-score-calculator', exam: 'IBPS Clerk', data: 'ibps-clerk', age: '/age-calculator-for-ibps-clerk/', mode: 'Computer-based test (Prelims)', dur: '60 minutes',
    papers: [{ name: 'IBPS Clerk Prelims', sections: [sec('English Language', 30, 1, 0.25), sec('Numerical Ability', 35, 1, 0.25), sec('Reasoning Ability', 35, 1, 0.25)] }],
    extra: 'Each section has its own time limit and cut-off.' },
  { slug: 'sbi-po-score-calculator', exam: 'SBI PO', data: 'sbi-po', age: '/age-calculator-for-sbi-po/', mode: 'Computer-based test (Prelims)', dur: '60 minutes',
    papers: [{ name: 'SBI PO Prelims', sections: [sec('English Language', 30, 1, 0.25), sec('Quantitative Aptitude', 35, 1, 0.25), sec('Reasoning Ability', 35, 1, 0.25)] }],
    extra: 'Each section is timed separately.' },
  { slug: 'sbi-clerk-score-calculator', exam: 'SBI Clerk', data: 'sbi-clerk', mode: 'Computer-based test (Prelims)', dur: '60 minutes',
    papers: [{ name: 'SBI Clerk Prelims', sections: [sec('English Language', 30, 1, 0.25), sec('Numerical Ability', 35, 1, 0.25), sec('Reasoning Ability', 35, 1, 0.25)] }],
    extra: 'Each section is timed separately.' },
  { slug: 'rrb-ntpc-score-calculator', exam: 'RRB NTPC', data: null, age: '/age-calculator-for-rrb-ntpc/', mode: 'Computer-based test (CBT 1)', dur: '90 minutes',
    papers: [{ name: 'RRB NTPC CBT 1', sections: [sec('Mathematics', 30, 1, 1 / 3), sec('General Intelligence & Reasoning', 30, 1, 1 / 3), sec('General Awareness', 40, 1, 1 / 3)] }],
    extra: 'RRB normalises marks across shifts before preparing the merit list.' },
  { slug: 'upsc-prelims-score-calculator', exam: 'UPSC Prelims', data: 'upsc', age: '/age-calculator-for-upsc/', mode: 'Pen and paper (OMR), two papers', dur: '2 hours per paper',
    papers: [{ name: 'GS Paper I', sections: [sec('General Studies', 100, 2, 2 / 3)] }, { name: 'CSAT (Paper II)', sections: [sec('CSAT', 80, 2.5, 2.5 / 3)], qualify: 66 }],
    extra: 'Only GS Paper I counts for the merit list. CSAT is qualifying — you must score at least 33%, i.e. 66 out of 200.' },
  { slug: 'cat-score-calculator', exam: 'CAT', data: 'cat', mode: 'Computer-based test', dur: '2 hours (40 minutes per section)',
    papers: [{ name: 'CAT', sections: [sec('VARC', 24, 3, 1, true), sec('DILR', 22, 3, 1, true), sec('Quantitative Ability', 22, 3, 1, true)] }],
    extra: 'MCQs carry +3/−1. TITA (type-in-the-answer) questions carry +3 with no negative marking — enter TITA answers separately. CAT scores are scaled and converted to percentiles.' },
];

const r2 = n => Math.round(n * 100) / 100;
for (const c of CALCS) {
  const d = c.data && ex(c.data), short = c.exam, allSec = c.papers.flatMap(p => p.sections);
  const totalQ = c.papers.map(p => p.sections.reduce((a, s) => a + s.q, 0));
  const totalM = c.papers.map(p => p.sections.reduce((a, s) => a + s.q * s.pos, 0));
  const s0 = allSec[0], mark = `+${s0.pos} for each correct answer and −${r2(s0.neg)} for each wrong answer`;
  const sameScheme = allSec.every(s => s.pos === s0.pos && s.neg === s0.neg);
  const patternRows = c.papers.map((p, i) => p.sections.map(s => `<tr><td>${esc(p.sections.length > 1 || c.papers.length > 1 ? (c.papers.length > 1 ? p.name + ' — ' : '') + s.name : p.name)}</td><td class="m">${s.q}</td><td class="m">${r2(s.q * s.pos)}</td><td class="m">+${s.pos} / −${r2(s.neg)}${s.tita ? ' (TITA: no negative)' : ''}</td></tr>`).join('') +
    (p.sections.length > 1 ? `<tr><td><strong>Total${c.papers.length > 1 ? ' — ' + esc(p.name) : ''}</strong></td><td class="m"><strong>${totalQ[i]}</strong></td><td class="m"><strong>${r2(totalM[i])}</strong></td><td></td></tr>` : '')).join('');
  const docLinks = d ? `<li><a href="/resizer/${d.slug}-photo-resize/">${esc(seoOf(d).short)} photo size</a></li><li><a href="/resizer/${d.slug}-signature-resize/">${esc(seoOf(d).short)} signature size</a></li>` : '';
  page({
    slug: c.slug, kind: 'exam', tool: 'score', data: { scheme: { papers: c.papers } }, hub: CALC_HUB, crumb: `${short} Score Calculator`, dated: true,
    title: `${short} Score Calculator ${YEARS} – Calculate Marks & Exam Pattern`,
    h1: `${short} Score Calculator ${YEARS}`,
    appName: `${short} Score Calculator`,
    desc: `Calculate your ${short} score from the answer key: ${mark}. Section-wise marks, accuracy and the ${short} exam pattern ${YEARS}.`,
    lede: `Enter your correct and wrong answers from the answer key to get your <strong>${short} score</strong> instantly — section by section, with negative marking applied.`,
    answer: `${short} marking scheme: <strong>${sameScheme ? mark : 'as shown per section below'}</strong>, and 0 for unattempted questions. ${c.papers.length === 1 ? `The paper has <strong>${totalQ[0]} questions for ${r2(totalM[0])} marks</strong>.` : c.papers.map((p, i) => `${esc(p.name)}: ${totalQ[i]} questions, ${r2(totalM[i])} marks.`).join(' ')} Score = (correct × ${s0.pos}) − (wrong × ${r2(s0.neg)}).`,
    chips: ['✓ Negative marking applied', '✓ Section-wise', '✓ Free'],
    body: `<section class="card"><h2>${esc(short)} Exam Pattern ${YEARS}</h2>
      <div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Marking</th></tr></thead><tbody>${patternRows}</tbody></table></div>
      <table class="spec" style="margin-top:12px"><tr><th scope="row">Mode</th><td style="font-family:inherit">${esc(c.mode)}</td></tr><tr><th scope="row">Duration</th><td style="font-family:inherit">${esc(c.dur)}</td></tr><tr><th scope="row">Unattempted</th><td style="font-family:inherit">0 marks</td></tr></table>
      <p style="margin:12px 0 0">${c.extra}</p></section>
      <section class="card"><h2>How the ${esc(short)} score is calculated</h2><p>Example: ${s0.q >= 80 ? 60 : 15} correct and ${s0.q >= 80 ? 20 : 5} wrong in a section → (${s0.q >= 80 ? 60 : 15} × ${s0.pos}) − (${s0.q >= 80 ? 20 : 5} × ${r2(s0.neg)}) = <strong>${r2((s0.q >= 80 ? 60 : 15) * s0.pos - (s0.q >= 80 ? 20 : 5) * s0.neg)}</strong> marks. Each wrong answer costs ${r2(s0.neg)} mark(s) — ${r2(s0.neg / s0.pos * 100)}% of what a correct answer earns — so guess only when you can eliminate options.</p></section>
      <section class="card"><h2>Everything for ${esc(short)}</h2><ul class="links">${docLinks}${c.age ? `<li><a href="${c.age}">${esc(short)} age calculator</a></li>` : ''}<li><a href="/exam-calculators/">All exam calculators</a></li><li><a href="/resizer/photo-signature-size-chart/">Exam size chart</a></li></ul></section>`,
    steps: ['Download the official answer key and your response sheet.', 'Count correct and wrong answers in each section.', 'Enter them above — the score updates instantly.'],
    howto: `calculate your ${short} score`,
    faqs: [
      { q: `What is the ${short} marking scheme?`, a: `${sameScheme ? mark.charAt(0).toUpperCase() + mark.slice(1) : 'It differs by section — see the table above'}. Unattempted questions get 0.` },
      { q: `How many questions are in ${short}?`, a: c.papers.map((p, i) => `${esc(p.name)}: ${totalQ[i]} questions, ${r2(totalM[i])} marks`).join('; ') + `. Duration: ${esc(c.dur)}.` },
      { q: `Is this ${short} score the final score?`, a: 'It is your raw score from the answer key. The official result may apply normalisation, bonus marks for dropped questions, or conversion to percentiles.' },
      { q: 'Is the calculator free and private?', a: 'Yes — it runs in your browser and nothing you enter is sent anywhere.' },
    ],
    related: CALCS.filter(x => x !== c).map(x => [`/${x.slug}/`, `${x.exam} score calculator`]).concat([['/jee-main-rank-predictor/', 'JEE Main rank predictor'], ['/typing-test/', 'Typing test']]),
    note: `Exam patterns are based on the latest official notifications (reviewed ${MONTH_YEAR}). Always confirm with the current notification — if the pattern changes, section-wise entries still let you calculate correctly.`,
  });
}

page({
  slug: 'jee-main-rank-predictor', kind: 'exam', tool: 'jee-rank', hub: CALC_HUB, crumb: 'JEE Main Rank Predictor', dated: true,
  title: `JEE Main Rank Predictor ${YEARS} – Percentile to Rank Calculator`,
  h1: `JEE Main Rank Predictor ${YEARS} (Percentile to Rank)`,
  desc: `Convert your JEE Main percentile to an expected All India Rank using NTA's formula. Free, instant — change the candidate count for accuracy.`,
  lede: 'Enter your <strong>NTA percentile</strong> to estimate your All India (CRL) rank.',
  answer: 'Expected rank ≈ <strong>(100 − percentile) × total candidates ÷ 100</strong>. For example, 99 percentile with 12 lakh candidates gives about rank 12,000. Enter your percentile below.',
  chips: ['✓ NTA formula', '✓ Editable candidate count', '✓ Free'],
  body: `<section class="card"><h2>JEE Main percentile vs rank (12 lakh candidates)</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Percentile</th><th>Approx. rank</th></tr></thead><tbody>
    ${[99.9, 99.5, 99, 98, 97, 95, 93, 90, 85, 80].map(p => `<tr><td class="m">${p}</td><td class="m">${Math.round((100 - p) * 1200000 / 100).toLocaleString('en-IN')}</td></tr>`).join('')}</tbody></table></div>
    <p>Ranks scale with the number of candidates — if NTA reports a different count, enter it above. Actual ranks also depend on tie-breaking.</p><h3>What your percentile means</h3><p>A percentile is not a percentage of marks. 97 percentile means you scored at or above 97% of the candidates in your session — out of 12 lakh, about 36,000 candidates scored above you. JEE Main percentiles are computed per session and then merged, and your best session score counts.</p></section>`,
  faqs: [{ q: 'How is JEE Main rank calculated from percentile?', a: 'Rank ≈ (100 − your percentile) × number of candidates ÷ 100, rounded. NTA publishes the final CRL after both sessions.' },
    { q: 'Is this my category rank?', a: 'No, it estimates the Common Rank List (CRL) rank. Category ranks are much lower than CRL ranks.' },
    { q: 'How do I calculate my JEE Main marks?', a: 'Use the <a href="/jee-main-score-calculator/">JEE Main score calculator</a> with your answer key.' }],
  related: [['/jee-main-score-calculator/', 'JEE Main score calculator'], ['/resizer/jee-main-photo-resize/', 'JEE Main photo size'], ['/exam-calculators/', 'All exam calculators']],
  note: 'Estimate only, using NTA\'s percentile definition. The official All India Rank is published by NTA.',
});

page({
  slug: 'typing-test', kind: 'exam', tool: 'typing', hub: CALC_HUB, crumb: 'Typing Test',
  title: 'Typing Test for SSC CHSL, CGL & Court Exams – Free Online (WPM)',
  h1: 'Typing Speed Test for Government Exams',
  desc: 'Free English typing test with WPM, accuracy and key depressions per hour — practise for SSC CHSL, CGL DEST and other skill tests. 1 to 15 minutes.',
  lede: 'Practise for the <strong>typing skill test</strong> with a live timer, net WPM, accuracy and KDPH — just like the real exam screen.',
  answer: 'Pick a duration and start typing the passage — the timer starts on your first key. You get <strong>net WPM</strong> (words per minute after errors), accuracy and key depressions per hour. SSC skill tests commonly expect <strong>35 WPM in English</strong>.',
  chips: ['✓ Live WPM & accuracy', '✓ 1–15 minutes', '✓ Free'],
  body: `<section class="card"><h2>How typing speed is measured</h2><ul>
    <li><strong>Words per minute:</strong> every 5 characters (including spaces) count as one word.</li>
    <li><strong>Net speed:</strong> gross speed minus errors — accuracy matters.</li>
    <li><strong>KDPH:</strong> key depressions per hour. 35 WPM is about 10,500 KDPH.</li></ul>
    <p>Speed requirements differ by post and exam. Check your notification for the exact speed, language and whether errors are penalised.</p>
    <h3>Tips to type faster</h3><ul><li>Use all ten fingers and keep them on the home row (ASDF JKL;).</li><li>Look at the screen, not the keyboard.</li><li>Practise 15 minutes daily — accuracy first, then speed.</li></ul></section>`,
  faqs: [{ q: 'What typing speed is needed for SSC CHSL?', a: 'SSC CHSL posts commonly require 35 WPM in English or 30 WPM in Hindi on a computer. Check the latest notification for your post.' },
    { q: 'Does this test work on mobile?', a: 'It works, but skill tests use a computer keyboard — practise on a laptop or desktop for realistic results.' }],
  related: [['/ssc-chsl-score-calculator/', 'SSC CHSL score calculator'], ['/ssc-cgl-score-calculator/', 'SSC CGL score calculator'], ['/word-counter/', 'Word counter'], ['/exam-calculators/', 'All exam calculators']],
});

// Exam calculators hub
page({
  slug: 'exam-calculators', crumb: 'Exam Calculators', dated: true,
  title: `Exam Score Calculators ${YEARS} – NEET, JEE, SSC, Bank, UPSC, CAT`,
  h1: `Exam Score Calculators & Tools ${YEARS}`,
  desc: 'Free score calculators with negative marking for NEET, JEE Main, CUET, SSC, IBPS, SBI, RRB NTPC, UPSC and CAT — plus JEE rank predictor, typing test and age calculators.',
  lede: 'Check your score from the answer key, predict your rank and practise skill tests — <strong>free and instant</strong>.',
  body: `<section class="card"><h2>Score calculators (with exam pattern)</h2><div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Exam</th><th>Marking</th></tr></thead><tbody>
    ${CALCS.map(c => `<tr><td><a href="/${c.slug}/"><strong>${esc(c.exam)}</strong></a></td><td>${c.papers.map(p => `+${p.sections[0].pos} / −${r2(p.sections[0].neg)}`).join(', ')}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="card"><h2>Negative marking, normalisation and percentiles</h2>
      <p><strong>Negative marking</strong> deducts part of a question's marks for each wrong answer — 1 of 4 in NEET and JEE Main, 0.5 of 2 in SSC CGL Tier 1, 0.25 of 1 in bank prelims and one-third in UPSC and RRB exams. Unattempted questions score zero, so a blind guess usually costs more than it gains.</p>
      <p><strong>Normalisation</strong> adjusts raw marks when an exam runs in several shifts with different difficulty (SSC, RRB and NTA exams do this). <strong>Percentiles</strong> (JEE Main, CAT) show the share of candidates you scored above. Use these calculators for your raw score from the official answer key, then compare with previous cut-offs.</p></section>
    <section class="card"><h2>More exam tools</h2><ul class="links"><li><a href="/jee-main-rank-predictor/">JEE Main rank predictor</a></li><li><a href="/typing-test/">Typing test</a></li><li><a href="/age-calculator/">Age calculator</a></li><li><a href="/percentage-calculator/">Percentage calculator</a></li><li><a href="/cgpa-to-percentage/">CGPA to percentage</a></li><li><a href="/marks-calculator/">Marks calculator</a></li><li><a href="/resizer/">Exam photo &amp; signature resizer</a></li></ul></section>`,
  faqs: [{ q: 'How do score calculators handle negative marking?', a: 'Each calculator uses that exam\'s marking scheme — for example +4/−1 for NEET and JEE Main, +2/−0.5 for SSC CGL Tier 1, +1/−0.25 for bank prelims.' }],
  related: [['/pdf-tools/', 'PDF tools'], ['/resizer/photo-signature-size-chart/', 'Exam size chart'], ['/resizer/guides/', 'Guides']],
});

console.log(`✅ Generated ${count} tool pages (PDF, image, documents, exam calculators)`);
