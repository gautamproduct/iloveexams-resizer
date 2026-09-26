/* Exam calculators: score calculator (marking scheme from data-scheme JSON),
   JEE Main percentile → rank predictor, typing speed test. Runs on the device. */
(function () {
  'use strict';
  var app = document.getElementById('app');
  if (!app) return;
  var tool = app.dataset.tool;
  function $(s) { return app.querySelector(s); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ── Score calculator ──────────────────────────────────────────────────
     scheme: { papers:[{ name, sections:[{ name, q, pos, neg, tita? }], qualify? }] } */
  if (tool === 'score') {
    var S = JSON.parse(app.dataset.scheme);
    var html = '';
    S.papers.forEach(function (p, pi) {
      html += (S.papers.length > 1 ? '<h2>' + esc(p.name) + '</h2>' : '') +
        '<div class="tbl-wrap"><table class="grid" style="min-width:0"><thead><tr><th>Section</th><th>Correct</th><th>Wrong</th>' + (p.sections.some(function (s) { return s.tita; }) ? '<th>TITA correct</th>' : '') + '<th>Score</th></tr></thead><tbody>' +
        p.sections.map(function (s, si) {
          var id = pi + '-' + si;
          return '<tr><td><strong>' + esc(s.name) + '</strong><br><span style="font-size:12px;color:#64748b">' + (s.q ? s.q + ' Qs · ' : '') + '+' + s.pos + ' / −' + r2(s.neg) + '</span></td>' +
            '<td><input class="inp num" type="number" min="0" ' + (s.q ? 'max="' + s.q + '"' : '') + ' data-c="' + id + '" inputmode="numeric" placeholder="0"></td>' +
            '<td><input class="inp num" type="number" min="0" ' + (s.q ? 'max="' + s.q + '"' : '') + ' data-w="' + id + '" inputmode="numeric" placeholder="0"></td>' +
            (p.sections.some(function (x) { return x.tita; }) ? '<td>' + (s.tita ? '<input class="inp num" type="number" min="0" data-t="' + id + '" inputmode="numeric" placeholder="0">' : '—') + '</td>' : '') +
            '<td class="m" data-s="' + id + '">0</td></tr>';
        }).join('') + '</tbody></table></div>';
    });
    app.innerHTML = '<h2>Enter your answers from the answer key</h2>' + html +
      '<div class="grid2" style="margin-top:14px" id="stats"></div><div class="status" id="st"></div>' +
      '<div class="row"><button class="go alt" type="button" id="rs">Reset</button></div>';
    function calc() {
      var out = '', warn = '';
      S.papers.forEach(function (p, pi) {
        var tot = 0, max = 0, att = 0, cor = 0, q = 0;
        p.sections.forEach(function (s, si) {
          var id = pi + '-' + si, c = +($('[data-c="' + id + '"]').value || 0), w = +($('[data-w="' + id + '"]').value || 0), t = s.tita ? +($('[data-t="' + id + '"]').value || 0) : 0;
          if (s.q && c + w + t > s.q) warn = '⚠️ ' + s.name + ': correct + wrong is more than ' + s.q + ' questions.';
          var sc = c * s.pos - w * s.neg + t * s.pos;
          $('[data-s="' + id + '"]').textContent = r2(sc);
          tot += sc; max += (s.q || 0) * s.pos; att += c + w + t; cor += c + t; q += s.q || 0;
        });
        out += '<div class="stat"><b>' + r2(tot) + (max ? ' / ' + r2(max) : '') + '</b><span>' + esc(p.name) + ' score</span></div>' +
          '<div class="stat"><b>' + (att ? Math.round(cor / att * 100) : 0) + '%</b><span>Accuracy · ' + att + (q ? ' of ' + q : '') + ' attempted</span></div>';
        var ok = tot >= p.qualify - 1e-9;
        if (p.qualify) out += '<div class="stat" style="grid-column:1/-1"><b style="color:' + (ok ? '#16a34a' : '#dc2626') + '">' + (ok ? 'Qualified ✓' : 'Below qualifying') + '</b><span>' + esc(p.name) + ' qualifying mark: ' + r2(p.qualify) + '</span></div>';
      });
      $('#stats').innerHTML = out;
      $('#st').textContent = warn; $('#st').classList.toggle('err', !!warn);
    }
    app.addEventListener('input', calc);
    $('#rs').onclick = function () { app.querySelectorAll('input').forEach(function (i) { i.value = ''; }); calc(); };
    calc();
  }

  /* ── JEE Main percentile → rank ────────────────────────────────────────── */
  if (tool === 'jee-rank') {
    app.innerHTML = '<h2>Your JEE Main percentile</h2>' +
      '<div class="row"><label>Percentile (NTA score)</label><input class="inp" type="number" id="p" min="0" max="100" step="0.0000001" placeholder="e.g. 97.5" style="width:170px"></div>' +
      '<div class="row"><label>Candidates who appeared</label><input class="inp" type="number" id="n" value="1200000" min="1000" step="1000" style="width:170px"><span style="font-size:12.5px;color:#64748b">Default ≈12 lakh — change it to the official count once NTA publishes it.</span></div>' +
      '<div class="grid2" id="out" style="margin-top:12px"></div>';
    function run() {
      var p = +$('#p').value, n = +$('#n').value || 1200000;
      if (!$('#p').value || p < 0 || p > 100) { $('#out').innerHTML = ''; return; }
      var rank = Math.max(1, Math.round((100 - p) * n / 100));
      var ahead = rank - 1;
      $('#out').innerHTML = '<div class="stat"><b>~' + rank.toLocaleString('en-IN') + '</b><span>Expected CRL rank (All India)</span></div>' +
        '<div class="stat"><b>' + ahead.toLocaleString('en-IN') + '</b><span>Candidates scoring above you</span></div>' +
        '<div class="stat" style="grid-column:1/-1"><span>Rank ≈ (100 − ' + p + ') × ' + n.toLocaleString('en-IN') + ' ÷ 100. Category ranks are lower — divide by your category\'s share of candidates for a rough estimate.</span></div>';
    }
    app.addEventListener('input', run);
  }

  /* ── Typing speed test ─────────────────────────────────────────────────── */
  if (tool === 'typing') {
    var PASSAGES = [
      'Preparing for a competitive examination requires patience, discipline and a clear plan. Candidates who divide the syllabus into small daily targets usually find it easier to stay consistent. Regular revision is just as important as learning new topics, because concepts that are not revised are quickly forgotten. Solving previous year question papers helps a student understand the pattern of the examination and the level of difficulty. Mock tests should be taken in a quiet place with a timer, so that the experience is close to the real examination hall.',
      'India is a country of great diversity, with many languages, cultures and traditions living side by side. The Constitution of India guarantees equality before the law and protects the fundamental rights of every citizen. Over the years the country has made steady progress in education, health, science and technology. Digital services have made it easier for citizens to apply for documents, pay bills and receive government benefits from their homes. Such progress depends on responsible citizens who value honesty, hard work and respect for others.',
      'Good health is the foundation of success in any field. A balanced diet, enough sleep and some physical activity every day keep the body and mind active. Students often ignore their health during examination season and study late into the night. This habit reduces concentration and memory in the long run. Short breaks between study sessions, a glass of water and a few minutes of walking can improve focus. Remember that a calm mind performs better than a tired mind on the day of the examination.',
      'The banking sector plays an important role in the growth of the economy. Banks collect deposits from the public and provide loans to individuals and businesses. In recent years, digital payments have grown rapidly because they are fast, safe and convenient. Customers can now transfer money, check their balance and open accounts using a mobile phone. However, it is important to protect personal information and never share passwords or one time codes with anyone, even if the caller claims to be from the bank.',
      'Typing speed and accuracy are important skills for many government jobs. In a skill test, candidates are given a passage and must type it within a fixed time. Speed is measured in words per minute, where every five characters are counted as one word. Errors reduce the net speed, so accuracy matters as much as speed. The best way to improve is to practise for a short time every day, keep the eyes on the screen and use all ten fingers instead of looking at the keyboard.',
    ];
    app.innerHTML = '<div class="row"><label>Duration</label><select class="sel" id="dur"><option value="60">1 minute</option><option value="120">2 minutes</option><option value="300" selected>5 minutes</option><option value="600">10 minutes</option><option value="900">15 minutes (SSC DEST style)</option></select>' +
      '<button class="mini" type="button" id="nx">New passage</button><span id="tm" style="margin-left:auto;font-weight:900;font-size:20px">5:00</span></div>' +
      '<div class="typing-src" id="src"></div><textarea class="inp" id="ta" placeholder="Start typing here — the timer starts with your first key" spellcheck="false" autocomplete="off" autocapitalize="off" style="margin-top:10px"></textarea>' +
      '<div class="grid2" id="res" style="margin-top:12px"></div><div class="row"><button class="go alt" type="button" id="rs">Restart</button></div>';
    var pi = Math.floor(Math.random() * PASSAGES.length), text = '', start = 0, timer = null, keys = 0, done = false;
    function setText() {
      var dur = +$('#dur').value, reps = Math.ceil(dur / 60);
      text = PASSAGES[pi]; for (var i = 1; i < reps; i++) text += ' ' + PASSAGES[(pi + i) % PASSAGES.length];
    }
    function paint() {
      var typed = $('#ta').value, out = '';
      for (var i = 0; i < text.length; i++) {
        var ch = esc(text[i]);
        out += i < typed.length ? '<span class="' + (typed[i] === text[i] ? 'c' : 'w') + '">' + ch + '</span>' : i === typed.length ? '<span class="cur">' + ch + '</span>' : ch;
      }
      $('#src').innerHTML = out;
    }
    function stats(final) {
      var typed = $('#ta').value, el = Math.max(1, (Date.now() - start) / 1000), mins = el / 60, errs = 0;
      for (var i = 0; i < typed.length; i++) if (typed[i] !== text[i]) errs++;
      var gross = typed.length / 5 / mins, net = Math.max(0, (typed.length - errs) / 5 / mins), acc = typed.length ? (typed.length - errs) / typed.length * 100 : 0;
      $('#res').innerHTML = '<div class="stat"><b>' + Math.round(net) + ' WPM</b><span>Net speed (gross ' + Math.round(gross) + ')</span></div>' +
        '<div class="stat"><b>' + acc.toFixed(1) + '%</b><span>Accuracy · ' + errs + ' error(s)</span></div>' +
        '<div class="stat"><b>' + Math.round(Math.max(keys, typed.length) / mins * 60).toLocaleString('en-IN') + '</b><span>Key depressions per hour</span></div>' +
        '<div class="stat"><b>' + (net >= 35 ? '✓' : '✗') + ' 35 WPM</b><span>' + (net >= 35 ? 'Meets' : 'Below') + ' the common SSC English speed</span></div>' +
        (final ? '<div class="stat" style="grid-column:1/-1"><span>Time up! Tap Restart to try again, or pick a new passage.</span></div>' : '');
    }
    function reset() {
      clearInterval(timer); timer = null; start = 0; keys = 0; done = false;
      $('#ta').value = ''; $('#ta').disabled = false; setText(); paint(); $('#res').innerHTML = '';
      var d = +$('#dur').value; $('#tm').textContent = Math.floor(d / 60) + ':00';
    }
    $('#ta').addEventListener('paste', function (e) { e.preventDefault(); });
    $('#ta').addEventListener('keydown', function (e) { if (!done && (e.key.length === 1 || e.key === 'Backspace')) keys++; });
    $('#ta').addEventListener('input', function () {
      if (done) return;
      if (!start) {
        start = Date.now(); var d = +$('#dur').value;
        timer = setInterval(function () {
          var left = Math.max(0, d - (Date.now() - start) / 1000);
          $('#tm').textContent = Math.floor(left / 60) + ':' + ('0' + Math.floor(left % 60)).slice(-2);
          stats(false);
          if (left <= 0) { clearInterval(timer); done = true; $('#ta').disabled = true; stats(true); }
        }, 500);
      }
      paint();
      if ($('#ta').value.length >= text.length) { clearInterval(timer); done = true; $('#ta').disabled = true; stats(true); }
    });
    $('#dur').onchange = reset; $('#rs').onclick = reset;
    $('#nx').onclick = function () { pi = (pi + 1) % PASSAGES.length; reset(); };
    reset();
  }
})();
