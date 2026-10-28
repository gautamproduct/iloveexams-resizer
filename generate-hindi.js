#!/usr/bin/env node
/**
 * Hindi versions of the exam photo & signature pages with the most Hindi-belt search demand:
 *   /hi/resizer/{slug}-photo-resize/  and  /hi/resizer/{slug}-signature-resize/
 * Same tool and sizes as the English page (exams-data.js); hreflang links both ways are added
 * by generate-sitemap.js. Run: node generate-hindi.js
 */
const fs = require('fs');
const path = require('path');
const S = require('./seo-shell');
const { EXAMS, seoOf } = require('./exams-data');
const { SITE, YEARS: YEAR, MONTH_YEAR, esc } = S;

const ROOT = __dirname;
const write = (rel, html) => {
  fs.mkdirSync(path.join(ROOT, rel), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel, 'index.html'), html, 'utf8');
};

const HINDI_EXAMS = ['ssc-gd', 'ssc-cgl', 'ssc-chsl', 'ssc-mts', 'ssc-cpo', 'upsc', 'upsc-nda', 'rrb-ntpc', 'rrb-group-d', 'rrb-alp',
  'rrb-je', 'up-police', 'upsssc-pet', 'uppsc', 'bpsc', 'csbc-bihar-police', 'bpssc', 'mppsc', 'rsmssb', 'reet', 'rpsc', 'ctet',
  'ibps-po', 'ibps-clerk', 'sbi-po', 'sbi-clerk', 'ibps-rrb-po', 'ibps-rrb-clerk', 'neet-ug', 'jee-main', 'cuet', 'post-gds',
  'delhi-police', 'ukpsc', 'jnvst', 'aissee', 'hpsc', 'jpsc', 'cgpsc', 'dsssb', 'afcat', 'ugc-net'];

let n = 0;
for (const slug of HINDI_EXAMS) {
  const exam = EXAMS.find(e => e.slug === slug);
  if (!exam) { console.error(`❌ generate-hindi: unknown exam ${slug}`); process.exit(1); }
  const short = seoOf(exam).short;
  for (const doc of ['photo', 'signature']) {
    const sp = exam[doc === 'photo' ? 'photo' : 'sig'];
    const other = doc === 'photo' ? 'signature' : 'photo';
    const osp = exam[doc === 'photo' ? 'sig' : 'photo'];
    const hiDoc = doc === 'photo' ? 'फोटो' : 'सिग्नेचर';
    const hiOther = doc === 'photo' ? 'सिग्नेचर' : 'फोटो';
    const dir = `${slug}-${doc}-resize`;
    const canonical = `${SITE}/hi/resizer/${dir}/`;
    const title = `${short} ${hiDoc} साइज ${YEAR}: ${sp.w}×${sp.h} px, ${sp.min}–${sp.max} KB – फ्री रिसाइज़र`;
    const desc = `${short} ${hiDoc} का साइज ${sp.w}×${sp.h} पिक्सल और ${sp.min}–${sp.max} KB (JPG) होना चाहिए। अपनी ${hiDoc} यहाँ फ्री में सही साइज में बदलें — कोई अपलोड नहीं, मोबाइल पर चलता है।`;
    const crumbs = [{ name: 'होम', url: `${SITE}/` }, { name: 'एग्जाम रिसाइज़र', url: `${SITE}/resizer/` }, { name: `${short} ${hiDoc} साइज`, url: canonical }];
    const faqs = [
      { q: `${short} ${hiDoc} का साइज कितना होना चाहिए?`, a: `${sp.w} पिक्सल चौड़ा × ${sp.h} पिक्सल ऊँचा, फाइल साइज ${sp.min} KB से ${sp.max} KB के बीच, फॉर्मेट JPG/JPEG।` },
      { q: `${short} ${hiDoc} को ${sp.max} KB से कम कैसे करें?`, a: `ऊपर वाले टूल में अपनी ${hiDoc} चुनें — यह अपने आप ${sp.w}×${sp.h} px और ${sp.min}–${sp.max} KB में बदल देता है। फाइल आपके फोन/कंप्यूटर से बाहर नहीं जाती।` },
      { q: `${short} ${hiOther} का साइज क्या है?`, a: `${hiOther}: ${osp.w}×${osp.h} px, ${osp.min}–${osp.max} KB, JPG। <a href="/hi/resizer/${slug}-${other}-resize/">${short} ${hiOther} रिसाइज़ करें</a>।` },
      { q: 'फॉर्म में फोटो रिजेक्ट क्यों होती है?', a: 'ज़्यादातर गलत पिक्सल साइज, KB सीमा से कम या ज़्यादा फाइल, PNG/HEIC फॉर्मेट, या धुंधली फोटो की वजह से। सही साइज में बदलने के बाद ही अपलोड करें।' },
      { q: 'क्या यह टूल फ्री है?', a: 'हाँ, पूरी तरह फ्री। कोई साइन-अप नहीं, कोई वॉटरमार्क नहीं, और आपकी फोटो किसी सर्वर पर अपलोड नहीं होती।' },
    ];
    const html = S.head({ title, desc, canonical, schema: [S.webPageSchema({ url: canonical, name: title, desc, crumbs }), S.faqSchema(faqs)] })
      .replace('<html lang="en-IN">', '<html lang="hi-IN">').replace('content="en_IN"', 'content="hi_IN"') + `
<header class="hero lt"><div class="hero-in">
  ${S.crumbsHtml(crumbs)}
  <h1>${esc(short)} ${hiDoc} साइज ${YEAR} — फ्री ऑनलाइन रिसाइज़र</h1>
  <p class="lede">अपनी ${esc(short)} ${hiDoc} को <strong>${sp.w}×${sp.h} px</strong> और <strong>${sp.min}–${sp.max} KB</strong> में बदलें — फ्री, तुरंत और 100% प्राइवेट।</p>
  <div class="trust"><span>✔ सही ${esc(short)} साइज</span><span>✔ अपने आप KB कम</span><span>✔ कोई अपलोड नहीं</span></div>
  <p class="updated">✓ आधिकारिक नोटिफिकेशन से मिलाया गया · अपडेट: <time datetime="${S.ISO_DATE}">${MONTH_YEAR}</time> · <a href="/resizer/${dir}/">English</a></p>
</div></header>
<main class="wrap">
  ${S.toolFrame(`/resizer/?exam=${slug}&document=${doc}&embed=1`, `${short} ${hiDoc} रिसाइज़र — ${sp.w}×${sp.h}px, ${sp.min}–${sp.max} KB`)}
  <div class="answer"><p><strong>${esc(exam.name)} ${hiDoc}</strong> का साइज <strong>${sp.w} × ${sp.h} पिक्सल</strong> (चौड़ाई × ऊँचाई) और फाइल साइज <strong>${sp.min} KB से ${sp.max} KB</strong> के बीच, <strong>JPG</strong> फॉर्मेट में होना चाहिए। ऊपर अपनी ${hiDoc} चुनें — एक क्लिक में सही साइज।</p></div>
  <section class="card"><h2>${esc(short)} ${hiDoc} की ज़रूरी शर्तें</h2>
    <table class="spec"><tr><th scope="row">चौड़ाई</th><td>${sp.w} px</td></tr><tr><th scope="row">ऊँचाई</th><td>${sp.h} px</td></tr><tr><th scope="row">फाइल साइज</th><td>${sp.min}–${sp.max} KB</td></tr><tr><th scope="row">फॉर्मेट</th><td>JPG / JPEG</td></tr></table>
  </section>
  <section class="card"><h2>3 आसान स्टेप</h2><ol>
    <li>ऊपर टूल में अपनी ${hiDoc} चुनें (फोन की फोटो, स्कैन या स्क्रीनशॉट)।</li>
    <li>${doc === 'photo' ? 'चेहरा बीच में रखकर क्रॉप करें — सफेद या हल्का बैकग्राउंड रखें।' : 'सफेद कागज़ पर काले/नीले पेन से किया सिग्नेचर क्रॉप करें।'}</li>
    <li>डाउनलोड करें और फॉर्म में अपलोड करें। नोटिफिकेशन में साइज अलग हो तो टूल में बदल लें।</li>
  </ol></section>
  <section style="margin:0 0 20px"><h2 style="font-size:19px;font-weight:800;margin:8px 0 12px">अक्सर पूछे जाने वाले सवाल</h2>${S.faqHtml(faqs)}</section>
  <section class="card"><h2>और एग्जाम</h2><ul class="links">${HINDI_EXAMS.filter(s => s !== slug).slice(0, 24).map(s => `<li><a href="/hi/resizer/${s}-${doc}-resize/">${esc(seoOf(EXAMS.find(e => e.slug === s)).short)} ${hiDoc}</a></li>`).join('')}<li><a href="/resizer/exam-forms-open-now/">अभी खुले फॉर्म</a></li></ul></section>
</main>
${S.footer()}`;
    write(`hi/resizer/${dir}`, html); n++;
  }
}
console.log(`✅ Generated ${n} Hindi exam pages`);
