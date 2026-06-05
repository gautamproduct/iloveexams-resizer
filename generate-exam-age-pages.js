#!/usr/bin/env node
/**
 * Generates exam-specific age calculator pages.
 * Each page is a fully-working age calculator with exam-specific eligibility rules,
 * targeting long-tail searches like "age calculator for upsc", "ssc cgl age limit 2025".
 * Run: node generate-exam-age-pages.js
 */
const fs = require('fs');
const path = require('path');

const TODAY = '2026-06-05';
const AD_SLOT = '8189529514';
const AD_CLIENT = 'ca-pub-9837613085159910';

const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display:inline-block;width:.9em;height:.9em;vertical-align:middle;margin:0 1px 3px"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const adSlot = () => `
<aside aria-label="Sponsored content" style="max-width:720px;margin:28px auto;padding:0 16px">
  <p style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.12em;margin:0 0 6px">ADVERTISEMENT</p>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;min-height:260px;display:flex;align-items:center;justify-content:center">
    <ins class="adsbygoogle" style="display:block;width:100%;min-height:230px" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  </div>
</aside>
<script>(function(){try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}})();<\/script>`;

const EXAMS = [
  {
    slug: 'age-calculator-for-upsc',
    name: 'UPSC CSE (IAS/IPS/IFS)',
    shortName: 'UPSC CSE',
    fullName: 'UPSC Civil Services Examination',
    cutoffLabel: '1 August of the exam year',
    cutoffMonthISO: '08-01',
    keywords: 'age calculator for upsc, upsc age limit, upsc cse age calculator 2025, am i eligible for upsc, upsc age limit general category, upsc ias age limit',
    desc: 'Check your age eligibility for UPSC Civil Services Examination (IAS/IPS/IFS). Enter your date of birth to instantly see if you meet the age criteria for the current UPSC CSE notification.',
    minAge: 21,
    elig: [
      { cat: 'General', min: 21, max: 32, attempts: '6' },
      { cat: 'OBC (Non-Creamy Layer)', min: 21, max: 35, attempts: '9' },
      { cat: 'SC / ST', min: 21, max: 37, attempts: 'Unlimited' },
      { cat: 'PwBD (General/OBC)', min: 21, max: 42, attempts: '9' },
      { cat: 'PwBD (SC/ST)', min: 21, max: 42, attempts: 'Unlimited' },
      { cat: 'Ex-Servicemen (General/OBC)', min: 21, max: 37, attempts: '6/9' },
      { cat: 'J&K Domicile (General)', min: 21, max: 37, attempts: '6' },
    ],
    qual: "Bachelor's degree in any discipline from a recognised university. Final-year graduates can also apply.",
    resizerLink: '/resizer/?document=photo',
    photoLink: '/upsc-photo-size/',
    faqs: [
      { q: 'What is the UPSC CSE age limit for general category?', a: 'The general category age limit for UPSC Civil Services Examination is 21 to 32 years as of 1 August of the exam year. You must be at least 21 but not have turned 32 before 2 August of the exam year.' },
      { q: 'How many attempts are allowed for UPSC CSE?', a: 'General category: 6 attempts. OBC: 9 attempts. SC/ST: unlimited attempts (up to the age limit). PwBD (General/OBC): 9 attempts. PwBD (SC/ST): unlimited.' },
      { q: 'What is the cut-off date for UPSC CSE age calculation?', a: 'UPSC calculates your age as of 1 August of the exam year. If you are applying for UPSC CSE 2025, your age is calculated on 1 August 2025.' },
      { q: 'What is the UPSC qualification requirement?', a: "A bachelor's degree from a recognised university in any subject. Final-year students waiting for results can also apply, but must furnish proof at the time of interview/DAF filling." },
      { q: 'Can I apply for UPSC CSE at 21?', a: 'Yes. The minimum age is 21 years as on 1 August of the exam year. If you turn 21 on or before 1 August of the year the exam is held, you are eligible.' },
      { q: 'Does age relaxation apply automatically for OBC/SC/ST?', a: 'No. You must claim your category at the time of application and submit a valid caste certificate during the document verification stage. Without the certificate, the relaxation is not granted.' },
      { q: 'What is the age limit for UPSC NDA?', a: 'UPSC NDA has a separate age limit: candidates must be between 16.5 and 19.5 years on the first day of the month in which the course commences. This is different from UPSC CSE.' },
    ],
  },
  {
    slug: 'age-calculator-for-ssc-cgl',
    name: 'SSC CGL',
    shortName: 'SSC CGL',
    fullName: 'SSC Combined Graduate Level Examination',
    cutoffLabel: '1 January of the exam year',
    cutoffMonthISO: '01-01',
    keywords: 'age calculator for ssc cgl, ssc cgl age limit, ssc cgl age calculator 2025, ssc cgl age limit general, am i eligible for ssc cgl',
    desc: 'Check your age eligibility for SSC CGL (Combined Graduate Level). Enter your date of birth to see if you meet the age requirement for the latest SSC CGL notification.',
    minAge: 18,
    elig: [
      { cat: 'General (most posts)', min: 18, max: 32, attempts: 'No limit' },
      { cat: 'General (Group B/C posts)', min: 18, max: 27, attempts: 'No limit' },
      { cat: 'OBC (Non-Creamy Layer)', min: 18, max: 35, attempts: 'No limit' },
      { cat: 'SC / ST', min: 18, max: 37, attempts: 'No limit' },
      { cat: 'PwBD (General)', min: 18, max: 42, attempts: 'No limit' },
      { cat: 'Ex-Servicemen', min: 18, max: 35, attempts: 'No limit' },
    ],
    qual: "Bachelor's degree in any discipline from a recognised university.",
    resizerLink: '/resizer/?preset=ssc-cgl-photo-resize',
    photoLink: '/ssc-cgl-photo-size/',
    faqs: [
      { q: 'What is the SSC CGL age limit 2025?', a: 'For most SSC CGL posts, the age limit is 18–32 years as of 1 January of the exam year. Some posts have different limits (e.g., Inspector posts: 18–30). Always check the official notification for post-wise age limits.' },
      { q: 'Is there an age relaxation for OBC in SSC CGL?', a: 'Yes. OBC (Non-Creamy Layer) candidates get +3 years relaxation (up to 35 for general posts). SC/ST get +5 years (up to 37). PwBD get +10 years over the general limit.' },
      { q: 'What is the SSC CGL age cut-off date?', a: 'SSC CGL calculates age as of 1 January of the examination year. If the notification is for 2025, age is calculated on 1 January 2025.' },
      { q: 'What is the qualification for SSC CGL?', a: "A bachelor's degree in any discipline from a recognised university. Some posts like Statistical Investigator require a specific degree (Statistics/Mathematics)." },
      { q: 'Is there an upper age limit for all SSC CGL posts?', a: 'No — the upper age limit varies by post. Most posts are 18–32, but some administrative and Inspector-level posts may specify 18–27 or 18–30. Check the post-wise list in the notification.' },
      { q: 'How many times can I attempt SSC CGL?', a: 'There is no attempt limit for SSC CGL. You can apply every year as long as you meet the age and qualification criteria.' },
      { q: 'What is the SSC CGL photo size requirement?', a: 'SSC CGL requires a photo of 275×354 pixels (3.5×4.5 cm equivalent), 20–50 KB, in JPG format. Signature must be 236×79 pixels, 10–20 KB.' },
    ],
  },
  {
    slug: 'age-calculator-for-ibps-po',
    name: 'IBPS PO',
    shortName: 'IBPS PO',
    fullName: 'IBPS Probationary Officer (PO) Examination',
    cutoffLabel: 'notification date (varies annually)',
    cutoffMonthISO: '08-01',
    keywords: 'age calculator for ibps po, ibps po age limit, ibps po age eligibility, ibps po age limit 2025, am i eligible for ibps po',
    desc: 'Check your age eligibility for IBPS PO (Probationary Officer). Enter your date of birth to instantly see if you meet the age requirement for the latest IBPS PO notification.',
    minAge: 20,
    elig: [
      { cat: 'General', min: 20, max: 30, attempts: 'No limit' },
      { cat: 'OBC (Non-Creamy Layer)', min: 20, max: 33, attempts: 'No limit' },
      { cat: 'SC / ST', min: 20, max: 35, attempts: 'No limit' },
      { cat: 'PwBD (General)', min: 20, max: 40, attempts: 'No limit' },
      { cat: 'PwBD (OBC)', min: 20, max: 43, attempts: 'No limit' },
      { cat: 'PwBD (SC/ST)', min: 20, max: 45, attempts: 'No limit' },
      { cat: 'Ex-Servicemen/Commissioned Officers', min: 20, max: 35, attempts: 'No limit' },
    ],
    qual: "Bachelor's degree in any discipline from a recognised university, or equivalent qualification recognised by the Central Government.",
    resizerLink: '/resizer/?preset=ibps-po-photo-resize',
    photoLink: '/ibps-po-photo-size/',
    faqs: [
      { q: 'What is the IBPS PO age limit 2025?', a: 'IBPS PO age limit is 20–30 years as of the notification date for general category candidates. OBC gets +3 years (up to 33), SC/ST gets +5 years (up to 35).' },
      { q: 'What is the age cut-off date for IBPS PO?', a: 'Age for IBPS PO eligibility is calculated as of the date specified in the notification — usually the opening date of the application form. This date changes each year.' },
      { q: 'Is there an attempt limit for IBPS PO?', a: 'No. There is no limit on the number of times you can attempt IBPS PO, as long as you meet the age and qualification criteria each time you apply.' },
      { q: 'What qualification is needed for IBPS PO?', a: "A bachelor's degree in any discipline from a recognised university (or its equivalent as recognised by the Central Government)." },
      { q: 'What is the IBPS PO photo size requirement?', a: 'IBPS PO requires a photo of approximately 200×230 pixels, 20–50 KB in JPG. Signature: approximately 80×30 pixels, under 20 KB. Check the current year notification for exact specs.' },
      { q: 'Can I apply for IBPS PO in my final year of graduation?', a: 'Yes. Final-year students can apply, but they must have completed the degree before the date of interview/joining specified in the notification.' },
      { q: 'What is the difference between IBPS PO and IBPS Clerk age limit?', a: 'IBPS PO: 20–30 years (general). IBPS Clerk: 20–28 years (general). Both have the same OBC/SC/ST relaxations, but the maximum age for Clerk is 2 years lower.' },
    ],
  },
  {
    slug: 'age-calculator-for-nda',
    name: 'UPSC NDA',
    shortName: 'NDA',
    fullName: 'NDA & NA Examination (National Defence Academy)',
    cutoffLabel: 'first day of the course commencement month',
    cutoffMonthISO: '01-01',
    keywords: 'age calculator for nda, nda age limit, nda age eligibility, upsc nda age calculator, am i eligible for nda 2025, nda age limit 2025',
    desc: 'Check your age eligibility for UPSC NDA (National Defence Academy) examination. NDA has a unique age window — enter your DOB to see if you qualify for the current NDA notification.',
    minAge: 16,
    elig: [
      { cat: 'All candidates (no relaxation)', min: 16.5, max: 19.5, attempts: '2 per year' },
    ],
    qual: 'Class 12 (10+2) pass or appearing. For Army: any stream. For Navy/Air Force: Physics and Mathematics are mandatory subjects in 12th.',
    resizerLink: '/resizer/?preset=nda-photo-resize',
    photoLink: '/nda-photo-size/',
    faqs: [
      { q: 'What is the NDA age limit 2025?', a: 'NDA candidates must be between 16.5 and 19.5 years old on the first day of the month of course commencement. There is NO age relaxation for any category (SC/ST/OBC) for NDA.' },
      { q: 'Is there age relaxation for OBC/SC/ST in NDA?', a: 'No. Unlike other UPSC exams, NDA has NO age relaxation for reserved categories. The 16.5–19.5 year window applies to ALL candidates equally.' },
      { q: 'Can girls apply for NDA?', a: 'Yes. From 2022 onwards, female candidates are also eligible to apply for the NDA examination under the Army wing.' },
      { q: 'How many times is the NDA exam held per year?', a: 'UPSC conducts NDA twice a year — NDA I (notification in January, exam in April) and NDA II (notification in May/June, exam in September). You can appear in both if you are within the age window.' },
      { q: 'What subjects are required for NDA?', a: 'For Army: Class 12 in any stream. For Air Force and Navy: Class 12 with Physics and Mathematics are mandatory. Without these subjects, you can only apply for the Army wing.' },
      { q: 'What is the NDA photo size requirement?', a: 'NDA online application requires a colour photo of 400×400 pixels (or similar square format), 20–100 KB in JPG. Check the current notification for exact specifications.' },
      { q: 'What happens if I exceed the NDA upper age limit of 19.5 years?', a: 'You become permanently ineligible for NDA. The 19.5-year cap has no relaxation and no second chances. However, you may still be eligible for CDS (combined defence services) once you graduate.' },
    ],
  },
  {
    slug: 'age-calculator-for-neet',
    name: 'NEET-UG',
    shortName: 'NEET-UG',
    fullName: 'NEET Undergraduate Medical Entrance Examination',
    cutoffLabel: '31 December of the admission year',
    cutoffMonthISO: '12-31',
    keywords: 'age calculator for neet, neet age limit, neet ug age eligibility, neet minimum age, am i eligible for neet 2025, neet age requirement',
    desc: 'Check your age eligibility for NEET-UG (National Eligibility cum Entrance Test for MBBS/BDS). NEET has a minimum age requirement — enter your DOB to verify eligibility.',
    minAge: 17,
    elig: [
      { cat: 'All candidates (no upper age limit)', min: 17, max: 999, attempts: 'No limit' },
    ],
    qual: 'Class 12 (10+2) with Physics, Chemistry and Biology/Biotechnology as mandatory subjects. Minimum 50% marks (40% for SC/ST/OBC, 45% for PwBD general) in PCB.',
    resizerLink: '/resizer/?preset=neet-photo-resize',
    photoLink: '/neet-photo-size/',
    faqs: [
      { q: 'What is the NEET age limit 2025?', a: 'The minimum age for NEET-UG is 17 years as on 31 December of the year of admission. There is NO upper age limit for NEET-UG after the Supreme Court struck down the 25-year upper age limit in 2018.' },
      { q: 'Is there an upper age limit for NEET?', a: "No upper age limit exists for NEET-UG after the Supreme Court of India's ruling in 2018. Any candidate who is at least 17 years old on 31 December of the admission year can appear." },
      { q: 'How many times can I attempt NEET?', a: 'There is no attempt limit for NEET-UG. You can appear in NEET as many times as you wish, as long as you are at least 17 years old.' },
      { q: 'What is the minimum age to appear in NEET?', a: 'You must be at least 17 years old on 31 December of the year in which you are seeking admission (not the year of the exam). If your birthday is after 31 December, you will not qualify for that admission cycle.' },
      { q: 'What subjects are compulsory for NEET eligibility?', a: 'Physics, Chemistry and Biology/Biotechnology are compulsory in Class 12 (10+2). Minimum PCB aggregate: 50% for general, 40% for SC/ST/OBC, 45% for PwBD general category.' },
      { q: 'What is the NEET photo size requirement?', a: 'NEET online application form requires a recent colour photo, 10×12 cm equivalent, 10–200 KB in JPG format with white background. Signature: 3.5×1.5 cm, under 30 KB. Check the NTA notification each year.' },
      { q: 'Can I apply for NEET if I am still in Class 11?', a: 'No. You must be in Class 12 or have passed Class 12 with Physics, Chemistry and Biology as mandatory subjects.' },
    ],
  },
  {
    slug: 'age-calculator-for-sbi-po',
    name: 'SBI PO',
    shortName: 'SBI PO',
    fullName: 'State Bank of India Probationary Officer Examination',
    cutoffLabel: 'notification date (varies annually)',
    cutoffMonthISO: '04-01',
    keywords: 'age calculator for sbi po, sbi po age limit, sbi po age eligibility 2025, am i eligible for sbi po, sbi po age limit general',
    desc: 'Check your age eligibility for SBI PO (State Bank of India Probationary Officer). Enter your date of birth to see if you qualify for the latest SBI PO notification.',
    minAge: 21,
    elig: [
      { cat: 'General', min: 21, max: 30, attempts: 'No limit' },
      { cat: 'OBC (Non-Creamy Layer)', min: 21, max: 33, attempts: 'No limit' },
      { cat: 'SC / ST', min: 21, max: 35, attempts: 'No limit' },
      { cat: 'PwBD (General)', min: 21, max: 40, attempts: 'No limit' },
      { cat: 'Ex-Servicemen/Commissioned Officers', min: 21, max: 35, attempts: 'No limit' },
    ],
    qual: "Bachelor's degree in any discipline from a recognised university.",
    resizerLink: '/resizer/?preset=sbi-po-photo-resize',
    photoLink: '/ibps-po-photo-size/',
    faqs: [
      { q: 'What is the SBI PO age limit 2025?', a: 'SBI PO age limit for general category is 21–30 years as on the date specified in the notification. OBC gets +3 years (up to 33), SC/ST gets +5 years (up to 35).' },
      { q: 'Is SBI PO age limit different from IBPS PO?', a: 'Yes. SBI PO: 21–30 years (general). IBPS PO: 20–30 years (general). SBI PO requires a minimum age of 21, while IBPS PO allows 20-year-old candidates.' },
      { q: 'What is the qualification required for SBI PO?', a: "A bachelor's degree in any discipline from a recognised university (or its equivalent as recognised by the Central Government)." },
      { q: 'How many times can I attempt SBI PO?', a: 'There is no limit on the number of SBI PO attempts. You can apply every year as long as you meet the age and qualification criteria.' },
      { q: 'Is there an age relaxation for SBI PO?', a: 'Yes. OBC (Non-Creamy Layer) gets +3 years, SC/ST gets +5 years, PwBD gets +10 years over the general upper age limit. J&K residents may get additional relaxation per central government norms.' },
      { q: 'Can final year students apply for SBI PO?', a: 'Yes. Final-year degree students can apply for SBI PO, but they must submit their final degree certificate by the date specified in the offer letter/notification.' },
      { q: 'What is the SBI PO photo size requirement?', a: 'SBI PO application requires a colour passport-size photo, approximately 200×230 pixels, 20–50 KB in JPG. Signature: approximately 80×30 pixels, under 20 KB.' },
    ],
  },
  {
    slug: 'age-calculator-for-rrb-ntpc',
    name: 'RRB NTPC',
    shortName: 'RRB NTPC',
    fullName: 'RRB Non-Technical Popular Categories (NTPC) Examination',
    cutoffLabel: 'date specified in the notification',
    cutoffMonthISO: '07-01',
    keywords: 'age calculator for rrb ntpc, rrb ntpc age limit, rrb ntpc age eligibility 2025, am i eligible for rrb ntpc, railway ntpc age limit',
    desc: 'Check your age eligibility for RRB NTPC (Non-Technical Popular Categories) examination. Enter your date of birth to see if you meet the age requirement for the current RRB NTPC notification.',
    minAge: 18,
    elig: [
      { cat: 'General (most posts)', min: 18, max: 33, attempts: 'No limit' },
      { cat: 'OBC (Non-Creamy Layer)', min: 18, max: 36, attempts: 'No limit' },
      { cat: 'SC / ST', min: 18, max: 38, attempts: 'No limit' },
      { cat: 'PwBD (General)', min: 18, max: 43, attempts: 'No limit' },
      { cat: 'Ex-Servicemen', min: 18, max: 36, attempts: 'No limit' },
    ],
    qual: 'Varies by post: Graduate (for Graduate Level posts) or 12th pass (for 12th Level posts). Some posts may require additional qualifications.',
    resizerLink: '/resizer/?preset=rrb-ntpc-photo-resize',
    photoLink: '/rrb-ntpc-photo-size/',
    faqs: [
      { q: 'What is the RRB NTPC age limit 2025?', a: 'Most RRB NTPC posts have an age limit of 18–33 years as on the date specified in the notification. Some posts may have different limits — always check the post-wise age table in the official notification.' },
      { q: 'What are the two levels of RRB NTPC?', a: 'RRB NTPC has two levels: Graduate Level (requires a bachelor\'s degree, age 18–33) and 12th Level (requires Class 12 pass, age 18–30 for most posts). The age limits and eligibility differ.' },
      { q: 'Is there age relaxation for OBC in RRB NTPC?', a: 'Yes. OBC (Non-Creamy Layer) gets +3 years, SC/ST gets +5 years, PwBD (General/OBC) gets +10 years, PwBD (SC/ST) gets +15 years over the general limit.' },
      { q: 'How many times can I attempt RRB NTPC?', a: 'There is no attempt limit for RRB NTPC. You can appear in every cycle as long as you meet the age and qualification requirements.' },
      { q: 'What qualifications are required for RRB NTPC?', a: 'For Graduate Level posts: any bachelor\'s degree. For Undergraduate Level posts: Class 12 pass. Some posts like Accounts Clerk/Typist may need additional typing certification.' },
      { q: 'What is the RRB NTPC photo size requirement?', a: 'RRB NTPC application requires a recent passport-size photo, 20–50 KB in JPG. Signature must be on white paper, under 20 KB. Exact pixel dimensions are specified in each notification.' },
      { q: 'What is the age limit for RRB Group D?', a: 'RRB Group D age limit is 18–33 years for general category (as of the notification date). OBC gets +3 years, SC/ST gets +5 years. Group D is a separate examination from NTPC.' },
    ],
  },
  {
    slug: 'age-calculator-for-ibps-clerk',
    name: 'IBPS Clerk',
    shortName: 'IBPS Clerk',
    fullName: 'IBPS Clerical Cadre Examination',
    cutoffLabel: 'notification date (varies annually)',
    cutoffMonthISO: '09-01',
    keywords: 'age calculator for ibps clerk, ibps clerk age limit, ibps clerk age eligibility 2025, am i eligible for ibps clerk, ibps cwe clerk age',
    desc: 'Check your age eligibility for IBPS Clerk (Clerical Cadre). Enter your date of birth to see if you meet the age requirement for the latest IBPS Clerk notification.',
    minAge: 20,
    elig: [
      { cat: 'General', min: 20, max: 28, attempts: 'No limit' },
      { cat: 'OBC (Non-Creamy Layer)', min: 20, max: 31, attempts: 'No limit' },
      { cat: 'SC / ST', min: 20, max: 33, attempts: 'No limit' },
      { cat: 'PwBD (General)', min: 20, max: 38, attempts: 'No limit' },
      { cat: 'PwBD (OBC)', min: 20, max: 41, attempts: 'No limit' },
      { cat: 'Ex-Servicemen', min: 20, max: 33, attempts: 'No limit' },
    ],
    qual: "Bachelor's degree in any discipline from a recognised university. Proficiency in local language is often required.",
    resizerLink: '/resizer/?preset=ibps-clerk-photo-resize',
    photoLink: '/ibps-po-photo-size/',
    faqs: [
      { q: 'What is the IBPS Clerk age limit 2025?', a: 'IBPS Clerk age limit for general category is 20–28 years. OBC gets +3 years (up to 31), SC/ST gets +5 years (up to 33), PwBD gets +10 years.' },
      { q: 'Is IBPS Clerk age limit lower than IBPS PO?', a: 'Yes. IBPS Clerk max age is 28 (general) versus 30 for IBPS PO. If you have crossed 28, you may still be eligible for IBPS PO but not Clerk (unless you have category relaxation).' },
      { q: 'What qualifications are required for IBPS Clerk?', a: "A bachelor's degree in any discipline from a recognised university. Additionally, knowledge of the local language of the state applied for is often mandatory." },
      { q: 'How many times can I apply for IBPS Clerk?', a: 'There is no attempt limit for IBPS Clerk. You can apply as many times as you wish while within the eligible age range.' },
      { q: 'Is there any age relaxation for IBPS Clerk?', a: 'Yes. OBC (Non-Creamy Layer): +3 years. SC/ST: +5 years. PwBD (General): +10 years. PwBD (OBC): +13 years. PwBD (SC/ST): +15 years. Ex-servicemen: +5 years.' },
      { q: 'Can I apply for IBPS Clerk and IBPS PO at the same time?', a: 'Yes. Both are separate examinations held by IBPS. You can apply for both in the same year if you meet each exam\'s individual eligibility criteria.' },
      { q: 'What is the IBPS Clerk photo size requirement?', a: 'IBPS Clerk requires the same photo format as IBPS PO — approximately 200×230 pixels (or as specified), 20–50 KB in JPG. Signature under 20 KB.' },
    ],
  },
];

function eligRow(e) {
  return `<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:9px 12px;color:#0f172a;font-weight:600">${e.cat}</td><td style="padding:9px 12px;color:#475569;text-align:center">${e.min}</td><td style="padding:9px 12px;color:#475569;text-align:center">${e.max === 999 ? 'No limit' : e.max}</td><td style="padding:9px 12px;color:#475569;text-align:center">${e.attempts}</td></tr>`;
}

function page(exam) {
  const canonical = `https://ilovexams.in/${exam.slug}/`;
  const title = `Age Calculator for ${exam.name} 2025 – Check Eligibility | ILoveExams`;
  const mainFaq = exam.faqs.map(f =>
    `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`
  ).join(',');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"><\/script>
  <title>${title}</title>
  <meta name="description" content="${exam.desc}">
  <meta name="keywords" content="${exam.keywords}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0a0e1a">
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ILoveExams">
  <meta property="og:title" content="Age Calculator for ${exam.name} | ILoveExams">
  <meta property="og:description" content="${exam.desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://ilovexams.in/og-image.png">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Age Calculator for ${exam.name} | ILoveExams">
  <meta name="twitter:description" content="${exam.desc}">
  <meta name="twitter:image" content="https://ilovexams.in/og-image.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; }
    .hero-nav { background: #0a0e1a; border-bottom: 1px solid rgba(255,255,255,.08); position: sticky; top: 0; z-index: 50; }
    .hero-nav-inner { max-width: 900px; margin: 0 auto; padding: 0 16px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 10px; }
    .faq-q { font-weight: 700; color: #0f172a; font-size: 14px; padding: 14px 16px; }
    .faq-a { font-size: 14px; color: #475569; padding: 0 16px 14px; line-height: 1.65; }
    .result-box { background: linear-gradient(135deg,#0f172a,#1e3a5f); border-radius: 16px; padding: 28px 24px; color: #fff; display: none; }
    .stat-card { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 14px 16px; }
    .stat-val { font-size: 20px; font-weight: 800; color: #93c5fd; }
    .stat-lbl { font-size: 11px; color: rgba(255,255,255,.5); margin-top: 2px; text-transform: uppercase; letter-spacing: .06em; }
    .badge-yes { background: #dcfce7; color: #166534; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
    .badge-no  { background: #fee2e2; color: #991b1b; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
    .badge-unk { background: #f1f5f9; color: #64748b; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
    input[type="date"] { appearance: none; -webkit-appearance: none; background: #fff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; font-size: 16px; font-family: 'Inter', sans-serif; color: #0f172a; width: 100%; outline: none; transition: border-color .15s; }
    input[type="date"]:focus { border-color: #3b82f6; }
    .calc-btn { width: 100%; padding: 15px; background: linear-gradient(135deg,#3b82f6,#2563eb); color: #fff; font-size: 16px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all .2s; }
    .calc-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,.4); }
  </style>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"https://ilovexams.in/"},
    {"@type":"ListItem","position":2,"name":"Age Calculator","item":"https://ilovexams.in/age-calculator/"},
    {"@type":"ListItem","position":3,"name":"${exam.name} Age Calculator","item":"${canonical}"}]}
  <\/script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Age Calculator for ${exam.name}","applicationCategory":"UtilityApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"INR"},"url":"${canonical}","description":"${exam.desc}","provider":{"@type":"Organization","name":"ILoveExams","url":"https://ilovexams.in/"}}
  <\/script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${mainFaq}]}
  <\/script>
</head>
<body>

<nav class="hero-nav">
  <div class="hero-nav-inner">
    <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:0;flex-shrink:0">
      <span style="font-size:22px;font-weight:900;color:#fff">I</span>${SVG_HEART}<span style="font-size:22px;font-weight:900;color:#fff">Exams</span><span style="font-size:12px;color:rgba(255,255,255,.3);font-weight:500;margin-left:2px">.in</span>
    </a>
    <div class="hidden md:flex items-center" style="gap:26px;font-size:13.5px;font-weight:600">
      <a href="/resizer/" style="color:rgba(255,255,255,.75);text-decoration:none">Exam Resizer</a>
      <a href="/age-calculator/" style="color:rgba(255,255,255,.75);text-decoration:none">Age Calculator</a>
      <a href="/" style="color:rgba(255,255,255,.75);text-decoration:none">All Tools</a>
    </div>
    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
      <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap">♥ Donate</a>
    </div>
  </div>
</nav>

<div style="background:linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%);padding:48px 16px 40px">
  <div style="max-width:720px;margin:0 auto">
    <nav style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:14px">
      <a href="/" style="color:rgba(255,255,255,.4);text-decoration:none">Home</a> › <a href="/age-calculator/" style="color:rgba(255,255,255,.4);text-decoration:none">Age Calculator</a> › ${exam.shortName}
    </nav>
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(5,150,105,.15);border:1px solid rgba(5,150,105,.3);border-radius:999px;padding:4px 12px;margin-bottom:16px">
      <span style="font-size:11px;font-weight:700;color:#6ee7b7;text-transform:uppercase;letter-spacing:.08em">${exam.shortName} Eligibility</span>
    </div>
    <h1 style="font-size:clamp(22px,4.5vw,40px);font-weight:900;color:#fff;margin:0 0 12px;line-height:1.15">Age Calculator for ${exam.name}</h1>
    <p style="color:rgba(255,255,255,.6);font-size:16px;margin:0 0 28px;max-width:580px">${exam.desc}</p>

    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:28px 24px;max-width:560px">
      <label style="display:block;font-size:13px;font-weight:700;color:rgba(255,255,255,.7);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Your Date of Birth</label>
      <input type="date" id="dob" max="">
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <label style="font-size:12px;color:rgba(255,255,255,.5)">Age as of:</label>
        <input type="date" id="asof" style="flex:1;min-width:160px;padding:10px 12px;font-size:14px;border-radius:10px;border:2px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-family:'Inter',sans-serif;outline:none">
        <button onclick="setToday()" style="font-size:12px;font-weight:600;color:#93c5fd;background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.25);padding:8px 12px;border-radius:8px;cursor:pointer;white-space:nowrap">Today</button>
      </div>
      <button class="calc-btn" onclick="calculate()" style="margin-top:16px">Check ${exam.shortName} Eligibility →</button>
    </div>
  </div>
</div>

<div style="max-width:720px;margin:0 auto;padding:32px 16px 0">

  <div class="result-box" id="result">
    <p style="font-size:13px;font-weight:700;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px">Your Age</p>
    <p style="font-size:clamp(22px,4vw,38px);font-weight:900;color:#fff;line-height:1.1;margin:0 0 6px" id="main-age">—</p>
    <p style="font-size:14px;color:rgba(255,255,255,.5);margin:0 0 20px" id="main-sub"></p>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px" id="stats-grid"></div>
    <div id="elig-result" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px 18px">
      <p id="elig-msg" style="font-size:15px;font-weight:700;color:#fff;margin:0"></p>
      <p id="elig-sub" style="font-size:13px;color:rgba(255,255,255,.6);margin:6px 0 0"></p>
    </div>
  </div>

  <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px;margin-top:24px;margin-bottom:24px">
    <h2 style="font-size:17px;font-weight:800;color:#0f172a;margin:0 0 6px">${exam.fullName} — Age Eligibility Table</h2>
    <p style="font-size:13px;color:#64748b;margin:0 0 16px">Age limits as per recent official notifications. Always verify from the current year's notification.</p>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px">
        <thead><tr style="background:#f8fafc;text-align:left">
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">Category</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;text-align:center">Min Age</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;text-align:center">Max Age</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;text-align:center">Attempts</th>
        </tr></thead>
        <tbody>${exam.elig.map(eligRow).join('')}</tbody>
      </table>
    </div>
    <p style="font-size:11px;color:#94a3b8;margin:10px 0 0">Age calculated as of: <strong>${exam.cutoffLabel}</strong>. Qualification: ${exam.qual}</p>
  </div>

  ${adSlot()}

  <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:28px 24px;margin-bottom:24px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 12px">About ${exam.fullName} Age Eligibility</h2>
    <p style="font-size:14px;color:#475569;line-height:1.75;margin:0 0 12px">The age limit for ${exam.fullName} is strictly enforced. Unlike marks or qualifications, there is no provision for relaxation beyond the stated limits (except for reserved categories as tabulated above). Missing the eligibility window by even one day means you cannot apply.</p>
    <p style="font-size:14px;color:#475569;line-height:1.75;margin:0 0 16px">Your age is counted as of <strong>${exam.cutoffLabel}</strong>. This means it is the age you are on that date that matters — not the date you fill the form or the date of the exam.</p>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:14px 16px;margin-bottom:16px">
      <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 4px">Important reminder</p>
      <p style="font-size:13px;color:#78350f;margin:0">Age limits change with each official notification. Use this calculator to get an estimate, but always verify your eligibility from the official ${exam.shortName} notification published on the official website.</p>
    </div>
    <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 10px">Also useful for ${exam.shortName}</h3>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <a href="${exam.photoLink}" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">📸 ${exam.shortName} Photo Size</a>
      <a href="${exam.resizerLink}" style="font-size:13px;color:#3b82f6;background:#eff6ff;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;text-decoration:none">🖼 Resize Photo for ${exam.shortName}</a>
      <a href="/age-calculator/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">🎂 Age Calculator (all exams)</a>
      <a href="/word-counter/" style="font-size:13px;color:#0284c7;background:#f0f9ff;border:1px solid #7dd3fc;padding:5px 12px;border-radius:8px;text-decoration:none">📝 Word Counter</a>
    </div>
  </div>

  <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">Frequently Asked Questions</h2>
  ${exam.faqs.map(f => `<div class="faq-item"><div class="faq-q">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('\n  ')}

  <div style="margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:40px">
    <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 14px">More Age Calculators</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <a href="/age-calculator/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">All Exams Age Calculator</a>
      <a href="/age-calculator-for-upsc/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">UPSC CSE</a>
      <a href="/age-calculator-for-ssc-cgl/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">SSC CGL</a>
      <a href="/age-calculator-for-ibps-po/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">IBPS PO</a>
      <a href="/age-calculator-for-nda/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">NDA</a>
      <a href="/age-calculator-for-neet/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">NEET-UG</a>
      <a href="/age-calculator-for-sbi-po/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">SBI PO</a>
      <a href="/age-calculator-for-rrb-ntpc/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">RRB NTPC</a>
      <a href="/age-calculator-for-ibps-clerk/" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">IBPS Clerk</a>
    </div>
  </div>
</div>

<footer style="background:#0a0e1a;color:rgba(255,255,255,.5);padding:28px 16px;text-align:center">
  <a href="/" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:0;margin-bottom:8px">
    <span style="font-size:20px;font-weight:900;color:#fff">I</span>${SVG_HEART}<span style="font-size:20px;font-weight:900;color:#fff">Exams</span><span style="font-size:12px;color:rgba(255,255,255,.25);font-weight:500;margin-left:2px">.in</span>
  </a>
  <p style="font-size:12px;margin:0 0 8px">Free tools for Indian exam aspirants</p>
  <p style="font-size:11px;margin:0;color:rgba(255,255,255,.4)">
    <a href="/" style="color:rgba(255,255,255,.5);text-decoration:none">Home</a> ·
    <a href="/age-calculator/" style="color:rgba(255,255,255,.5);text-decoration:none">Age Calculator</a> ·
    <a href="/resizer/" style="color:rgba(255,255,255,.5);text-decoration:none">Exam Resizer</a> ·
    <a href="/privacy/" style="color:rgba(255,255,255,.5);text-decoration:none">Privacy</a> ·
    <a href="/terms/" style="color:rgba(255,255,255,.5);text-decoration:none">Terms</a>
  </p>
</footer>

<script>
function setToday() {
  document.getElementById('asof').value = new Date().toISOString().split('T')[0];
}
function fmt(d) { return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); }

function calculate() {
  const dobVal = document.getElementById('dob').value;
  const asofVal = document.getElementById('asof').value;
  if (!dobVal) { alert('Please enter your date of birth.'); return; }
  const dob = new Date(dobVal + 'T00:00:00');
  const ref = asofVal ? new Date(asofVal + 'T00:00:00') : new Date();
  ref.setHours(0,0,0,0);
  if (dob >= ref) { alert('Date of birth must be before the selected date.'); return; }

  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  let days = ref.getDate() - dob.getDate();
  if (days < 0) { months--; days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((ref - dob) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);

  document.getElementById('main-age').textContent = years + ' years, ' + months + ' months & ' + days + ' days';
  document.getElementById('main-sub').textContent = 'Born ' + fmt(dob) + ' · As of ' + fmt(ref);
  document.getElementById('stats-grid').innerHTML = [
    { v: totalDays.toLocaleString('en-IN'), l: 'Total Days' },
    { v: totalWeeks.toLocaleString('en-IN'), l: 'Total Weeks' },
    { v: (years * 12 + months).toLocaleString('en-IN'), l: 'Total Months' },
    { v: (totalDays * 24).toLocaleString('en-IN'), l: 'Total Hours' },
  ].map(s => '<div class="stat-card"><div class="stat-val">' + s.v + '</div><div class="stat-lbl">' + s.l + '</div></div>').join('');

  const ageDecimal = years + months / 12 + days / 365;
  const minOk = ageDecimal >= ${exam.minAge};
  const maxOk = ${exam.elig[0].max === 999} ? true : ageDecimal <= ${exam.elig[0].max};
  let msg, sub;
  if (!minOk) {
    msg = '⚠️ Too young for ${exam.shortName}';
    sub = 'You need to be at least ${exam.minAge} years old. Keep preparing — your time will come!';
  } else if (!maxOk) {
    msg = '✗ Over the general age limit for ${exam.shortName}';
    sub = 'Check if you qualify under a reserved category (OBC/SC/ST) for the age relaxation table above.';
  } else {
    msg = '✓ Eligible for ${exam.shortName} (General Category)';
    sub = 'Your age falls within the ${exam.elig[0].min}–${exam.elig[0].max === 999 ? 'no upper limit' : exam.elig[0].max} year window. Apply before the ${exam.cutoffLabel}.';
  }
  document.getElementById('elig-msg').textContent = msg;
  document.getElementById('elig-sub').textContent = sub;
  document.getElementById('result').style.display = 'block';
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dob').max = today;
  document.getElementById('asof').value = today;
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.target.id === 'dob' || e.target.id === 'asof')) calculate(); });
<\/script>
</body>
</html>`;
}

let count = 0;
EXAMS.forEach(exam => {
  const dir = path.join(__dirname, exam.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(exam), 'utf8');
  count++;
});
console.log(`✅ Generated ${count} exam age calculator pages`);
