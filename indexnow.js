#!/usr/bin/env node
/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver…) with every URL in sitemap.xml —
 * or only the URLs you pass as arguments. Run AFTER the site is deployed:
 *   node indexnow.js                      # all sitemap URLs
 *   node indexnow.js /resizer/size/       # specific paths
 * The key file /b5558b2b4fd744c833302931f2efb38f.txt must stay in the site root.
 */
const fs = require('fs');
const KEY = 'b5558b2b4fd744c833302931f2efb38f';
const HOST = 'ilovexams.in';

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map(p => `https://${HOST}${p.startsWith('/') ? p : '/' + p}`)
  : [...fs.readFileSync(__dirname + '/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
}).then(r => console.log(`IndexNow: HTTP ${r.status} for ${urlList.length} URLs (200/202 = accepted)`))
  .catch(e => { console.error('IndexNow failed:', e.message); process.exit(1); });
