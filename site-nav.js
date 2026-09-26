/**
 * The one top-bar menu used on every page:
 *   Exam Resizer · Resize to 50 KB · Compress Image · Tools ▾
 * The Tools dropdown is plain CSS + a tiny script (no Tailwind needed), closes
 * after a click, and its links go to /#id, /#kb, /#dim, /#all — the homepage
 * reads the hash, filters the tool grid and scrolls to it.
 *
 * normalizeNav(html) swaps the centre-menu block of any page for this one;
 * generate-sitemap.js runs it over every page as the last build step.
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

const CSS = `<style id="ilx-nav-css">
.ilx-nav{display:none;align-items:center;gap:22px;font-size:13.5px;font-weight:600}
@media(min-width:1024px){.ilx-nav{display:flex}}
.ilx-nav>a,.ilx-dd>button{color:var(--ilx-nav-fg,rgba(255,255,255,.75));text-decoration:none;background:none;border:0;cursor:pointer;font:inherit;padding:0}
.ilx-nav>a:hover,.ilx-dd>button:hover{color:var(--ilx-nav-hover,#fff)}
.ilx-dd{position:relative;padding:18px 0}
.ilx-dd>button{display:flex;align-items:center;gap:5px}
.ilx-dd-menu{display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.22);padding:8px;min-width:250px;z-index:60}
.ilx-dd:hover .ilx-dd-menu,.ilx-dd:focus-within .ilx-dd-menu{display:block}
.ilx-dd.ilx-closed .ilx-dd-menu{display:none!important}
.ilx-dd-menu a{display:block;padding:9px 12px;border-radius:8px;text-decoration:none;color:#0f172a;font-size:13px;font-weight:600;white-space:nowrap}
.ilx-dd-menu a:hover{background:#f1f5f9}
.ilx-dd-menu hr{border:0;height:1px;background:#e2e8f0;margin:6px 8px}
.ilx-dd-menu a.all{color:#2563eb;font-weight:700}
</style>`;

const SCRIPT = `<script>(function(){var dd=document.currentScript.previousElementSibling.querySelector('.ilx-dd');if(!dd)return;
dd.addEventListener('mouseleave',function(){dd.classList.remove('ilx-closed')});
dd.querySelector('.ilx-dd-menu').addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;dd.classList.add('ilx-closed');if(document.activeElement)document.activeElement.blur();
if(location.pathname==='/'&&a.getAttribute('href').indexOf('/#')===0&&typeof window.applyHashFilter==='function'){e.preventDefault();history.replaceState(null,'',a.getAttribute('href').slice(1));window.applyHashFilter();}});})();</script>`;

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
    </div>${SCRIPT}`;
}

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
  { re: /<div class="nav-links">/, tag: 'div', light: false },                                         // seo-shell pages
  { re: /<nav class="hidden sm:flex gap-4 text-sm text-gray-600">/, tag: 'nav', light: true },        // light calculator pages
];

function normalizeNav(html) {
  for (const c of CONTAINERS) {
    const m = c.re.exec(html);
    if (!m) continue;
    let end = matchClose(html, m.index, c.tag);
    if (end < 0) return html;
    const light = c.light === null ? /--ilx-nav-fg:#475569/.test(m[0]) : c.light;
    if (c.withScript && html.startsWith('<script>(function(){var dd=', end)) end = html.indexOf('</script>', end) + 9;
    const replacement = c.tag === 'nav' ? `<nav aria-label="Main">${navHtml(true)}</nav>` : navHtml(light);
    html = html.slice(0, m.index) + replacement + html.slice(end);
    if (!html.includes('id="ilx-nav-css"')) html = html.replace('</head>', `${CSS}\n</head>`);
    return html;
  }
  return html;
}

module.exports = { normalizeNav, navHtml, CSS };
