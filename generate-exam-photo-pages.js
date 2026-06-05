#!/usr/bin/env node
/**
 * Generates exam-specific photo & signature size requirement pages.
 * Targets long-tail queries like "upsc photo size 2025", "neet photo size requirements".
 * Run: node generate-exam-photo-pages.js
 */
const fs = require('fs');
const path = require('path');

const TODAY = '2026-06-05';
const AD_CLIENT = 'ca-pub-9837613085159910';
const AD_SLOT = '8189529514';

const SVG_HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display:inline-block;width:.9em;height:.9em;vertical-align:middle;margin:0 1px 3px"><path d="M16 28C16 28 2 19.5 2 10.5 2 6 5.2 3 9.5 3c2.7 0 4.9 1.6 6.5 3.8C17.6 4.6 19.8 3 22.5 3 26.8 3 30 6 30 10.5 30 19.5 16 28 16 28Z" fill="#ef4444"/><polyline points="10,13 14.5,18.5 22.5,10" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const EXAMS = [
  {
    slug: 'upsc-photo-size',
    name: 'UPSC CSE',
    fullName: 'UPSC Civil Services Examination (IAS/IPS/IFS)',
    keywords: 'upsc photo size, upsc cse photo size 2025, upsc ias photo requirements, upsc photo dimensions, upsc cse photo size in kb, upsc signature size',
    desc: 'Official UPSC CSE photo and signature size requirements for 2025. Exact pixel dimensions, file size limits and format — with a one-click resize tool.',
    photo: { w: 400, h: 400, minKb: 20, maxKb: 300, fmt: 'JPG', note: 'Square format, white background, front-facing, no cap' },
    sig:   { w: 400, h: 400, minKb: 20, maxKb: 100, fmt: 'JPG', note: 'Black ink on white paper, scanned at ≥200 DPI' },
    resizerPhotoUrl: '/resizer/?preset=upsc-cse-photo-resize&w=400&h=400&minkb=20&maxkb=300&fmt=JPG&document=photo&title=UPSC+CSE+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fupsc-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=upsc-cse-signature-resize&w=400&h=400&minkb=20&maxkb=100&fmt=JPG&document=signature&title=UPSC+CSE+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fupsc-photo-size%2F',
    ageLink: '/age-calculator-for-upsc/',
    portalNote: 'Upload on the UPSC online application portal (upsconline.nic.in) during DAF/application form filling.',
    tips: ['Use a recent photo (within 3 months of application).', 'Plain white or off-white background is required.', 'Wear formal attire. No caps, goggles or heavy jewellery.', 'Photo must show the full face clearly with eyes open.'],
    faqs: [
      { q: 'What is the UPSC CSE photo size in pixels?', a: 'UPSC CSE typically requires a photo of 400×400 pixels (or as specified in the current notification), 20–300 KB in JPG format with a white background.' },
      { q: 'What is the UPSC signature size?', a: 'The UPSC online form requires a scanned signature image of 400×400 pixels, 20–100 KB in JPG. Sign on plain white paper in black ink and scan at 200 DPI or higher.' },
      { q: 'Can I use a mobile photo for UPSC CSE application?', a: 'Yes, if the photo meets the specifications — white background, proper lighting, full face visible, 400×400 px and under 300 KB in JPG. Use our resize tool to convert any photo.' },
      { q: 'What happens if I upload a wrong-sized photo for UPSC?', a: 'The portal may reject the upload outright or, in some cases, accept it and flag the application during scrutiny. Using the exact specified dimensions avoids any risk of rejection.' },
      { q: 'Does UPSC accept PNG photos?', a: 'UPSC online forms typically accept only JPG/JPEG. Convert PNG to JPG using our PNG to JPG tool before uploading.' },
      { q: 'How recent must the UPSC photo be?', a: 'UPSC recommends a photo taken within the last 3 months before filling the application form.' },
    ],
  },
  {
    slug: 'ssc-cgl-photo-size',
    name: 'SSC CGL',
    fullName: 'SSC Combined Graduate Level (CGL) Examination',
    keywords: 'ssc cgl photo size, ssc cgl photo requirements 2025, ssc cgl photo size in kb, ssc cgl signature size, ssc cgl photo dimensions',
    desc: 'Exact SSC CGL photo and signature size requirements for 2025. Get the dimensions, KB limits and format right — then resize in one click.',
    photo: { w: 275, h: 354, minKb: 20, maxKb: 50, fmt: 'JPG', note: 'Passport-style, white background, full face, no cap' },
    sig:   { w: 236, h: 79,  minKb: 10, maxKb: 20, fmt: 'JPG', note: 'Black ink on white paper, no pencil' },
    resizerPhotoUrl: '/resizer/?preset=ssc-cgl-photo-resize&w=275&h=354&minkb=20&maxkb=50&fmt=JPG&document=photo&title=SSC+CGL+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fssc-cgl-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=ssc-cgl-signature-resize&w=236&h=79&minkb=10&maxkb=20&fmt=JPG&document=signature&title=SSC+CGL+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fssc-cgl-photo-size%2F',
    ageLink: '/age-calculator-for-ssc-cgl/',
    portalNote: 'Upload during the SSC CGL online application on ssc.gov.in or ssc-cr.org (region-specific).',
    tips: ['Photo must be in colour with a plain white background.', 'No sunglasses, cap or heavy ornaments.', 'Ears should be visible. Look directly at the camera.', 'Signature must be done in black/blue ink, not pencil.'],
    faqs: [
      { q: 'What is the SSC CGL photo size 2025?', a: 'SSC CGL requires a photo of 275×354 pixels, between 20 KB and 50 KB, in JPG format. The background should be plain white.' },
      { q: 'What is the SSC CGL signature size?', a: 'The SSC CGL online form requires a signature image of 236×79 pixels, 10–20 KB in JPG. Sign on white paper in black or blue ink.' },
      { q: 'Why is the SSC CGL photo size so small (up to 50 KB)?', a: 'Government exam portals set low KB limits to save server storage and ensure fast uploads even on slow connections. Our resize tool can reduce any photo to under 50 KB while keeping it sharp enough for identification.' },
      { q: 'Does the SSC CGL photo need to match a specific ratio?', a: 'Yes. SSC CGL specifies 275×354 pixels — approximately a 3:4 ratio (standard passport photo aspect). Uploading a square or landscape photo may cause the form to reject it.' },
      { q: 'Can I use a smartphone camera for the SSC CGL photo?', a: 'Yes, as long as the photo has a plain white background, is well-lit, shows your full face clearly, and is resized to 275×354 px at 20–50 KB in JPG.' },
      { q: 'What happens if I upload an oversized photo for SSC CGL?', a: 'The portal will display an error and reject the upload. You must resize the photo to the specified dimensions and KB range before re-uploading.' },
    ],
  },
  {
    slug: 'ssc-chsl-photo-size',
    name: 'SSC CHSL',
    fullName: 'SSC Combined Higher Secondary Level (CHSL) Examination',
    keywords: 'ssc chsl photo size, ssc chsl photo requirements 2025, ssc chsl photo size in kb, ssc chsl signature size, ssc chsl photo dimensions',
    desc: 'Exact SSC CHSL photo and signature size requirements for 2025. Dimensions, KB limits and format — with a one-click resize tool.',
    photo: { w: 200, h: 240, minKb: 20, maxKb: 50, fmt: 'JPG', note: 'Passport-style, white background, recent colour photo' },
    sig:   { w: 200, h: 80,  minKb: 10, maxKb: 20, fmt: 'JPG', note: 'Black ink on white paper' },
    resizerPhotoUrl: '/resizer/?preset=ssc-chsl-photo-resize&w=200&h=240&minkb=20&maxkb=50&fmt=JPG&document=photo&title=SSC+CHSL+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fssc-chsl-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=ssc-chsl-signature-resize&w=200&h=80&minkb=10&maxkb=20&fmt=JPG&document=signature&title=SSC+CHSL+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fssc-chsl-photo-size%2F',
    ageLink: '/age-calculator-for-ssc-cgl/',
    portalNote: 'Upload during the SSC CHSL online application on ssc.gov.in.',
    tips: ['Plain white background required.', 'Full face must be visible — no caps, sunglasses or heavy jewellery.', 'Black or blue ink signature on plain white paper.', 'Take the photo in good natural or artificial lighting.'],
    faqs: [
      { q: 'What is the SSC CHSL photo size 2025?', a: 'SSC CHSL requires a photo of 200×240 pixels, between 20 KB and 50 KB, in JPG format on a plain white background.' },
      { q: 'What is the SSC CHSL signature size?', a: 'Signature for SSC CHSL: 200×80 pixels, 10–20 KB in JPG. Sign on white paper with black or blue ink.' },
      { q: 'Is the SSC CHSL photo size different from SSC CGL?', a: 'Yes. SSC CGL photo: 275×354 px, 20–50 KB. SSC CHSL photo: 200×240 px, 20–50 KB. Always check the current notification as these requirements can change.' },
      { q: 'What happens if I use the wrong photo size for SSC CHSL?', a: 'The portal rejects uploads that exceed the KB limit or fall outside the pixel dimensions. Use our tool to resize to exactly 200×240 px under 50 KB.' },
      { q: 'Can I use the same photo for multiple SSC exams?', a: 'Only if the photo meets each exam\'s specific pixel and KB requirements. SSC CGL and CHSL have different dimensions. Always resize specifically for each exam form.' },
      { q: 'What format does SSC CHSL accept for photos?', a: 'SSC CHSL (and most SSC exams) accept only JPG/JPEG format. Convert PNG or HEIC photos to JPG before uploading.' },
    ],
  },
  {
    slug: 'neet-photo-size',
    name: 'NEET-UG',
    fullName: 'NEET Undergraduate (NTA Medical Entrance)',
    keywords: 'neet photo size, neet photo size 2025, neet ug photo requirements, neet photo size in kb, neet photo dimensions, neet signature size, nta neet photo',
    desc: 'Exact NEET-UG photo and signature size requirements for 2025. NTA specifies strict photo dimensions and KB limits — get them right before the deadline.',
    photo: { w: 480, h: 576, minKb: 10, maxKb: 200, fmt: 'JPG', note: 'White background, colour photo, name and date printed at bottom preferred' },
    sig:   { w: 480, h: 144, minKb: 4, maxKb: 30, fmt: 'JPG', note: 'Black ink on white paper, sign your usual signature' },
    resizerPhotoUrl: '/resizer/?preset=neet-photo-resize&w=480&h=576&minkb=10&maxkb=200&fmt=JPG&document=photo&title=NEET+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fneet-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=neet-signature-resize&w=480&h=144&minkb=4&maxkb=30&fmt=JPG&document=signature&title=NEET+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fneet-photo-size%2F',
    ageLink: '/age-calculator-for-neet/',
    portalNote: 'Upload on NTA NEET application portal (neet.nta.nic.in) during the registration window.',
    tips: ['Write your name and date of photo at the bottom of the physical photo (if printed).', 'White or very light grey background is required.', 'Photo must be recent (within 3 months) for recognition at exam centres.', 'High-contrast, well-lit photo prevents rejection at the exam centre.'],
    faqs: [
      { q: 'What is the NEET photo size 2025?', a: 'NEET-UG (NTA) typically requires a photo of 480×576 pixels (or equivalent 3.5×4.5 cm at 200 DPI), 10–200 KB in JPG with a white background. Always confirm from the current year NTA information bulletin.' },
      { q: 'What is the NEET signature size?', a: 'NEET signature: approximately 480×144 pixels, 4–30 KB in JPG. Sign on plain white paper in black ink and scan or photograph clearly.' },
      { q: 'Does NEET require the candidate\'s name on the photo?', a: 'NTA NEET recommends (and sometimes requires) the candidate to print their name and the date the photo was taken at the bottom of the photo before scanning it.' },
      { q: 'What happens if my NEET photo is rejected?', a: 'Incorrect photos can result in rejection of your online application, barring you from receiving your admit card. Always use exactly the dimensions and KB range specified.' },
      { q: 'Can I use the same photo for NEET and JEE?', a: 'Only if it meets both exams\' specifications (which sometimes differ). NTA NEET and JEE Main are separate portals — upload fresh photos sized for each exam.' },
      { q: 'Is a mobile phone photo acceptable for NEET?', a: 'Yes, as long as the background is plain white, the photo is well-lit, the face is clearly visible, and the image is resized to the required dimensions and KB range.' },
    ],
  },
  {
    slug: 'jee-main-photo-size',
    name: 'JEE Main',
    fullName: 'JEE Main (Joint Entrance Examination) by NTA',
    keywords: 'jee main photo size, jee main photo size 2025, jee main photo requirements, jee photo size in kb, jee main photo dimensions, jee main signature size, nta jee photo',
    desc: 'Exact JEE Main photo and signature size requirements for 2025. NTA specifies exact pixel and KB requirements — get your photo ready before the registration deadline.',
    photo: { w: 480, h: 576, minKb: 10, maxKb: 200, fmt: 'JPG', note: 'White background, colour, front-facing, no cap' },
    sig:   { w: 480, h: 144, minKb: 4, maxKb: 30, fmt: 'JPG', note: 'Black ink on white paper' },
    resizerPhotoUrl: '/resizer/?preset=jee-photo-resize&w=480&h=576&minkb=10&maxkb=200&fmt=JPG&document=photo&title=JEE+Main+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fjee-main-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=jee-signature-resize&w=480&h=144&minkb=4&maxkb=30&fmt=JPG&document=signature&title=JEE+Main+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fjee-main-photo-size%2F',
    ageLink: '/age-calculator/',
    portalNote: 'Upload on the NTA JEE Main portal (jeemain.nta.nic.in) during registration.',
    tips: ['Use a white or very light background.', 'No caps, sunglasses or religious head coverings (unless for genuine religious reasons, with supporting document).', 'The same photo must be carried to the exam hall.', 'Keep the original (unedited) photo safe — you may need it for counselling.'],
    faqs: [
      { q: 'What is the JEE Main photo size 2025?', a: 'NTA JEE Main requires a photo of 480×576 pixels (equivalent to 3.5×4.5 cm passport size at 200 DPI), 10–200 KB in JPG format with a plain white background.' },
      { q: 'What is the JEE Main signature size?', a: 'JEE Main signature: approximately 480×144 pixels, 4–30 KB in JPG. Sign on white paper in black ink.' },
      { q: 'Does JEE Main and NEET have the same photo requirements?', a: 'Yes, NTA uses the same specifications for both JEE Main and NEET-UG: ~480×576 px, 10–200 KB, JPG, white background. But always verify from the specific information bulletin each year.' },
      { q: 'Do I need to carry the same photo to the JEE Main exam centre?', a: 'Yes. NTA requires you to carry a printout of your admit card and the same photograph that was uploaded during registration. A mismatch may cause issues at the centre.' },
      { q: 'Can I upload a photo taken with my phone for JEE Main?', a: 'Yes. Use your phone camera in good lighting against a white wall. Then use our resize tool to bring it to 480×576 px under 200 KB in JPG.' },
      { q: 'What format does JEE Main accept for the photo?', a: 'Only JPG/JPEG format. Convert PNG or HEIC photos to JPG using our PNG to JPG converter before uploading.' },
    ],
  },
  {
    slug: 'ibps-po-photo-size',
    name: 'IBPS PO & Clerk',
    fullName: 'IBPS PO and IBPS Clerk Online Application',
    keywords: 'ibps po photo size, ibps po photo requirements 2025, ibps clerk photo size, ibps photo size in kb, ibps po photo dimensions, ibps signature size',
    desc: 'Exact IBPS PO and Clerk photo and signature size requirements for 2025. Get the pixel dimensions, KB limits and format right before the deadline.',
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, fmt: 'JPG', note: 'Colour photo, white background, within last 3 months' },
    sig:   { w: 140, h: 60,  minKb: 10, maxKb: 20, fmt: 'JPG', note: 'Black or blue ink on white paper' },
    resizerPhotoUrl: '/resizer/?preset=ibps-po-photo-resize&w=200&h=230&minkb=20&maxkb=50&fmt=JPG&document=photo&title=IBPS+PO+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fibps-po-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=ibps-po-signature-resize&w=140&h=60&minkb=10&maxkb=20&fmt=JPG&document=signature&title=IBPS+PO+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fibps-po-photo-size%2F',
    ageLink: '/age-calculator-for-ibps-po/',
    portalNote: 'Upload during the IBPS CRP PO/MT or CRP Clerk registration on ibps.in.',
    tips: ['Photo must be from the last 3 months.', 'Light background — white or off-white preferred.', 'No spectacles unless medically necessary.', 'Signature should match across all IBPS applications.'],
    faqs: [
      { q: 'What is the IBPS PO photo size 2025?', a: 'IBPS PO typically requires a colour photo of 200×230 pixels, 20–50 KB in JPG format with a plain white background taken within the last 3 months.' },
      { q: 'What is the IBPS PO signature size?', a: 'IBPS PO signature: approximately 140×60 pixels, 10–20 KB in JPG. Sign on white paper in black or blue ink — not pencil.' },
      { q: 'Is the IBPS Clerk photo size the same as IBPS PO?', a: 'Yes. IBPS uses the same photo and signature requirements for all its CRP exams (PO, Clerk, SO, RRB). The specs may occasionally change — verify from the current notification.' },
      { q: 'Can I use the same photo for IBPS PO and SBI PO?', a: 'Only if the photo meets both specifications. The dimensions and KB limits are often similar but not always identical. Always resize specifically for each portal.' },
      { q: 'What happens if my IBPS photo upload fails?', a: 'If the photo exceeds the KB limit or is in the wrong format, the portal shows an error. Resize to 200×230 px and under 50 KB using our tool, then re-upload.' },
      { q: 'Does IBPS accept coloured backgrounds for photos?', a: 'No. IBPS requires a plain white or off-white background for the passport-size photo.' },
    ],
  },
  {
    slug: 'nda-photo-size',
    name: 'UPSC NDA',
    fullName: 'UPSC NDA & NA (National Defence Academy) Application',
    keywords: 'nda photo size, upsc nda photo requirements, nda photo size 2025, nda photo size in kb, nda signature size, nda application photo dimensions',
    desc: 'Exact UPSC NDA photo and signature size requirements for the online application. Dimensions, KB limits and format — with a one-click resizer.',
    photo: { w: 400, h: 400, minKb: 20, maxKb: 100, fmt: 'JPG', note: 'Colour passport photo, white or light background, formal attire' },
    sig:   { w: 400, h: 200, minKb: 10, maxKb: 50, fmt: 'JPG', note: 'Black ink on white paper, clear signature' },
    resizerPhotoUrl: '/resizer/?preset=nda-photo-resize&w=400&h=400&minkb=20&maxkb=100&fmt=JPG&document=photo&title=NDA+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fnda-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=nda-signature-resize&w=400&h=200&minkb=10&maxkb=50&fmt=JPG&document=signature&title=NDA+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fnda-photo-size%2F',
    ageLink: '/age-calculator-for-nda/',
    portalNote: 'Upload on the UPSC online application portal (upsconline.nic.in) during NDA/NA registration.',
    tips: ['Military-style photo: look directly at the camera, no smile, formal attire.', 'Plain white or light background.', 'Keep the same photo for SSB documents — consistency is important.', 'Do not edit or filter the photo.'],
    faqs: [
      { q: 'What is the NDA photo size for online application?', a: 'UPSC NDA online application typically requires a passport-size colour photo of 400×400 pixels, 20–100 KB in JPG with a plain white background.' },
      { q: 'What is the NDA signature size?', a: 'NDA signature: approximately 400×200 pixels, 10–50 KB in JPG. Sign clearly on white paper in black ink.' },
      { q: 'Can girls apply for NDA and submit a photo?', a: 'Yes. Female candidates have been eligible for NDA since 2022. The same photo requirements apply.' },
      { q: 'What kind of photo should I use for NDA?', a: 'A formal, front-facing colour photo in a collared shirt or formal attire. Plain white background. No cap, sunglasses or jewellery. Direct gaze at the camera.' },
      { q: 'Does NDA require a recent photo?', a: 'Yes. Use a recent passport-size photo taken within the last 6 months. The same photo must be used throughout the NDA selection process (SSB, medical, etc.).' },
      { q: 'What is the NDA age limit?', a: 'NDA has a strict age window: 16.5 to 19.5 years on the first day of the month of course commencement. There is no age relaxation for any category. Check our NDA age calculator.' },
    ],
  },
  {
    slug: 'rrb-ntpc-photo-size',
    name: 'RRB NTPC',
    fullName: 'RRB Non-Technical Popular Categories (NTPC) Application',
    keywords: 'rrb ntpc photo size, rrb ntpc photo requirements 2025, railway ntpc photo size, rrb ntpc photo dimensions, rrb ntpc signature size, rrb photo size in kb',
    desc: 'Exact RRB NTPC photo and signature size requirements for the online application. Get dimensions, KB limits and format correct before the deadline.',
    photo: { w: 200, h: 230, minKb: 15, maxKb: 40, fmt: 'JPG', note: 'Recent colour passport photo, white background' },
    sig:   { w: 200, h: 80,  minKb: 10, maxKb: 20, fmt: 'JPG', note: 'Blue or black ink on white paper' },
    resizerPhotoUrl: '/resizer/?preset=rrb-ntpc-photo-resize&w=200&h=230&minkb=15&maxkb=40&fmt=JPG&document=photo&title=RRB+NTPC+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Frrb-ntpc-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=rrb-ntpc-signature-resize&w=200&h=80&minkb=10&maxkb=20&fmt=JPG&document=signature&title=RRB+NTPC+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Frrb-ntpc-photo-size%2F',
    ageLink: '/age-calculator-for-rrb-ntpc/',
    portalNote: 'Upload on the respective RRB regional portal (e.g., rrbcdg.gov.in, rrbbhopal.nic.in) during online registration.',
    tips: ['Use a recent passport-size colour photo on white background.', 'The same photo is needed for admit card and document verification.', 'Signature should be consistent — you will sign again at exam and DVP.', 'Confirm the exact specs from your RRB regional notification.'],
    faqs: [
      { q: 'What is the RRB NTPC photo size 2025?', a: 'RRB NTPC typically requires a colour photo of 200×230 pixels (or equivalent passport size), 15–40 KB in JPG. Requirements may vary slightly by RRB region — confirm from the regional notification.' },
      { q: 'What is the RRB NTPC signature size?', a: 'Signature for RRB NTPC: approximately 200×80 pixels, 10–20 KB in JPG. Sign on white paper with blue or black ink.' },
      { q: 'Does each RRB zone have different photo requirements?', a: 'The core format (JPG, passport-size, white background) is the same across RRB zones, but KB limits and exact pixel dimensions may vary slightly. Always check your specific RRB regional notification.' },
      { q: 'Can I use a scanned photo for RRB NTPC?', a: 'Yes. Scan a passport-size print at 200 DPI or higher, then resize to the required dimensions and KB range using our tool.' },
      { q: 'What happens if I upload a wrong photo size for RRB NTPC?', a: 'The portal will reject uploads exceeding the file size or dimension limits. Resize your photo using our tool and re-upload.' },
      { q: 'Is the RRB NTPC photo requirement different from RRB Group D?', a: 'The format is similar but specifications may differ. Both require a JPG colour photo with white background, but check the exact pixel and KB requirements for each exam separately.' },
    ],
  },
  {
    slug: 'sbi-po-photo-size',
    name: 'SBI PO',
    fullName: 'State Bank of India PO (Probationary Officer) Application',
    keywords: 'sbi po photo size, sbi po photo requirements 2025, sbi po photo size in kb, sbi po photo dimensions, sbi po signature size, sbi po application photo',
    desc: 'Exact SBI PO photo and signature size requirements for 2025. Get the pixel dimensions, KB limits and JPEG format right before the SBI PO application deadline.',
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, fmt: 'JPG', note: 'Recent colour photo, white background, taken in last 3 months' },
    sig:   { w: 140, h: 60,  minKb: 10, maxKb: 20, fmt: 'JPG', note: 'Black or dark blue ink, white paper, clear strokes' },
    resizerPhotoUrl: '/resizer/?preset=sbi-po-photo-resize&w=200&h=230&minkb=20&maxkb=50&fmt=JPG&document=photo&title=SBI+PO+Photo+Resize&canon=https%3A%2F%2Filovexams.in%2Fsbi-po-photo-size%2F',
    resizerSigUrl:   '/resizer/?preset=sbi-po-signature-resize&w=140&h=60&minkb=10&maxkb=20&fmt=JPG&document=signature&title=SBI+PO+Signature+Resize&canon=https%3A%2F%2Filovexams.in%2Fsbi-po-photo-size%2F',
    ageLink: '/age-calculator-for-sbi-po/',
    portalNote: 'Upload on the SBI online application portal (sbi.co.in/careers) during the registration window.',
    tips: ['Photo must be recent (within 3 months).', 'Plain white or off-white background.', 'No editing, filters or beauty mode.', 'Signature must match your official documents exactly.'],
    faqs: [
      { q: 'What is the SBI PO photo size 2025?', a: 'SBI PO requires a colour photo of 200×230 pixels, 20–50 KB in JPG with a plain white background taken within the last 3 months.' },
      { q: 'What is the SBI PO signature size?', a: 'SBI PO signature: 140×60 pixels, 10–20 KB in JPG. Sign with black or dark blue ink on plain white paper.' },
      { q: 'Is SBI PO photo size different from IBPS PO?', a: 'Both are very similar: 200×230 px, 20–50 KB, JPG. However, always verify from the current SBI notification since banks occasionally update specifications.' },
      { q: 'Does SBI PO require a thumb impression upload?', a: 'Some SBI recruitment cycles require a left thumb impression in addition to photo and signature. Check the specific notification for the current year.' },
      { q: 'What if my SBI PO photo upload fails?', a: 'Resize the photo to 200×230 px, under 50 KB, in JPG format using our resize tool and try again.' },
      { q: 'Can I use the same photo for SBI PO and SBI Clerk?', a: 'Yes, if the photo meets both specifications (which are usually the same for SBI examinations). Use fresh photos for best results.' },
    ],
  },
];

function specRow(label, spec) {
  return `
    <tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:9px 12px;color:#64748b;font-size:13px;font-weight:600">${label}</td>
      <td style="padding:9px 12px;font-size:13px;font-family:monospace;color:#0f172a;font-weight:700">${spec.w} × ${spec.h} px</td>
      <td style="padding:9px 12px;font-size:13px;color:#0f172a">${spec.minKb}–${spec.maxKb} KB</td>
      <td style="padding:9px 12px;font-size:13px;color:#0f172a">${spec.fmt}</td>
      <td style="padding:9px 12px;font-size:13px;color:#64748b">${spec.note}</td>
    </tr>`;
}

function page(exam) {
  const canonical = `https://ilovexams.in/${exam.slug}/`;
  const title = `${exam.name} Photo & Signature Size Requirements 2025 | ILoveExams`;
  const faqSchema = exam.faqs.map(f =>
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
  <meta property="og:title" content="${exam.name} Photo Size Requirements 2025 | ILoveExams">
  <meta property="og:description" content="${exam.desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://ilovexams.in/og-image.png">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${exam.name} Photo Size | ILoveExams">
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
    .spec-chip { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); padding: 6px 14px; border-radius: 8px; font-size: 13px; color: #e2e8f0; font-family: monospace; }
    .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg,#3b82f6,#2563eb); color: #fff; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; padding: 12px 24px; font-size: 14px; transition: all .2s; }
    .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,.4); }
  </style>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"https://ilovexams.in/"},
    {"@type":"ListItem","position":2,"name":"${exam.name} Photo Size","item":"${canonical}"}]}
  <\/script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqSchema}]}
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
      <a href="/" style="color:rgba(255,255,255,.75);text-decoration:none">All Tools</a>
    </div>
    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
      <span class="hidden sm:inline-flex" style="font-size:11px;color:#93c5fd;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);padding:4px 10px;border-radius:999px;white-space:nowrap">● 100% Private</span>
      <a href="https://razorpay.me/@gautamkumarrajkumar" target="_blank" rel="noopener" style="font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ef4444,#dc2626);padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap">♥ Donate</a>
    </div>
  </div>
</nav>

<div style="background:linear-gradient(135deg,#0a0e1a 0%,#0d1629 60%,#0a1828 100%);padding:48px 16px 40px">
  <div style="max-width:860px;margin:0 auto">
    <nav style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:14px">
      <a href="/" style="color:rgba(255,255,255,.4);text-decoration:none">Home</a> › <a href="/resizer/" style="color:rgba(255,255,255,.4);text-decoration:none">Exam Resizer</a> › ${exam.name}
    </nav>
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.3);border-radius:999px;padding:4px 12px;margin-bottom:16px">
      <span style="font-size:11px;font-weight:700;color:#fca5a5;text-transform:uppercase;letter-spacing:.08em">${exam.name} Requirements</span>
    </div>
    <h1 style="font-size:clamp(22px,4.5vw,40px);font-weight:900;color:#fff;margin:0 0 12px;line-height:1.15">${exam.name} Photo & Signature Size Requirements</h1>
    <p style="color:rgba(255,255,255,.6);font-size:16px;margin:0 0 24px;max-width:600px">${exam.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px">
      <span class="spec-chip">📸 Photo: ${exam.photo.w}×${exam.photo.h} px</span>
      <span class="spec-chip">💾 ${exam.photo.minKb}–${exam.photo.maxKb} KB</span>
      <span class="spec-chip">✍ Sig: ${exam.sig.w}×${exam.sig.h} px</span>
      <span class="spec-chip">📄 ${exam.photo.fmt}</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px">
      <a href="${exam.resizerPhotoUrl}" class="cta-btn">📸 Resize Photo for ${exam.name} →</a>
      <a href="${exam.resizerSigUrl}" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-weight:700;border-radius:12px;text-decoration:none;padding:12px 24px;font-size:14px;transition:all .2s">✍ Resize Signature →</a>
    </div>
  </div>
</div>

<div style="max-width:860px;margin:0 auto;padding:32px 16px 0">

  <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:28px 24px;margin-bottom:24px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">${exam.fullName} — Photo & Signature Specifications</h2>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px">
        <thead><tr style="background:#f8fafc;text-align:left">
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">Type</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">Dimensions</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">File Size</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">Format</th>
          <th style="padding:10px 12px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0">Notes</th>
        </tr></thead>
        <tbody>
          ${specRow('Photo', exam.photo)}
          ${specRow('Signature', exam.sig)}
        </tbody>
      </table>
    </div>
    <p style="font-size:12px;color:#94a3b8;margin:12px 0 0">Portal: ${exam.portalNote} Specifications may change each year — verify from the official notification.</p>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
    <a href="${exam.resizerPhotoUrl}" style="display:block;background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:16px;padding:24px;text-decoration:none;transition:all .2s">
      <div style="font-size:28px;margin-bottom:8px">📸</div>
      <p style="font-size:15px;font-weight:800;color:#fff;margin:0 0 4px">Resize ${exam.name} Photo</p>
      <p style="font-size:12px;color:rgba(255,255,255,.65);margin:0">${exam.photo.w}×${exam.photo.h} px · ${exam.photo.minKb}–${exam.photo.maxKb} KB · ${exam.photo.fmt}</p>
    </a>
    <a href="${exam.resizerSigUrl}" style="display:block;background:linear-gradient(135deg,#0d9488,#0f766e);border-radius:16px;padding:24px;text-decoration:none;transition:all .2s">
      <div style="font-size:28px;margin-bottom:8px">✍</div>
      <p style="font-size:15px;font-weight:800;color:#fff;margin:0 0 4px">Resize ${exam.name} Signature</p>
      <p style="font-size:12px;color:rgba(255,255,255,.65);margin:0">${exam.sig.w}×${exam.sig.h} px · ${exam.sig.minKb}–${exam.sig.maxKb} KB · ${exam.sig.fmt}</p>
    </a>
  </div>

  <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:28px 24px;margin-bottom:24px">
    <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 12px">How to Resize Your Photo for ${exam.name}</h2>
    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:16px">
      <div style="display:flex;gap:14px;align-items:flex-start"><span style="width:28px;height:28px;background:#3b82f6;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">1</span><p style="margin:0;font-size:14px;color:#475569">Click "Resize ${exam.name} Photo" above — the tool loads pre-configured with the exact specifications.</p></div>
      <div style="display:flex;gap:14px;align-items:flex-start"><span style="width:28px;height:28px;background:#3b82f6;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">2</span><p style="margin:0;font-size:14px;color:#475569">Upload your photo (JPG, PNG, HEIC or WEBP). Drag-and-drop or browse — up to 15 MB input.</p></div>
      <div style="display:flex;gap:14px;align-items:flex-start"><span style="width:28px;height:28px;background:#3b82f6;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">3</span><p style="margin:0;font-size:14px;color:#475569">Crop if needed, click Process, then download. Your image will be exactly ${exam.photo.w}×${exam.photo.h} px and under ${exam.photo.maxKb} KB — ready to upload.</p></div>
    </div>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:12px 16px;margin-bottom:16px">
      <p style="font-size:13px;color:#78350f;margin:0"><strong>Tips for ${exam.name}:</strong> ${exam.tips.join(' ')}</p>
    </div>
    <h3 style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 8px">Also useful</h3>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <a href="${exam.ageLink}" style="font-size:13px;color:#059669;background:#ecfdf5;border:1px solid #6ee7b7;padding:5px 12px;border-radius:8px;text-decoration:none">🎂 ${exam.name} Age Calculator</a>
      <a href="/compress-image/" style="font-size:13px;color:#7c3aed;background:#f5f3ff;border:1px solid #c4b5fd;padding:5px 12px;border-radius:8px;text-decoration:none">🗜 Compress Image</a>
      <a href="/png-to-jpg/" style="font-size:13px;color:#d97706;background:#fffbeb;border:1px solid #fcd34d;padding:5px 12px;border-radius:8px;text-decoration:none">PNG to JPG</a>
      <a href="/word-counter/" style="font-size:13px;color:#0284c7;background:#f0f9ff;border:1px solid #7dd3fc;padding:5px 12px;border-radius:8px;text-decoration:none">📝 Word Counter</a>
    </div>
  </div>

  <aside aria-label="Sponsored content" style="margin-bottom:24px">
    <p style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.12em;margin:0 0 6px">ADVERTISEMENT</p>
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;min-height:260px;display:flex;align-items:center;justify-content:center">
      <ins class="adsbygoogle" style="display:block;width:100%;min-height:230px" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </div>
  </aside>
  <script>(function(){try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}})();<\/script>

  <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 16px">Frequently Asked Questions</h2>
  ${exam.faqs.map(f => `<div class="faq-item"><div class="faq-q">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('\n  ')}

  <div style="margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:40px">
    <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 14px">More Exam Photo Size Guides</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <a href="/upsc-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">UPSC CSE</a>
      <a href="/ssc-cgl-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">SSC CGL</a>
      <a href="/ssc-chsl-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">SSC CHSL</a>
      <a href="/neet-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">NEET-UG</a>
      <a href="/jee-main-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">JEE Main</a>
      <a href="/ibps-po-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">IBPS PO/Clerk</a>
      <a href="/nda-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">NDA</a>
      <a href="/rrb-ntpc-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">RRB NTPC</a>
      <a href="/sbi-po-photo-size/" style="font-size:13px;color:#dc2626;background:#fff5f5;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;text-decoration:none">SBI PO</a>
      <a href="/resizer/" style="font-size:13px;color:#3b82f6;background:#eff6ff;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;text-decoration:none">All 80+ Exams Resizer</a>
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
    <a href="/resizer/" style="color:rgba(255,255,255,.5);text-decoration:none">Exam Resizer</a> ·
    <a href="/age-calculator/" style="color:rgba(255,255,255,.5);text-decoration:none">Age Calculator</a> ·
    <a href="/privacy/" style="color:rgba(255,255,255,.5);text-decoration:none">Privacy</a> ·
    <a href="/terms/" style="color:rgba(255,255,255,.5);text-decoration:none">Terms</a>
  </p>
</footer>

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
console.log(`✅ Generated ${count} exam photo requirement pages`);
