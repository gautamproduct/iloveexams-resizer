// Compiles the Tailwind classes used across the site into /assets/tw.css
// (replaces the 400 KB cdn.tailwindcss.com runtime). Rebuild after changing classes:
//   npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o assets/tw.css --minify
module.exports = {
  content: ['./index.html', './*/index.html', './resizer/index.html', './generate-*.js', './site-nav.js'],
  theme: { extend: {} },
  plugins: [],
};
