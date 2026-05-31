#!/usr/bin/env node
/**
 * Generates SEO landing pages for every non-exam tool (ID cards, resize-to-KB,
 * custom size, cm/inch/mm). Same look as the exam pages.
 * Run: node generate-tools.js
 */
const fs = require('fs');
const path = require('path');

const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display:inline-block;width:.9em;height:.9em;vertical-align:middle;margin:0 1px 3px"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Manual ad slot ID — replace '8189529514' with your AdSense ad-unit slot
// number after creating ONE "Display ads – Responsive" unit in AdSense.
const AD_SLOT_ID = '8189529514';
const adSlot = (label = 'ADVERTISEMENT', maxW = 760) => `
<aside class="ad-slot" style="max-width:${maxW}px;margin:32px auto;padding:0 16px;display:block" aria-label="Sponsored content">
  <p style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.12em;margin:0 0 6px;text-align:left">${label}</p>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;min-height:260px;display:flex;align-items:center;justify-content:center">
    <ins class="adsbygoogle" style="display:block;width:100%;min-height:230px" data-ad-client="ca-pub-9837613085159910" data-ad-slot="${AD_SLOT_ID}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  </div>
</aside>
<script>(function(){try{var ins=document.currentScript.previousElementSibling.querySelector('.adsbygoogle');if(ins&&/^\\d+$/.test(ins.dataset.adSlot)){(adsbygoogle=window.adsbygoogle||[]).push({});}}catch(e){}})();</script>`;

// Shared centred nav links (Exam Resizer · All Tools · Tools ▾ dropdown)
const DD_LINK = 'display:block;padding:9px 12px;border-radius:8px;text-decoration:none;color:#0f172a;font-size:13px;font-weight:600;white-space:nowrap';
const NAV_LINKS = `<div class="hidden md:flex items-center" style="gap:26px;font-size:13.5px;font-weight:600">
      <a href="/resizer/" style="color:rgba(255,255,255,.75);text-decoration:none">Exam Resizer</a>
      <a href="/" style="color:rgba(255,255,255,.75);text-decoration:none">All Tools</a>
      <div class="relative group" style="padding:20px 0">
        <button style="color:rgba(255,255,255,.75);background:none;border:none;cursor:pointer;font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:5px;padding:0">Tools <span style="font-size:8px;opacity:.7">▼</span></button>
        <div class="hidden group-hover:block" style="position:absolute;top:100%;left:50%;transform:translateX(-50%);background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.22);padding:8px;min-width:248px;z-index:60">
          <a href="/#id" style="${DD_LINK}">🪪 ID Card — Voter, Aadhaar, PAN</a>
          <a href="/#kb" style="${DD_LINK}">💾 By File Size — 10–500&nbsp;KB</a>
          <a href="/#dim" style="${DD_LINK}">📐 By Dimension — cm, inch, custom</a>
          <div style="height:1px;background:#e2e8f0;margin:6px 8px"></div>
          <a href="/" style="${DD_LINK};color:#2563eb;font-weight:700">View all tools →</a>
        </div>
      </div>
    </div>`;

// helper: build resizer URL
function toolURL(t) {
  const p = new URLSearchParams();
  p.set('preset', t.slug);
  if (t.free) p.set('free', '1');
  if (t.w) p.set('w', t.w);
  if (t.h) p.set('h', t.h);
  if (t.minkb != null) p.set('minkb', t.minkb);
  if (t.maxkb != null) p.set('maxkb', t.maxkb);
  if (t.fmt) p.set('fmt', t.fmt);
  p.set('title', t.h1);
  p.set('canon', `https://ilovexams.in/${t.slug}/`);
  return `/resizer/?${p.toString()}`;
}

// ── TOOL DEFINITIONS ──
const kb = (n, unit='KB') => ({
  slug: `resize-image-to-${n}${unit==='MB'?'mb':'kb'}`,
  group: 'kb', free: true, maxkb: unit==='MB'? n*1024 : n,
  name: `Resize Image to ${n} ${unit}`,
  h1:   `Resize Image to ${n} ${unit}`,
  blurb:`Compress any photo or image to ${n} ${unit} online — keeps your image as sharp as possible while hitting the exact size limit.`,
});

const TOOLS = [
  // ───── ID CARD / DOCUMENT (fixed dimensions, work today) ─────
  { slug:'voter-id-photo-resize', group:'id', w:200, h:230, minkb:10, maxkb:100, fmt:'JPG',
    name:'Voter ID Photo Resize', h1:'Voter ID Photo Resize (200×230 px)',
    blurb:'Resize your photo to the size accepted for Voter ID / EPIC card online applications — 200×230 px, under 100 KB.' },
  { slug:'aadhaar-card-resize-cm-inch-mm', group:'id', w:1011, h:638, minkb:20, maxkb:300, fmt:'JPG',
    name:'Aadhaar Card Resize', h1:'Aadhaar Card Resize in cm / inch / mm',
    blurb:'Resize an Aadhaar card image to the standard ID-1 card size (8.56 × 5.40 cm) at print-ready 300 DPI — that is 1011 × 638 pixels.' },
  { slug:'voter-id-card-resize-cm-inch-mm', group:'id', w:1011, h:638, minkb:20, maxkb:300, fmt:'JPG',
    name:'Voter ID Card Resize', h1:'Voter ID Card Resize in cm / inch / mm',
    blurb:'Resize a Voter ID (EPIC) card image to the standard ID-1 card size (8.56 × 5.40 cm) at 300 DPI — 1011 × 638 pixels.' },
  { slug:'pan-card-photo-resize', group:'id', w:213, h:213, minkb:10, maxkb:50, fmt:'JPG',
    name:'PAN Card Photo Resize', h1:'PAN Card Photo Resize',
    blurb:'Resize your photo for a PAN card application to the required passport-style size and file limit.' },
  { slug:'passport-size-photo-resize', group:'id', w:413, h:531, minkb:20, maxkb:200, fmt:'JPG',
    name:'Passport Size Photo Resize', h1:'Passport Size Photo Resize (35×45 mm)',
    blurb:'Create a standard passport-size photo — 35 × 45 mm at 300 DPI (413 × 531 px) — ready for visa, passport and exam forms.' },
  { slug:'2x2-inch-photo-resize', group:'id', w:600, h:600, minkb:20, maxkb:200, fmt:'JPG',
    name:'2x2 Inch Photo Resize', h1:'2×2 Inch Photo Resize (51×51 mm)',
    blurb:'Make a 2 × 2 inch (51 × 51 mm) photo at 300 DPI — 600 × 600 px — the US visa & green-card standard.' },
  { slug:'3.5x4.5-cm-photo-resize', group:'id', w:413, h:531, minkb:20, maxkb:200, fmt:'JPG',
    name:'3.5x4.5 cm Photo Resize', h1:'3.5 × 4.5 cm Photo Resize',
    blurb:'Resize your photo to the common 3.5 × 4.5 cm (35 × 45 mm) format used for Indian passports, visas and many exam forms.' },

  // ───── RESIZE TO FILE SIZE (free dimensions) ─────
  kb(10), kb(15), kb(20), kb(25), kb(30), kb(40), kb(50),
  kb(80), kb(100), kb(150), kb(200), kb(300), kb(500), kb(1,'MB'),

  // photo / signature specific KB (free dims, just different copy)
  { slug:'resize-photo-to-50kb', group:'kb', free:true, maxkb:50, name:'Resize Photo to 50 KB', h1:'Resize Photo to 50 KB',
    blurb:'Compress your photograph to 50 KB for exam, job and government online forms — quick, free and private.' },
  { slug:'resize-photo-to-100kb', group:'kb', free:true, maxkb:100, name:'Resize Photo to 100 KB', h1:'Resize Photo to 100 KB',
    blurb:'Reduce your photo to 100 KB without visible quality loss — perfect for portals with a 100 KB upload limit.' },
  { slug:'resize-signature-to-10kb', group:'kb', free:true, maxkb:10, name:'Resize Signature to 10 KB', h1:'Resize Signature to 10 KB',
    blurb:'Shrink your scanned signature to 10 KB for online application forms that demand a tiny file size.' },
  { slug:'resize-signature-to-20kb', group:'kb', free:true, maxkb:20, name:'Resize Signature to 20 KB', h1:'Resize Signature to 20 KB',
    blurb:'Compress your signature image to 20 KB — the most common signature size limit on Indian exam portals.' },

  // ───── BY DIMENSION (custom) ─────
  { slug:'resize-image-custom-size', group:'dim', w:600, h:600, minkb:0, maxkb:500, fmt:'JPG',
    name:'Resize to Custom Size', h1:'Resize Image to Custom Size (px)',
    blurb:'Enter any width × height in pixels and a target file size — full manual control over your image.' },
  { slug:'resize-image-in-cm', group:'dim', w:1011, h:638, minkb:0, maxkb:500, fmt:'JPG',
    name:'Resize Image in cm', h1:'Resize Image in Centimetres (cm)',
    blurb:'Resize an image by centimetres at 300 DPI. Tip: 1 cm ≈ 118 px at 300 DPI — set your exact pixels in the tool.' },
  { slug:'resize-image-in-inches', group:'dim', w:600, h:600, minkb:0, maxkb:500, fmt:'JPG',
    name:'Resize Image in Inches', h1:'Resize Image in Inches',
    blurb:'Resize an image by inches at 300 DPI. Tip: 1 inch = 300 px at 300 DPI — enter the exact pixels in the tool.' },
  { slug:'resize-image-in-mm', group:'dim', w:413, h:531, minkb:0, maxkb:500, fmt:'JPG',
    name:'Resize Image in mm', h1:'Resize Image in Millimetres (mm)',
    blurb:'Resize an image by millimetres at 300 DPI. Tip: 10 mm ≈ 118 px at 300 DPI — set your exact pixels in the tool.' },
  { slug:'resize-image-cm-inch-mm', group:'dim', w:600, h:600, minkb:0, maxkb:500, fmt:'JPG',
    name:'Resize in cm / inch / mm', h1:'Resize Image in cm, inch or mm',
    blurb:'Resize any image by centimetres, inches or millimetres at your chosen DPI, then download instantly.' },
];

const GROUP_LABEL = { id:'ID Card & Document', kb:'Resize by File Size', dim:'Resize by Dimension' };

function relatedLinks(tool) {
  return TOOLS.filter(t => t.group === tool.group && t.slug !== tool.slug).slice(0, 10)
    .map(t => `<a href="/${t.slug}/" style="font-size:13px;color:#3b82f6;background:#eff6ff;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;text-decoration:none">${t.name}</a>`)
    .join('\n      ');
}

function specChips(t) {
  const chips = [];
  if (t.w && t.h) chips.push(`📐 ${t.w}×${t.h} px`);
  if (t.maxkb) chips.push(t.free ? `💾 ≤ ${t.maxkb>=1024?(t.maxkb/1024)+' MB':t.maxkb+' KB'}` : `💾 ${t.minkb||0}–${t.maxkb} KB`);
  chips.push(`🖼 ${t.fmt||'JPG'}`);
  return chips.map(c => `<span style="background:rgba(255,255,255,.08);color:#e2e8f0;border:1px solid rgba(255,255,255,.12);padding:6px 14px;border-radius:8px;font-size:13px;font-family:monospace">${c}</span>`).join('\n      ')
    + `\n      <span style="background:rgba(59,130,246,.2);color:#93c5fd;border:1px solid rgba(59,130,246,.3);padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600">✓ Free Tool</span>`;
}

function page(t) {
  const url = toolURL(t);
  const title = `${t.h1} – Free Online Tool | ILoveExams`;
  const desc  = `${t.blurb} 100% free, instant and private — your image is processed in your browser, never uploaded.`;
  const canonical = `https://ilovexams.in/${t.slug}/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9837613085159910" crossorigin="anonymous"><\/script>
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0a0e1a">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ILoveExams">
  <meta property="og:title" content="${t.h1} | ILoveExams">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://ilovexams.in/og-image.png">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t.h1} | ILoveExams">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="https://ilovexams.in/og-image.png">
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; }
    .hero-nav { background: #0a0e1a; border-bottom: 1px solid rgba(255,255,255,.08); position: sticky; top: 0; z-index: 50; }
    .hero-nav-inner { max-width: 900px; margin: 0 auto; padding: 0 16px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
    .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg,#3b82f6,#2563eb); color: #fff; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; transition: all .2s; }
    .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,.4); }
    .spec-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .spec-row:last-child { border-bottom: none; }
    .step-num { width: 28px; height: 28px; background: #3b82f6; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 10px; }
    .faq-q { font-weight: 700; color: #0f172a; font-size: 14px; padding: 14px 16px; }
    .faq-a { font-size: 14px; color: #475569; padding: 0 16px 14px; line-height: 1.6; }
  </style>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"https://ilovexams.in/"},
    {"@type":"ListItem","position":2,"name":"${GROUP_LABEL[t.group]}","item":"https://ilovexams.in/"},
    {"@type":"ListItem","position":3,"name":"${t.name}","item":"${canonical}"}]}
  <\/script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"HowTo","name":"How to ${t.h1.toLowerCase()}","totalTime":"PT1M",
   "estimatedCost":{"@type":"MonetaryAmount","currency":"INR","value":"0"},
   "step":[
    {"@type":"HowToStep","position":1,"name":"Open the tool","text":"Click the button to open the ILoveExams resizer with this preset loaded."},
    {"@type":"HowToStep","position":2,"name":"Upload image","text":"Upload or drag-and-drop your image. JPG, PNG, HEIC and WEBP are supported."},
    {"@type":"HowToStep","position":3,"name":"Process","text":"Click Process Image. The tool resizes and compresses to meet the target automatically."},
    {"@type":"HowToStep","position":4,"name":"Download","text":"Click Download to save the result to your device."}]}
  <\/script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"Is ${t.name} free?","acceptedAnswer":{"@type":"Answer","text":"Yes, ${t.name} on ILoveExams is 100% free with no sign-up, no watermark and no limits."}},
    {"@type":"Question","name":"Is my image uploaded to a server?","acceptedAnswer":{"@type":"Answer","text":"No. Everything runs in your browser using HTML5 Canvas. Your image never leaves your device."}},
    {"@type":"Question","name":"Does it work on mobile?","acceptedAnswer":{"@type":"Answer","text":"Yes, it works on any Android or iPhone browser — no app needed."}}]}
  <\/script>
</head>
<body>

<nav class="hero-nav">
  <div class="hero-nav-inner">
    <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:0;flex-shrink:0">
      <span style="font-size:22px;font-weight:900;color:#fff">I</span>${SVG_HEART}<span style="font-size:22px;font-weight:900;color:#fff">Exams</span><span style="font-size:12px;color:rgba(255,255,255,.3);font-weight:500;margin-left:2px">.in</span>
    </a>
    ${NAV_LINKS}
    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
      <span class="hidden sm:inline-flex" style="font-size:11px;color:#93c5fd;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);padding:4px 10px;border-radius:999px;white-space:nowrap">● 100% Private</span>
      <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap">♥ Donate</a>
    </div>
  </div>
</nav>

<div style="background:linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%);padding:48px 16px 40px">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.25);border-radius:999px;padding:4px 12px;margin-bottom:16px">
      <span style="font-size:11px;font-weight:700;color:#93c5fd;text-transform:uppercase;letter-spacing:.08em">${GROUP_LABEL[t.group]}</span>
    </div>
    <h1 style="font-size:clamp(22px,4vw,36px);font-weight:900;color:#fff;margin:0 0 12px;line-height:1.2">${t.h1}</h1>
    <p style="color:rgba(255,255,255,.6);font-size:16px;margin:0 0 28px;max-width:620px">${t.blurb}</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px">
      ${specChips(t)}
    </div>
    <a href="${url}" class="cta-btn" style="font-size:16px;padding:14px 28px;border-radius:14px">Open ${t.name} →</a>
  </div>
</div>

<div style="max-width:900px;margin:0 auto;padding:40px 16px">
  <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:24px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">How to ${t.h1} — Step by Step</h2>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:14px;align-items:flex-start"><span class="step-num">1</span><div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Open the tool</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Click "Open ${t.name}" above — the resizer loads with this preset ready.</p></div></div>
      <div style="display:flex;gap:14px;align-items:flex-start"><span class="step-num">2</span><div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Upload your image</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Drag-and-drop or pick a file. JPG, PNG, HEIC and WEBP supported, up to 15 MB.</p></div></div>
      <div style="display:flex;gap:14px;align-items:flex-start"><span class="step-num">3</span><div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Crop &amp; process</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Adjust if needed, then click Process Image. The tool hits the target automatically.</p></div></div>
      <div style="display:flex;gap:14px;align-items:flex-start"><span class="step-num">4</span><div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Download</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Save the resized image, ready to upload anywhere.</p></div></div>
    </div>
    <div style="margin-top:20px;text-align:center"><a href="${url}" class="cta-btn" style="font-size:15px;padding:12px 32px;border-radius:12px">Start Now – Free &amp; Instant →</a></div>
  </div>

  ${adSlot('ADVERTISEMENT')}

  <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">Frequently Asked Questions</h2>
  <div class="faq-item"><div class="faq-q">Is ${t.name} free?</div><div class="faq-a">Yes — completely free. No account, no watermark, no limits on how many images you resize.</div></div>
  <div class="faq-item"><div class="faq-q">Is my image safe?</div><div class="faq-a">100%. All processing happens locally in your browser with HTML5 Canvas. Your image is never uploaded to any server.</div></div>
  <div class="faq-item"><div class="faq-q">Does it work on mobile?</div><div class="faq-a">Yes. Open ilovexams.in in Chrome or Safari on Android/iPhone, upload, and download — no app required.</div></div>

  <div style="margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px">
    <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 14px">More ${GROUP_LABEL[t.group]} Tools</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${relatedLinks(t)}
    </div>
  </div>

  ${adSlot('ADVERTISEMENT')}
</div>

<footer style="background:#0a0e1a;color:rgba(255,255,255,.5);margin-top:40px;padding:28px 16px;text-align:center">
  <a href="/" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:0;margin-bottom:8px">
    <span style="font-size:20px;font-weight:900;color:#fff">I</span>${SVG_HEART}<span style="font-size:20px;font-weight:900;color:#fff">Exams</span><span style="font-size:12px;color:rgba(255,255,255,.25);font-weight:500;margin-left:2px">.in</span>
  </a>
  <p style="font-size:12px;margin:0 0 8px">Free image, photo &amp; signature resizer for Indian exams &amp; ID cards</p>
  <p style="font-size:11px;margin:0;color:rgba(255,255,255,.4)">
    <a href="/" style="color:rgba(255,255,255,.5);text-decoration:none">Home</a> ·
    <a href="/resizer/" style="color:rgba(255,255,255,.5);text-decoration:none">Exam Resizer</a> ·
    <a href="/privacy/" style="color:rgba(255,255,255,.5);text-decoration:none">Privacy</a> ·
    <a href="/terms/" style="color:rgba(255,255,255,.5);text-decoration:none">Terms</a> ·
    <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener" style="color:rgba(239,68,68,.6);text-decoration:none">♥ Donate</a>
  </p>
</footer>

</body>
</html>`;
}

let count = 0;
const today = '2026-05-31';
const sitemapEntries = [];
TOOLS.forEach(t => {
  const dir = path.join(__dirname, t.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(t), 'utf8');
  sitemapEntries.push(`  <url><loc>https://ilovexams.in/${t.slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  count++;
});
console.log(`✅ Generated ${count} tool pages`);

// expose slugs for sitemap rebuild
fs.writeFileSync(path.join(__dirname, '.tool-slugs.json'), JSON.stringify(TOOLS.map(t => t.slug)), 'utf8');
console.log('✅ Wrote .tool-slugs.json');
