import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById } from '../lib/store.js'
import { StatusBadge, fmtDate, PageHero, HowItWorks } from '../components/Layout.jsx'
import { fmtBDT } from '../data/products.js'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  useEffect(() => { setOrder(getOrderById(id) || null); document.title = `অর্ডার ${id} | RRR TopUp` }, [id])
  if (!order) {
    return (
      <div>
        <PageHero badge="অর্ডার পাওয়া যায়নি" title="অর্ডারটি পাওয়া যায়নি" sub="অর্ডার আইডিটি ভুল হতে পারে। ট্র্যাক পেজ থেকে আবার খুঁজুন।" />
        <div className="text-center mt-6"><Link to="/track" className="btn-primary inline-flex">অর্ডার ট্র্যাক করুন</Link></div>
      </div>
    )
  }
  return (
    <div>
      <PageHero
        badge="অর্ডার সফল"
        title="অর্ডার সফলভাবে জমা হয়েছে!"
        sub="আপনার পেমেন্ট এখন ভেরিফিকেশনে আছে। অ্যাডমিন যাচাই করে ডেলিভারি করবেন — সাধারণত ৫–৩০ মিনিটের মধ্যে।"
        chips={['পেমেন্ট ভেরিফিকেশন চলছে', 'অর্ডার আইডি সংরক্ষণ করুন', '২৪/৭ সাপোর্ট']}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <div className="landing-card p-6 sm:p-8 text-center">
          <span className="inline-flex w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 items-center justify-center text-3xl text-emerald-600">✓</span>
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 mt-5">
            <p className="text-xs text-slate-500">আপনার অর্ডার আইডি (সংরক্ষণ করুন)</p>
            <p className="text-2xl font-extrabold text-[#0f172a] tracking-wide">{order.id}</p>
            <button onClick={() => navigator.clipboard?.writeText(order.id)} className="text-sm text-[#02B53D] underline mt-1">কপি করুন</button>
          </div>
          <div className="text-left mt-6 space-y-2 text-sm">
            <Row k="গেম" v={`${order.gameBn} (${order.game})`} />
            <Row k="প্যাকেজ" v={`${order.productName} — ${order.qty}`} />
            <Row k="Player UID" v={order.uid} />
            <Row k="পরিমাণ" v={fmtBDT(order.amount)} />
            <Row k="পেমেন্ট" v={`${order.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} — TrxID: ${order.trxId}`} />
            <Row k="পেমেন্ট স্ট্যাটাস" v={<StatusBadge status={order.paymentStatus} />} />
            <Row k="অর্ডার স্ট্যাটাস" v={<StatusBadge status={order.status} />} />
            <Row k="অর্ডারের সময়" v={fmtDate(order.createdAt)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Link to={`/track?order=${order.id}`} className="btn-primary flex-1">অর্ডার ট্র্যাক করুন</Link>
            <Link to="/" className="btn-ghost flex-1">হোমে ফিরুন</Link>
          </div>
        </div>
      </div>
      <HowItWorks />
    </div>
  )
}
function Row({ k, v }) {
  return <div className="flex justify-between gap-3 border-b border-slate-100 pb-2"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-900 text-right">{v}</span></div>
}
