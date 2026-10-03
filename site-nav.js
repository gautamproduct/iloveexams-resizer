/**
 * Site shell shared by every page (applied by generate-sitemap.js as the last build step):
 *  • top menu  — Exam Resizer · Resize to 50 KB · Compress Image · Tools ▾  (+ ☰ menu on phones/tablets)
 *  • footer    — one rich footer with the key sections
 *  • theme     — small global polish layer (type, focus rings, hero, selection)
 * Plain CSS + a few lines of JS — no framework needed, works on every page family.
 */

const LINKS = [
  { href: '/resizer/', t: 'Exam Resizer' },
  { href: '/resize-image-to-50kb/', t: 'Resize to 50 KB' },
  { href: '/compress-image/', t: 'Compress Image' },
];
const TOOLS = [
  { href: '/#id', t: '🪪 ID Card — Voter, Aadhaar, PAN' },
  { href: '/#kb', t: '💾 By File Size — 10–500 KB' },
  { href: '/#dim', t: '📐 By Dimension — cm, inch, custom' },
  { href: '/pdf-tools/', t: '📄 PDF Tools — compress, merge, split' },
  { href: '/exam-calculators/', t: '🧮 Exam Calculators — score, rank' },
];
// Phone menu: bigger, task-first list
const MOBILE = [
  { href: '/resizer/', t: '📷 Exam photo & signature resizer' },
  { href: '/resizer/photo-signature-size-chart/', t: '📊 Exam size chart' },
  { href: '/resize-image-to-50kb/', t: '💾 Resize image to 50 KB' },
  { href: '/compress-image/', t: '🗜 Compress image' },
  { href: '/pdf-tools/', t: '📄 PDF tools' },
  { href: '/exam-calculators/', t: '🧮 Exam score calculators' },
  { href: '/resizer/guides/', t: '📖 Guides' },
  { href: '/#all', t: '🧰 All tools' },
];

const HEART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:20px;height:20px;margin:0 1px 3px;vertical-align:middle" aria-hidden="true"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CSS = `<style id="ilx-nav-css">
/* ── Theme polish (all pages) ── */
html{-webkit-text-size-adjust:100%;text-rendering:optimizeLegibility}
body,button,input,select,textarea{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif!important}
body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::selection{background:#bfdbfe;color:#0f172a}
:focus-visible{outline:3px solid #60a5fa;outline-offset:2px;border-radius:6px}
.ad-slot:has(ins[data-ad-status="unfilled"]),.ad-wrap:has(ins[data-ad-status="unfilled"]){display:none!important}
a,button{-webkit-tap-highlight-color:transparent}
.hero:not(.lt){background:radial-gradient(900px 340px at 8% -20%,rgba(59,130,246,.34),transparent 62%),radial-gradient(700px 300px at 100% -10%,rgba(236,72,153,.16),transparent 60%),linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%)!important}
[id]{scroll-margin-top:76px}
/* ── Menu ── */
.ilx-nav{display:flex;align-items:center;gap:22px;font-size:13.5px;font-weight:600}
.ilx-nav>a,.ilx-dd>button{color:var(--ilx-nav-fg,rgba(255,255,255,.78));text-decoration:none;background:none;border:0;cursor:pointer;font:inherit;padding:0;transition:color .15s}
.ilx-nav>a:hover,.ilx-dd>button:hover{color:var(--ilx-nav-hover,#fff)}
.ilx-dd{position:relative;padding:18px 0}
.ilx-dd>button{display:flex;align-items:center;gap:5px}
.ilx-dd-menu{display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);background:#fff;border-radius:14px;box-shadow:0 18px 44px rgba(2,6,23,.22);border:1px solid #e2e8f0;padding:8px;min-width:262px;z-index:60}
.ilx-dd:hover .ilx-dd-menu,.ilx-dd:focus-within .ilx-dd-menu{display:block}
.ilx-dd.ilx-closed .ilx-dd-menu{display:none!important}
.ilx-dd-menu a{display:block;padding:9px 12px;border-radius:8px;text-decoration:none;color:#0f172a;font-size:13px;font-weight:600;white-space:nowrap}
.ilx-dd-menu a:hover{background:#f1f5f9}
.ilx-dd-menu hr{border:0;height:1px;background:#e2e8f0;margin:6px 8px}
.ilx-dd-menu a.all{color:#2563eb;font-weight:700}
.ilx-burger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;font-size:18px;cursor:pointer;margin-left:auto}
.ilx-mnav{display:none;position:fixed;left:10px;right:10px;top:64px;z-index:90;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(2,6,23,.35);padding:8px;max-height:calc(100vh - 80px);overflow-y:auto}
.ilx-mnav.open{display:block;animation:ilxIn .16s ease-out}
.ilx-mnav a{display:flex;align-items:center;padding:14px 14px;border-radius:12px;color:#0f172a;text-decoration:none;font-size:15.5px;font-weight:650;font-weight:600;border-bottom:1px solid #f1f5f9}
.ilx-mnav a:last-child{border-bottom:0}
.ilx-mnav .mi{width:34px;height:34px;border-radius:10px;background:#f1f5f9;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:17px;flex-shrink:0}
.ilx-mnav a:active,.ilx-mnav a:hover{background:#eff6ff}
@keyframes ilxIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@media(max-width:1023px){.ilx-nav{gap:0;margin-left:auto;margin-right:8px}.ilx-nav>a,.ilx-nav>.ilx-dd{display:none}.ilx-burger{display:inline-flex}}
/* ── Standard header (pages that had a light header) ── */
.ilx-hdr{background:rgba(10,14,26,.94);-webkit-backdrop-filter:saturate(160%) blur(12px);backdrop-filter:saturate(160%) blur(12px);border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;z-index:50}
.ilx-hdr-in{max-width:1080px;margin:0 auto;padding:0 16px;height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.ilx-logo{display:flex;align-items:center;text-decoration:none;color:#fff;font-size:22px;font-weight:900;letter-spacing:-.5px}
.ilx-logo small{font-size:12px;color:rgba(255,255,255,.35);font-weight:500;margin-left:2px;align-self:flex-end;margin-bottom:3px}
.ilx-donate{font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:7px 14px;border-radius:999px;text-decoration:none;white-space:nowrap;box-shadow:0 4px 14px rgba(239,68,68,.3)}
/* ── Footer ── */
.ilx-foot{background:#070b16;color:rgba(255,255,255,.6);margin-top:40px;font-size:13.5px}
.ilx-foot-in{max-width:1080px;margin:0 auto;padding:44px 16px 26px}
.ilx-foot-grid{display:grid;grid-template-columns:1.4fr repeat(4,1fr);gap:28px}
.ilx-foot h4{color:#fff;font-size:13px;font-weight:800;letter-spacing:.02em;margin:0 0 12px}
.ilx-foot ul{list-style:none;margin:0;padding:0}
.ilx-foot li{margin:0 0 8px}
.ilx-foot a{color:rgba(255,255,255,.62);text-decoration:none}
.ilx-foot a:hover{color:#fff}
.ilx-foot .brand p{margin:10px 0 14px;line-height:1.6;max-width:300px}
.ilx-foot .trust{display:flex;flex-wrap:wrap;gap:6px}
.ilx-foot .trust span{font-size:11.5px;font-weight:600;color:#86efac;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.22);padding:4px 10px;border-radius:999px}
.ilx-foot-bottom{border-top:1px solid rgba(255,255,255,.08);margin-top:30px;padding-top:18px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font-size:12.5px;color:rgba(255,255,255,.42)}
@media(max-width:900px){.ilx-foot-grid{grid-template-columns:1fr 1fr}.ilx-foot .brand{grid-column:1/-1}}
</style>`;

const SCRIPT = `<script>(function(){var root=document.currentScript.previousElementSibling,dd=root.querySelector('.ilx-dd'),b=root.querySelector('.ilx-burger'),m=root.querySelector('.ilx-mnav');
if(dd){dd.addEventListener('mouseleave',function(){dd.classList.remove('ilx-closed')});
dd.querySelector('.ilx-dd-menu').addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;dd.classList.add('ilx-closed');if(document.activeElement)document.activeElement.blur();
if(location.pathname==='/'&&a.getAttribute('href').indexOf('/#')===0&&typeof window.applyHashFilter==='function'){e.preventDefault();history.replaceState(null,'',a.getAttribute('href').slice(1));window.applyHashFilter();}});}
if(b&&m){var set=function(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');b.textContent=o?'✕':'☰';};
b.addEventListener('click',function(e){e.stopPropagation();set(!m.classList.contains('open'));});
document.addEventListener('click',function(e){if(!e.target.closest('.ilx-mnav'))set(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
m.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;set(false);
if(location.pathname==='/'&&a.getAttribute('href').indexOf('/#')===0&&typeof window.applyHashFilter==='function'){e.preventDefault();history.replaceState(null,'',a.getAttribute('href').slice(1));window.applyHashFilter();}});}})();</script>`;

function navHtml(light) {
  const vars = light ? ' style="--ilx-nav-fg:#475569;--ilx-nav-hover:#4f46e5"' : '';
  return `<div class="ilx-nav"${vars}>
      ${LINKS.map(l => `<a href="${l.href}">${l.t}</a>`).join('\n      ')}
      <div class="ilx-dd">
        <button type="button" aria-haspopup="true">Tools <span style="font-size:8px;opacity:.7">▼</span></button>
        <div class="ilx-dd-menu">
          ${TOOLS.map(l => `<a href="${l.href}">${l.t}</a>`).join('\n          ')}
          <hr>
          <a class="all" href="/#all">View all tools →</a>
        </div>
      </div>
      <button type="button" class="ilx-burger" aria-label="Open menu" aria-expanded="false">☰</button>
      <nav class="ilx-mnav" aria-label="Menu">${MOBILE.map(l => { const [ic, ...rest] = l.t.split(' '); return `<a href="${l.href}"><span class="mi" aria-hidden="true">${ic}</span>${rest.join(' ')}</a>`; }).join('')}</nav>
    </div>${SCRIPT}`;
}

const HEADER = `<header class="ilx-hdr"><div class="ilx-hdr-in">
    <a href="/" class="ilx-logo" aria-label="ILoveExams home">I${HEART}Exams<small>.in</small></a>
    ${navHtml(false)}
    <a class="ilx-donate" href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener">♥ Donate</a>
  </div></header>`;

const FOOTER = `<footer class="ilx-foot"><div class="ilx-foot-in">
  <div class="ilx-foot-grid">
    <div class="brand">
      <a href="/" class="ilx-logo" aria-label="ILoveExams home">I${HEART}Exams<small>.in</small></a>
      <p>Free photo, signature, PDF and exam tools for Indian competitive exams. Everything runs in your browser — your files never leave your device.</p>
      <div class="trust"><span>✓ 100% free</span><span>✓ No upload</span><span>✓ No sign-up</span></div>
    </div>
    <div><h4>Exam resizer</h4><ul>
      <li><a href="/resizer/">All 80+ exams</a></li><li><a href="/resizer/photo-signature-size-chart/">Size chart</a></li>
      <li><a href="/resizer/ssc-cgl-photo-resize/">SSC CGL photo</a></li><li><a href="/resizer/neet-ug-photo-resize/">NEET photo</a></li>
      <li><a href="/resizer/ibps-po-signature-resize/">IBPS signature</a></li><li><a href="/resizer/size/">By pixel size</a></li></ul></div>
    <div><h4>Image tools</h4><ul>
      <li><a href="/resize-image-to-20kb/">Resize to 20 KB</a></li><li><a href="/resize-image-to-50kb/">Resize to 50 KB</a></li>
      <li><a href="/compress-image/">Compress image</a></li><li><a href="/jpg-resize/">JPG resize</a></li>
      <li><a href="/heic-to-jpg/">HEIC to JPG</a></li><li><a href="/photo-with-name-and-date/">Photo with name &amp; date</a></li></ul></div>
    <div><h4>PDF tools</h4><ul>
      <li><a href="/compress-pdf/">Compress PDF</a></li><li><a href="/compress-pdf-to-200kb/">PDF to 200 KB</a></li>
      <li><a href="/merge-pdf/">Merge PDF</a></li><li><a href="/unlock-pdf/">Unlock PDF</a></li>
      <li><a href="/image-to-pdf/">JPG to PDF</a></li><li><a href="/pdf-tools/">All PDF tools</a></li></ul></div>
    <div><h4>Exam help</h4><ul>
      <li><a href="/exam-calculators/">Score calculators</a></li><li><a href="/jee-main-rank-predictor/">JEE rank predictor</a></li>
      <li><a href="/age-calculator/">Age calculator</a></li><li><a href="/typing-test/">Typing test</a></li>
      <li><a href="/resizer/guides/">Guides</a> · <a href="/resizer/updates/">Size updates</a></li><li><a href="/embed/">Add our tool to your site</a></li><li><a href="/about/">About</a> · <a href="/contact/">Contact</a></li></ul></div>
  </div>
  <div class="ilx-foot-bottom"><span>© ${new Date().getFullYear()} ILoveExams.in · Not affiliated with any exam body</span><span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener">♥ Donate</a></span></div>
</div></footer>`;

// Find the element starting at `start` and return the index just past its matching close tag.
function matchClose(html, start, tag) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  return -1;
}

// Known centre-menu containers across the site's page families.
const CONTAINERS = [
  { re: /<div class="ilx-nav"[^>]*>/, tag: 'div', light: null, withScript: true },                 // already normalised
  { re: /<div class="hidden (?:md|lg):flex items-center" style="gap:\d+px;font-size:13\.5px;font-weight:600">/, tag: 'div', light: false },
  { re: /<div class="nav-links">/, tag: 'div', light: false },                                         // seo-shell pages (older builds)
];

function normalizeNav(html) {
  // Pages with the old light header get the standard dark header instead
  const lh = html.search(/<header class="bg-white border-b border-gray-200 sticky top-0 z-50">/);
  if (lh >= 0) { const end = matchClose(html, lh, 'header'); if (end > 0) html = html.slice(0, lh) + HEADER + html.slice(end); }
  for (const c of CONTAINERS) {
    const m = c.re.exec(html);
    if (!m) continue;
    let end = matchClose(html, m.index, c.tag);
    if (end < 0) break;
    const light = c.light === null ? /--ilx-nav-fg:#475569/.test(m[0]) : c.light;
    if (c.withScript && html.startsWith('<script>(function(){var ', end)) end = html.indexOf('</script>', end) + 9;
    html = html.slice(0, m.index) + navHtml(light) + html.slice(end);
    break;
  }
  // One footer everywhere (replace the page's last <footer>)
  const fi = html.lastIndexOf('<footer');
  if (fi >= 0) { const fe = matchClose(html, fi, 'footer'); if (fe > 0) html = html.slice(0, fi) + FOOTER + html.slice(fe); }
  // No web fonts: system fonts render instantly (no flash of re-styled text)
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>\s*/g, '')
             .replace(/<link[^>]+href="https:\/\/fonts\.googleapis\.com\/[^"]*"[^>]*>\s*/g, '')
             .replace(/@import url\(['"]?https:\/\/fonts\.googleapis\.com\/[^)]*\);?/g, '');
  // Theme + menu CSS once per page (refresh if already present)
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin><link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^>]*>\s*<style id="ilx-nav-css">[\s\S]*?<\/style>\n?|<style id="ilx-nav-css">[\s\S]*?<\/style>\n?/, '');
  html = html.replace('</head>', `${CSS}\n</head>`);
  return html;
}

module.exports = { normalizeNav, navHtml, CSS, FOOTER };
