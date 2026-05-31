#!/usr/bin/env node
/**
 * Generates individual SEO landing pages for every exam × document type.
 * Run: node generate-pages.js
 * Output: /{slug}-photo-resize/index.html and /{slug}-signature-resize/index.html
 */

const fs = require('fs');
const path = require('path');

const EXAMS = [
  {slug:'upsc',         name:'UPSC CSE',               cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'upsc-ies',     name:'UPSC IES / ESE',          cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'upsc-geo',     name:'UPSC Geo-Scientist',       cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'upsc-capf',    name:'UPSC CAPF AC',             cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'upsc-nda',     name:'UPSC NDA',                 cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'upsc-cds',     name:'UPSC CDS',                 cat:'UPSC',      photo:{w:400,  h:400,  min:20,  max:300,  fmt:'JPG'}, sig:{w:400,  h:400,  min:20,  max:100, fmt:'JPG'}},
  {slug:'ssc-cgl',      name:'SSC CGL',                  cat:'SSC',       photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:236,  h:79,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-chsl',     name:'SSC CHSL',                 cat:'SSC',       photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:200,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-mts',      name:'SSC MTS',                  cat:'SSC',       photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:240,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-gd',       name:'SSC GD Constable',         cat:'SSC',       photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:240,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-cpo',      name:'SSC CPO SI',               cat:'SSC',       photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:236,  h:79,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-steno',    name:'SSC Stenographer',          cat:'SSC',       photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:200,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ssc-je',       name:'SSC JE',                   cat:'SSC',       photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:236,  h:79,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'sbi-po',       name:'SBI PO',                   cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'sbi-clerk',    name:'SBI Clerk',                cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ibps-po',      name:'IBPS PO',                  cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ibps-clerk',   name:'IBPS Clerk',               cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ibps-rrb-po',  name:'IBPS RRB Officer',         cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ibps-rrb-clerk',name:'IBPS RRB Assistant',      cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ibps-so',      name:'IBPS SO',                  cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'rbi-grade-b',  name:'RBI Grade B',              cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'rbi-assistant',name:'RBI Assistant',            cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'lic-aao',      name:'LIC AAO',                  cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'lic-ado',      name:'LIC ADO',                  cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'nabard',       name:'NABARD Grade A',           cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'idbi',         name:'IDBI Executive',           cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'niacl',        name:'NIACL AO',                 cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'sebi',         name:'SEBI Grade A',             cat:'Banking',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'afcat',        name:'AFCAT',                    cat:'Defence',   photo:{w:200,  h:230,  min:10,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:50,  fmt:'JPG'}},
  {slug:'coast-guard',  name:'Coast Guard Navik',        cat:'Defence',   photo:{w:200,  h:230,  min:10,  max:100,  fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:100, fmt:'JPG'}},
  {slug:'rrb-alp',      name:'RRB ALP',                  cat:'Railways',  photo:{w:275,  h:354,  min:50,  max:150,  fmt:'JPG'}, sig:{w:275,  h:157,  min:30,  max:49,  fmt:'JPG'}},
  {slug:'rpf-si',       name:'RPF SI',                   cat:'Railways',  photo:{w:320,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:40,  fmt:'JPG'}},
  {slug:'rpf-constable',name:'RPF Constable',            cat:'Railways',  photo:{w:320,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:40,  fmt:'JPG'}},
  {slug:'jee-main',     name:'JEE Main',                 cat:'Entrance',  photo:{w:275,  h:354,  min:10,  max:300,  fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:50,  fmt:'JPG'}},
  {slug:'neet-ug',      name:'NEET UG',                  cat:'Entrance',  photo:{w:275,  h:354,  min:10,  max:200,  fmt:'JPG'}, sig:{w:275,  h:118,  min:4,   max:30,  fmt:'JPG'}},
  {slug:'gate',         name:'GATE',                     cat:'Entrance',  photo:{w:350,  h:450,  min:5,   max:1000, fmt:'JPG'}, sig:{w:400,  h:120,  min:3,   max:1000,fmt:'JPG'}},
  {slug:'cuet',         name:'CUET UG',                  cat:'Entrance',  photo:{w:200,  h:230,  min:10,  max:200,  fmt:'JPG'}, sig:{w:140,  h:60,   min:4,   max:30,  fmt:'JPG'}},
  {slug:'clat',         name:'CLAT',                     cat:'Entrance',  photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'cat',          name:'CAT (IIM)',                 cat:'Entrance',  photo:{w:1200, h:1200, min:30,  max:80,   fmt:'JPG'}, sig:{w:1000, h:350,  min:30,  max:80,  fmt:'JPG'}},
  {slug:'cmat',         name:'NTA CMAT',                  cat:'Entrance',  photo:{w:200,  h:230,  min:10,  max:200,  fmt:'JPG'}, sig:{w:140,  h:60,   min:4,   max:30,  fmt:'JPG'}},
  {slug:'xat',          name:'XAT',                      cat:'Entrance',  photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'ib-acio',      name:'IB ACIO',                  cat:'Central',   photo:{w:200,  h:230,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'post-gds',     name:'India Post GDS',           cat:'Central',   photo:{w:320,  h:400,  min:30,  max:100,  fmt:'JPG'}, sig:{w:300,  h:120,  min:20,  max:100, fmt:'JPG'}},
  {slug:'ugc-net',      name:'UGC NET',                  cat:'Central',   photo:{w:200,  h:230,  min:10,  max:200,  fmt:'JPG'}, sig:{w:140,  h:60,   min:4,   max:30,  fmt:'JPG'}},
  {slug:'csir-net',     name:'CSIR UGC NET',             cat:'Central',   photo:{w:200,  h:230,  min:10,  max:200,  fmt:'JPG'}, sig:{w:140,  h:60,   min:4,   max:30,  fmt:'JPG'}},
  {slug:'uppsc',        name:'UPPSC',                    cat:'State PSC', photo:{w:180,  h:216,  min:20,  max:50,   fmt:'JPG'}, sig:{w:216,  h:108,  min:10,  max:30,  fmt:'JPG'}},
  {slug:'bpsc',         name:'BPSC',                     cat:'State PSC', photo:{w:250,  h:250,  min:20,  max:50,   fmt:'JPG'}, sig:{w:220,  h:100,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'mpsc',         name:'MPSC (Maharashtra)',        cat:'State PSC', photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'wbcs',         name:'WBCS',                     cat:'State PSC', photo:{w:138,  h:177,  min:20,  max:100,  fmt:'JPG'}, sig:{w:138,  h:59,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'opsc',         name:'OPSC (Odisha)',             cat:'State PSC', photo:{w:200,  h:240,  min:20,  max:100,  fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:50,  fmt:'JPG'}},
  {slug:'apsc',         name:'APSC (Assam)',              cat:'State PSC', photo:{w:200,  h:250,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'mppsc',        name:'MPPSC',                    cat:'State PSC', photo:{w:275,  h:354,  min:25,  max:200,  fmt:'JPG'}, sig:{w:275,  h:118,  min:25,  max:200, fmt:'JPG'}},
  {slug:'jpsc',         name:'JPSC (Jharkhand)',          cat:'State PSC', photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'tnpsc',        name:'TNPSC',                    cat:'State PSC', photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'kpsc',         name:'KPSC (Kerala)',             cat:'State PSC', photo:{w:150,  h:200,  min:20,  max:30,   fmt:'JPG'}, sig:{w:150,  h:100,  min:20,  max:30,  fmt:'JPG'}},
  {slug:'gpsc',         name:'GPSC (Gujarat)',            cat:'State PSC', photo:{w:130,  h:180,  min:10,  max:15,   fmt:'JPG'}, sig:{w:275,  h:90,   min:10,  max:15,  fmt:'JPG'}},
  {slug:'rpsc',         name:'RPSC / RAS',               cat:'State PSC', photo:{w:240,  h:320,  min:20,  max:50,   fmt:'JPG'}, sig:{w:280,  h:80,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'tspsc',        name:'TSPSC (Telangana)',         cat:'State PSC', photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:30,  fmt:'JPG'}},
  {slug:'cgpsc',        name:'CGPSC',                    cat:'State PSC', photo:{w:275,  h:354,  min:30,  max:100,  fmt:'JPG'}, sig:{w:275,  h:118,  min:20,  max:50,  fmt:'JPG'}},
  {slug:'ukpsc',        name:'UKPSC',                    cat:'State PSC', photo:{w:150,  h:200,  min:30,  max:50,   fmt:'JPG'}, sig:{w:150,  h:100,  min:20,  max:30,  fmt:'JPG'}},
  {slug:'appsc',        name:'APPSC (Arunachal)',         cat:'State PSC', photo:{w:200,  h:250,  min:50,  max:100,  fmt:'JPG'}, sig:{w:140,  h:60,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'ppsc',         name:'PPSC (Punjab)',             cat:'State PSC', photo:{w:140,  h:177,  min:10,  max:40,   fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:40,  fmt:'JPG'}},
  {slug:'hpsc',         name:'HPSC (Haryana)',            cat:'State PSC', photo:{w:138,  h:177,  min:10,  max:100,  fmt:'JPG'}, sig:{w:138,  h:59,   min:10,  max:50,  fmt:'JPG'}},
  {slug:'jkpsc',        name:'JKPSC',                    cat:'State PSC', photo:{w:200,  h:240,  min:10,  max:20,   fmt:'JPG'}, sig:{w:200,  h:100,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'spsc',         name:'SPSC (Sikkim)',             cat:'State PSC', photo:{w:150,  h:200,  min:10,  max:50,   fmt:'JPG'}, sig:{w:150,  h:100,  min:5,   max:30,  fmt:'JPG'}},
  {slug:'up-police',    name:'UP Police',                cat:'Police',    photo:{w:180,  h:225,  min:20,  max:50,   fmt:'JPG'}, sig:{w:200,  h:80,   min:5,   max:20,  fmt:'JPG'}},
  {slug:'delhi-police', name:'Delhi Police',             cat:'Police',    photo:{w:100,  h:120,  min:20,  max:50,   fmt:'JPG'}, sig:{w:40,   h:60,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'wbprb',        name:'WBPRB (WB Police)',        cat:'Police',    photo:{w:200,  h:240,  min:10,  max:50,   fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:30,  fmt:'JPG'}},
  {slug:'bpssc',        name:'BPSSC (Bihar Police)',     cat:'Police',    photo:{w:200,  h:230,  min:30,  max:50,   fmt:'JPG'}, sig:{w:140,  h:60,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'tnusrb',       name:'TNUSRB (TN Police)',       cat:'Police',    photo:{w:275,  h:354,  min:20,  max:50,   fmt:'JPG'}, sig:{w:200,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'jkssb',        name:'JKSSB',                    cat:'Police',    photo:{w:180,  h:225,  min:20,  max:50,   fmt:'JPG'}, sig:{w:180,  h:100,  min:10,  max:20,  fmt:'JPG'}},
  {slug:'osssc',        name:'OSSSC (Odisha)',            cat:'Police',    photo:{w:200,  h:240,  min:20,  max:100,  fmt:'JPG'}, sig:{w:140,  h:60,   min:10,  max:50,  fmt:'JPG'}},
  {slug:'rsmssb',       name:'RSMSSB (Rajasthan)',        cat:'Police',    photo:{w:240,  h:320,  min:20,  max:50,   fmt:'JPG'}, sig:{w:280,  h:80,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'delhi-judicial',name:'Delhi Judicial',          cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'patna-hc',     name:'Patna High Court',         cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'bombay-hc',    name:'Bombay High Court',        cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:120,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'raj-judicial', name:'Rajasthan Judicial',       cat:'Judiciary', photo:{w:240,  h:320,  min:20,  max:50,   fmt:'JPG'}, sig:{w:280,  h:80,   min:20,  max:50,  fmt:'JPG'}},
  {slug:'mah-judicial', name:'Maharashtra Judicial',     cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:50,   fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:20,  fmt:'JPG'}},
  {slug:'gauhati-hc',   name:'Gauhati High Court',       cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:100,  fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:50,  fmt:'JPG'}},
  {slug:'cg-judicial',  name:'CG Judicial Service',      cat:'Judiciary', photo:{w:200,  h:240,  min:20,  max:100,  fmt:'JPG'}, sig:{w:140,  h:80,   min:10,  max:100, fmt:'JPG'}},
];

const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="width:20px;height:20px;margin:0 1px 2px;vertical-align:middle"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function generatePage(exam, docType) {
  const spec   = docType === 'photo' ? exam.photo : exam.sig;
  const label  = docType === 'photo' ? 'Photo' : 'Signature';
  const other  = docType === 'photo' ? 'signature' : 'photo';
  const otherL = docType === 'photo' ? 'Signature' : 'Photo';
  const slugDir  = `${exam.slug}-${docType}-resize`;
  const dirName  = `resizer/${slugDir}`;
  const canonical = `https://ilovexams.in/resizer/${slugDir}/`;
  const toolURL   = `/resizer/?exam=${exam.slug}&document=${docType}`;

  const title = `${exam.name} ${label} Size & Resize – ${spec.w}×${spec.h}px ${spec.min}–${spec.max}KB | ILoveExams`;
  const desc  = `Resize your ${exam.name} ${label.toLowerCase()} to exact ${spec.w}×${spec.h} pixels, ${spec.min}–${spec.max} KB ${spec.fmt} format. Free, instant, 100% private. No upload to server. Works on mobile.`;

  const otherSpec = docType === 'photo' ? exam.sig : exam.photo;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9837613085159910" crossorigin="anonymous"><\/script>

  <!-- Primary SEO -->
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta name="author" content="ILoveExams">
  <meta name="theme-color" content="#0a0e1a">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="ILoveExams">
  <meta property="og:title"       content="${exam.name} ${label} Size – ${spec.w}×${spec.h}px | ILoveExams">
  <meta property="og:description" content="${desc}">
  <meta property="og:url"         content="${canonical}">
  <meta property="og:image"       content="https://ilovexams.in/og-image.png">
  <meta property="og:locale"      content="en_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${exam.name} ${label} Size – ${spec.w}×${spec.h}px | ILoveExams">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image"       content="https://ilovexams.in/og-image.png">

  <!-- Geo -->
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">

  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Fonts + Tailwind -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>

  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; }
    .hero-nav { background: #0a0e1a; border-bottom: 1px solid rgba(255,255,255,.08); position: sticky; top: 0; z-index: 50; }
    .hero-nav-inner { max-width: 900px; margin: 0 auto; padding: 0 16px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
    .logo { text-decoration: none; display: flex; align-items: center; gap: 0; }
    .logo-i, .logo-e { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .logo-in { font-size: 12px; color: rgba(255,255,255,.3); font-weight: 500; margin-left: 2px; align-self: flex-end; margin-bottom: 3px; }
    .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; transition: all .2s; }
    .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,.4); }
    .spec-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .spec-row:last-child { border-bottom: none; }
    .badge { background: #dbeafe; color: #2563eb; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
    .step-num { width: 28px; height: 28px; background: #3b82f6; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
    .faq-q { font-weight: 700; color: #0f172a; font-size: 14px; padding: 14px 16px; background: #fff; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
    .faq-a { font-size: 14px; color: #475569; padding: 0 16px 14px; background: #fff; line-height: 1.6; }
  </style>

  <!-- Structured data: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://ilovexams.in/"},
      {"@type":"ListItem","position":2,"name":"${exam.cat}","item":"https://ilovexams.in/"},
      {"@type":"ListItem","position":3,"name":"${exam.name} ${label} Resize","item":"${canonical}"}
    ]
  }
  <\/script>

  <!-- Structured data: HowTo -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to resize ${exam.name} ${label.toLowerCase()} online",
    "description": "Step-by-step guide to resize your ${exam.name} ${label.toLowerCase()} to ${spec.w}×${spec.h}px and ${spec.min}–${spec.max}KB ${spec.fmt} as required.",
    "totalTime": "PT2M",
    "estimatedCost": {"@type":"MonetaryAmount","currency":"INR","value":"0"},
    "step": [
      {"@type":"HowToStep","position":1,"name":"Open the resize tool","text":"Click the Resize Now button above. ${exam.name} is pre-selected automatically."},
      {"@type":"HowToStep","position":2,"name":"Upload your ${label.toLowerCase()}","text":"Click the upload area or drag and drop your image. JPG, PNG, HEIC and WEBP are supported."},
      {"@type":"HowToStep","position":3,"name":"Crop and adjust","text":"Use the crop tool to frame correctly. You can zoom, rotate, flip, or remove background."},
      {"@type":"HowToStep","position":4,"name":"Process image","text":"Click Process Image. The tool automatically resizes to ${spec.w}×${spec.h}px and compresses to ${spec.min}–${spec.max}KB."},
      {"@type":"HowToStep","position":5,"name":"Download","text":"Click Download Image to save the resized ${label.toLowerCase()} to your device."}
    ]
  }
  <\/script>

  <!-- Structured data: FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the ${label.toLowerCase()} size for ${exam.name}?",
        "acceptedAnswer": {"@type":"Answer","text":"${exam.name} requires a ${label.toLowerCase()} of ${spec.w}×${spec.h} pixels in ${spec.fmt} format. The file size must be between ${spec.min} KB and ${spec.max} KB."}
      },
      {
        "@type": "Question",
        "name": "How do I resize my ${exam.name} ${label.toLowerCase()} for free?",
        "acceptedAnswer": {"@type":"Answer","text":"Use ILoveExams.in — a free online tool. Click Resize Now, upload your image, and the tool automatically resizes it to ${spec.w}×${spec.h}px and compresses it to under ${spec.max}KB. No software installation needed."}
      },
      {
        "@type": "Question",
        "name": "Is my image safe when using ILoveExams?",
        "acceptedAnswer": {"@type":"Answer","text":"Yes. ILoveExams processes all images entirely in your browser using HTML5 Canvas. Your images are never uploaded to any server, ensuring 100% privacy."}
      },
      {
        "@type": "Question",
        "name": "What format does ${exam.name} ${label.toLowerCase()} require?",
        "acceptedAnswer": {"@type":"Answer","text":"${exam.name} requires the ${label.toLowerCase()} in ${spec.fmt} format with dimensions ${spec.w}×${spec.h} pixels and file size between ${spec.min} KB and ${spec.max} KB."}
      }
    ]
  }
  <\/script>
</head>
<body>

<!-- Sticky Nav -->
<nav class="hero-nav">
  <div class="hero-nav-inner">
    <a href="/" class="logo">
      <span class="logo-i">I</span>${SVG_HEART}<span class="logo-e">Exams</span><span class="logo-in">.in</span>
    </a>
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:11px;color:#93c5fd;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);padding:4px 10px;border-radius:999px;white-space:nowrap">● 100% Private</span>
      <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener"
         style="font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap">♥ Donate</a>
    </div>
  </div>
</nav>

<!-- Hero -->
<div style="background:linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%);padding:48px 16px 40px">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.25);border-radius:999px;padding:4px 12px;margin-bottom:16px">
      <span style="font-size:11px;font-weight:700;color:#93c5fd;text-transform:uppercase;letter-spacing:.08em">${exam.cat}</span>
    </div>
    <h1 style="font-size:clamp(22px,4vw,36px);font-weight:900;color:#fff;margin:0 0 12px;line-height:1.2">
      ${exam.name} ${label} Size &amp; Free Online Resize Tool
    </h1>
    <p style="color:rgba(255,255,255,.6);font-size:16px;margin:0 0 28px;max-width:600px">
      Resize your ${exam.name} ${label.toLowerCase()} to exactly <strong style="color:#fff">${spec.w}×${spec.h} pixels</strong>,
      <strong style="color:#fff">${spec.min}–${spec.max} KB</strong>, ${spec.fmt} format — free, instant, private.
    </p>

    <!-- Spec chips -->
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px">
      <span style="background:rgba(255,255,255,.08);color:#e2e8f0;border:1px solid rgba(255,255,255,.12);padding:6px 14px;border-radius:8px;font-size:13px;font-family:monospace">📐 ${spec.w}×${spec.h} px</span>
      <span style="background:rgba(255,255,255,.08);color:#e2e8f0;border:1px solid rgba(255,255,255,.12);padding:6px 14px;border-radius:8px;font-size:13px;font-family:monospace">💾 ${spec.min}–${spec.max} KB</span>
      <span style="background:rgba(255,255,255,.08);color:#e2e8f0;border:1px solid rgba(255,255,255,.12);padding:6px 14px;border-radius:8px;font-size:13px;font-family:monospace">🖼 ${spec.fmt}</span>
      <span style="background:rgba(59,130,246,.2);color:#93c5fd;border:1px solid rgba(59,130,246,.3);padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600">✓ Free Tool</span>
    </div>

    <a href="${toolURL}" class="cta-btn" style="font-size:16px;padding:14px 28px;border-radius:14px">
      Resize ${exam.name} ${label} Now →
    </a>
    <a href="/resizer/${exam.slug}-${other}-resize/" style="display:inline-flex;align-items:center;gap:6px;margin-left:12px;color:rgba(255,255,255,.5);font-size:13px;text-decoration:none">
      Switch to ${otherL} →
    </a>
  </div>
</div>

<!-- Main Content -->
<div style="max-width:900px;margin:0 auto;padding:40px 16px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px" class="lg:grid-cols-2">

    <!-- Specs Card -->
    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px">
      <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 16px">
        📋 ${exam.name} ${label} Requirements
      </h2>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Width</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${spec.w} px</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Height</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${spec.h} px</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">File Size</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${spec.min} – ${spec.max} KB</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Format</span>
        <span class="badge">${spec.fmt}</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Document Type</span>
        <span class="badge">${label}</span>
      </div>
      <a href="${toolURL}" class="cta-btn" style="font-size:14px;padding:10px 20px;margin-top:16px;border-radius:10px;width:100%;justify-content:center">
        Resize Now – It's Free →
      </a>
    </div>

    <!-- Also resize card -->
    <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px">
      <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 16px">
        ✍ ${exam.name} ${otherL} Requirements
      </h2>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Width</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${otherSpec.w} px</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Height</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${otherSpec.h} px</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">File Size</span>
        <span style="font-size:14px;font-weight:700;color:#0f172a;font-family:monospace">${otherSpec.min} – ${otherSpec.max} KB</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Format</span>
        <span class="badge">${otherSpec.fmt}</span>
      </div>
      <div class="spec-row">
        <span style="font-size:14px;color:#64748b;font-weight:500">Document Type</span>
        <span class="badge">${otherL}</span>
      </div>
      <a href="/resizer/${exam.slug}-${other}-resize/" class="cta-btn" style="font-size:14px;padding:10px 20px;margin-top:16px;border-radius:10px;width:100%;justify-content:center;background:linear-gradient(135deg,#475569,#334155)">
        Resize ${otherL} →
      </a>
    </div>

  </div>

  <!-- How to resize -->
  <div style="margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 20px">
      How to Resize ${exam.name} ${label} – Step by Step
    </h2>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span class="step-num">1</span>
        <div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Open the resize tool</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Click "Resize Now" above — <strong>${exam.name}</strong> loads pre-selected automatically.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span class="step-num">2</span>
        <div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Upload your ${label.toLowerCase()}</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Click the upload area or drag-and-drop. Supports JPG, PNG, HEIC, WEBP up to 15 MB.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span class="step-num">3</span>
        <div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Crop &amp; adjust</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Use the crop tool to frame correctly. Zoom, rotate, flip, or use AI background removal.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span class="step-num">4</span>
        <div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Process image</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Click Process Image. Automatically resized to <strong>${spec.w}×${spec.h}px</strong> and compressed to <strong>${spec.min}–${spec.max}KB</strong>.</p></div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span class="step-num">5</span>
        <div><p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Download &amp; use</p><p style="margin:4px 0 0;color:#64748b;font-size:13px">Click Download to save. Ready to upload on the ${exam.name} application portal.</p></div>
      </div>
    </div>
    <div style="margin-top:20px;text-align:center">
      <a href="${toolURL}" class="cta-btn" style="font-size:15px;padding:12px 32px;border-radius:12px">
        Start Resizing – Free &amp; Instant →
      </a>
    </div>
  </div>

  <!-- FAQ -->
  <div style="margin-top:32px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">
      Frequently Asked Questions
    </h2>
    <div class="faq-item">
      <div class="faq-q">What is the ${label.toLowerCase()} size for ${exam.name}?</div>
      <div class="faq-a">${exam.name} requires a ${label.toLowerCase()} of <strong>${spec.w}×${spec.h} pixels</strong> in <strong>${spec.fmt}</strong> format. The file size must be between <strong>${spec.min} KB and ${spec.max} KB</strong>. ILoveExams automatically resizes and compresses your image to meet these exact requirements.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is ILoveExams free to use for ${exam.name}?</div>
      <div class="faq-a">Yes, ILoveExams is completely free. There are no hidden charges, no account required, and no limits on the number of images you can resize. All processing happens in your browser — nothing is uploaded to any server.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Does it work on mobile phones?</div>
      <div class="faq-a">Yes. ILoveExams works fully on Android and iPhone browsers. Open ilovexams.in in Chrome or Safari, upload your ${label.toLowerCase()} from your gallery, and download the resized image — no app needed.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Can I also resize the ${otherL.toLowerCase()} for ${exam.name}?</div>
      <div class="faq-a">Yes. ${exam.name} ${otherL.toLowerCase()} requires <strong>${otherSpec.w}×${otherSpec.h}px</strong>, <strong>${otherSpec.min}–${otherSpec.max}KB</strong>, ${otherSpec.fmt} format. <a href="/resizer/${exam.slug}-${other}-resize/" style="color:#3b82f6">Click here to resize your ${exam.name} ${otherL.toLowerCase()}</a>.</div>
    </div>
  </div>

  <!-- Related exams -->
  <div style="margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px">
    <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 14px">Other ${exam.cat} Exams</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${EXAMS.filter(e => e.cat === exam.cat && e.slug !== exam.slug).slice(0, 8).map(e =>
        `<a href="/resizer/${e.slug}-photo-resize/" style="font-size:13px;color:#3b82f6;background:#eff6ff;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;text-decoration:none">${e.name}</a>`
      ).join('\n      ')}
    </div>
  </div>

</div>

<!-- Footer -->
<footer style="background:#0a0e1a;color:rgba(255,255,255,.5);margin-top:40px;padding:28px 16px;text-align:center">
  <a href="/" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:0;margin-bottom:8px">
    <span style="font-size:20px;font-weight:900;color:#fff">I</span>${SVG_HEART}<span style="font-size:20px;font-weight:900;color:#fff">Exams</span><span style="font-size:12px;color:rgba(255,255,255,.25);font-weight:500;margin-left:2px;align-self:flex-end;margin-bottom:2px">.in</span>
  </a>
  <p style="font-size:12px;margin:0 0 8px">Free photo &amp; signature resizer for 80+ Indian competitive exams</p>
  <p style="font-size:11px;margin:0;color:rgba(255,255,255,.25)">
    <a href="/" style="color:rgba(255,255,255,.4);text-decoration:none">Home</a> ·
    <a href="/resizer/${exam.slug}-photo-resize/" style="color:rgba(255,255,255,.4);text-decoration:none">${exam.name} Photo</a> ·
    <a href="/resizer/${exam.slug}-signature-resize/" style="color:rgba(255,255,255,.4);text-decoration:none">${exam.name} Signature</a> ·
    <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener" style="color:rgba(239,68,68,.6);text-decoration:none">♥ Donate</a>
  </p>
</footer>

</body>
</html>`;

  const dir = path.join(__dirname, dirName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// Generate all pages
let count = 0;
const sitemapEntries = [];
const today = '2026-05-31';

EXAMS.forEach(exam => {
  ['photo', 'signature'].forEach(docType => {
    generatePage(exam, docType);
    const slugDir = `${exam.slug}-${docType}-resize`;
    sitemapEntries.push(`  <url><loc>https://ilovexams.in/resizer/${slugDir}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    count++;
  });
});

console.log(`✅ Generated ${count} pages`);

// Write updated sitemap
const existingSitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
const insertBefore = '</urlset>';
const newSitemap = existingSitemap.replace(
  insertBefore,
  `\n  <!-- Individual exam landing pages -->\n${sitemapEntries.join('\n')}\n\n${insertBefore}`
);
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), newSitemap, 'utf8');
console.log(`✅ Sitemap updated with ${count} new URLs`);
