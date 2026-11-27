import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getOrderById } from '../lib/store.js'
import { StatusBadge, fmtDate, DemoBanner, PageHero, HowItWorks } from '../components/Layout.jsx'
import { fmtBDT } from '../data/products.js'

export default function Track() {
  const [params] = useSearchParams()
  const [orderId, setOrderId] = useState(params.get('order') || '')
  const [mobile, setMobile] = useState('')
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const [searched, setSearched] = useState(false)

  function search(e) {
    e?.preventDefault()
    setErr(''); setOrder(null); setSearched(true)
    const o = getOrderById(orderId.trim().toUpperCase())
    if (!o) return setErr('এই অর্ডার আইডিতে কোনো অর্ডার পাওয়া যায়নি। আইডিটি ঠিক আছে কি না যাচাই করুন।')
    // যাচাই: মোবাইলের শেষ ৪ সংখ্যা মিলতে হবে (ব্যক্তিগত তথ্য সুরক্ষা)
    if (mobile.trim() && !o.mobile.endsWith(mobile.trim().slice(-4))) {
      return setErr('মোবাইল নম্বরের শেষ ৪ সংখ্যা মিলছে না। অর্ডারের সময় দেওয়া নম্বরটি দিন।')
    }
    setOrder(o)
  }

  useEffect(() => {
    document.title = 'অর্ডার ট্র্যাক করুন | RRR TopUp'
    if (params.get('order')) search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const steps = ['Pending', 'Payment Verification', 'Processing', 'Completed']
  const stepIdx = order ? steps.indexOf(order.status) : -1

  return (
    <div>
      <DemoBanner />
      <PageHero
        badge="অর্ডার ট্র্যাক"
        title="অর্ডার ট্র্যাক করুন"
        sub="অর্ডার আইডি ও মোবাইল নম্বরের শেষ ৪ সংখ্যা দিয়ে আপনার অর্ডারের অবস্থা দেখুন।"
        chips={['অর্ডার আইডি দিয়েই খুঁজুন', 'লগইন ছাড়াই ট্র্যাক করা যায়', '২৪/৭ সাপোর্ট']}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <form onSubmit={search} className="landing-card p-5 sm:p-6 space-y-4">
          <div>
            <label className="label" htmlFor="oid">অর্ডার আইডি *</label>
            <input id="oid" className="input" value={orderId} onChange={(e) => setOrderId(e.target.value.toUpperCase())} placeholder="যেমন: RRR-100231" />
          </div>
          <div>
            <label className="label" htmlFor="mob">মোবাইল নম্বরের শেষ ৪ সংখ্যা *</label>
            <input id="mob" className="input" inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="যেমন: 1234 অথবা পুরো নম্বর" />
          </div>
          {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
          <button className="btn-primary w-full">অর্ডার খুঁজুন</button>
        </form>

        {searched && !order && !err && <p className="text-slate-500 text-center mt-6">কোনো অর্ডার পাওয়া যায়নি।</p>}

        {order && (
          <div className="landing-card p-6 mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{order.id}</h2>
              <StatusBadge status={order.status} />
            </div>
            {(order.status === 'Rejected' || order.status === 'Cancelled') && (
              <p className="text-rose-700 text-sm mt-3 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                এই অর্ডারটি {order.status === 'Rejected' ? 'বাতিল' : 'বাতিল'} করা হয়েছে। {order.notes ? `কারণ: ${order.notes}` : 'বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।'}
              </p>
            )}
            {stepIdx >= 0 && (
              <div>
                <div className="flex gap-1 mt-5">
                  {steps.map((s, i) => (
                    <div key={s} className={`flex-1 h-2 rounded-full ${i <= stepIdx ? 'bg-[#028a2e]' : 'bg-slate-200'}`} title={s} />
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>পেন্ডিং</span><span>পেমেন্ট যাচাই</span><span>প্রসেসিং</span><span>সম্পন্ন</span>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-2 text-sm">
              <Row k="গেম" v={`${order.gameBn || order.game} (${order.game})`} />
              <Row k="পণ্য" v={`${order.productName} — ${order.qty}`} />
              <Row k="Player UID" v={order.uid} />
              <Row k="পরিমাণ" v={fmtBDT(order.amount)} />
              <Row k="পেমেন্ট পদ্ধতি" v={order.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} />
              <Row k="Transaction ID" v={order.trxId} />
              <Row k="পেমেন্ট স্ট্যাটাস" v={<StatusBadge status={order.paymentStatus} />} />
              <Row k="অর্ডার স্ট্যাটাস" v={<StatusBadge status={order.status} />} />
              <Row k="অর্ডারের সময়" v={fmtDate(order.createdAt)} />
              <Row k="সর্বশেষ আপডেট" v={fmtDate(order.updatedAt)} />
            </div>
            <Link to="/contact" className="btn-ghost w-full mt-6">সমস্যা হলে সাপোর্টে যোগাযোগ করুন</Link>
          </div>
        )}
      </div>
      <HowItWorks />
    </div>
  )
}
function Row({ k, v }) {
  return <div className="flex justify-between gap-3 border-b border-slate-100 pb-2"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-900 text-right">{v}</span></div>
}
