// স্টোরেজ লেয়ার: Firebase থাকলে Firestore, না থাকলে localStorage ডেমো মোড।
// হোমপেজের "সাম্প্রতিক অর্ডার" শুধু আসল সংরক্ষিত অর্ডার থেকে আসে;
// ডেমোতে সেগুলো স্পষ্টভাবে "নমুনা অর্ডার" লেবেলসহ দেখানো হয়।
import { PRODUCTS } from '../data/products.js'
import { db, firebaseConfigured } from './firebase.js'
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore'

const LS = {
  products: 'rrrtopup_products',
  orders: 'rrrtopup_orders',
  settings: 'rrrtopup_settings',
  session: 'rrrtopup_session',
  adminSession: 'rrrtopup_admin_session',
}

export const DEFAULT_SETTINGS = {
  siteName: 'RRR TopUp',
  tagline: 'বাংলাদেশের প্রিমিয়াম গেমিং টপ-আপ',
  heroTitle: 'ফ্রি ফায়ার ডায়মন্ড ও PUBG UC টপ আপ করুন',
  heroSubtitle: 'শুধু UID দিন — পাসওয়ার্ড লাগবে না। বিকাশ ও নগদে নিরাপদ পেমেন্ট, ৫–৩০ মিনিটে ডেলিভারি।',
  offerBanner: 'ঈদ অফার: সব ডায়মন্ড প্যাকে অতিরিক্ত ছাড়! সীমিত সময়ের জন্য।',
  supportPhone: '01XXXXXXXXX',
  supportEmail: 'support@rrrtopup.com',
  supportHours: 'প্রতিদিন ২৪ ঘণ্টা (Mo–Su 00:00–23:59)',
  payments: {
    bkash: { enabled: true, number: '01XXXXXXXXX', label: 'bKash (Personal)', instructions: 'bKash অ্যাপ থেকে Send Money করুন। নিচের নম্বরে ঠিক পরিমাণ টাকা পাঠান, তারপর Transaction ID দিন।' },
    nagad: { enabled: true, number: '01XXXXXXXXX', label: 'Nagad (Personal)', instructions: 'Nagad অ্যাপ থেকে Send Money করুন। নিচের নম্বরে ঠিক পরিমাণ টাকা পাঠান, তারপর Transaction ID দিন।' },
  },
  deliveryNote: 'পেমেন্ট ভেরিফাই হওয়ার পর সাধারণত ৫–৩০ মিনিটের মধ্যে ডেলিভারি হয়। ব্যস্ত সময়ে সর্বোচ্চ ২ ঘণ্টা লাগতে পারে।',
}

// নমুনা অর্ডার — শুধু ডেমো/সিড হিসেবে, স্পষ্ট লেবেলসহ দেখানো হয়।
export const SAMPLE_ORDERS = [
  { id: 'RRR-100231', name: 'রাহাত', productName: '25 Diamond', game: 'Free Fire', amount: 22, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 12, sample: true },
  { id: 'RRR-100229', name: 'সিয়াম', productName: 'Weekly Membership 2X', game: 'Free Fire', amount: 316, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 34, sample: true },
  { id: 'RRR-100227', name: 'তানভীর', productName: 'Weekly Membership', game: 'Free Fire', amount: 158, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 58, sample: true },
  { id: 'RRR-100224', name: 'আরিফ', productName: '5060 Diamond', game: 'Free Fire', amount: 3200, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 95, sample: true },
  { id: 'RRR-100221', name: 'নাঈম', productName: '325 UC', game: 'PUBG Mobile', amount: 617, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 140, sample: true },
  { id: 'RRR-100218', name: 'হাসান', productName: '115 Diamond', game: 'Free Fire', amount: 79, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 190, sample: true },
]

function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

export function getProducts() {
  const overrides = readLS(LS.products, null)
  if (!overrides) return PRODUCTS
  // অ্যাডমিন পরিবর্তন: সিড প্রোডাক্টে override মার্জ + নতুন প্রোডাক্ট যোগ
  const map = new Map(PRODUCTS.map((p) => [p.id, p]))
  for (const p of overrides) map.set(p.id, { ...(map.get(p.id) || {}), ...p })
  return [...map.values()]
}
export function saveProducts(list) { writeLS(LS.products, list) }
export function getProductById(id) { return getProducts().find((p) => p.id === id) }

export function getSettings() {
  const s = readLS(LS.settings, null)
  return s ? { ...DEFAULT_SETTINGS, ...s, payments: { ...DEFAULT_SETTINGS.payments, ...(s.payments || {}) } } : DEFAULT_SETTINGS
}
export function saveSettings(s) { writeLS(LS.settings, s) }

export function getOrders() {
  const local = readLS(LS.orders, [])
  return [...local].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}
export function getOrderById(id) { return getOrders().find((o) => o.id === id) }

export function saveOrder(order) {
  const list = readLS(LS.orders, [])
  const i = list.findIndex((o) => o.id === order.id)
  if (i >= 0) list[i] = order; else list.unshift(order)
  writeLS(LS.orders, list)
  if (firebaseConfigured && db) {
    addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() }).catch(() => {})
  }
  return order
}

export function makeOrderId() {
  return 'RRR-' + Math.floor(100000 + Math.random() * 900000)
}

export async function fetchRemoteOrders() {
  if (!firebaseConfigured || !db) return []
  try {
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(20)))
    return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || Date.now() }))
  } catch { return [] }
}

export function latestOrdersForHome() {
  const real = getOrders()
  if (real.length) return real.slice(0, 6)
  return SAMPLE_ORDERS // ডেমো মোডে নমুনা — UI-তে "নমুনা অর্ডার" লেবেল দেখানো হয়
}
export function isDemoMode() { return !firebaseConfigured }
export { LS }
