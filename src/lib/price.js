// সার্ভার-সাইড স্টাইলে দাম যাচাই: দাম সবসময় প্রোডাক্ট ডেটা থেকে নেওয়া হয়,
// URL বা ফর্ম থেকে আসা দাম কখনো বিশ্বাস করা হয় না।
import { getProduct } from '../data/products.js'

export function verifyPrice(productId, claimedPrice) {
  const p = getProduct(productId)
  if (!p) return { ok: false, error: 'প্রোডাক্ট পাওয়া যায়নি।' }
  if (!p.inStock) return { ok: false, error: 'এই প্যাকেজটি এখন স্টকে নেই।' }
  if (claimedPrice != null && Number(claimedPrice) !== p.price) {
    return { ok: false, error: 'দাম যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' }
  }
  return { ok: true, product: p, price: p.price }
}

export const validateUID = (uid) => /^[0-9]{6,12}$/.test(String(uid || '').trim())
export const validateMobile = (m) => /^01[3-9]\d{8}$/.test(String(m || '').trim())
export const validateTrxId = (t) => String(t || '').trim().length >= 8

export const ORDER_STATUSES = ['Pending', 'Payment Verification', 'Processing', 'Completed', 'Rejected', 'Cancelled']
export const PAYMENT_STATUSES = ['Pending Verification', 'Verified', 'Rejected']
