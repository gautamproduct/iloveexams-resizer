#!/usr/bin/env bash
# Rebuild every generated page, the compiled CSS and the sitemaps — in this order.
#   ./build.sh            (needs Node 18+; Tailwind is fetched by npx on first run)
# Then commit + push, and after GitHub Pages deploys:  node indexnow.js
set -euo pipefail
cd "$(dirname "$0")"
for g in generate-tools.js generate-exam-age-pages.js generate-legal.js generate-exam-photo-pages.js \
         generate-pages.js generate-seo-hubs.js generate-guides.js generate-apps.js; do
  node "$g"
done
# Compile only the Tailwind classes the pages use (replaces the 400 KB CDN runtime)
npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i tailwind.input.css -o assets/tw.css --minify
# Last: sitemaps + site-wide post-processing (menu, AdSense meta)
node generate-sitemap.js
