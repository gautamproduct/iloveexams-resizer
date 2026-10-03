/* ILoveExams in-browser tools — shared helpers. Files never leave the device. */
(function () {
  'use strict';
  var loaded = {};
  var ILX = window.ILX = {
    // Load a script once (libraries are fetched only when a tool is used)
    load: function (src) {
      if (!loaded[src]) loaded[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.async = true; s.crossOrigin = 'anonymous';
        s.onload = res; s.onerror = function () { delete loaded[src]; rej(new Error('Could not load ' + src + ' — check your connection.')); };
        document.head.appendChild(s);
      });
      return loaded[src];
    },
    pdfLib: function () {
      return ILX.load('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js').then(function () { return window.PDFLib; });
    },
    pdfjs: function () {
      return ILX.load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js').then(function () {
        var p = window.pdfjsLib;
        p.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        return p;
      });
    },
    jszip: function () {
      return ILX.load('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js').then(function () { return window.JSZip; });
    },
    kb: function (bytes) {
      return bytes >= 1048576 ? (bytes / 1048576).toFixed(2) + ' MB' : (bytes / 1024).toFixed(1) + ' KB';
    },
    esc: function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); },
    baseName: function (name) { return String(name || 'file').replace(/\.[^.]+$/, '').replace(/[^\w\-]+/g, '_').slice(0, 60) || 'file'; },
    download: function (blob, name) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 60000);
    },
    readBuf: function (file) { return file.arrayBuffer(); },
    // Wire a drop zone + hidden <input type=file>
    drop: function (zone, opts, onFiles) {
      var appEl = zone.closest('.app');
      if (appEl && !opts.keepOpen) appEl.classList.add('needs-file');
      var inner = onFiles;
      onFiles = function (f) { if (appEl) appEl.classList.add('has-file'); return inner(f); };
      var input = document.createElement('input');
      input.type = 'file'; input.accept = opts.accept || '*/*'; input.multiple = !!opts.multiple; input.hidden = true;
      zone.appendChild(input);
      zone.addEventListener('click', function (e) { if (e.target !== input) input.click(); });
      zone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
      input.addEventListener('change', function () { if (input.files.length) onFiles([].slice.call(input.files)); input.value = ''; });
      ['dragenter', 'dragover'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add('over'); }); });
      ['dragleave', 'drop'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.remove('over'); }); });
      zone.addEventListener('drop', function (e) { var f = [].slice.call(e.dataTransfer.files || []); if (f.length) onFiles(opts.multiple ? f : f.slice(0, 1)); });
      return input;
    },
    status: function (el, msg, isErr) { el.textContent = msg || ''; el.classList.toggle('err', !!isErr); },
    progress: function (el, frac) { var i = el.querySelector('i'); if (i) i.style.width = Math.round(Math.max(0, Math.min(1, frac)) * 100) + '%'; },
    canvasBlob: function (canvas, type, q) { return new Promise(function (r) { canvas.toBlob(r, type || 'image/jpeg', q); }); },
    loadImage: function (src) {
      return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('Could not read this image.')); }; i.src = src; });
    },
    // Parse "1-3, 5, 8-" into 0-based page indexes (bounded by total)
    parseRanges: function (str, total) {
      var out = [];
      String(str || '').split(',').forEach(function (part) {
        var p = part.trim(); if (!p) return;
        var m = p.match(/^(\d*)\s*-\s*(\d*)$/);
        if (m) {
          var a = m[1] ? +m[1] : 1, b = m[2] ? +m[2] : total;
          for (var i = Math.max(1, a); i <= Math.min(total, b); i++) out.push(i - 1);
        } else if (/^\d+$/.test(p) && +p >= 1 && +p <= total) out.push(+p - 1);
      });
      return out;
    },
  };
})();
