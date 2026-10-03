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
  {slug:'jee-main',     name:'JEE Main',                 cat:'Entrance',  photo:{w:275,  h:354,  min:10,  max:200,  fmt:'JPG'}, sig:{w:275,  h:118,  min:10,  max:100, fmt:'JPG'}},
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
  'kpsc':           { short: 'Kerala PSC',      alt: ['KPSC Kerala', 'Kerala PSC Thulasi'],
                      nameDate: { strip: 0.25, rule: 'Kerala PSC requires your <strong>name</strong> and the <strong>date the photo was taken</strong> printed at the bottom of the photo.' },
                      note: 'This page is for <strong>Kerala PSC</strong> (Thulasi one-time registration). Applying to <strong>Karnataka PSC</strong> (kpsc.kar.nic.in)? Its photo and signature limits differ by notification — check yours, then set the exact width, height and KB in the <a href="/jpg-resize/">JPG resizer</a>.' },
  'tnpsc':          { short: 'TNPSC',           alt: ['Tamil Nadu PSC', 'TNPSC Group 4', 'TNPSC Group 2', 'TNPSC photo compressor'],
                      // TNPSC OTR: name (CAPITALS, as in SSLC) + photo date printed in a 1.5 cm strip at the bottom of a 3.5×4.5 cm photo
                      nameDate: { strip: 0.33, rule: 'TNPSC requires your <strong>name in CAPITAL letters (as on your SSLC mark sheet)</strong> and the <strong>date the photo was taken (DD/MM/YYYY)</strong> printed in a strip at the bottom of the photo.' } },
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
    tip: 'Press your left thumb on a blue or black ink pad, then on plain white paper. Photograph or scan it in good light, with no smudges.',
    steps: ['Use a blue or black stamp-pad ink — not pen ink smeared on the thumb.',
      'Press your left thumb lightly on the pad so it is evenly coated, without excess ink.',
      'Place the thumb on plain white paper and roll it gently once from one side to the other, then lift straight up.',
      'Make 3–4 impressions and pick the one where the ridges are clearest.',
      'Photograph it from directly above in daylight, then crop to a square around the print in the tool below.'],
    mistakes: ['A black blob with no visible ridges (too much ink)', 'A faint, patchy print (too little ink or pressure)',
      'Right thumb used when the left is available', 'Shadows, fingers or the ink pad visible in the photo',
      'The print is tiny in a large white frame — crop close'] },
  'declaration': { label: 'Handwritten Declaration', short: 'Declaration', w: 800, h: 400, min: 50, max: 100, fmt: 'JPG',
    tip: 'Write the declaration in English, in your own handwriting, with black ink on white paper. Capital letters are not accepted.',
    steps: ['Take a plain white A4 sheet and a black ink pen.',
      'Write the declaration text in English, in your normal running handwriting, filling in your own name.',
      'Keep it to 3–4 even lines so it stays readable at 800×400 pixels.',
      'Photograph the sheet flat, from directly above, in daylight.',
      'Crop close around the text (a wide 2:1 shape) in the tool below and download the JPG.'],
    mistakes: ['Text written in CAPITAL letters', 'Typed or printed text instead of handwriting',
      'Written by someone else, or in a language other than English (unless the notification allows it)',
      'Blue or faint pen that becomes unreadable after compression', 'Wrong text — always copy the text given in your notification'] },
};
const DECLARATION_TEXT = 'I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.';

// NEET-UG also asks for a postcard-size (4×6 inch) photo. NTA gives inches + KB only;
// 600×900 px is 4×6 inch at 150 DPI and stays comfortably inside 10–200 KB.
const NEET_POSTCARD = { exam: 'neet-ug', key: 'postcard-photo', label: 'Postcard Size Photo', short: 'Postcard Photo',
  w: 600, h: 900, min: 10, max: 200, fmt: 'JPG', inches: '4×6 inch',
  tip: 'Use a recent colour photo with a white background and your face clearly visible — the same photo as your passport-size upload.' };

// Generic size pages driven by search demand, in addition to every size used by an exam
const EXTRA_SIZES = [
  { w: 150, h: 200, max: 50 }, { w: 250, h: 250, max: 50 }, { w: 200, h: 200, max: 50 },
  { w: 300, h: 300, max: 100 }, { w: 140, h: 40, max: 20 }, { w: 600, h: 600, max: 100 },
  { w: 413, h: 531, max: 100 }, { w: 350, h: 450, max: 100 }, { w: 100, h: 120, max: 50 },
];

// Exam-specific "where & how to upload" guidance for the highest-traffic exams.
// Only facts that hold across cycles — always defer to the current notification.
const IBPS = { body: 'IBPS', url: 'https://www.ibps.in/', tips: [
  'IBPS forms need <strong>four uploads</strong>: photo, signature, left thumb impression and handwritten declaration — the form will not submit until all four are in.',
  'The uploaded photo is printed on your call letter and matched at the exam centre and document verification. Keep a printed copy of the same photo.',
  'Sign in your normal running hand — IBPS rejects signatures in CAPITAL letters and compares your signature at every stage.',
  'Upload in the first days of the window: the portal slows down near the last date.'] };
const NTA = tipsExtra => ({ body: 'National Testing Agency (NTA)', url: 'https://nta.ac.in/', tips: [
  'NTA asks for a recent colour photo with about 80% of the face visible, plain white background, without a mask or cap.',
  'Use the same photo on exam day — NTA checks it against you at the centre.', ...tipsExtra] });
const GUIDES = {
  'ibps-rrb-clerk': IBPS, 'ibps-rrb-po': IBPS, 'ibps-po': IBPS, 'ibps-clerk': IBPS, 'ibps-so': IBPS,
  'sbi-po': { body: 'State Bank of India', url: 'https://sbi.co.in/web/careers', tips: IBPS.tips.slice(0, 3) },
  'sbi-clerk': { body: 'State Bank of India', url: 'https://sbi.co.in/web/careers', tips: IBPS.tips.slice(0, 3) },
  'niacl': { body: 'The New India Assurance Co. Ltd.', url: 'https://www.newindia.co.in/', tips: [
    'NIACL uses the IBPS-style form: photo, signature, left thumb impression and handwritten declaration are all required.',
    'Your signature must not be in capital letters; keep it identical to the one you will sign at the exam centre.'] },
  'post-gds': { body: 'India Post (Gramin Dak Sevak)', url: 'https://indiapostgdsonline.gov.in/', tips: [
    'GDS has two steps: <strong>register</strong> first to get a registration number, then <strong>apply</strong> — the photo and signature are uploaded during the application.',
    'Selection is on Class 10 marks with no written exam, so a rejected or unclear upload can cost you the post — check the preview before submitting.',
    'Keep the same mobile number and email for the whole process; the registration number is sent there.'] },
  'ukpsc': { body: 'Uttarakhand Public Service Commission', url: 'https://psc.uk.gov.in/', tips: [
    'UKPSC checks both pixel size and file size — a 150×200 photo must also stay within 30–50 KB.',
    'Use a recent photo with a plain light background; the same photo appears on your admit card.',
    'Prepare the signature (150×100 px, 20–30 KB) before you start the form so you can finish in one sitting.'] },
  'tnpsc': { body: 'Tamil Nadu Public Service Commission', url: 'https://www.tnpsc.gov.in/', tips: [
    'Photo and signature are uploaded once in your <strong>One Time Registration (OTR)</strong> and reused for every TNPSC exam you apply to.',
    'Print your name in CAPITAL letters exactly as on your SSLC mark sheet, and the date the photo was taken (DD/MM/YYYY), at the bottom of the photo.',
    'The photo must be recent — within three months of the notification.'] },
  'kpsc': { body: 'Kerala Public Service Commission', url: 'https://thulasi.psc.kerala.gov.in/', tips: [
    'Kerala PSC uses a one-time profile (Thulasi): the photo you upload is used for all applications from your profile.',
    'Your name and the date the photo was taken must be printed at the bottom of the photo.'] },
  'apsc': { body: 'Assam Public Service Commission', url: 'https://apsc.nic.in/', tips: [
    'Keep the photo at 200×250 px within 20–50 KB and the signature at 140×60 px within 10–20 KB.',
    'Certificates for APSC applications are usually uploaded separately as PDFs — use Compress PDF if they are over the limit.'] },
  'csir-net': NTA(['CSIR NET is conducted by NTA, so photo rules match other NTA exams.']),
  'ugc-net': NTA(['UGC NET is conducted by NTA, so photo rules match other NTA exams.']),
  'jee-main': NTA(['JEE Main uses passport-size (3.5×4.5 cm) photos — 275×354 px at 200 DPI.']),
  'neet-ug': NTA(['NEET also asks for a postcard-size (4×6 inch) photo — use the postcard photo resizer.']),
  'cuet': NTA([]),
  'cat': { body: 'IIM CAT', url: 'https://iimcat.ac.in/', tips: [
    'CAT photo and signature are uploaded during registration, usually open in August–September.',
    'CAT asks for large, square photos (1200×1200 px) — start from a sharp original so the result is not blurry.'] },
  'rpsc': { body: 'Rajasthan Public Service Commission', url: 'https://rpsc.rajasthan.gov.in/', tips: [
    'RPSC applications are filled through your <strong>SSO Rajasthan</strong> ID (sso.rajasthan.gov.in) using the One Time Registration profile.',
    'Your photo and signature in the OTR profile are reused for future RPSC applications — keep them up to date.'] },
  'gpsc': { body: 'Gujarat Public Service Commission', url: 'https://gpsc-ojas.gujarat.gov.in/', tips: [
    'GPSC applications run on OJAS: fill the form, note your confirmation number, then upload photo and signature with it.',
    'GPSC limits are tight (photo 10–15 KB) — the resizer compresses to fit automatically.'] },
  'osssc': { body: 'Odisha Subordinate Staff Selection Commission', url: 'https://osssc.gov.in/', tips: [
    'Keep the photo at 200×240 px within 20–100 KB and the signature at 140×60 px within 10–50 KB.'] },
  'afcat': { body: 'Indian Air Force (AFCAT)', url: 'https://afcat.cdac.in/', tips: [
    'AFCAT photos should be formal and front-facing with a plain background — they are verified again at the AFSB interview.'] },
};

module.exports = { GUIDES, EXAMS, SEO, seoOf, CATEGORIES, BANK_EXTRA_EXAMS, BANK_EXTRA_DOCS, DECLARATION_TEXT, EXTRA_SIZES, NEET_POSTCARD };
