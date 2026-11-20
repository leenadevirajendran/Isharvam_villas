/* ISHARVAM VILLAS: site configuration. Edit values here; nothing else in the code needs to change.
   Items marked ASSUMPTION are placeholders until the business confirms them. */
window.ISH_CONFIG = {
  brand: { name: 'Isharvam Villas', short: 'Isharvam' },
  contact: {
    phones: ['7358898271', '7448822224'],          // which is the main line: to be confirmed
    email: 'isharvam@gmail.com',
    address: null,                                  // NOT PROVIDED YET: footer/contact show a labelled placeholder
    hours: '10:00 AM – 7:00 PM', hoursStart: 10, hoursEnd: 19,
    instagram: 'https://www.instagram.com/isharvam_villas',
    whatsapp: '918675759131'                        // ASSUMPTION: +91 country code added to 8675759131
  },
  booking: {
    demo: false,                                     // frontend-only demo: no real reservations
    checkIn: '2:00 PM', checkOut: '11:00 AM',       // ASSUMPTION (sample)
    minNights: 1,                                   // ASSUMPTION (sample)
    cleaningFee: 2500,                              // ASSUMPTION (sample)
    taxRate: 0.12,                                  // ASSUMPTION (sample rate, label shown to user)
    weekendMultiplier: 1.15, weekendDays: [5, 6],   // Fri & Sat nights (sample)
    maxMonthsAhead: 12
  },
  paths: { villas: 'assets/img/villas/', site: 'assets/img/site/', fallback: 'assets/img/site/fallback.webp' }
};
