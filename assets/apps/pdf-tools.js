/* PDF tools — run entirely in the browser with pdf-lib + pdf.js. Nothing is uploaded.
   The page provides <div id="app" data-tool="…"> (plus optional data-target-kb). */
(function () {
  'use strict';
  var app = document.getElementById('app');
  if (!app || !window.ILX) return;
  var tool = app.dataset.tool;
  var X = window.ILX;

  function ui(html) { app.innerHTML = html; return function (sel) { return app.querySelector(sel); }; }
  function dropHtml(multi, label) {
    return '<div class="drop" tabindex="0" role="button" aria-label="' + label + '"><div class="big">📄</div><strong>' + label + '</strong><span>' +
      (multi ? 'Drop PDF files here or tap to choose' : 'Drop a PDF here or tap to choose') + ' · processed on your device, never uploaded</span></div>';
  }
  function fail(st, e) {
    console.error(e);
    var msg = e && e.message || String(e);
    if (/encrypt|password/i.test(msg)) msg = 'This PDF is password-protected. Remove the password first, then try again.';
    X.status(st, '⚠️ ' + msg, true);
  }
  async function openPdfjs(file) {
    var pdfjs = await X.pdfjs();
    return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  }
  async function renderPage(doc, i, scale, maxDim) {
    var page = await doc.getPage(i);
    var vp = page.getViewport({ scale: scale });
    var k = Math.min(1, (maxDim || 3000) / Math.max(vp.width, vp.height));
    if (k < 1) vp = page.getViewport({ scale: scale * k });
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.floor(vp.width)); c.height = Math.max(1, Math.floor(vp.height));
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    // intent 'print' renders without requestAnimationFrame, so it keeps going in background tabs
    await page.render({ canvasContext: ctx, viewport: vp, intent: 'print' }).promise;
    var base = page.getViewport({ scale: 1 });
    page.cleanup();
    return { canvas: c, w: base.width, h: base.height };
  }
  function grayscale(c) {
    var ctx = c.getContext('2d'), d = ctx.getImageData(0, 0, c.width, c.height), p = d.data;
    for (var i = 0; i < p.length; i += 4) { var g = p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114; p[i] = p[i + 1] = p[i + 2] = g; }
    ctx.putImageData(d, 0, 0);
  }

  var tools = {};

  /* ── Compress PDF (optionally to a target KB) ─────────────────────────── */
  tools['compress-pdf'] = function () {
    var preset = +app.dataset.targetKb || 0;
    var $ = ui(dropHtml(false, 'Choose PDF to compress') +
      '<div class="row"><label>Target size:</label><div class="chips-kb">' +
      [0, 100, 200, 300, 500, 1024, 2048].map(function (k) {
        return '<button type="button" data-kb="' + k + '"' + (k === preset ? ' class="on"' : '') + '>' + (k ? (k >= 1024 ? k / 1024 + ' MB' : k + ' KB') : 'Smallest good quality') + '</button>';
      }).join('') + '</div><label style="margin-left:4px">or <input class="inp num" type="number" min="20" placeholder="KB" id="kbx"> KB</label></div>' +
      '<div class="row"><label><input type="checkbox" id="gray"> Black &amp; white (smaller, good for mark sheets &amp; certificates)</label></div>' +
      '<ul class="files" id="fl"></ul><div class="bar hide" id="bar"><i></i></div><div class="status" id="st"></div><div id="res"></div>' +
      '<button class="go" id="go" disabled>Compress PDF</button>');
    var file = null, target = preset;
    app.querySelectorAll('.chips-kb button').forEach(function (b) {
      b.onclick = function () { app.querySelectorAll('.chips-kb button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); target = +b.dataset.kb; $('#kbx').value = ''; };
    });
    $('#kbx').oninput = function () { var v = +this.value; if (v > 0) { target = v; app.querySelectorAll('.chips-kb button').forEach(function (x) { x.classList.remove('on'); }); } };
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, function (f) {
      file = f[0]; $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + X.kb(file.size) + '</span></li>';
      $('#go').disabled = false; $('#res').innerHTML = ''; X.status($('#st'), '');
    });
    $('#go').onclick = async function () {
      var st = $('#st'), bar = $('#bar'), btn = this; btn.disabled = true; bar.classList.remove('hide'); $('#res').innerHTML = '';
      try {
        var tgt = target * 1024;
        if (tgt && file.size <= tgt) {
          X.status(st, 'Your PDF is already ' + X.kb(file.size) + ' — under the ' + X.kb(tgt) + ' target. No compression needed.');
          return showResult(file, file.size, 'Already under target');
        }
        X.status(st, 'Loading PDF tools…');
        var PDFLib = await X.pdfLib(), doc = await openPdfjs(file), n = doc.numPages, gray = $('#gray').checked;
        var scales = tgt ? [1.6, 1.3, 1.05, 0.85, 0.68, 0.55] : [1.4];
        var quals = tgt ? [0.8, 0.68, 0.56, 0.45, 0.36, 0.28, 0.2] : [0.62];
        var best = null;
        for (var si = 0; si < scales.length; si++) {
          var pages = []; // per page: [{q, bytes}]
          for (var i = 1; i <= n; i++) {
            X.status(st, 'Compressing page ' + i + ' of ' + n + (si ? ' (trying smaller size…)' : '') + '…');
            X.progress(bar, ((si * n) + i) / (scales.length * n));
            var r = await renderPage(doc, i, scales[si], 2400);
            if (gray) grayscale(r.canvas);
            var enc = [];
            for (var qi = 0; qi < quals.length; qi++) {
              var b = await X.canvasBlob(r.canvas, 'image/jpeg', quals[qi]);
              enc.push(new Uint8Array(await b.arrayBuffer()));
            }
            pages.push({ w: r.w, h: r.h, enc: enc });
            r.canvas.width = r.canvas.height = 0;
          }
          // Highest quality whose total size fits the target (≈1.2 KB PDF overhead per page)
          var fit = -1;
          for (var q = 0; q < quals.length; q++) {
            var total = 2048 + pages.reduce(function (s, p) { return s + p.enc[q].length + 1200; }, 0);
            if (!tgt || total <= tgt) { fit = q; break; }
          }
          if (fit >= 0) { best = { pages: pages, q: fit }; break; }
          best = { pages: pages, q: quals.length - 1, over: true }; // smallest so far; try a lower resolution next
        }
        X.status(st, 'Building PDF…');
        var out = await PDFLib.PDFDocument.create();
        for (var p = 0; p < best.pages.length; p++) {
          var pg = best.pages[p], img = await out.embedJpg(best.pages[p].enc[best.q]);
          out.addPage([pg.w, pg.h]).drawImage(img, { x: 0, y: 0, width: pg.w, height: pg.h });
        }
        var bytes = await out.save({ useObjectStreams: true });
        var blob = new Blob([bytes], { type: 'application/pdf' });
        X.progress(bar, 1);
        if (!tgt && blob.size >= file.size) {
          X.status(st, 'This PDF is already well compressed — the original is smaller, so we kept it.');
          return showResult(file, file.size, 'Original kept');
        }
        X.status(st, best.over ? '⚠️ Could not reach ' + X.kb(tgt) + ' without making pages unreadable — this is the smallest readable version. Try Black & white, or split the PDF.' :
          'Done! Pages were re-saved as optimised images (text is no longer selectable).', !!best.over);
        showResult(blob, blob.size, Math.round((1 - blob.size / file.size) * 100) + '% smaller');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
    function showResult(blob, size, note) {
      $('#res').innerHTML = '<div class="result"><div class="big">' + X.kb(size) + '</div><div class="sub">Original ' + X.kb(file.size) + ' · ' + note + '</div><div class="row"><button class="go ok" id="dl">⬇ Download PDF</button></div></div>';
      $('#dl').onclick = function () { X.download(blob, X.baseName(file.name) + '-compressed.pdf'); };
    }
  };

  /* ── Merge PDF ─────────────────────────────────────────────────────────── */
  tools['merge-pdf'] = function () {
    var $ = ui(dropHtml(true, 'Choose PDFs to merge') + '<ul class="files" id="fl"></ul><div class="status" id="st"></div><button class="go" id="go" disabled>Merge PDFs</button>');
    var files = [];
    function draw() {
      $('#fl').innerHTML = files.map(function (f, i) {
        return '<li><span>' + (i + 1) + '.</span><span class="nm">' + X.esc(f.name) + '</span><span class="sz">' + X.kb(f.size) + '</span>' +
          '<button class="mini" data-up="' + i + '" aria-label="Move up">▲</button><button class="mini" data-dn="' + i + '" aria-label="Move down">▼</button><button class="mini" data-rm="' + i + '" aria-label="Remove">✕</button></li>';
      }).join('');
      $('#go').disabled = files.length < 2;
      X.status($('#st'), files.length === 1 ? 'Add at least one more PDF.' : '');
    }
    $('#fl').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var i;
      if ((i = b.dataset.up) !== undefined && +i > 0) files.splice(+i - 1, 0, files.splice(+i, 1)[0]);
      if ((i = b.dataset.dn) !== undefined && +i < files.length - 1) files.splice(+i + 1, 0, files.splice(+i, 1)[0]);
      if ((i = b.dataset.rm) !== undefined) files.splice(+i, 1);
      draw();
    };
    X.drop($('.drop'), { accept: 'application/pdf,.pdf', multiple: true }, function (f) { files = files.concat(f); draw(); });
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this; btn.disabled = true;
      try {
        var L = await X.pdfLib(), out = await L.PDFDocument.create();
        for (var i = 0; i < files.length; i++) {
          X.status(st, 'Adding ' + files[i].name + '…');
          var src = await L.PDFDocument.load(await files[i].arrayBuffer());
          (await out.copyPages(src, src.getPageIndices())).forEach(function (p) { out.addPage(p); });
        }
        var blob = new Blob([await out.save()], { type: 'application/pdf' });
        X.status(st, '✅ Merged ' + files.length + ' files into ' + out.getPageCount() + ' pages (' + X.kb(blob.size) + ').');
        X.download(blob, 'merged.pdf');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Split PDF ─────────────────────────────────────────────────────────── */
  tools['split-pdf'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to split') + '<ul class="files" id="fl"></ul>' +
      '<div class="row"><label><input type="radio" name="m" value="range" checked> Extract pages</label><input class="inp" id="rg" placeholder="e.g. 1-3, 5, 8-10" style="flex:1;min-width:160px"></div>' +
      '<div class="row"><label><input type="radio" name="m" value="each"> Split every page into a separate PDF (ZIP)</label></div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Split PDF</button>');
    var file = null, total = 0;
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, async function (f) {
      file = f[0];
      try { var L = await X.pdfLib(); total = (await L.PDFDocument.load(await file.arrayBuffer())).getPageCount(); } catch (e) { return fail($('#st'), e); }
      $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + total + ' pages · ' + X.kb(file.size) + '</span></li>';
      $('#rg').placeholder = 'e.g. 1-' + Math.min(3, total) + (total > 4 ? ', 5' : ''); $('#go').disabled = false;
    });
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this; btn.disabled = true;
      try {
        var L = await X.pdfLib(), src = await L.PDFDocument.load(await file.arrayBuffer()), base = X.baseName(file.name);
        if (app.querySelector('input[name=m]:checked').value === 'range') {
          var idx = X.parseRanges($('#rg').value, total);
          if (!idx.length) return X.status(st, 'Enter the pages to extract, e.g. 1-3, 5', true);
          var out = await L.PDFDocument.create();
          (await out.copyPages(src, idx)).forEach(function (p) { out.addPage(p); });
          X.download(new Blob([await out.save()], { type: 'application/pdf' }), base + '-pages.pdf');
          X.status(st, '✅ Extracted ' + idx.length + ' page(s).');
        } else {
          var Z = await X.jszip(), zip = new Z();
          for (var i = 0; i < total; i++) {
            X.status(st, 'Page ' + (i + 1) + ' of ' + total + '…');
            var o = await L.PDFDocument.create(); o.addPage((await o.copyPages(src, [i]))[0]);
            zip.file(base + '-page-' + (i + 1) + '.pdf', await o.save());
          }
          X.download(await zip.generateAsync({ type: 'blob' }), base + '-pages.zip');
          X.status(st, '✅ Split into ' + total + ' PDFs (ZIP).');
        }
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Rotate PDF ────────────────────────────────────────────────────────── */
  tools['rotate-pdf'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to rotate') + '<ul class="files" id="fl"></ul>' +
      '<div class="row"><label>Rotate</label><select class="sel" id="ang"><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">90° anti-clockwise</option></select>' +
      '<label>Pages</label><input class="inp" id="rg" placeholder="All pages (or e.g. 2, 4-6)" style="flex:1;min-width:160px"></div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Rotate PDF</button>');
    var file = null;
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, function (f) {
      file = f[0]; $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + X.kb(file.size) + '</span></li>'; $('#go').disabled = false;
    });
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this; btn.disabled = true;
      try {
        var L = await X.pdfLib(), doc = await L.PDFDocument.load(await file.arrayBuffer()), n = doc.getPageCount();
        var idx = $('#rg').value.trim() ? X.parseRanges($('#rg').value, n) : doc.getPageIndices(), ang = +$('#ang').value;
        idx.forEach(function (i) { var p = doc.getPage(i); p.setRotation(L.degrees((p.getRotation().angle + ang) % 360)); });
        X.download(new Blob([await doc.save()], { type: 'application/pdf' }), X.baseName(file.name) + '-rotated.pdf');
        X.status(st, '✅ Rotated ' + idx.length + ' page(s).');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Organize / delete / reorder pages ─────────────────────────────────── */
  tools['organize-pdf'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to organise') + '<div class="status" id="st"></div><div class="thumbs" id="th"></div>' +
      '<p class="sub" style="font-size:13px;color:#64748b">Use ◀ ▶ to move a page, ⟳ to rotate, ✕ to delete (tap again to restore).</p>' +
      '<button class="go" id="go" disabled>Save new PDF</button>');
    var file = null, order = [];
    function draw() {
      var th = $('#th'), map = {};
      th.querySelectorAll('.t').forEach(function (t) { map[t.dataset.i] = t; });
      order.forEach(function (o, k) {
        var t = map[o.i]; t.classList.toggle('off', o.del);
        t.querySelector('canvas').style.transform = 'rotate(' + o.rot + 'deg)';
        t.querySelector('.pn').textContent = o.del ? 'deleted' : 'Page ' + (o.i + 1);
        th.appendChild(t);
      });
      $('#go').disabled = !order.some(function (o) { return !o.del; });
    }
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, async function (f) {
      file = f[0]; var st = $('#st'), th = $('#th'); th.innerHTML = ''; order = [];
      try {
        var doc = await openPdfjs(file);
        for (var i = 1; i <= doc.numPages; i++) {
          X.status(st, 'Loading page ' + i + ' of ' + doc.numPages + '…');
          var r = await renderPage(doc, i, 0.3, 220), t = document.createElement('div');
          t.className = 't'; t.dataset.i = i - 1; t.appendChild(r.canvas);
          t.insertAdjacentHTML('beforeend', '<div class="pn"></div><div class="acts"><button class="mini" data-a="l">◀</button><button class="mini" data-a="r">⟳</button><button class="mini" data-a="d">✕</button><button class="mini" data-a="m">▶</button></div>');
          th.appendChild(t); order.push({ i: i - 1, rot: 0, del: false });
        }
        X.status(st, doc.numPages + ' pages loaded.'); draw();
      } catch (e) { fail(st, e); }
    });
    $('#th').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var i = +b.closest('.t').dataset.i, k = order.findIndex(function (o) { return o.i === i; }), o = order[k];
      if (b.dataset.a === 'l' && k > 0) order.splice(k - 1, 0, order.splice(k, 1)[0]);
      if (b.dataset.a === 'm' && k < order.length - 1) order.splice(k + 1, 0, order.splice(k, 1)[0]);
      if (b.dataset.a === 'r') o.rot = (o.rot + 90) % 360;
      if (b.dataset.a === 'd') o.del = !o.del;
      draw();
    };
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this; btn.disabled = true;
      try {
        var L = await X.pdfLib(), src = await L.PDFDocument.load(await file.arrayBuffer()), out = await L.PDFDocument.create();
        var keep = order.filter(function (o) { return !o.del; });
        var pages = await out.copyPages(src, keep.map(function (o) { return o.i; }));
        pages.forEach(function (p, k) { if (keep[k].rot) p.setRotation(L.degrees((p.getRotation().angle + keep[k].rot) % 360)); out.addPage(p); });
        X.download(new Blob([await out.save()], { type: 'application/pdf' }), X.baseName(file.name) + '-organised.pdf');
        X.status(st, '✅ Saved ' + keep.length + ' page(s).');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── PDF to JPG ────────────────────────────────────────────────────────── */
  tools['pdf-to-jpg'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to convert') + '<ul class="files" id="fl"></ul>' +
      '<div class="row"><label>Quality</label><select class="sel" id="dpi"><option value="100">Standard (100 DPI)</option><option value="150" selected>High (150 DPI)</option><option value="200">Print (200 DPI)</option><option value="300">Very high (300 DPI)</option></select>' +
      '<label>Pages</label><input class="inp" id="rg" placeholder="All pages (or e.g. 1-2)" style="flex:1;min-width:140px"></div>' +
      '<div class="bar hide" id="bar"><i></i></div><div class="status" id="st"></div><div class="thumbs" id="th"></div><button class="go" id="go" disabled>Convert to JPG</button>');
    var file = null;
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, function (f) {
      file = f[0]; $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + X.kb(file.size) + '</span></li>'; $('#go').disabled = false; $('#th').innerHTML = '';
    });
    $('#go').onclick = async function () {
      var st = $('#st'), bar = $('#bar'), btn = this; btn.disabled = true; bar.classList.remove('hide'); $('#th').innerHTML = '';
      try {
        var doc = await openPdfjs(file), n = doc.numPages, base = X.baseName(file.name);
        var idx = $('#rg').value.trim() ? X.parseRanges($('#rg').value, n) : Array.from({ length: n }, function (_, i) { return i; });
        var outs = [];
        for (var k = 0; k < idx.length; k++) {
          X.status(st, 'Converting page ' + (idx[k] + 1) + '…'); X.progress(bar, (k + 1) / idx.length);
          var r = await renderPage(doc, idx[k] + 1, +$('#dpi').value / 72, 5000);
          var blob = await X.canvasBlob(r.canvas, 'image/jpeg', 0.9);
          outs.push({ name: base + '-page-' + (idx[k] + 1) + '.jpg', blob: blob });
          var t = document.createElement('div'); t.className = 't';
          var img = new Image(); img.src = URL.createObjectURL(blob); t.appendChild(img);
          t.insertAdjacentHTML('beforeend', '<div>Page ' + (idx[k] + 1) + ' · ' + X.kb(blob.size) + '</div>');
          (function (o) { t.onclick = function () { X.download(o.blob, o.name); }; })(outs[outs.length - 1]);
          $('#th').appendChild(t);
        }
        if (outs.length === 1) X.download(outs[0].blob, outs[0].name);
        else { var Z = await X.jszip(), zip = new Z(); outs.forEach(function (o) { zip.file(o.name, o.blob); }); X.download(await zip.generateAsync({ type: 'blob' }), base + '-jpg.zip'); }
        X.status(st, '✅ ' + outs.length + ' JPG image(s) ready' + (outs.length > 1 ? ' — downloaded as ZIP. Tap a page to download it alone.' : '.'));
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Add watermark ─────────────────────────────────────────────────────── */
  tools['watermark-pdf'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to watermark') + '<ul class="files" id="fl"></ul>' +
      '<div class="row"><label>Text</label><input class="inp" id="tx" value="CONFIDENTIAL" style="flex:1;min-width:160px"></div>' +
      '<div class="row"><label>Size</label><input class="inp num" type="number" id="fs" value="48" min="8" max="200">' +
      '<label>Opacity</label><select class="sel" id="op"><option value="0.12">Light</option><option value="0.25" selected>Medium</option><option value="0.45">Strong</option></select>' +
      '<label>Colour</label><select class="sel" id="co"><option value="0.5,0.5,0.5">Grey</option><option value="0.85,0.1,0.1">Red</option><option value="0.1,0.3,0.85">Blue</option></select>' +
      '<label>Style</label><select class="sel" id="pos"><option value="diag">Diagonal, centre</option><option value="center">Centre</option><option value="bottom">Bottom</option></select></div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Add watermark</button>');
    var file = null;
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, function (f) {
      file = f[0]; $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + X.kb(file.size) + '</span></li>'; $('#go').disabled = false;
    });
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this, text = $('#tx').value.trim();
      if (!text) return X.status(st, 'Enter watermark text.', true);
      if (/[^\x20-\x7E]/.test(text)) return X.status(st, 'Please use English letters, numbers and basic symbols for the watermark.', true);
      btn.disabled = true;
      try {
        var L = await X.pdfLib(), doc = await L.PDFDocument.load(await file.arrayBuffer()), font = await doc.embedFont(L.StandardFonts.HelveticaBold);
        var size = +$('#fs').value || 48, op = +$('#op').value, c = $('#co').value.split(',').map(Number), pos = $('#pos').value;
        doc.getPages().forEach(function (p) {
          var w = p.getWidth(), h = p.getHeight(), tw = font.widthOfTextAtSize(text, size), o = { size: size, font: font, color: L.rgb(c[0], c[1], c[2]), opacity: op };
          if (pos === 'diag') { var a = Math.atan2(h, w); o.rotate = L.radians(a); o.x = w / 2 - Math.cos(a) * tw / 2 + Math.sin(a) * size / 3; o.y = h / 2 - Math.sin(a) * tw / 2 - Math.cos(a) * size / 3; }
          else if (pos === 'center') { o.x = (w - tw) / 2; o.y = h / 2 - size / 3; }
          else { o.x = (w - tw) / 2; o.y = 28; }
          p.drawText(text, o);
        });
        X.download(new Blob([await doc.save()], { type: 'application/pdf' }), X.baseName(file.name) + '-watermarked.pdf');
        X.status(st, '✅ Watermark added to ' + doc.getPageCount() + ' page(s).');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Page numbers ──────────────────────────────────────────────────────── */
  tools['page-numbers-pdf'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to number') + '<ul class="files" id="fl"></ul>' +
      '<div class="row"><label>Position</label><select class="sel" id="pos"><option value="bc">Bottom centre</option><option value="br">Bottom right</option><option value="tr">Top right</option></select>' +
      '<label>Format</label><select class="sel" id="fmt"><option value="n">1</option><option value="p">Page 1</option><option value="pn" selected>Page 1 of N</option><option value="s">1 / N</option></select></div>' +
      '<div class="row"><label>Start at</label><input class="inp num" type="number" id="sn" value="1" min="0"><label>Size</label><input class="inp num" type="number" id="fs" value="11" min="6" max="40">' +
      '<label><input type="checkbox" id="skip"> Skip first page</label></div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Add page numbers</button>');
    var file = null;
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, function (f) {
      file = f[0]; $('#fl').innerHTML = '<li><span>📄</span><span class="nm">' + X.esc(file.name) + '</span><span class="sz">' + X.kb(file.size) + '</span></li>'; $('#go').disabled = false;
    });
    $('#go').onclick = async function () {
      var st = $('#st'), btn = this; btn.disabled = true;
      try {
        var L = await X.pdfLib(), doc = await L.PDFDocument.load(await file.arrayBuffer()), font = await doc.embedFont(L.StandardFonts.Helvetica);
        var pages = doc.getPages(), skip = $('#skip').checked, start = +$('#sn').value || 1, size = +$('#fs').value || 11, fmt = $('#fmt').value, pos = $('#pos').value;
        var total = pages.length - (skip ? 1 : 0) + start - 1;
        pages.forEach(function (p, i) {
          if (skip && i === 0) return;
          var n = i - (skip ? 1 : 0) + start;
          var t = fmt === 'n' ? '' + n : fmt === 'p' ? 'Page ' + n : fmt === 'pn' ? 'Page ' + n + ' of ' + total : n + ' / ' + total;
          var w = p.getWidth(), h = p.getHeight(), tw = font.widthOfTextAtSize(t, size), m = 24;
          var x = pos === 'bc' ? (w - tw) / 2 : w - tw - m, y = pos === 'tr' ? h - m - size : m;
          p.drawText(t, { x: x, y: y, size: size, font: font, color: L.rgb(0.2, 0.2, 0.2) });
        });
        X.download(new Blob([await doc.save()], { type: 'application/pdf' }), X.baseName(file.name) + '-numbered.pdf');
        X.status(st, '✅ Page numbers added.');
      } catch (e) { fail(st, e); } finally { btn.disabled = false; }
    };
  };

  /* ── Extract text ──────────────────────────────────────────────────────── */
  tools['pdf-to-text'] = function () {
    var $ = ui(dropHtml(false, 'Choose PDF to extract text') + '<div class="status" id="st"></div>' +
      '<textarea class="inp hide" id="out" readonly></textarea><div class="row hide" id="acts"><button class="go" id="cp">Copy text</button><button class="go alt" id="dl">⬇ Download .txt</button></div>');
    var name = 'text';
    X.drop($('.drop'), { accept: 'application/pdf,.pdf' }, async function (f) {
      var st = $('#st'); name = X.baseName(f[0].name);
      try {
        var doc = await openPdfjs(f[0]), parts = [];
        for (var i = 1; i <= doc.numPages; i++) {
          X.status(st, 'Reading page ' + i + ' of ' + doc.numPages + '…');
          var c = await (await doc.getPage(i)).getTextContent(), line = '';
          c.items.forEach(function (it) { line += it.str + (it.hasEOL ? '\n' : (it.str && !/\s$/.test(it.str) ? ' ' : '')); });
          parts.push('--- Page ' + i + ' ---\n' + line.replace(/[ \t]+\n/g, '\n').trim());
        }
        var text = parts.join('\n\n');
        $('#out').value = text; $('#out').classList.remove('hide'); $('#acts').classList.remove('hide');
        X.status(st, text.replace(/--- Page \d+ ---/g, '').trim() ? '✅ Text extracted from ' + doc.numPages + ' page(s).' :
          '⚠️ No selectable text found — this looks like a scanned PDF (images only).', !text.replace(/--- Page \d+ ---/g, '').trim());
      } catch (e) { fail(st, e); }
    });
    $('#cp').onclick = function () { navigator.clipboard.writeText($('#out').value).then(function () { X.status($('#st'), '✅ Copied to clipboard.'); }); };
    $('#dl').onclick = function () { X.download(new Blob([$('#out').value], { type: 'text/plain' }), name + '.txt'); };
  };

  if (tools[tool]) tools[tool]();
})();
