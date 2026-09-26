/**
 * Single source of truth for exam photo/signature specs + SEO metadata.
 * Used by generate-pages.js, generate-seo-hubs.js and (via build) the resizer engine table.
 * Keep specs in sync with the EXAMS array inside resizer/index.html (checked by generate-seo-hubs.js).
 */

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

// Short name used in <title> (what people actually type) + extra search
// variants woven into the page copy. Only exams with notable search demand.
const SEO = {
  'ibps-rrb-clerk': { short: 'IBPS RRB Clerk',  alt: ['IBPS RRB Office Assistant', 'RRB Clerk', 'IBPS RRB Assistant'] },
  'ibps-rrb-po':    { short: 'IBPS RRB PO',     alt: ['IBPS RRB Officer Scale I', 'RRB PO'] },
  'post-gds':       { short: 'India Post GDS',  alt: ['GDS', 'Gramin Dak Sevak', 'Post Office GDS'] },
  'niacl':          { short: 'NIACL AO',        alt: ['New India Assurance AO', 'NIACL Assistant'] },
  'cat':            { short: 'CAT',             alt: ['IIM CAT', 'CAT exam'] },
  'ukpsc':          { short: 'UKPSC',           alt: ['Uttarakhand PSC'] },
  'kpsc':           { short: 'Kerala PSC',      alt: ['KPSC', 'Kerala PSC Thulasi'] },
  'tnpsc':          { short: 'TNPSC',           alt: ['Tamil Nadu PSC', 'TNPSC Group 4', 'TNPSC Group 2'] },
  'apsc':           { short: 'APSC',            alt: ['Assam PSC', 'APSC CCE'] },
  'csir-net':       { short: 'CSIR NET',        alt: ['CSIR UGC NET', 'NTA CSIR NET'] },
  'ugc-net':        { short: 'UGC NET',         alt: ['NTA UGC NET'] },
  'rpf-si':         { short: 'RPF SI',          alt: ['RPF Sub Inspector'] },
  'rpf-constable':  { short: 'RPF Constable',   alt: ['RPF'] },
  'osssc':          { short: 'OSSSC',           alt: ['Odisha SSSC', 'OSSSC CRE'] },
  'rpsc':           { short: 'RPSC',            alt: ['RAS', 'Rajasthan PSC', 'RPSC RAS'] },
  'jkssb':          { short: 'JKSSB',           alt: ['J&K SSB', 'Jammu Kashmir SSB'] },
  'ssc-gd':         { short: 'SSC GD',          alt: ['SSC GD Constable'] },
  'ssc-cpo':        { short: 'SSC CPO',         alt: ['SSC CPO SI', 'Delhi Police SI'] },
  'neet-ug':        { short: 'NEET',            alt: ['NEET UG', 'NTA NEET'] },
  'upsc':           { short: 'UPSC',            alt: ['UPSC CSE', 'UPSC IAS', 'UPSC Prelims'] },
  'gpsc':           { short: 'GPSC',            alt: ['Gujarat PSC', 'OJAS'] },
  'mpsc':           { short: 'MPSC',            alt: ['Maharashtra PSC'] },
  'wbprb':          { short: 'WBPRB',           alt: ['WB Police', 'West Bengal Police'] },
  'bpsc':           { short: 'BPSC',            alt: ['Bihar PSC', 'BPSC TRE'] },
  'uppsc':          { short: 'UPPSC',           alt: ['UP PSC', 'UPPSC PCS'] },
  'afcat':          { short: 'AFCAT',           alt: ['Air Force AFCAT'] },
  'patna-hc':       { short: 'Patna High Court', alt: ['Patna HC'] },
  'bombay-hc':      { short: 'Bombay High Court', alt: ['Bombay HC'] },
};
const seoOf = e => SEO[e.slug] || { short: e.name.replace(/\s*\(.*\)$/, ''), alt: [] };

// Category hub pages: /resizer/{hub}/
const CATEGORIES = {
  'UPSC':      { hub: 'upsc-exam-photo-signature-size',      title: 'UPSC Exams' },
  'SSC':       { hub: 'ssc-exam-photo-signature-size',       title: 'SSC Exams' },
  'Banking':   { hub: 'bank-exam-photo-signature-size',      title: 'Bank Exams (IBPS, SBI, RBI)' },
  'Defence':   { hub: 'defence-exam-photo-signature-size',   title: 'Defence Exams' },
  'Railways':  { hub: 'railway-exam-photo-signature-size',   title: 'Railway Exams (RRB, RPF)' },
  'Entrance':  { hub: 'entrance-exam-photo-signature-size',  title: 'Entrance Exams (JEE, NEET, CAT)' },
  'Central':   { hub: 'central-govt-exam-photo-signature-size', title: 'Central Govt Exams' },
  'State PSC': { hub: 'state-psc-photo-signature-size',      title: 'State PSC Exams' },
  'Police':    { hub: 'police-exam-photo-signature-size',    title: 'Police & State SSB Exams' },
  'Judiciary': { hub: 'judiciary-exam-photo-signature-size', title: 'Judiciary & High Court Exams' },
};

// IBPS-pattern online applications also ask for a left thumb impression and
// a handwritten declaration, with these standard specs.
const BANK_EXTRA_EXAMS = ['ibps-po', 'ibps-clerk', 'ibps-rrb-po', 'ibps-rrb-clerk', 'ibps-so',
  'sbi-po', 'sbi-clerk', 'rbi-grade-b', 'rbi-assistant', 'niacl', 'lic-aao'];
const BANK_EXTRA_DOCS = {
  'thumb-impression': { label: 'Left Thumb Impression', short: 'Thumb Impression', w: 240, h: 240, min: 20, max: 50, fmt: 'JPG',
    tip: 'Press your left thumb on a blue or black ink pad, then on plain white paper. Photograph or scan it in good light, with no smudges.' },
  'declaration': { label: 'Handwritten Declaration', short: 'Declaration', w: 800, h: 400, min: 50, max: 100, fmt: 'JPG',
    tip: 'Write the declaration in English, in your own handwriting, with black ink on white paper. Capital letters are not accepted.' },
};
const DECLARATION_TEXT = 'I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.';

// Generic size pages driven by search demand, in addition to every size used by an exam
const EXTRA_SIZES = [
  { w: 150, h: 200, max: 50 }, { w: 250, h: 250, max: 50 }, { w: 200, h: 200, max: 50 },
  { w: 300, h: 300, max: 100 }, { w: 140, h: 40, max: 20 }, { w: 600, h: 600, max: 100 },
  { w: 413, h: 531, max: 100 }, { w: 350, h: 450, max: 100 }, { w: 100, h: 120, max: 50 },
];

module.exports = { EXAMS, SEO, seoOf, CATEGORIES, BANK_EXTRA_EXAMS, BANK_EXTRA_DOCS, DECLARATION_TEXT, EXTRA_SIZES };
