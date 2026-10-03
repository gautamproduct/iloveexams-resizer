/* Image tools — converters, photo with name & date, photo + signature joiner.
   Everything runs on the device with <canvas>; nothing is uploaded. */
(function () {
  'use strict';
  var app = document.getElementById('app');
  if (!app || !window.ILX) return;
  var X = window.ILX, tool = app.dataset.tool;
  function ui(html) { app.innerHTML = html; return function (s) { return app.querySelector(s); }; }
  function drop(label, hint) {
    return '<div class="drop" tabindex="0" role="button" aria-label="' + label + '"><div class="big">🖼️</div><strong>' + label + '</strong><span>' + hint + ' · processed on your device, never uploaded</span></div>';
  }

  // Decode any image file (HEIC via heic2any, loaded only when needed) into an <img>
  async function toImage(file) {
    var blob = file;
    if (/\.(heic|heif)$/i.test(file.name) || /heic|heif/i.test(file.type)) {
      await X.load('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');
      blob = await window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.95 });
      if (Array.isArray(blob)) blob = blob[0];
    }
    var url = URL.createObjectURL(blob);
    try { return await X.loadImage(url); } finally { setTimeout(function () { URL.revokeObjectURL(url); }, 30000); }
  }
  function canvasOf(img, w, h) {
    var c = document.createElement('canvas'); c.width = w || img.naturalWidth; c.height = h || img.naturalHeight;
    var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, c.width, c.height); return c;
  }
  // JPG within [minKB, maxKB] where possible (quality search, then COM padding for the minimum)
  async function jpegToKB(canvas, maxKB, minKB) {
    var lo = 0.05, hi = 0.95, best = await X.canvasBlob(canvas, 'image/jpeg', hi);
    if (maxKB && best.size > maxKB * 1024) {
      for (var i = 0; i < 9; i++) {
        var mid = (lo + hi) / 2, b = await X.canvasBlob(canvas, 'image/jpeg', mid);
        if (b.size > maxKB * 1024) hi = mid; else { lo = mid; best = b; }
      }
      if (best.size > maxKB * 1024) best = await X.canvasBlob(canvas, 'image/jpeg', 0.05);
    }
    if (minKB && best.size < minKB * 1024) {
      var src = new Uint8Array(await best.arrayBuffer()), need = minKB * 1024 + 256 - src.length, parts = [src.subarray(0, 2)];
      while (need > 0) { var n = Math.min(65533, Math.max(1, need - 4)), seg = new Uint8Array(n + 4); seg[0] = 255; seg[1] = 254; seg[2] = (n + 2) >> 8; seg[3] = (n + 2) & 255; seg.fill(32, 4); parts.push(seg); need -= seg.length; }
      parts.push(src.subarray(2)); best = new Blob(parts, { type: 'image/jpeg' });
    }
    return best;
  }
  function resultBox(el, blob, canvas, name, extra) {
    var url = URL.createObjectURL(blob);
    el.innerHTML = '<div class="result"><img class="preview" style="max-height:320px" src="' + url + '" alt="Result preview">' +
      '<div class="big">' + X.kb(blob.size) + '</div><div class="sub">' + canvas.width + '×' + canvas.height + ' px · JPG' + (extra ? ' · ' + extra : '') + '</div>' +
      '<div class="row"><button class="go ok" type="button">⬇ Download JPG</button></div></div>';
    el.querySelector('button').onclick = function () { X.download(blob, name); };
  }

  /* ── Convert any image (HEIC, WEBP, PNG, GIF, BMP…) to JPG ─────────────── */
  function converter(accept, label, hint) {
    var $ = ui(drop(label, hint) + '<div class="row"><label>Quality</label><select class="sel" id="q"><option value="0.95">Best</option><option value="0.88" selected>High</option><option value="0.75">Smaller file</option></select></div>' +
      '<div class="bar hide" id="bar"><i></i></div><div class="status" id="st"></div><div class="thumbs" id="th"></div><div class="row hide" id="all"><button class="go" id="zip">⬇ Download all (ZIP)</button></div>');
    var outs = [];
    X.drop($('.drop'), { accept: accept, multiple: true }, async function (files) {
      var st = $('#st'), bar = $('#bar'); bar.classList.remove('hide'); $('#th').innerHTML = ''; outs = []; $('#all').classList.add('hide');
      for (var i = 0; i < files.length; i++) {
        try {
          X.status(st, 'Converting ' + files[i].name + (/heic|heif/i.test(files[i].name) ? ' (first HEIC takes a few seconds)…' : '…'));
          var img = await toImage(files[i]), c = canvasOf(img), blob = await X.canvasBlob(c, 'image/jpeg', +$('#q').value);
          var o = { name: X.baseName(files[i].name) + '.jpg', blob: blob }; outs.push(o);
          var t = document.createElement('div'); t.className = 't'; var im = new Image(); im.src = URL.createObjectURL(blob); t.appendChild(im);
          t.insertAdjacentHTML('beforeend', '<div>' + X.esc(o.name) + '<br>' + X.kb(blob.size) + '</div><div class="acts"><button class="mini" type="button">⬇ Save</button></div>');
          (function (o) { t.querySelector('button').onclick = function () { X.download(o.blob, o.name); }; })(o);
          $('#th').appendChild(t);
        } catch (e) { console.error(e); X.status(st, '⚠️ ' + files[i].name + ': ' + (e.message || 'could not convert'), true); }
        X.progress(bar, (i + 1) / files.length);
      }
      if (outs.length) {
        X.status(st, '✅ Converted ' + outs.length + ' image(s) to JPG. Tap Save under each, or download all.');
        if (outs.length === 1) X.download(outs[0].blob, outs[0].name); else $('#all').classList.remove('hide');
      }
    });
    $('#zip').onclick = async function () { var Z = await X.jszip(), z = new Z(); outs.forEach(function (o) { z.file(o.name, o.blob); }); X.download(await z.generateAsync({ type: 'blob' }), 'converted-jpg.zip'); };
  }

  var tools = {
    'heic-to-jpg': function () { converter('.heic,.heif,image/heic,image/heif', 'Choose HEIC photos (iPhone)', 'HEIC / HEIF, several at once'); },
    'webp-to-jpg': function () { converter('image/webp,.webp,image/*', 'Choose WEBP images', 'WEBP, PNG, GIF, BMP — several at once'); },
  };

  /* ── Photo with name and date ──────────────────────────────────────────── */
  tools['photo-name-date'] = function () {
    var today = new Date(), dd = ('0' + today.getDate()).slice(-2), mm = ('0' + (today.getMonth() + 1)).slice(-2);
    var $ = ui(drop('Choose your photo', 'JPG, PNG, HEIC') +
      '<div class="grid2" style="margin-top:12px"><div><label style="font-size:13px;font-weight:600">Name (as on the form)</label><input class="inp" id="nm" placeholder="e.g. RAHUL KUMAR" style="width:100%"></div>' +
      '<div><label style="font-size:13px;font-weight:600">Date the photo was taken</label><input class="inp" id="dt" value="' + dd + '/' + mm + '/' + today.getFullYear() + '" style="width:100%"></div></div>' +
      '<div class="row"><label>Size</label><select class="sel" id="sz"><option value="200x230">200×230 px (bank exams)</option><option value="275x354" selected>275×354 px (3.5×4.5 cm, NTA/SSC)</option><option value="413x531">413×531 px (3.5×4.5 cm @300 DPI)</option><option value="orig">Keep my photo\'s size</option></select>' +
      '<label>Max size</label><input class="inp num" type="number" id="mx" value="100" min="10"> KB <label style="margin-left:6px">Min</label><input class="inp num" type="number" id="mn" value="10" min="0"> KB</div>' +
      '<div class="row"><label>Name/date strip</label><select class="sel" id="strip"><option value="0.2">20% of photo height</option><option value="0.25" selected>25%</option><option value="0.3">30%</option></select>' +
      '<label><input type="checkbox" id="up" checked> CAPITAL letters</label></div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Create photo</button><div id="res"></div>');
    // Page presets (e.g. TNPSC: 275×354, 20–50 KB, 1.5 cm strip ≈ 33%)
    var D = app.dataset;
    if (D.size) { if (![].some.call($('#sz').options, function (o) { return o.value === D.size; })) $('#sz').insertAdjacentHTML('afterbegin', '<option value="' + D.size + '">' + D.size.replace('x', '×') + ' px</option>'); $('#sz').value = D.size; }
    if (D.max) $('#mx').value = D.max;
    if (D.min) $('#mn').value = D.min;
    if (D.strip) { if (![].some.call($('#strip').options, function (o) { return o.value === D.strip; })) $('#strip').insertAdjacentHTML('beforeend', '<option value="' + D.strip + '">' + Math.round(D.strip * 100) + '% (exam rule)</option>'); $('#strip').value = D.strip; }
    var img = null, fname = 'photo';
    X.drop($('.drop'), { accept: 'image/*,.heic,.heif' }, async function (f) {
      try { fname = X.baseName(f[0].name); img = await toImage(f[0]); $('#go').disabled = false; X.status($('#st'), '✅ Photo loaded (' + img.naturalWidth + '×' + img.naturalHeight + '). Enter your name and tap Create.'); }
      catch (e) { X.status($('#st'), '⚠️ ' + e.message, true); }
    });
    $('#go').onclick = async function () {
      var name = $('#nm').value.trim(), date = $('#dt').value.trim(), st = $('#st');
      if (!name) return X.status(st, 'Enter your name.', true);
      if ($('#up').checked) name = name.toUpperCase();
      var sz = $('#sz').value, W, H;
      if (sz === 'orig') { W = img.naturalWidth; H = img.naturalHeight; } else { W = +sz.split('x')[0]; H = +sz.split('x')[1]; }
      var stripH = Math.round(H * +$('#strip').value), photoH = H - stripH;
      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      // cover-crop the photo into the top area, biased slightly upward to keep the face
      var s = Math.max(W / img.naturalWidth, photoH / img.naturalHeight), dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, (W - dw) / 2, Math.min(0, (photoH - dh) * 0.3), dw, dh);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, photoH, W, stripH);
      ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      function fit(t, maxFs) { var fs = maxFs; ctx.font = 'bold ' + fs + 'px Arial, sans-serif'; while (ctx.measureText(t).width > W * 0.94 && fs > 6) { fs--; ctx.font = 'bold ' + fs + 'px Arial, sans-serif'; } return fs; }
      var fs1 = fit(name, Math.floor(stripH * 0.36));
      ctx.fillText(name, W / 2, photoH + stripH * 0.32);
      ctx.font = 'bold ' + Math.min(fs1, fit(date, Math.floor(stripH * 0.32))) + 'px Arial, sans-serif';
      ctx.fillText(date, W / 2, photoH + stripH * 0.72);
      var blob = await jpegToKB(c, +$('#mx').value || 0, +$('#mn').value || 0);
      resultBox($('#res'), blob, c, fname + '-name-date.jpg', 'name & date added');
      X.status(st, '✅ Done. Check the spelling before you upload.');
    };
  };

  /* ── Join photo and signature ──────────────────────────────────────────── */
  tools['join-photo-signature'] = function () {
    var $ = ui('<div class="grid2"><div>' + drop('1. Choose photo', 'JPG, PNG, HEIC').replace('class="drop"', 'class="drop" id="dp"') + '<div class="status" id="s1"></div></div><div>' +
      drop('2. Choose signature', 'JPG, PNG, HEIC').replace('class="drop"', 'class="drop" id="ds"') + '<div class="status" id="s2"></div></div></div>' +
      '<div class="row"><label>Layout</label><select class="sel" id="lay"><option value="v" selected>Signature below photo</option><option value="h">Side by side</option></select>' +
      '<label>Width</label><input class="inp num" type="number" id="w" value="300" min="80"> px ' +
      '<label>Max size</label><input class="inp num" type="number" id="mx" value="100" min="10"> KB</div>' +
      '<div class="status" id="st"></div><button class="go" id="go" disabled>Join images</button><div id="res"></div>');
    var photo = null, sig = null;
    function ready() { $('#go').disabled = !(photo && sig); }
    X.drop($('#dp'), { accept: 'image/*,.heic,.heif' }, async function (f) { try { photo = await toImage(f[0]); X.status($('#s1'), '✅ Photo ' + photo.naturalWidth + '×' + photo.naturalHeight); } catch (e) { X.status($('#s1'), '⚠️ ' + e.message, true); } ready(); });
    X.drop($('#ds'), { accept: 'image/*,.heic,.heif' }, async function (f) { try { sig = await toImage(f[0]); X.status($('#s2'), '✅ Signature ' + sig.naturalWidth + '×' + sig.naturalHeight); } catch (e) { X.status($('#s2'), '⚠️ ' + e.message, true); } ready(); });
    $('#go').onclick = async function () {
      var W = +$('#w').value || 300, lay = $('#lay').value, c = document.createElement('canvas'), ctx = c.getContext('2d'), gap = Math.round(W * 0.03);
      if (lay === 'v') {
        var ph = Math.round(photo.naturalHeight * W / photo.naturalWidth), sh = Math.round(sig.naturalHeight * W / sig.naturalWidth);
        c.width = W; c.height = ph + gap + sh; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(photo, 0, 0, W, ph); ctx.drawImage(sig, 0, ph + gap, W, sh);
      } else {
        var H = Math.round(W * 0.6), pw = Math.round(photo.naturalWidth * H / photo.naturalHeight), sw = Math.round(sig.naturalWidth * H / sig.naturalHeight);
        c.width = pw + gap + sw; c.height = H; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(photo, 0, 0, pw, H); ctx.drawImage(sig, pw + gap, 0, sw, H);
      }
      var blob = await jpegToKB(c, +$('#mx').value || 0, 0);
      resultBox($('#res'), blob, c, 'photo-and-signature.jpg');
      X.status($('#st'), '✅ Done.');
    };
  };

  if (tools[tool]) tools[tool]();
})();
