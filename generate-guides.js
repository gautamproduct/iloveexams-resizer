#!/usr/bin/env node
/**
 * Hand-written guides (/resizer/guides/…) and the About page.
 * Unlike the programmatic exam pages, each guide is original long-form content —
 * edit the GUIDES array to update them. Run: node generate-guides.js
 */

const fs = require('fs');
const path = require('path');
const S = require('./seo-shell');
const { EXAMS, seoOf, BANK_EXTRA_DOCS, DECLARATION_TEXT } = require('./exams-data');
const { SITE, YEAR, MONTH_YEAR, esc } = S;

const ROOT = __dirname;
const PUBLISHED = '2026-09-26';
const write = (rel, html) => {
  fs.mkdirSync(path.join(ROOT, rel), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel, 'index.html'), html, 'utf8');
};
const ex = slug => EXAMS.find(e => e.slug === slug);
const spec = (slug, doc) => { const s = ex(slug)[doc]; return `${s.w}×${s.h} px, ${s.min}–${s.max} KB`; };

const GUIDES = [
  {
    slug: 'take-exam-photo-with-phone',
    title: 'How to Take a Perfect Exam Passport Photo With Your Phone',
    h1: 'How to Take a Passport-Size Exam Photo With Your Phone (No Studio Needed)',
    desc: 'Step-by-step guide to taking an exam-ready passport photo at home with a phone: background, lighting, framing, and how to resize it to the exact px and KB.',
    minutes: 6,
    body: `
<p>Most exam application portals — SSC, IBPS, SBI, NTA, UPSC and every State PSC — accept a photo you take yourself, as long as it follows the rules. You do not need a studio. You need a plain wall, daylight and two minutes. This guide walks through exactly what examiners check and how to get it right the first time.</p>

<h2>What you need</h2>
<ul>
  <li>A phone with a rear camera (the rear camera is sharper than the selfie camera).</li>
  <li>A plain white or very light-coloured wall, door or bedsheet.</li>
  <li>A window with daylight, or two lamps.</li>
  <li>Someone to take the photo — or a stack of books to rest the phone on and the camera timer.</li>
</ul>

<h2>Step 1 — Set up the background</h2>
<p>Stand about <strong>half a metre (2 feet) in front of the wall</strong>, not touching it. Standing away from the wall is the single best trick against the dark shadow outline that causes most rejections. If the wall is not white, pin a clean white bedsheet behind you and pull out the creases.</p>

<h2>Step 2 — Get the light right</h2>
<p>Face a window so daylight falls evenly on your face. Avoid:</p>
<ul>
  <li><strong>Overhead tube-light only</strong> — creates shadows under the eyes and nose.</li>
  <li><strong>A window behind you</strong> — your face turns dark and the background burns out.</li>
  <li><strong>Phone flash</strong> — causes shine on the forehead and red eyes, and throws a hard shadow on the wall.</li>
</ul>
<p>If it is evening, place two lamps at 45° on either side of your face at eye level.</p>

<h2>Step 3 — Pose and dress</h2>
<ul>
  <li>Look straight into the camera with a neutral expression and your mouth closed.</li>
  <li>Keep both ears visible where possible; push hair away from the eyes.</li>
  <li>Remove caps and sunglasses. Clear spectacles are usually allowed, but tilt them slightly to avoid glare. Religious headwear is generally permitted if the face is fully visible.</li>
  <li>Wear a plain, darker top — it contrasts with the white background. Avoid white clothes.</li>
</ul>

<h2>Step 4 — Frame the shot</h2>
<p>Hold the phone at your eye level, <strong>about 1–1.5 metres away</strong>, and zoom in slightly (1.5×–2×) rather than standing close. Standing close with a wide lens makes the nose look bigger and distorts the face. Include your head and the top of your shoulders, and leave space above the head — you will crop it later.</p>
<p>Take 5–6 shots and pick the sharpest one. Do not use portrait mode, beauty filters or background blur: examiners reject edited photos, and NTA explicitly asks for an un-retouched photo.</p>

<h2>Step 5 — Crop and resize to your exam's size</h2>
<p>Every exam has its own pixel dimensions and file-size window. For example:</p>
<ul>
  <li>IBPS / SBI bank exams: <strong>${spec('ibps-po', 'photo')}</strong></li>
  <li>SSC CGL: <strong>${spec('ssc-cgl', 'photo')}</strong></li>
  <li>NEET / JEE Main: <strong>${spec('neet-ug', 'photo')}</strong> (3.5×4.5 cm)</li>
  <li>UPSC: <strong>${spec('upsc', 'photo')}</strong></li>
</ul>
<p>Open your exam in the <a href="/resizer/">exam resizer</a>. The crop box is already locked to your exam's shape, so you only drag it so your face is centred with a little space above the head. It then resizes to the exact pixels and compresses into the KB range — all inside your browser. The full list is in the <a href="/resizer/photo-signature-size-chart/">exam size chart</a>.</p>

<h2>Final checklist before you upload</h2>
<ul class="check">
  <li>Plain white or light background, no shadow behind the head</li>
  <li>Face evenly lit, eyes open and clearly visible</li>
  <li>No filters, no beauty mode, no background blur</li>
  <li>Exact pixel size and KB range for your exam, saved as JPG</li>
  <li>Photo is recent — most notifications say within the last 3–6 months</li>
</ul>
<p>Keep the original, un-cropped photo safe. Many exams (NEET, SSB interviews, bank document verification) ask you to bring a printed copy of the same photo later.</p>`,
    faqs: [
      { q: 'Can I take my exam photo with a mobile phone?', a: 'Yes. Exam portals care about the result, not the camera: a plain light background, even lighting, a clear front-facing face and the exact pixel and KB size. A phone photo that meets these rules is accepted.' },
      { q: 'Should I use the selfie camera?', a: 'Prefer the rear camera held by someone else at 1–1.5 m. Selfie cameras are wide-angle and distort the face when held close.' },
      { q: 'Can I wear glasses in my exam photo?', a: 'Most Indian exams allow clear spectacles if there is no glare and the eyes are visible. Tinted glasses and sunglasses are not allowed. Check your notification — a few exams ask you to remove them.' },
    ],
  },
  {
    slug: 'scan-signature-for-online-form',
    title: 'How to Scan or Photograph Your Signature for Online Exam Forms',
    h1: 'How to Scan Your Signature for Online Exam Forms (With a Phone)',
    desc: 'Get a clean, dark, correctly sized signature for SSC, IBPS, SBI, NTA and PSC forms: the right pen and paper, how to photograph it, and how to crop to exact px and KB.',
    minutes: 5,
    body: `
<p>A signature upload looks trivial, yet it is one of the most common reasons an application is flagged. Faint strokes, grey paper, shadows and wrong sizes all cause trouble — and bank exams (IBPS, SBI, RBI) reject signatures written in capital letters. Here is how to produce a signature image that passes on the first try.</p>

<h2>Step 1 — Sign on the right paper with the right pen</h2>
<ul>
  <li>Use <strong>plain white A4 paper</strong> — not ruled notebook paper.</li>
  <li>Use a <strong>black ink pen</strong> (a gel pen gives the darkest line). Blue is accepted by most exams, black is safest. Never pencil or sketch pen.</li>
  <li>Sign your normal full signature — the <strong>same one you will sign at the exam hall</strong>. Invigilators compare them.</li>
  <li>Do not sign in CAPITAL LETTERS. IBPS, SBI and RBI notifications state that such signatures are not accepted, and other exams discourage it too.</li>
  <li>Sign 4–5 times on the page and choose the neatest.</li>
</ul>

<h2>Step 2 — Photograph it without shadows</h2>
<p>Place the paper on a flat table next to a window. Hold the phone <strong>directly above</strong> the paper, parallel to it, so the signature is not skewed. Tap on the signature to focus. If your hand or phone casts a shadow, move so the light comes from the side. A phone scanning app (Google Drive scan, Notes scan) works well too — it flattens the page and boosts contrast.</p>

<h2>Step 3 — Crop tightly</h2>
<p>Signature boxes are wide and short. Crop close around the signature with a small white margin; big white borders make the signature tiny and unreadable after resizing. Typical sizes:</p>
<ul>
  <li>IBPS / SBI / RBI: <strong>${spec('ibps-po', 'sig')}</strong></li>
  <li>SSC CGL / CPO / JE: <strong>${spec('ssc-cgl', 'sig')}</strong></li>
  <li>NEET: <strong>${spec('neet-ug', 'sig')}</strong></li>
  <li>JEE Main: <strong>${spec('jee-main', 'sig')}</strong></li>
</ul>
<p>Open your exam's signature page in the <a href="/resizer/">exam resizer</a>. The crop box is locked to the right shape. The tool then resizes to the exact pixels and fits the file into the KB range.</p>

<h2>"My signature is below the minimum KB"</h2>
<p>A small, clean signature can be only 4–8 KB, while a bank portal may ask for at least 10 KB. Our resizer automatically raises quality and, if needed, pads the JPG file so it meets the minimum without changing how the signature looks. If you use another tool, avoid converting to PNG — portals want JPG.</p>

<h2>Checklist</h2>
<ul class="check">
  <li>Black (or blue) ink on plain white paper</li>
  <li>Running signature, not capital letters</li>
  <li>No shadows, fingers or table edges in the image</li>
  <li>Tight crop, readable at small size</li>
  <li>Exact px and KB for your exam, saved as JPG</li>
</ul>`,
    faqs: [
      { q: 'Can I use a digital signature drawn on my phone?', a: 'No. Exam portals expect a scan or photo of a signature made with pen on paper. Finger-drawn or typed signatures are rejected.' },
      { q: 'Blue or black ink for the exam signature?', a: 'Black is the safest because it stays dark after compression. Most exams accept blue too; check your notification if it specifies black.' },
      { q: 'Why is my signature rejected for being in capital letters?', a: 'IBPS, SBI and RBI notifications state that signatures in CAPITAL letters are not accepted, and other exams discourage them because block letters are easy to copy. Use your normal running signature.' },
    ],
  },
  {
    slug: 'photo-upload-rejected-reasons',
    title: 'Exam Photo or Signature Rejected? 12 Reasons and How to Fix Each',
    h1: 'Exam Photo or Signature Upload Rejected? 12 Common Reasons and Fixes',
    desc: 'The 12 most common reasons exam portals reject photo and signature uploads — wrong KB, wrong pixels, PNG/HEIC, shadows, filters — and the exact fix for each.',
    minutes: 7,
    body: `
<p>Portals reject uploads in two ways: instantly (an error such as "file size should be between 20 KB and 50 KB") or later, during scrutiny, when a person looks at your photo. The first is annoying; the second can cost you an admit card. These are the reasons we see most often, with a fix for each.</p>

<h2>Errors the portal shows immediately</h2>
<h3>1. File is too large</h3>
<p>Phone photos are 2–6 MB; bank exams allow 50 KB. <strong>Fix:</strong> resize to the exact pixel size first — a smaller image compresses far better — then lower JPG quality. The <a href="/resizer/">exam resizer</a> does both automatically.</p>
<h3>2. File is too small</h3>
<p>Common with signatures: a clean 140×60 image is only a few KB. <strong>Fix:</strong> use maximum JPG quality; if still short, a tool that pads the JPG (ours does) brings it above the minimum without changing the image.</p>
<h3>3. Wrong dimensions</h3>
<p>Some portals check pixels exactly (e.g. 200×230). <strong>Fix:</strong> crop to the same shape first, then resize — never stretch a photo into a different shape.</p>
<h3>4. Wrong format (PNG, HEIC, WEBP, PDF)</h3>
<p>iPhones save HEIC; screenshots are PNG. Almost every Indian exam wants JPG/JPEG. <strong>Fix:</strong> export as JPG — our tools always output JPG.</p>
<h3>5. File name or extension problems</h3>
<p>Some older portals reject names with spaces or ".jpeg" vs ".jpg". <strong>Fix:</strong> rename to something simple like <code>photo.jpg</code>.</p>
<h3>6. Upload times out</h3>
<p>Usually a slow connection or a portal under deadline-day load. <strong>Fix:</strong> keep files near the lower end of the KB range and upload early — not on the last day.</p>

<h2>Problems found during scrutiny</h2>
<h3>7. Dark or coloured background</h3>
<p><strong>Fix:</strong> retake against a white wall, standing half a metre from it, facing a window. See <a href="/resizer/guides/take-exam-photo-with-phone/">how to take an exam photo with your phone</a>.</p>
<h3>8. Face not clearly visible</h3>
<p>Too small in the frame, hair over the eyes, sunglasses, heavy shadow. <strong>Fix:</strong> the face should fill roughly 50–70% of the photo height.</p>
<h3>9. Edited or filtered photo</h3>
<p>Beauty filters, background blur and AI edits are grounds for rejection — NTA asks for photos without alteration. <strong>Fix:</strong> use the plain camera mode.</p>
<h3>10. Old photo</h3>
<p>Notifications typically require a photo from the last 3–6 months, and it must match your face at the exam centre. <strong>Fix:</strong> take a fresh one.</p>
<h3>11. Signature in capital letters, faint or cut off</h3>
<p><strong>Fix:</strong> follow <a href="/resizer/guides/scan-signature-for-online-form/">our signature scanning guide</a> — black gel pen, white paper, tight crop.</p>
<h3>12. Photo and signature swapped</h3>
<p>It happens more than you think on mobile. <strong>Fix:</strong> name files clearly (<code>photo.jpg</code>, <code>sign.jpg</code>) and check the preview before submitting.</p>

<h2>Already submitted a bad photo?</h2>
<p>Many portals (IBPS, SSC, NTA) open a correction window after registration closes. Watch the official website for it, and re-upload the corrected image there. If there is no correction window, contact the exam helpdesk listed in the notification.</p>`,
    faqs: [
      { q: 'Why does the portal say my photo size is invalid?', a: 'Either the file size (KB) is outside the allowed range or the pixel dimensions are wrong. Resize to the exact pixels for your exam and compress into the KB window.' },
      { q: 'Can I change my photo after submitting the form?', a: 'Often yes, during the correction window that IBPS, SSC and NTA announce after registration. Otherwise contact the helpdesk in the notification.' },
    ],
  },
  {
    slug: 'pixels-kb-dpi-cm-explained',
    title: 'Pixels, KB, DPI and cm Explained for Exam Photo Uploads',
    h1: 'Pixels vs KB vs DPI vs cm — What Exam Photo Requirements Actually Mean',
    desc: 'Understand exam photo requirements: what pixels, KB, DPI and 3.5×4.5 cm mean, how they relate, and worked examples for converting cm to pixels.',
    minutes: 6,
    body: `
<p>Notifications mix units freely: "3.5 cm × 4.5 cm", "200 × 230 pixels", "20 KB to 50 KB", "scanned at 200 DPI". They measure different things. Once you know which is which, meeting any requirement becomes straightforward.</p>

<h2>Pixels — the image's dimensions</h2>
<p>A digital photo is a grid of dots called pixels. "200 × 230 pixels" means 200 dots wide and 230 tall. This is what upload portals actually check, because a file has no physical size until it is printed. Width always comes first.</p>

<h2>KB — the file size</h2>
<p>KB (kilobytes) is how much storage the file takes. It depends on the pixel count <em>and</em> on JPG compression quality. The same 200×230 photo can be 15 KB or 80 KB depending on quality. That is why you control KB by adjusting compression after setting the pixels.</p>
<p>Rough guide: a 200×230 photo at good quality is 15–35 KB; a 1200×1200 photo (CAT) is 150–400 KB before compression.</p>

<h2>cm and inches — the printed size</h2>
<p>"3.5 × 4.5 cm" is the classic Indian passport photo size on paper. On a screen it has no meaning until you choose a DPI.</p>

<h2>DPI — the bridge between cm and pixels</h2>
<p>DPI (dots per inch) says how many pixels fit in one inch (2.54 cm) when printed. The formula is:</p>
<p class="decl">pixels = cm ÷ 2.54 × DPI</p>
<p>Worked examples for 3.5 × 4.5 cm:</p>
<div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>DPI</th><th>Width (3.5 cm)</th><th>Height (4.5 cm)</th></tr></thead><tbody>
${[100, 200, 300].map(d => `<tr><td>${d}</td><td class="m">${Math.round(3.5 / 2.54 * d)} px</td><td class="m">${Math.round(4.5 / 2.54 * d)} px</td></tr>`).join('')}
</tbody></table></div>
<p>That is why NTA's 3.5×4.5 cm photo works out to about <strong>275×354 px at 200 DPI</strong>, and SSC's long-standing 275×354 px requirement is the same shape.</p>

<h2>Which number should you follow?</h2>
<ol>
  <li>If the notification gives <strong>pixels</strong>, match them exactly.</li>
  <li>If it gives only <strong>cm/inches</strong>, keep the same shape (aspect ratio) and use 200 DPI unless another DPI is stated.</li>
  <li>Always meet the <strong>KB range</strong> — it is checked on every upload.</li>
  <li>Always save as <strong>JPG</strong> unless told otherwise.</li>
</ol>
<p>The <a href="/resize-image-cm-inch-mm/">cm / inch / mm resizer</a> converts physical sizes to pixels for you, and every exam page in the <a href="/resizer/photo-signature-size-chart/">size chart</a> lists the exact pixels.</p>`,
    faqs: [
      { q: 'How many pixels is 3.5 × 4.5 cm?', a: 'About 138×177 px at 100 DPI, 276×354 px at 200 DPI and 413×531 px at 300 DPI.' },
      { q: 'Does DPI change the file size?', a: 'Not directly. File size depends on pixel dimensions and JPG quality. DPI is only a printing hint stored in the file.' },
      { q: 'Why is my 200×230 photo 120 KB?', a: 'JPG quality is set very high. Lower the quality until it falls inside the allowed range; the exam resizer does this automatically.' },
    ],
  },
  {
    slug: 'ibps-thumb-impression-handwritten-declaration',
    title: 'IBPS Left Thumb Impression & Handwritten Declaration: How to Make Them',
    h1: 'How to Make the IBPS Left Thumb Impression and Handwritten Declaration',
    desc: `How to create and upload the left thumb impression (${BANK_EXTRA_DOCS['thumb-impression'].w}×${BANK_EXTRA_DOCS['thumb-impression'].h} px) and handwritten declaration (${BANK_EXTRA_DOCS.declaration.w}×${BANK_EXTRA_DOCS.declaration.h} px) for IBPS, SBI, RBI and other bank exams — with the declaration text.`,
    minutes: 5,
    body: `
<p>IBPS-pattern bank applications (IBPS PO, Clerk, RRB, SO, SBI, RBI, NIACL, LIC AAO) ask for four uploads: photo, signature, <strong>left thumb impression</strong> and <strong>handwritten declaration</strong>. The last two trip up many first-time applicants. Here is how to make both.</p>

<h2>Left thumb impression — ${BANK_EXTRA_DOCS['thumb-impression'].w}×${BANK_EXTRA_DOCS['thumb-impression'].h} px, ${BANK_EXTRA_DOCS['thumb-impression'].min}–${BANK_EXTRA_DOCS['thumb-impression'].max} KB</h2>
<ol>
  <li>Use a <strong>blue or black stamp ink pad</strong>. Do not use pen ink smeared on the thumb.</li>
  <li>Press your <strong>left thumb</strong> lightly on the pad, then roll it gently once on plain white paper. Too much ink gives a black blob; too little gives a faint print.</li>
  <li>Make 3–4 impressions and choose the clearest — ridges should be visible.</li>
  <li>Photograph it from directly above in daylight, crop to a square around the print and resize with the <a href="/resizer/ibps-po-thumb-impression-resize/">thumb impression resizer</a>.</li>
</ol>
<p>If you do not have a left thumb, the notifications allow the right thumb — check the current notification.</p>

<h2>Handwritten declaration — ${BANK_EXTRA_DOCS.declaration.w}×${BANK_EXTRA_DOCS.declaration.h} px, ${BANK_EXTRA_DOCS.declaration.min}–${BANK_EXTRA_DOCS.declaration.max} KB</h2>
<p>Write the following in English, in your own running handwriting, with <strong>black ink on white paper</strong>. Put your own name in the blank:</p>
<p class="decl">${esc(DECLARATION_TEXT)}</p>
<ul>
  <li>Do <strong>not</strong> write in capital letters — it will be rejected.</li>
  <li>Write it yourself; it must not be typed or written by someone else.</li>
  <li>Keep the text on 3–4 lines with even spacing so it stays readable at 800×400 px.</li>
  <li>If your notification prints a different declaration text, copy that one exactly.</li>
</ul>
<p>Photograph the paper flat and in daylight, crop to the text with a small margin (the wide 2:1 shape) and resize with the <a href="/resizer/ibps-po-declaration-resize/">declaration resizer</a>.</p>

<h2>All four bank exam uploads at a glance</h2>
<div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Document</th><th>Pixels</th><th>File size</th></tr></thead><tbody>
<tr><td>Photo</td><td class="m">${ex('ibps-po').photo.w}×${ex('ibps-po').photo.h}</td><td class="m">${ex('ibps-po').photo.min}–${ex('ibps-po').photo.max} KB</td></tr>
<tr><td>Signature</td><td class="m">${ex('ibps-po').sig.w}×${ex('ibps-po').sig.h}</td><td class="m">${ex('ibps-po').sig.min}–${ex('ibps-po').sig.max} KB</td></tr>
${Object.values(BANK_EXTRA_DOCS).map(d => `<tr><td>${d.label}</td><td class="m">${d.w}×${d.h}</td><td class="m">${d.min}–${d.max} KB</td></tr>`).join('')}
</tbody></table></div>
<p>See every bank exam in the <a href="/resizer/bank-exam-photo-signature-size/">bank exam size chart</a>.</p>`,
    faqs: [
      { q: 'Can I write the IBPS declaration in capital letters?', a: 'No. The declaration must be in your normal running handwriting. Capital letters are not accepted.' },
      { q: 'Which ink should I use for the thumb impression?', a: 'Blue or black stamp-pad ink. The print should show the ridges clearly without smudging.' },
    ],
  },
  {
    slug: 'upload-error-messages-explained',
    published: '2026-10-13',
    title: 'Exam Upload Error Messages Explained: "Must Be at Least 300px", "Invalid Size" & More',
    h1: 'Exam Form Upload Errors Decoded — What Each Message Means and How to Fix It',
    desc: 'What "signature must be at least 300px width", "file size should be between 20 and 50 KB", "invalid file type" and other exam portal errors mean — and the exact fix for each.',
    minutes: 8,
    body: `
<p>Every week thousands of candidates copy an exam portal's error message straight into Google — messages like <em>"Signature must be at least 300px width and 100px height. Your file is 275px × 118px."</em> The good news: these messages are precise. Each one tells you exactly which of three things is wrong — the <strong>pixels</strong>, the <strong>KB</strong> or the <strong>file type</strong>. This guide translates the common ones and gives a fix for each.</p>

<h2>First, read the message for these three clues</h2>
<ul>
  <li><strong>"px", "width", "height", "dimension"</strong> — the image is the wrong size in pixels. Changing JPG quality will not help; you must resize.</li>
  <li><strong>"KB", "file size", "MB"</strong> — the pixels may be fine but the file is too heavy or too light. Adjust compression, not dimensions.</li>
  <li><strong>"format", "type", "extension"</strong> — the file is PNG, HEIC, WEBP or PDF instead of JPG.</li>
</ul>
<p>Fix only the thing the message names. Changing everything at once is how people end up with a blurry, stretched photo that passes the upload check but fails human scrutiny later.</p>

<h2>"Must be at least 300px width and 100px height. Your file is 275px × 118px."</h2>
<p>This is a <strong>minimum dimension</strong> error. Your signature is 275 px wide — a common size because it matches the 3.5 cm width used by NTA forms (JEE Main signature: ${spec('jee-main', 'sig')}) — but this particular portal wants at least 300 px wide and 100 px tall. The height (118 px) is already fine; only the width is short.</p>
<p><strong>Fix:</strong></p>
<ol>
  <li>Go back to your <em>original</em> scan or phone photo of the signature, not the already-shrunk 275 px file. Enlarging a small file makes the strokes soft.</li>
  <li>Crop around the signature leaving a thin white margin, keeping a wide shape (roughly 3:1).</li>
  <li>Resize to the exact size the portal asks for — for example 300 × 100 px — with the <a href="/resizer/size/">resize by pixel size</a> tool, then check the KB limit.</li>
</ol>
<p>If you only have the small file, upscaling from 275 to 300 px (about 9%) is safe — the difference is too small to blur a signature. Avoid stretching only one side; keep the shape and add white margin instead.</p>

<h2>"File size should be between 20 KB and 50 KB"</h2>
<p>Pixels may be correct; the file is outside the KB window. Phone photos are 2–6 MB, so "too large" is the usual case.</p>
<p><strong>Fix (too large):</strong> resize to the required pixels first — a 200×230 image at decent quality is only 15–35 KB — and then lower JPG quality step by step. <strong>Fix (too small):</strong> raise JPG quality to maximum. Small signatures sometimes still fall short; our resizer pads the file to the minimum without changing the image. See <a href="/resizer/guides/pixels-kb-dpi-cm-explained/">pixels vs KB explained</a> for why the same photo can be 15 KB or 80 KB.</p>

<h2>"Image dimension invalid" / "Please upload photo of 200 × 230 pixels"</h2>
<p>Some portals check exact pixels rather than a range. A 201×230 file fails. <strong>Fix:</strong> use the preset for your exam from the <a href="/resizer/photo-signature-size-chart/">size chart</a>, which outputs the exact width and height. Crop to the same shape first so the face is not squashed.</p>

<h2>"Invalid file type" / "Only JPG/JPEG allowed"</h2>
<p>iPhones save photos as HEIC; screenshots are PNG; WhatsApp sometimes saves WEBP. Renaming <code>photo.png</code> to <code>photo.jpg</code> does <em>not</em> convert it — many portals read the file's real format and still reject it. <strong>Fix:</strong> convert properly with <a href="/heic-to-jpg/">HEIC to JPG</a>, <a href="/png-to-jpg/">PNG to JPG</a> or <a href="/webp-to-jpg/">WEBP to JPG</a>.</p>

<h2>"Upload failed" / spinner that never finishes</h2>
<p>No size or type is mentioned, so the file itself is probably fine. Causes are usually a slow connection, an expired session, or the portal under last-day load. <strong>Fix:</strong> log out and in again, try another browser, keep files near the lower end of the KB range, and upload early in the application window.</p>

<h2>Photo accepted, but the preview looks wrong</h2>
<p>If the preview shows a stretched face, a cut-off signature, or the photo in the signature box, do not submit. The upload check only measures size; a person checks the image later. Re-crop, re-upload and confirm the preview before final submission. Our <a href="/resizer/guides/photo-upload-rejected-reasons/">12 rejection reasons</a> guide covers what scrutiny looks for.</p>

<h2>Quick reference</h2>
<div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Message mentions</th><th>What is wrong</th><th>What to change</th></tr></thead><tbody>
<tr><td>px / width / height</td><td>Pixel dimensions</td><td>Resize (crop to shape first)</td></tr>
<tr><td>KB / MB / file size</td><td>Compression</td><td>JPG quality</td></tr>
<tr><td>type / format / extension</td><td>File format</td><td>Convert to JPG</td></tr>
<tr><td>Nothing specific</td><td>Network or session</td><td>Retry, re-login, other browser</td></tr>
</tbody></table></div>`,
    faqs: [
      { q: 'Why does the portal say my signature must be at least 300px wide?', a: 'Your file is narrower than the minimum that portal accepts. Resize the original signature scan to at least the stated width and height, keeping the same shape, then check the KB limit.' },
      { q: 'Can I just rename a PNG file to JPG?', a: 'No. Renaming does not change the format inside the file, and many portals detect it. Convert it with a PNG to JPG tool.' },
      { q: 'My photo is the right KB but still rejected — why?', a: 'The pixel dimensions are probably wrong. Portals check pixels and KB separately; resize to the exact width × height first.' },
    ],
  },
  {
    slug: 'photo-with-name-and-date-guide',
    published: '2026-10-13',
    title: 'Photo With Name and Date for TNPSC, Kerala PSC & Other Forms: Complete Guide',
    h1: 'How to Make a Passport Photo With Your Name and Date Printed Below',
    desc: 'Why TNPSC, Kerala PSC and some other forms want your name and photo date printed on the photo, how to add them correctly at home, and the mistakes that get it rejected.',
    minutes: 6,
    body: `
<p>A few recruiting bodies — most notably the <strong>Tamil Nadu PSC</strong> and <strong>Kerala PSC</strong> — ask for something most exams do not: your <strong>name and the date the photo was taken</strong>, printed in a strip at the bottom of the photo. Studios do it routinely; at home it is easy to get slightly wrong. Here is how to do it right.</p>

<h2>Why do they ask for it?</h2>
<p>The date proves the photo is recent; the name ties the photo to the applicant. Both commissions use a <strong>one-time registration profile</strong> (TNPSC OTR, Kerala PSC Thulasi) where the photo is reused across many applications, so they want to know how old it is.</p>

<h2>What the strip should contain</h2>
<ul>
  <li><strong>Your name</strong> — TNPSC asks for capital letters, exactly as on your SSLC mark sheet. Spelling should match your certificates.</li>
  <li><strong>The date the photo was taken</strong>, not today's date — in DD/MM/YYYY (or the format your notification shows).</li>
  <li>Black text on a white strip, centred, readable at the small upload size.</li>
</ul>
<p>Requirements differ slightly between commissions and change between notifications — always check the current notification for the exact pixels, KB range and text format. The exam pages for <a href="/resizer/tnpsc-photo-resize/">TNPSC</a> and <a href="/resizer/kpsc-photo-resize/">Kerala PSC</a> list the sizes we track.</p>

<h2>Step by step</h2>
<ol>
  <li><strong>Take the photo</strong> against a plain white wall in daylight (see <a href="/resizer/guides/take-exam-photo-with-phone/">how to take an exam photo with your phone</a>). Note the date.</li>
  <li><strong>Open the <a href="/photo-with-name-and-date/">photo with name &amp; date</a> tool</strong>, upload the photo and crop so your face fills most of the frame.</li>
  <li><strong>Type your name and the photo date.</strong> The tool adds a white strip below the face — it does not cover your chin or shoulders.</li>
  <li><strong>Pick your exam's preset</strong> so the final image, strip included, comes out at the required pixels and KB.</li>
  <li><strong>Zoom into the result.</strong> Name and date must be readable. If they are blurry, start from a sharper original.</li>
</ol>

<h2>Mistakes that cause rejection</h2>
<ul>
  <li><strong>Text written over the face or background</strong> instead of in a separate strip.</li>
  <li><strong>Today's date</strong> on an old photo. Scrutiny compares it with your face at verification.</li>
  <li><strong>Name in a different spelling</strong> from your certificates, or initials in the wrong order.</li>
  <li><strong>Resizing after adding text</strong> to a different shape — the text stretches and becomes unreadable. Add text and resize in one step.</li>
  <li><strong>Handwritten name photographed on paper</strong> under the photo — looks unprofessional and is often too faint at small size.</li>
</ul>

<h2>Do other exams need this?</h2>
<p>Most central exams (SSC, IBPS, NTA, UPSC) do <strong>not</strong> ask for name and date on the photo, and some instruct you not to add any text. Only add it when your notification asks for it.</p>`,
    faqs: [
      { q: 'Which date goes on the photo — today or when it was taken?', a: 'The date the photo was taken. The purpose is to show the photo is recent.' },
      { q: 'Should the name be in capital letters?', a: 'TNPSC asks for capital letters matching your SSLC mark sheet. For other commissions, follow the notification; when it does not say, capitals are the safe choice.' },
      { q: 'Can I add name and date for SSC or IBPS?', a: 'No — those exams do not ask for it. Add text only when the notification requires it.' },
    ],
  },
  {
    slug: 'compress-certificate-pdf-for-online-form',
    published: '2026-10-13',
    title: 'How to Compress Certificates & Mark Sheets to 100–500 KB Without Losing Readability',
    h1: 'Compress Certificate and Mark Sheet PDFs for Online Forms — and Keep Them Readable',
    desc: 'How to get caste, EWS, domicile certificates and mark sheets under a 100, 200 or 500 KB limit for exam forms while keeping text readable — scanning settings, JPG vs PDF, and fixes.',
    minutes: 7,
    body: `
<p>Recruitment and admission forms increasingly ask for documents — caste, EWS, domicile, NCL-OBC certificates, Class 10/12 mark sheets, degree certificates — with tight limits like 100 KB, 200 KB or 500 KB. A phone scan is usually 2–8 MB. Squeeze it carelessly and the verifying officer cannot read it; that is a far bigger problem than a failed upload. Here is how to hit the limit and stay readable.</p>

<h2>1. Start with a good scan</h2>
<ul>
  <li><strong>Flat and straight.</strong> Place the document on a dark table so the edges are easy to crop. Shoot from directly above.</li>
  <li><strong>Daylight, no flash.</strong> Flash creates a shiny patch that hides stamps and signatures.</li>
  <li><strong>Use a scanner app's "document" mode</strong> if you have one — it flattens and whitens the page, which also makes the file compress much smaller.</li>
  <li><strong>Crop away everything outside the paper.</strong> Table edges and fingers waste kilobytes.</li>
</ul>

<h2>2. Choose the right format</h2>
<p>Read the notification: some portals want <strong>PDF</strong>, some want <strong>JPG</strong>.</p>
<ul>
  <li>For <strong>JPG</strong>, use the <a href="/resize-certificate-for-online-form/">certificate resizer</a> or <a href="/resize-marksheet-for-online-form/">mark sheet resizer</a>.</li>
  <li>For <strong>PDF</strong>, use <a href="/compress-pdf/">Compress PDF</a> or the one-tap <a href="/compress-pdf-to-200kb/">Compress PDF to 200 KB</a>. Multiple pages? <a href="/merge-pdf/">Merge</a> first, then compress.</li>
  <li>Have a JPG but the portal wants PDF? <a href="/image-to-pdf/">Image to PDF</a>.</li>
</ul>

<h2>3. Why size and readability fight — and how to win</h2>
<p>A certificate is mostly white paper with small black text. Colour photos of it waste space on paper texture and shadows. Three things shrink it without hurting the text:</p>
<ol>
  <li><strong>Lower the resolution sensibly.</strong> An A4 page at about 1240 × 1754 px (150 DPI) keeps printed text sharp; going under ~1000 px wide is where small print starts to blur.</li>
  <li><strong>Convert to black and white or greyscale</strong> when colour does not matter. Our <a href="/pdf-to-black-and-white/">PDF to black &amp; white</a> tool often halves the size. Keep colour if the stamp or hologram must be visible and the notification says colour.</li>
  <li><strong>Only then lower JPG quality.</strong> Quality around 60–75% is usually invisible for text documents.</li>
</ol>

<h2>4. Check before you upload</h2>
<p>Open the compressed file on your phone and zoom to 100%. You should be able to read: your name, the certificate number, the issuing authority, the date, and the stamp/signature. If any of these is unreadable, go one step back — higher resolution or quality — even if it means a few more KB.</p>

<h2>Common problems</h2>
<ul>
  <li><strong>Still over the limit at readable quality:</strong> crop margins tighter, switch to greyscale, or split a two-sided document only if the portal allows two files.</li>
  <li><strong>"PDF is password protected":</strong> some downloaded e-certificates (DigiLocker, state portals) are locked. Use <a href="/unlock-pdf/">Unlock PDF</a> with the password you were given.</li>
  <li><strong>Rotated page:</strong> fix it with <a href="/rotate-pdf/">Rotate PDF</a> before compressing — verifiers dislike sideways documents.</li>
</ul>
<p>Everything above runs inside your browser: documents with your caste, income or Aadhaar details never leave your device.</p>`,
    faqs: [
      { q: 'What resolution keeps a certificate readable?', a: 'About 150 DPI for an A4 page (roughly 1240 × 1754 px) keeps printed text sharp while staying small. Below about 1000 px wide, small text begins to blur.' },
      { q: 'Should I upload certificates in colour?', a: 'Only if the notification asks for colour or a coloured stamp matters. Greyscale or black-and-white files are much smaller and just as readable.' },
      { q: 'My PDF is locked — can I compress it?', a: 'Unlock it first using the password provided by the issuer, then compress.' },
    ],
  },
  {
    slug: 'jpg-png-pdf-which-format-for-exam-forms',
    published: '2026-10-13',
    title: 'JPG, PNG, HEIC or PDF: Which File Format to Use for Exam Forms',
    h1: 'JPG vs PNG vs HEIC vs PDF — Which Format Exam Portals Want and Why',
    desc: 'Why exam portals almost always ask for JPG photos and PDF documents, what goes wrong with PNG, HEIC and WEBP, and how to convert correctly without losing quality.',
    minutes: 5,
    body: `
<p>"Invalid file format" is one of the most common upload errors, and it is entirely avoidable. Here is what each format is, why portals choose the ones they do, and how to convert without damaging your photo.</p>

<h2>JPG / JPEG — the default for photos and signatures</h2>
<p>JPG compresses photographs very efficiently, which is why portals can demand 20–50 KB files. "JPG" and "JPEG" are the same format; if a portal rejects one extension, rename <code>.jpeg</code> to <code>.jpg</code> (this rename is safe because the format is identical). Nearly every Indian exam — SSC, IBPS, NTA, UPSC and the State PSCs — asks for JPG photos and signatures.</p>

<h2>PNG — fine for screenshots, wrong for uploads</h2>
<p>PNG is lossless: great for screenshots and graphics, but a PNG photo is many times larger than the same JPG and is usually not accepted. Convert with <a href="/png-to-jpg/">PNG to JPG</a>. Note: transparent areas in a PNG become white in JPG, which is what you want for a signature.</p>

<h2>HEIC — the iPhone trap</h2>
<p>iPhones save photos as HEIC by default. Most portals do not accept it, and some Windows PCs cannot even open it. Either convert with <a href="/heic-to-jpg/">HEIC to JPG</a>, or change the iPhone setting <em>Settings → Camera → Formats → Most Compatible</em> before taking your exam photo.</p>

<h2>WEBP — the WhatsApp/browser surprise</h2>
<p>Images saved from websites or some WhatsApp versions may be WEBP even if the name looks normal. Convert with <a href="/webp-to-jpg/">WEBP to JPG</a>. Better still, send yourself the original photo as a <em>document</em> rather than an image — chat apps recompress images and reduce quality.</p>

<h2>PDF — for documents, not photos</h2>
<p>Certificates, mark sheets and ID proofs are usually requested as PDF so multi-page documents stay together. Do not upload your photo as a PDF unless the notification explicitly says so. To combine scans into one file use <a href="/image-to-pdf/">Image to PDF</a> or <a href="/merge-pdf/">Merge PDF</a>; to meet a size limit see <a href="/resizer/guides/compress-certificate-pdf-for-online-form/">compressing certificates</a>.</p>

<h2>Renaming is not converting</h2>
<p>Changing <code>photo.png</code> to <code>photo.jpg</code> changes only the label. Many portals check the file's real contents and still reject it — or accept it and fail later. Always convert with a tool that re-saves the image.</p>

<h2>Quick reference</h2>
<div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Upload</th><th>Usual format</th><th>If you have…</th></tr></thead><tbody>
<tr><td>Photo</td><td>JPG</td><td>HEIC / PNG / WEBP → convert to JPG</td></tr>
<tr><td>Signature, thumb, declaration</td><td>JPG</td><td>PNG scan → convert to JPG</td></tr>
<tr><td>Certificates, mark sheets</td><td>PDF (sometimes JPG)</td><td>Photos of pages → Image to PDF</td></tr>
</tbody></table></div>`,
    faqs: [
      { q: 'Is JPEG the same as JPG?', a: 'Yes. They are the same format with different extensions. Renaming between .jpeg and .jpg is safe.' },
      { q: 'Why is my iPhone photo rejected?', a: 'iPhones save HEIC by default, which most exam portals do not accept. Convert it to JPG or switch the camera to Most Compatible.' },
      { q: 'Can I upload my photo as a PDF?', a: 'Only if the notification says so. Photos and signatures are almost always required as JPG.' },
    ],
  },
];

// ─── Guide pages ──────────────────────────────────────────────────────────────
for (const g of GUIDES) {
  const canonical = `${SITE}/resizer/guides/${g.slug}/`;
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'Guides', url: `${SITE}/resizer/guides/` }, { name: g.title, url: canonical }];
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, description: g.desc, url: canonical, mainEntityOfPage: canonical,
    datePublished: g.published || PUBLISHED, dateModified: S.ISO_DATE, inLanguage: 'en-IN', image: `${SITE}/og-image.png`,
    author: { '@type': 'Organization', name: 'ILoveExams Team', url: `${SITE}/about/` }, publisher: { '@type': 'Organization', name: 'ILoveExams', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/apple-touch-icon.png` } } };
  const html = `${S.head({ title: g.title.length > 60 ? g.title : `${g.title} | ILoveExams`, desc: g.desc, canonical, schema: [article, S.crumbsSchema(crumbs), ...(g.faqs.length ? [S.faqSchema(g.faqs)] : [])] })}
<header class="hero"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>${esc(g.h1)}</h1>
  <p class="updated" style="margin-top:6px">By the ILoveExams Team · ${g.minutes} min read · Published <time datetime="${g.published || PUBLISHED}">${new Date(g.published || PUBLISHED).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time></p>
</div></header>
<main class="wrap">
  <article class="card guide">${g.body}</article>
  ${S.adSlot()}
  ${g.faqs.length ? `<section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">FAQs</h2>${S.faqHtml(g.faqs)}</section>` : ''}
  <section class="card"><h2>More guides</h2><ul class="links">${GUIDES.filter(x => x !== g).map(x => `<li><a href="/resizer/guides/${x.slug}/">${esc(x.title)}</a></li>`).join('')}</ul></section>
</main>
${S.footer()}`;
  write(`resizer/guides/${g.slug}`, html.replace('</style>', '.guide h2{font-size:20px;margin:26px 0 10px}.guide h2:first-child{margin-top:0}.guide h3{font-size:16px;margin:18px 0 6px}.guide p,.guide li{font-size:15.5px;line-height:1.7}.guide code{background:#f1f5f9;padding:1px 6px;border-radius:5px}</style>'));
}

// Guides index
{
  const canonical = `${SITE}/resizer/guides/`;
  const title = 'Exam Photo & Signature Guides – Tips to Avoid Rejection';
  const desc = 'Practical guides for Indian exam applications: taking a passport photo with your phone, scanning your signature, fixing rejected uploads, and understanding px, KB and DPI.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'Guides', url: canonical }];
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs })] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Exam Photo &amp; Signature Guides</h1><p class="lede" style="display:block">Clear, practical help for getting your uploads accepted the first time.</p></div></header>
<main class="wrap">
  ${GUIDES.map(g => `<section class="card"><h2><a href="/resizer/guides/${g.slug}/" style="text-decoration:none">${esc(g.title)}</a></h2><p>${esc(g.desc)}</p><p style="margin:8px 0 0;font-size:13px;color:#64748b">${g.minutes} min read</p></section>`).join('\n  ')}
</main>
${S.footer()}`;
  write('resizer/guides', html);
}

// ─── About page ──────────────────────────────────────────────────────────────
{
  const canonical = `${SITE}/about/`;
  const title = 'About ILoveExams – Free, Private Exam Photo Tools';
  const desc = 'ILoveExams builds free, private tools that help Indian exam applicants resize photos and signatures to exact official requirements. Learn how we work and keep specs accurate.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'About', url: canonical }];
  const html = `${S.head({ title, desc, canonical, schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', url: canonical, name: title, description: desc, dateModified: S.ISO_DATE,
    mainEntity: { '@type': 'Organization', name: 'ILoveExams', url: `${SITE}/`, logo: `${SITE}/apple-touch-icon.png` } }, S.crumbsSchema(crumbs)] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>About ILoveExams</h1><p class="lede" style="display:block">Free tools that get your exam application uploads right the first time.</p></div></header>
<main class="wrap"><article class="card guide">
  <h2>Why we built this</h2>
  <p>Every year, millions of candidates across India fill online forms for SSC, banking, railway, NTA, UPSC and State PSC exams. Each exam wants the photo and signature in its own pixel size and KB range, and the rules change between notifications. Cyber cafés charge for resizing, and many online tools upload your photo to unknown servers. ILoveExams exists to make this simple, free and private.</p>
  <h2>What we offer</h2>
  <ul>
    <li><strong>Exam resizers for ${EXAMS.length}+ exams</strong> with the exact size preset — upload, crop, download.</li>
    <li><strong>A size chart</strong> of photo, signature, thumb and declaration requirements across exams.</li>
    <li><strong>General image tools</strong>: resize to KB, resize by cm/inch/mm, compress, convert JPG/PNG, image to PDF.</li>
    <li><strong>Guides</strong> on taking an exam photo with a phone, scanning a signature and fixing rejected uploads.</li>
  </ul>
  <h2>Your privacy</h2>
  <p>All image processing happens inside your browser using HTML5 Canvas. Your photos and signatures are <strong>never uploaded</strong> to our servers — we could not see them even if we wanted to. See our <a href="/privacy/">privacy policy</a>.</p>
  <h2>How we keep sizes accurate</h2>
  <p>Specifications are compiled from official notifications and information bulletins, and reviewed when a new notification is released. Every exam page shows when it was last reviewed. Sizes can change between exam cycles, so we always recommend cross-checking the latest official notification — and our tool lets you edit width, height and KB if a requirement changes before we update.</p>
  <p>Found an outdated size? Please <a href="/contact/">tell us</a> — corrections from candidates help everyone.</p>
  <h2>Free, supported by ads and donations</h2>
  <p>ILoveExams is free with no sign-up. We show a small number of ads and accept voluntary <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener">donations</a> to cover running costs.</p>
</article></main>
${S.footer()}`;
  write('about', html.replace('</style>', '.guide h2{font-size:20px;margin:22px 0 8px}.guide h2:first-child{margin-top:0}.guide p,.guide li{font-size:15.5px;line-height:1.7}</style>'));
}

// ─── Size updates log (trust: what changed and when) ─────────────────────────
{
  const LOG = [
    ['2026-10-28', 'Added <strong>13 exams</strong>: RRB NTPC, RRB Group D, RRB JE, CTET, DSSSB, Navodaya JNVST, Sainik School AISSEE, BITSAT, MHT CET, KCET, REET, UPSSSC PET and CSBC Bihar Police. Sizes follow each board’s portal; always confirm in your notification.', ['/resizer/rrb-ntpc-photo-resize/', '/resizer/ctet-photo-resize/']],
    ['2026-10-28', 'New <strong>exam form calendar</strong> (290+ exams by usual form month) and <strong>upload-error fix pages</strong> for real portal messages; Hindi pages for 42 exams.', ['/resizer/exam-forms-open-now/', '/resizer/fix/']],
    ['2026-10-03', 'TNPSC and Kerala PSC photo pages now add your <strong>name and photo date</strong> on the photo, as both commissions require.', ['/resizer/tnpsc-photo-resize/', '/resizer/kpsc-photo-resize/']],
    ['2026-10-03', 'Resizer: iPhone <strong>HEIC</strong> photos now open in every browser; clearer steps and a one-tap “next: signature” button.', ['/resizer/']],
    ['2026-09-26', '<strong>JEE Main</strong> limits updated to the 2026 information bulletin: photo 10–200 KB, signature 10–100 KB.', ['/resizer/jee-main-photo-resize/', '/resizer/jee-main-signature-resize/']],
    ['2026-09-26', '<strong>UPSC Prelims</strong> calculator: CSAT qualifying mark corrected to 33% = 66 of 200.', ['/upsc-prelims-score-calculator/']],
    ['2026-09-26', '<strong>IBPS PO / SBI PO</strong> age-calculator pages: signature corrected to 140×60 px, 10–20 KB.', ['/resizer/ibps-po-signature-resize/']],
    ['2026-09-26', 'Resizer FAQs corrected for GATE, CAT, UPPSC, RRB ALP, Delhi Police, CUET and JEE to match the official sizes used by the tool.', ['/resizer/photo-signature-size-chart/']],
    ['2026-09-26', 'Added the <strong>NEET postcard-size photo</strong> (4×6 inch, 10–200 KB) and IBPS-pattern <strong>thumb impression &amp; handwritten declaration</strong> pages.', ['/resizer/neet-ug-postcard-photo-resize/', '/resizer/bank-exam-photo-signature-size/']],
    ['2026-09-26', 'Signatures below the minimum KB (e.g. 10 KB for bank exams) are now brought up to the limit automatically.', ['/resizer/ibps-po-signature-resize/']],
  ];
  const canonical = `${SITE}/resizer/updates/`;
  const title = 'Exam Photo & Signature Size Updates – What Changed';
  const desc = 'A dated log of every exam photo and signature size we have updated or corrected, so you always know the specs on ILoveExams are current.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Exam Resizer', url: `${SITE}/resizer/` }, { name: 'Size updates', url: canonical }];
  const fmtD = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs })] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Size Updates</h1><p class="lede" style="display:block">Every change to an exam size on ILoveExams, with the date. We check official notifications and fix sizes as soon as they change.</p></div></header>
<main class="wrap">
  <section class="card"><h2>Recent updates</h2><ul class="check">${LOG.map(([d, t, links]) => `<li><strong>${fmtD(d)}</strong> — ${t} ${links.map(u => `<a href="${u}">View →</a>`).join(' ')}</li>`).join('')}</ul></section>
  <section class="card"><h2>Found a size that has changed?</h2><p>Email <a href="mailto:gautamcoder@gmail.com?subject=Size%20update">gautamcoder@gmail.com</a> with the exam name and a link to the official notification — we update pages within a day or two.</p></section>
</main>
${S.footer()}`;
  write('resizer/updates', html);
}

// ─── Contact page ────────────────────────────────────────────────────────────
{
  const EMAIL = 'gautamcoder@gmail.com';
  const canonical = `${SITE}/contact/`;
  const title = 'Contact ILoveExams';
  const desc = 'Contact the ILoveExams team to report an outdated exam size, suggest an exam or tool, or ask a question about our free photo and signature resizers.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Contact', url: canonical }];
  const html = `${S.head({ title, desc, canonical, schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: canonical, name: title, description: desc,
    mainEntity: { '@type': 'Organization', name: 'ILoveExams', url: `${SITE}/`, email: EMAIL, contactPoint: { '@type': 'ContactPoint', email: EMAIL, contactType: 'customer support', availableLanguage: ['English', 'Hindi'] } } }, S.crumbsSchema(crumbs)] })}
<header class="hero"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Contact Us</h1><p class="lede" style="display:block">We read every message and usually reply within 2–3 working days.</p></div></header>
<main class="wrap"><article class="card guide">
  <h2>Email</h2>
  <p style="font-size:18px"><a href="mailto:${EMAIL}"><strong>${EMAIL}</strong></a></p>
  <h2>What to write to us about</h2>
  <ul>
    <li><strong>An outdated size</strong> — tell us the exam and link the official notification, and we will update the page.</li>
    <li><strong>A missing exam or document</strong> you need a resizer for.</li>
    <li><strong>A problem with a tool</strong> — mention your phone/browser and what happened.</li>
    <li><strong>Advertising or partnership</strong> enquiries.</li>
  </ul>
  <h2>Please note</h2>
  <p>We are not affiliated with any exam body. For questions about your application, admit card or result, contact the official helpdesk listed in your exam notification. Never email us your photos, passwords or application numbers — our tools work entirely in your browser, so we never need them.</p>
</article></main>
${S.footer()}`;
  write('contact', html.replace('</style>', '.guide h2{font-size:20px;margin:22px 0 8px}.guide h2:first-child{margin-top:0}.guide p,.guide li{font-size:15.5px;line-height:1.7}</style>'));
}


// ─── Embed page: free resizer for blogs, coaching & job sites (earns links) ──
{
  const canonical = `${SITE}/embed/`;
  const title = 'Free Exam Photo Resizer for Your Website (Embed)';
  const desc = 'Add a free exam photo & signature resizer to your blog, coaching or job-alert site. Copy one snippet — 90+ exams, exact px and KB, nothing uploaded.';
  const crumbs = [{ name: 'Home', url: `${SITE}/` }, { name: 'Embed', url: canonical }];
  const opts = EXAMS.map(e => `<option value="${e.slug}">${esc(seoOf(e).short)}</option>`).join('');
  const names = Object.fromEntries(EXAMS.map(e => [e.slug, seoOf(e).short]));
  const html = `${S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs })] })}
<header class="hero lt"><div class="hero-in">${S.crumbsHtml(crumbs)}<h1>Put a free exam photo resizer on your website</h1>
<p class="lede" style="display:block">Running a job-alert blog, coaching site or exam Telegram channel? Give your readers a resizer that makes their photo and signature exactly the size the form asks for — free, no sign-up, no ads inside, and their files never leave their phone.</p></div></header>
<main class="wrap">
  <section class="card"><h2>1. Pick the exam</h2>
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      <select id="em-exam" style="padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;min-width:200px">${opts}</select>
      <select id="em-doc" style="padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px"><option value="photo">Photo</option><option value="signature">Signature</option></select>
    </div>
  </section>
  <section class="card"><h2>2. Copy this code into your page</h2>
    <p>Paste it into any HTML block — WordPress (Custom HTML block), Blogger (HTML view), Wix (Embed code) or plain HTML. The tool resizes itself to fit.</p>
    <textarea id="em-code" readonly rows="9" style="width:100%;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;padding:12px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc"></textarea>
    <p><button id="em-copy" type="button" style="background:#2563eb;color:#fff;border:0;border-radius:10px;padding:11px 18px;font-weight:700;font-size:15px;cursor:pointer">Copy code</button> <span id="em-done" style="color:#16a34a;font-weight:600"></span></p>
  </section>
  <section class="card"><h2>Preview</h2><div id="em-preview"></div></section>
  <section class="card"><h2>Good to know</h2><ul class="check">
    <li>Free forever. Please keep the small credit link under the tool.</li>
    <li>Sizes are kept up to date by us — when an exam changes its photo size, your embed updates automatically.</li>
    <li>Privacy-safe: images are processed in the visitor's browser and never uploaded.</li>
    <li>Need an exam we don't have? <a href="/contact/">Tell us</a> and we'll add it.</li>
  </ul></section>
</main>
<script>
(function () {
  var N = ${JSON.stringify(names)}, ex = document.getElementById('em-exam'), dc = document.getElementById('em-doc'), out = document.getElementById('em-code');
  ex.value = 'ssc-cgl' in N ? 'ssc-cgl' : ex.value;
  function code() {
    var s = ex.value, d = dc.value, label = N[s] + (d === 'signature' ? ' signature' : ' photo') + ' resizer';
    return '<iframe src="${SITE}/resizer/?embed=1&exam=' + s + '&document=' + d + '" title="' + label + '" style="width:100%;max-width:760px;height:640px;border:0" loading="lazy"></iframe>\\n'
      + '<p style="font-size:13px;margin:4px 0 0">Free <a href="${SITE}/resizer/' + s + '-' + d + '-resize/">' + label + '</a> by ILoveExams</p>\\n'
      + '<script>addEventListener("message",function(e){if(e.origin!=="${SITE}"||!e.data||e.data.type!=="ilx-embed-height")return;document.querySelectorAll("iframe").forEach(function(f){if(f.contentWindow===e.source)f.style.height=Math.max(420,e.data.h)+"px"})});<\\/script>';
  }
  function render() { var c = code(); out.value = c; document.getElementById('em-preview').innerHTML = c.split('<script>')[0]; }
  addEventListener('message', function (e) { if (e.origin !== location.origin || !e.data || e.data.type !== 'ilx-embed-height') return; document.querySelectorAll('#em-preview iframe').forEach(function (f) { if (f.contentWindow === e.source) f.style.height = Math.max(420, e.data.h) + 'px'; }); });
  ex.onchange = dc.onchange = render; render();
  document.getElementById('em-copy').onclick = function () { out.select(); (navigator.clipboard ? navigator.clipboard.writeText(out.value) : Promise.reject()).catch(function () { document.execCommand('copy'); }).then(function () { document.getElementById('em-done').textContent = '✓ Copied'; }); };
})();
</script>
${S.footer()}`;
  write('embed', html);
}

console.log(`✅ Generated ${GUIDES.length} guides, guides index, About and Contact pages`);
