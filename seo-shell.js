/**
 * Shared page shell for generated SEO pages (exam landing pages, hubs, size pages).
 * No Tailwind CDN: the few utility classes these pages need are defined in BASE_CSS,
 * which keeps landing pages light for Core Web Vitals.
 */

const SITE = 'https://ilovexams.in';
const AD_CLIENT = 'ca-pub-9837613085159910';
const AD_SLOT_ID = '8189529514';

const BUILD_DATE = new Date();
const ISO_DATE = BUILD_DATE.toISOString().slice(0, 10);
const YEAR = BUILD_DATE.getFullYear();
// From September, application forms for next year's exam cycle start opening
// (JEE Main, NEET, bank exams), so pages cover both years instead of spawning
// duplicate "-2027" pages. Rolls forward automatically on each build.
const SPAN_NEXT = BUILD_DATE.getMonth() >= 8;
const NEXT_YEAR = YEAR + 1;
const YEARS = SPAN_NEXT ? `${YEAR}-${NEXT_YEAR}` : `${YEAR}`;
const MONTH_YEAR = BUILD_DATE.toLocaleString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:20px;height:20px;margin:0 1px 2px;vertical-align:middle" aria-hidden="true"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const adSlot = (label = 'ADVERTISEMENT') => `
<aside class="ad-slot" aria-label="Sponsored content">
  <p class="ad-label">${label}</p>
  <div class="ad-box">
    <ins class="adsbygoogle" style="display:block;width:100%;min-height:250px" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT_ID}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  </div>
</aside>
<script>(function(){try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}})();</script>`;

const BASE_CSS = `
*{box-sizing:border-box}
body{font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#f8fafc;margin:0;color:#0f172a;line-height:1.55;-webkit-text-size-adjust:100%}
a{color:#2563eb}
.nav{background:#0a0e1a;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;z-index:50}
.nav-in{max-width:960px;margin:0 auto;padding:0 16px;height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.logo{text-decoration:none;display:flex;align-items:center}
.logo-t{font-size:22px;font-weight:900;color:#fff;letter-spacing:-.5px}
.logo-in{font-size:12px;color:rgba(255,255,255,.3);font-weight:500;margin-left:2px;align-self:flex-end;margin-bottom:3px}
.nav-links{display:none;gap:24px;font-size:13.5px;font-weight:600}
.nav-links a{color:rgba(255,255,255,.75);text-decoration:none}
.nav-links a:hover{color:#fff}
.donate{font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap}
@media(min-width:768px){.nav-links{display:flex}}
.hero{background:linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%);padding:28px 16px 26px;color:#fff}
.hero-in,.wrap{max-width:960px;margin:0 auto}
.wrap{padding:24px 16px 8px}
.crumbs{font-size:12px;color:rgba(255,255,255,.5);margin:0 0 12px}
.crumbs a{color:rgba(255,255,255,.6);text-decoration:none}
.crumbs a:hover{color:#fff}
h1{font-size:clamp(22px,4.2vw,34px);font-weight:900;margin:0 0 10px;line-height:1.2;letter-spacing:-.01em}
.lede{color:rgba(255,255,255,.72);font-size:15.5px;margin:0 0 16px;max-width:680px}
.lede strong{color:#fff}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:rgba(255,255,255,.08);color:#e2e8f0;border:1px solid rgba(255,255,255,.14);padding:5px 12px;border-radius:8px;font-size:13px;font-family:ui-monospace,Menlo,monospace}
.chip.ok{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.3);color:#86efac;font-family:inherit;font-weight:600}
.updated{font-size:12px;color:rgba(255,255,255,.45);margin-top:14px}
.card{background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:22px;margin:0 0 20px}
.card h2{font-size:19px;font-weight:800;margin:0 0 12px;line-height:1.3}
.card h3{font-size:15px;font-weight:700;margin:16px 0 6px}
.card p,.card li{font-size:14.5px;color:#334155}
.answer{border-left:4px solid #2563eb;background:#eff6ff;border-radius:12px;padding:16px 18px;margin:0 0 20px}
.answer p{margin:0;font-size:15.5px;color:#0f172a}
.tool-frame{background:#fff;border:1.5px solid #bfdbfe;border-radius:16px;overflow:hidden;margin:0 0 20px;box-shadow:0 8px 30px rgba(37,99,235,.08)}
.tool-frame .tf-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;background:#eff6ff;border-bottom:1px solid #bfdbfe;font-size:13px;font-weight:700;color:#1e40af}
.tool-frame iframe{display:block;width:100%;border:0;min-height:760px}
@media(min-width:1024px){.tool-frame iframe{min-height:620px}}
table.spec{width:100%;border-collapse:collapse;font-size:14px}
table.spec th,table.spec td{padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:left;vertical-align:top}
table.spec th{color:#64748b;font-weight:600;width:42%}
table.spec td{font-weight:700;font-family:ui-monospace,Menlo,monospace}
.tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
table.grid{width:100%;border-collapse:collapse;font-size:13.5px;min-width:560px}
table.grid th{background:#0f172a;color:#fff;padding:9px 12px;text-align:left;font-weight:700;white-space:nowrap}
table.grid td{padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#334155}
table.grid tr:nth-child(even) td{background:#f8fafc}
table.grid td.m{font-family:ui-monospace,Menlo,monospace;white-space:nowrap}
.cols{display:grid;grid-template-columns:1fr;gap:20px}
@media(min-width:768px){.cols{grid-template-columns:1fr 1fr}}
.btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font-weight:700;border-radius:12px;text-decoration:none;padding:11px 20px;font-size:14px}
.btn.alt{background:linear-gradient(135deg,#475569,#334155)}
.links{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.links a{display:inline-block;font-size:13px;color:#1d4ed8;background:#eff6ff;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;text-decoration:none}
.links a:hover{background:#dbeafe}
.check{list-style:none;padding:0;margin:0}
.check li{padding:6px 0 6px 28px;position:relative}
.check li:before{content:'✓';position:absolute;left:4px;color:#16a34a;font-weight:900}
.check.x li:before{content:'✗';color:#dc2626}
details.faq{border:1px solid #e2e8f0;border-radius:12px;background:#fff;margin:0 0 10px}
details.faq summary{font-weight:700;font-size:14.5px;padding:14px 16px;cursor:pointer;list-style:none}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary:after{content:'+';float:right;color:#94a3b8;font-weight:900}
details.faq[open] summary:after{content:'–'}
details.faq .a{padding:0 16px 14px;font-size:14.5px;color:#475569}
.note{font-size:12.5px;color:#64748b;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;padding:10px 12px}
.ad-slot{max-width:760px;margin:24px auto;padding:0}
.ad-label{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.12em;margin:0 0 6px}
.ad-box{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:12px;min-height:274px}
.decl{font-family:Georgia,serif;font-size:15px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;color:#422006}
footer.foot{background:#0a0e1a;color:rgba(255,255,255,.55);margin-top:32px;padding:28px 16px;text-align:center;font-size:12.5px}
footer.foot a{color:rgba(255,255,255,.6);text-decoration:none}
@media(max-width:639px){.hero{padding:18px 16px 16px}.lede,.hero .chip.ok{display:none}.crumbs{font-size:11px;margin-bottom:8px}.updated{margin-top:10px;font-size:11px}.answer{padding:12px 14px}.answer p{font-size:14.5px}.tool-frame .tf-head span:last-child{display:none}}
footer.foot nav{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;margin:10px 0}
`;

const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'ILoveExams', url: `${SITE}/`, logo: `${SITE}/favicon.svg` };

/**
 * head({ title, desc, canonical, schema: [..], extraHead })
 */
function head({ title, desc, canonical, schema = [], ogTitle, extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-adsense-account" content="${AD_CLIENT}">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta name="author" content="ILoveExams">
  <meta name="theme-color" content="#0a0e1a">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ILoveExams">
  <meta property="og:title" content="${esc(ogTitle || title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitle || title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
  <style>${BASE_CSS.replace(/\n/g, '')}</style>
  ${schema.map(jsonLd).join('\n  ')}
  ${extraHead}
</head>
<body>
<nav class="nav" aria-label="Main">
  <div class="nav-in">
    <a href="/" class="logo" aria-label="ILoveExams home"><span class="logo-t">I</span>${SVG_HEART}<span class="logo-t">Exams</span><span class="logo-in">.in</span></a>
    <div class="nav-links">
      <a href="/resizer/">Exam Resizer</a>
      <a href="/resizer/photo-signature-size-chart/">Size Chart ${YEAR}</a>
      <a href="/resizer/size/">By Pixel Size</a>
      <a href="/resizer/guides/">Guides</a>
      <a href="/">All Tools</a>
    </div>
    <a class="donate" href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener">♥ Donate</a>
  </div>
</nav>`;
}

function crumbsHtml(items) {
  return `<p class="crumbs">${items.map((c, i) => i === items.length - 1 ? `<span>${esc(c.name)}</span>` : `<a href="${c.url.replace(SITE, '')}">${esc(c.name)}</a>`).join(' › ')}</p>`;
}
function crumbsSchema(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) };
}

// Embedded resizer (the engine in ?embed=1 mode). Grows to fit its content.
function toolFrame(src, heading) {
  return `<section class="tool-frame" id="resize-tool" aria-label="${esc(heading)}">
  <div class="tf-head"><span>⚡ ${esc(heading)}</span><span style="font-weight:600;color:#16a34a">● 100% private · in your browser</span></div>
  <iframe src="${src}" title="${esc(heading)}" loading="eager" allow="clipboard-write" referrerpolicy="same-origin"></iframe>
</section>
<script>
addEventListener('message', function (e) {
  if (e.origin !== location.origin || !e.data || e.data.type !== 'ilx-embed-height') return;
  var f = document.querySelector('#resize-tool iframe');
  if (f) { f.style.minHeight = '0'; f.style.height = Math.max(420, e.data.h) + 'px'; }
});
</script>`;
}

function faqHtml(faqs) {
  return faqs.map(f => `<details class="faq"><summary>${esc(f.q)}</summary><div class="a">${f.a}</div></details>`).join('\n');
}
function faqSchema(faqs) {
  const strip = h => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })) };
}

function webPageSchema({ url, name, desc, crumbs }) {
  return { '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url, name, description: desc,
    inLanguage: 'en-IN', dateModified: ISO_DATE, isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'ILoveExams', url: `${SITE}/` },
    publisher: ORG, breadcrumb: crumbsSchema(crumbs) };
}
function appSchema({ url, name, desc }) {
  return { '@context': 'https://schema.org', '@type': 'WebApplication', name, url, description: desc,
    applicationCategory: 'MultimediaApplication', operatingSystem: 'Any (runs in the browser)', browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: ORG };
}

function footer(extraLinks = []) {
  const links = [
    { href: '/resizer/', t: 'Exam Photo Resizer' },
    { href: '/resizer/photo-signature-size-chart/', t: `Exam Size Chart ${YEAR}` },
    { href: '/resizer/size/', t: 'Resize by Pixels' },
    ...extraLinks,
    { href: '/resizer/guides/', t: 'Guides' },
    { href: '/', t: 'All Tools' }, { href: '/about/', t: 'About' }, { href: '/contact/', t: 'Contact' },
    { href: '/privacy/', t: 'Privacy' }, { href: '/terms/', t: 'Terms' },
  ];
  return `<footer class="foot">
  <a href="/" class="logo" style="justify-content:center"><span class="logo-t" style="font-size:20px">I</span>${SVG_HEART}<span class="logo-t" style="font-size:20px">Exams</span><span class="logo-in">.in</span></a>
  <nav aria-label="Footer">${links.map(l => `<a href="${l.href}">${esc(l.t)}</a>`).join('')}</nav>
  <p style="margin:0;color:rgba(255,255,255,.35)">Free photo &amp; signature resizer for 80+ Indian exams. Images are processed in your browser and never uploaded.</p>
</footer>
</body>
</html>`;
}

// Physical size helpers (for "px to cm" answers)
const toCm = (px, dpi) => (px * 2.54 / dpi).toFixed(2);
const ratio = (w, h) => { const g = (a, b) => b ? g(b, a % b) : a; const d = g(w, h); const r = `${w / d}:${h / d}`; return r.length > 7 ? (w / h).toFixed(2) + ':1' : r; };

module.exports = { SITE, ISO_DATE, YEAR, YEARS, SPAN_NEXT, NEXT_YEAR, MONTH_YEAR, esc, jsonLd, adSlot, head, footer, crumbsHtml, crumbsSchema, toolFrame, faqHtml, faqSchema, webPageSchema, appSchema, toCm, ratio };
