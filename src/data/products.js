// RRR TopUp — একমাত্র সত্য উৎস (single source of truth)।
// দামগুলো শুরু-দাম (starting price), অ্যাডমিন প্যানেল থেকে বদলানো যায়।
// ছবি: গ্রেডিয়েন্ট + আইকন (কোনো কপি করা ছবি/লোগো ব্যবহার করা হয়নি)।

export const GAMES = {
  ff: { id: 'ff', name: 'Free Fire', nameBn: 'ফ্রি ফায়ার', tagline: 'ডায়মন্ড ও মেম্বারশিপ', gradient: 'from-orange-500 via-red-500 to-rose-600', icon: 'diamond' },
  pubg: { id: 'pubg', name: 'PUBG Mobile', nameBn: 'পাবজি মোবাইল', tagline: 'UC ও রয়্যাল পাস', gradient: 'from-amber-400 via-yellow-500 to-orange-600', icon: 'uc' },
}

export const FF_CATEGORIES = [
  { id: 'diamonds', name: 'Free Fire Diamonds', nameBn: 'ফ্রি ফায়ার ডায়মন্ড' },
  { id: 'weekly', name: 'Weekly Membership', nameBn: 'উইকলি মেম্বারশিপ' },
  { id: 'monthly', name: 'Monthly Membership', nameBn: 'মান্থলি মেম্বারশিপ' },
  { id: 'weekly-lite', name: 'Weekly Lite', nameBn: 'উইকলি লাইট' },
  { id: 'level-up', name: 'Level Up Pass', nameBn: 'লেভেল আপ পাস' },
  { id: 'special', name: 'Special Packages', nameBn: 'স্পেশাল প্যাকেজ' },
  { id: 'like', name: 'Free Fire Like Service', nameBn: 'লাইক সার্ভিস' },
]

export const PUBG_CATEGORIES = [
  { id: 'uc', name: 'UC Packages', nameBn: 'ইউসি প্যাকেজ' },
  { id: 'royale-pass', name: 'Royale Pass', nameBn: 'রয়্যাল পাস' },
  { id: 'special', name: 'Special UC', nameBn: 'স্পেশাল ইউসি' },
]

// image: gradient key — ProductArt কম্পোনেন্ট এই কী থেকে CSS আর্ট বানায়।
export const PRODUCTS = [
  // ---- Free Fire Diamonds (BD সার্ভার, UID টপ আপ) ----
  { id: 'ff-25', game: 'ff', category: 'diamonds', name: '25 Diamond', qty: '25 ডায়মন্ড', price: 22, oldPrice: 28, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ৫–৩০ মিনিটে ডেলিভারি।', badge: '', featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-50', game: 'ff', category: 'diamonds', name: '50 Diamond', qty: '50 ডায়মন্ড', price: 38, oldPrice: 48, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-115', game: 'ff', category: 'diamonds', name: '115 Diamond', qty: '115 ডায়মন্ড', price: 79, oldPrice: 95, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: 'জনপ্রিয়', featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-240', game: 'ff', category: 'diamonds', name: '240 Diamond', qty: '240 ডায়মন্ড', price: 155, oldPrice: 185, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-355', game: 'ff', category: 'diamonds', name: '355 Diamond', qty: '355 ডায়মন্ড', price: 235, oldPrice: 275, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-480', game: 'ff', category: 'diamonds', name: '480 Diamond', qty: '480 ডায়মন্ড', price: 310, oldPrice: 360, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-610', game: 'ff', category: 'diamonds', name: '610 Diamond', qty: '610 ডায়মন্ড', price: 400, oldPrice: 465, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-850', game: 'ff', category: 'diamonds', name: '850 Diamond', qty: '850 ডায়মন্ড', price: 555, oldPrice: 640, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-1240', game: 'ff', category: 'diamonds', name: '1240 Diamond', qty: '1240 ডায়মন্ড', price: 785, oldPrice: 900, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-2530', game: 'ff', category: 'diamonds', name: '2530 Diamond', qty: '2530 ডায়মন্ড', price: 1570, oldPrice: 1780, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-5060', game: 'ff', category: 'diamonds', name: '5060 Diamond', qty: '5060 ডায়মন্ড', price: 3200, oldPrice: 3650, desc: 'BD সার্ভার — সবচেয়ে বড় ডায়মন্ড প্যাক। শুধু UID দিয়ে টপ আপ।', badge: 'বেস্ট ভ্যালু', featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  // ---- ডেমো ডায়মন্ড প্যাক (নমুনা — badge 'ডেমো' দিয়ে লেবেল করা) ----
  { id: 'ff-10', game: 'ff', category: 'diamonds', name: '10 Diamond', qty: '10 ডায়মন্ড', price: 9, oldPrice: 12, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-75', game: 'ff', category: 'diamonds', name: '75 Diamond', qty: '75 ডায়মন্ড', price: 55, oldPrice: 65, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-100', game: 'ff', category: 'diamonds', name: '100 Diamond', qty: '100 ডায়মন্ড', price: 69, oldPrice: 85, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-200', game: 'ff', category: 'diamonds', name: '200 Diamond', qty: '200 ডায়মন্ড', price: 129, oldPrice: 155, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-300', game: 'ff', category: 'diamonds', name: '300 Diamond', qty: '300 ডায়মন্ড', price: 195, oldPrice: 230, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-500', game: 'ff', category: 'diamonds', name: '500 Diamond', qty: '500 ডায়মন্ড', price: 325, oldPrice: 385, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-1000', game: 'ff', category: 'diamonds', name: '1000 Diamond', qty: '1000 ডায়মন্ড', price: 640, oldPrice: 750, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: true, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-1500', game: 'ff', category: 'diamonds', name: '1500 Diamond', qty: '1500 ডায়মন্ড', price: 950, oldPrice: 1120, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-2000', game: 'ff', category: 'diamonds', name: '2000 Diamond', qty: '2000 ডায়মন্ড', price: 1250, oldPrice: 1480, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  { id: 'ff-3000', game: 'ff', category: 'diamonds', name: '3000 Diamond', qty: '3000 ডায়মন্ড', price: 1880, oldPrice: 2200, desc: 'BD সার্ভার — শুধু UID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  // ---- Weekly / Monthly / Lite ----
  { id: 'ff-weekly', game: 'ff', category: 'weekly', name: 'Weekly Membership', qty: 'উইকলি মেম্বারশিপ', price: 158, oldPrice: 185, desc: '৭ দিনের মেম্বারশিপ — মোট ৪৫০ ডায়মন্ড + এক্সক্লুসিভ রিওয়ার্ড।', badge: 'জনপ্রিয়', featured: true, inStock: true, gradient: 'from-violet-500 to-purple-700', icon: 'weekly' },
  { id: 'ff-weekly-2x', game: 'ff', category: 'weekly', name: 'Weekly Membership 2X', qty: 'উইকলি ২টি', price: 316, oldPrice: 370, desc: '২টি উইকলি মেম্বারশিপ একসাথে — মোট ৯০০ ডায়মন্ড।', badge: '', featured: false, inStock: true, gradient: 'from-violet-500 to-purple-700', icon: 'weekly' },
  { id: 'ff-weekly-3x', game: 'ff', category: 'weekly', name: 'Weekly Membership 3X', qty: 'উইকলি ৩টি', price: 474, oldPrice: 555, desc: '৩টি উইকলি মেম্বারশিপ একসাথে — মোট ১৩৫০ ডায়মন্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-violet-500 to-purple-700', icon: 'weekly' },
  { id: 'ff-weekly-lite', game: 'ff', category: 'weekly-lite', name: 'Weekly Lite', qty: 'উইকলি লাইট', price: 44, oldPrice: 55, desc: 'BD সার্ভার উইকলি লাইট — ১০০ ডায়মন্ড + লাইট রিওয়ার্ড।', badge: '', featured: true, inStock: true, gradient: 'from-sky-500 to-indigo-600', icon: 'lite' },
  { id: 'ff-monthly', game: 'ff', category: 'monthly', name: 'Monthly Membership', qty: 'মান্থলি মেম্বারশিপ', price: 780, oldPrice: 899, desc: '৩০ দিনের মেম্বারশিপ — মোট ২৬০০ ডায়মন্ড + এক্সক্লুসিভ রিওয়ার্ড।', badge: 'বেস্ট ভ্যালু', featured: true, inStock: true, gradient: 'from-fuchsia-500 to-violet-700', icon: 'monthly' },
  { id: 'ff-monthly-2x', game: 'ff', category: 'monthly', name: 'Monthly Membership 2X', qty: 'মান্থলি ২টি', price: 1560, oldPrice: 1798, desc: '২টি মান্থলি মেম্বারশিপ একসাথে — মোট ৫২০০ ডায়মন্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-fuchsia-500 to-violet-700', icon: 'monthly' },
  { id: 'ff-monthly-3x', game: 'ff', category: 'monthly', name: 'Monthly Membership 3X', qty: 'মান্থলি ৩টি', price: 2340, oldPrice: 2697, desc: '৩টি মান্থলি মেম্বারশিপ একসাথে — মোট ৭৮০০ ডায়মন্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-fuchsia-500 to-violet-700', icon: 'monthly' },
  // ---- Level Up Pass ----
  { id: 'ff-lvl-6', game: 'ff', category: 'level-up', name: 'Level Up Pass 6', qty: 'লেভেল ৬ পর্যন্ত', price: 44, oldPrice: 55, desc: 'লেভেল আপ পাস — লেভেল ৬ পর্যন্ত রিওয়ার্ড আনলক।', badge: '', featured: false, inStock: true, gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  { id: 'ff-lvl-10-25', game: 'ff', category: 'level-up', name: 'Level Up Pass 10–25', qty: 'লেভেল ১০–২৫', price: 81, oldPrice: 100, desc: 'লেভেল আপ পাস — লেভেল ১০ থেকে ২৫ পর্যন্ত রিওয়ার্ড আনলক।', badge: '', featured: false, inStock: true, gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  { id: 'ff-lvl-30', game: 'ff', category: 'level-up', name: 'Level Up Pass 30', qty: 'লেভেল ৩০ পর্যন্ত', price: 115, oldPrice: 140, desc: 'লেভেল আপ পাস — লেভেল ৩০ পর্যন্ত সব রিওয়ার্ড আনলক।', badge: '', featured: false, inStock: true, gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  { id: 'ff-lvl-15', game: 'ff', category: 'level-up', name: 'Level Up Pass 15', qty: 'লেভেল ১৫ পর্যন্ত', price: 60, oldPrice: 75, desc: 'লেভেল আপ পাস — লেভেল ১৫ পর্যন্ত রিওয়ার্ড আনলক। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  { id: 'ff-lvl-20', game: 'ff', category: 'level-up', name: 'Level Up Pass 20', qty: 'লেভেল ২০ পর্যন্ত', price: 72, oldPrice: 90, desc: 'লেভেল আপ পাস — লেভেল ২০ পর্যন্ত রিওয়ার্ড আনলক। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  // ---- Special ----
  { id: 'ff-special-310', game: 'ff', category: 'special', name: 'Special Pack 310', qty: '৩১০ ডায়মন্ড + বোনাস', price: 199, oldPrice: 240, desc: 'স্পেশাল প্যাকেজ — ৩১০ ডায়মন্ড + বোনাস রিওয়ার্ড।', badge: 'অফার', featured: false, inStock: true, gradient: 'from-amber-500 to-orange-600', icon: 'gift' },
  { id: 'ff-special-520', game: 'ff', category: 'special', name: 'Special Pack 520', qty: '৫২০ ডায়মন্ড + বোনাস', price: 329, oldPrice: 395, desc: 'স্পেশাল প্যাকেজ — ৫২০ ডায়মন্ড + বোনাস রিওয়ার্ড।', badge: 'অফার', featured: false, inStock: true, gradient: 'from-amber-500 to-orange-600', icon: 'gift' },
  { id: 'ff-special-100', game: 'ff', category: 'special', name: 'Special Pack 100', qty: '১০০ ডায়মন্ড + বোনাস', price: 65, oldPrice: 80, desc: 'স্পেশাল প্যাকেজ — ১০০ ডায়মন্ড + বোনাস রিওয়ার্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-500 to-orange-600', icon: 'gift' },
  { id: 'ff-special-1000', game: 'ff', category: 'special', name: 'Special Pack 1000', qty: '১০০০ ডায়মন্ড + বোনাস', price: 620, oldPrice: 740, desc: 'স্পেশাল প্যাকেজ — ১০০০ ডায়মন্ড + বোনাস রিওয়ার্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-500 to-orange-600', icon: 'gift' },
  // ---- Like Service ----
  { id: 'ff-like-100', game: 'ff', category: 'like', name: '100 Like Daily', qty: '১০০ লাইক (দৈনিক)', price: 15, oldPrice: 20, desc: 'প্রোফাইলে প্রতিদিন ১০০ লাইক — UID দিলেই হবে, পাসওয়ার্ড লাগে না।', badge: '', featured: false, inStock: true, gradient: 'from-pink-500 to-rose-600', icon: 'heart' },
  { id: 'ff-like-500', game: 'ff', category: 'like', name: '500 Like (5 Days)', qty: '৫০০ লাইক (৫ দিন)', price: 60, oldPrice: 80, desc: '৫ দিনে মোট ৫০০ লাইক — প্রতিদিন ১০০ লাইক।', badge: '', featured: false, inStock: true, gradient: 'from-pink-500 to-rose-600', icon: 'heart' },
  { id: 'ff-like-1000', game: 'ff', category: 'like', name: '1000 Like (10 Days)', qty: '১০০০ লাইক (১০ দিন)', price: 120, oldPrice: 160, desc: '১০ দিনে মোট ১০০০ লাইক — প্রতিদিন ১০০ লাইক। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-pink-500 to-rose-600', icon: 'heart' },

  // ---- PUBG Mobile UC ----
  { id: 'pubg-60', game: 'pubg', category: 'uc', name: '60 UC', qty: '৬০ ইউসি', price: 125, oldPrice: 150, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ।', badge: '', featured: true, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-325', game: 'pubg', category: 'uc', name: '325 UC', qty: '৩২৫ ইউসি', price: 617, oldPrice: 720, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ।', badge: 'জনপ্রিয়', featured: true, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-660', game: 'pubg', category: 'uc', name: '660 UC', qty: '৬৬০ ইউসি', price: 1232, oldPrice: 1420, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ।', badge: '', featured: true, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-1800', game: 'pubg', category: 'uc', name: '1800 UC', qty: '১৮০০ ইউসি', price: 3079, oldPrice: 3550, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-3850', game: 'pubg', category: 'uc', name: '3850 UC', qty: '৩৮৫০ ইউসি', price: 6159, oldPrice: 7100, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ।', badge: '', featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-8100', game: 'pubg', category: 'uc', name: '8100 UC', qty: '৮১০০ ইউসি', price: 12316, oldPrice: 14200, desc: 'PUBG Mobile UC — সবচেয়ে বড় UC প্যাক।', badge: 'বেস্ট ভ্যালু', featured: true, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  // ---- ডেমো UC প্যাক (নমুনা — badge 'ডেমো' দিয়ে লেবেল করা) ----
  { id: 'pubg-30', game: 'pubg', category: 'uc', name: '30 UC', qty: '৩০ ইউসি', price: 65, oldPrice: 80, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-120', game: 'pubg', category: 'uc', name: '120 UC', qty: '১২০ ইউসি', price: 245, oldPrice: 290, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-180', game: 'pubg', category: 'uc', name: '180 UC', qty: '১৮০ ইউসি', price: 360, oldPrice: 420, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-300', game: 'pubg', category: 'uc', name: '300 UC', qty: '৩০০ ইউসি', price: 565, oldPrice: 660, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-1200', game: 'pubg', category: 'uc', name: '1200 UC', qty: '১২০০ ইউসি', price: 2250, oldPrice: 2620, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: true, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-2400', game: 'pubg', category: 'uc', name: '2400 UC', qty: '২৪০০ ইউসি', price: 4100, oldPrice: 4750, desc: 'PUBG Mobile UC — Character ID দিয়ে টপ আপ। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  { id: 'pubg-rp', game: 'pubg', category: 'royale-pass', name: 'Royale Pass', qty: 'রয়্যাল পাস', price: 899, oldPrice: 1050, desc: 'PUBG Mobile Royale Pass — সিজনের সব রিওয়ার্ড আনলক করুন।', badge: '', featured: false, inStock: true, gradient: 'from-yellow-400 to-amber-600', icon: 'crown' },
  { id: 'pubg-rp-plus', game: 'pubg', category: 'royale-pass', name: 'Royale Pass Plus', qty: 'রয়্যাল পাস প্লাস', price: 1899, oldPrice: 2200, desc: 'Royale Pass Plus — অতিরিক্ত রিওয়ার্ড + ২৫ র‍্যাংক বোনাস।', badge: '', featured: false, inStock: true, gradient: 'from-yellow-400 to-amber-600', icon: 'crown' },
  { id: 'pubg-prime', game: 'pubg', category: 'royale-pass', name: 'Prime Pack', qty: 'প্রাইম প্যাক', price: 450, oldPrice: 550, desc: 'PUBG Mobile Prime Pack — দৈনিক UC + এক্সক্লুসিভ রিওয়ার্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-yellow-400 to-amber-600', icon: 'crown' },
  { id: 'pubg-prime-plus', game: 'pubg', category: 'royale-pass', name: 'Prime Plus Pack', qty: 'প্রাইম প্লাস প্যাক', price: 950, oldPrice: 1150, desc: 'PUBG Mobile Prime Plus Pack — অতিরিক্ত UC + প্রিমিয়াম রিওয়ার্ড। ডেমো প্যাক।', badge: 'ডেমো', demo: true, featured: false, inStock: true, gradient: 'from-yellow-400 to-amber-600', icon: 'crown' },
  { id: 'pubg-special-300', game: 'pubg', category: 'special', name: 'Special UC 300+25', qty: '৩০০+২৫ ইউসি', price: 549, oldPrice: 640, desc: 'স্পেশাল UC প্যাক — ৩০০ UC + ২৫ বোনাস UC।', badge: 'অফার', featured: false, inStock: true, gradient: 'from-orange-400 to-red-500', icon: 'gift' },
]

export function getProduct(id) { return PRODUCTS.find((p) => p.id === id) }
export function productsByGame(game) { return PRODUCTS.filter((p) => p.game === game) }
export function featuredProducts() { return PRODUCTS.filter((p) => p.featured) }
export const fmtBDT = (n) => `${Number(n).toLocaleString('en-IN')}৳`
