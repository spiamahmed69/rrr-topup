import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getProductById, getSettings, saveOrder, makeOrderId } from '../lib/store.js'
import { verifyPrice, validateUID, validateMobile, validateTrxId } from '../lib/price.js'
import { fmtBDT, GAMES } from '../data/products.js'
import { useAuth } from '../lib/auth.jsx'
import { DemoBanner, PageHero, HowItWorks, StepCard } from '../components/Layout.jsx'

const STEPS = ['তথ্য', 'পেমেন্ট', 'ট্রানজাকশন']

export default function Checkout() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const productId = params.get('product')
  const [product, setProduct] = useState(null)
  const [priceError, setPriceError] = useState('')
  const [step, setStep] = useState(1)
  const [uid, setUid] = useState(params.get('uid') || '')
  const [mobile, setMobile] = useState(params.get('mobile') || '')
  const [server, setServer] = useState('BD')
  const [method, setMethod] = useState(params.get('method') === 'nagad' ? 'nagad' : 'bkash')
  const [trxId, setTrxId] = useState('')
  const [sender, setSender] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const settings = getSettings()
  const methods = useMemo(() => Object.entries(settings.payments).filter(([, v]) => v.enabled), [settings])

  useEffect(() => {
    // দাম সবসময় সার্ভার-সাইড ডেটা থেকে — URL/ফর্মের দাম কখনো নয়।
    const check = verifyPrice(productId, params.get('price'))
    if (!check.ok) { setPriceError(check.error); return }
    setProduct(check.product)
    document.title = `চেকআউট — ${check.product.name} | RRR TopUp`
  }, [productId, params])

  useEffect(() => { if (methods.length && !methods.find(([k]) => k === method)) setMethod(methods[0][0]) }, [methods, method])

  if (priceError) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="চেকআউট করা যাচ্ছে না" title="চেকআউট করা যাচ্ছে না" sub={priceError} />
        <div className="text-center mt-6"><Link to="/" className="btn-primary inline-flex">প্যাকেজ বেছে নিন</Link></div>
      </div>
    )
  }
  if (!product) return <div className="text-slate-500 py-16 text-center">লোড হচ্ছে…</div>

  const pay = settings.payments[method]
  const game = GAMES[product.game]

  function goStep2(e) {
    e.preventDefault()
    if (!validateUID(uid)) return setErr('সঠিক Player UID দিন (৬–১২ সংখ্যা)।')
    if (!validateMobile(mobile)) return setErr('সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।')
    setErr(''); setStep(2)
  }

  function submitOrder(e) {
    e.preventDefault()
    if (submitting) return // ডাবল সাবমিট প্রতিরোধ
    if (!validateTrxId(trxId)) return setErr('সঠিক Transaction ID দিন (কমপক্ষে ৮ অক্ষর)।')
    if (!validateMobile(sender)) return setErr('পেমেন্ট পাঠানো নম্বরটি সঠিকভাবে দিন (01XXXXXXXXX)।')
    // শেষ মুহূর্তে আবার দাম যাচাই — ফ্রন্টএন্ডের দাম নয়, ডেটার দামই চূড়ান্ত।
    const check = verifyPrice(product.id)
    if (!check.ok) return setErr(check.error)
    setSubmitting(true)
    const order = {
      id: makeOrderId(),
      productId: product.id,
      productName: product.name,
      game: game.name,
      gameBn: game.nameBn,
      qty: product.qty,
      amount: check.price, // ডেটাবেজের দাম
      uid: uid.trim(),
      server,
      mobile: mobile.trim(),
      paymentMethod: method,
      paymentNumber: pay.number,
      trxId: trxId.trim(),
      sender: sender.trim(),
      paymentStatus: 'Pending Verification',
      status: 'Payment Verification',
      customerEmail: user?.email || '',
      customerName: user?.name || '',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    saveOrder(order)
    nav(`/order-success/${order.id}`)
  }

  return (
    <div>
      <DemoBanner />
      <PageHero
        badge="চেকআউট"
        title={`চেকআউট — ${product.name}`}
        sub={`${game.nameBn} (${game.name}) · ${product.qty} · শুধু UID দিয়ে ডেলিভারি, পাসওয়ার্ড লাগে না।`}
        chips={['ধাপ ১: তথ্য', 'ধাপ ২: পেমেন্ট', 'ধাপ ৩: Transaction ID']}
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 mt-6">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-pill ${step > i + 1 ? 'step-pill-done' : step === i + 1 ? 'step-pill-active' : ''}`}>
              ধাপ {i + 1}: {s}
            </div>
          ))}
        </div>

        {/* Step 1 — Select Recharge */}
        <StepCard n={1} title="Select Recharge — প্যাকেজ">
          <div className="pkg-btn pkg-btn-selected">
            <span className="pkg-btn-name">{product.name} — {product.qty}</span>
            <span className="pkg-btn-price">{fmtBDT(product.price)}</span>
          </div>
          <div className="flex justify-between items-center mt-3 text-sm">
            <span className="text-slate-500">{game.nameBn} ({game.name}) · মোট দিতে হবে</span>
            <Link to={game.id === 'ff' ? '/free-fire' : '/pubg'} className="font-bold text-[#02B53D] hover:underline">প্যাকেজ পরিবর্তন করুন</Link>
          </div>
        </StepCard>

        {/* Step 2 — Account Info */}
        <StepCard n={2} title="Account Info — Player তথ্য">
          {step > 1 ? (
            <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
              <span className="text-slate-600">UID: <b className="text-slate-900">{uid}</b> · মোবাইল: <b className="text-slate-900">{mobile}</b> · সার্ভার: <b className="text-slate-900">{server}</b></span>
              <button type="button" onClick={() => setStep(1)} className="font-bold text-[#02B53D] hover:underline">পরিবর্তন করুন</button>
            </div>
          ) : (
            <form onSubmit={goStep2} className="space-y-4">
              <div>
                <label className="label" htmlFor="uid">Player Id {product.game === 'pubg' ? '(Character ID)' : ''} *</label>
                <input id="uid" className="input" inputMode="numeric" value={uid} onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ''))} placeholder="যেমন: 123456789" />
              </div>
              <div>
                <label className="label" htmlFor="server">সার্ভার / রিজিয়ন</label>
                <select id="server" className="input" value={server} onChange={(e) => setServer(e.target.value)}>
                  <option value="BD">বাংলাদেশ (BD)</option>
                  <option value="Global">গ্লোবাল</option>
                  <option value="Indonesia">ইন্দোনেশিয়া</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="mobile">যোগাযোগের মোবাইল নম্বর *</label>
                <input id="mobile" className="input" inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" />
              </div>
              {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
              <button className="btn-primary w-full">পরবর্তী — পেমেন্ট পদ্ধতি</button>
            </form>
          )}
        </StepCard>

        {/* Step 3 — Select Payment */}
        <StepCard n={3} title="Select Payment — পেমেন্ট পদ্ধতি" muted={step < 2}>
          {step < 2 ? (
            <p className="text-sm text-slate-500">আগে Player তথ্য দিন — তারপর পেমেন্ট পদ্ধতি বেছে নিতে পারবেন।</p>
          ) : step > 2 ? (
            <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
              <span className="text-slate-600">পেমেন্ট: <b className="text-slate-900">{pay?.label}</b> · {fmtBDT(product.price)}</span>
              <button type="button" onClick={() => setStep(2)} className="font-bold text-[#02B53D] hover:underline">পরিবর্তন করুন</button>
            </div>
          ) : (
            <div className="space-y-4">
              {methods.length === 0 && <p className="text-rose-600 text-sm">এই মুহূর্তে কোনো পেমেন্ট পদ্ধতি চালু নেই। সাপোর্টে যোগাযোগ করুন।</p>}
              <div className="grid grid-cols-2 gap-3">
                {methods.map(([key, m]) => (
                  <button key={key} type="button" onClick={() => setMethod(key)} className={`rounded-xl border-2 p-4 text-left ${method === key ? 'border-[#028a2e] bg-green-50' : 'border-slate-200 bg-white'}`}>
                    <span className={`text-base sm:text-lg font-extrabold ${key === 'bkash' ? 'text-pink-600' : 'text-orange-500'}`}>{m.label}</span>
                    <span className="block text-sm text-slate-500 mt-1">Send Money — {fmtBDT(product.price)}</span>
                  </button>
                ))}
              </div>
              {pay && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="font-bold text-slate-900">{pay.label} — পেমেন্ট নির্দেশনা</p>
                  <p className="text-sm text-slate-600 mt-2">{pay.instructions}</p>
                  <div className="flex items-center justify-between gap-3 mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs text-slate-500">Send Money নম্বর</p>
                      <p className="text-xl font-extrabold text-slate-900 tracking-wide">{pay.number}</p>
                    </div>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(pay.number)} className="btn-ghost !py-2 !px-3 text-sm">কপি করুন</button>
                  </div>
                  <p className="text-sm text-amber-700 mt-3 font-semibold">পরিমাণ: {fmtBDT(product.price)} — ঠিক এই পরিমাণই পাঠান। কম/বেশি পাঠালে ভেরিফিকেশন ব্যর্থ হতে পারে।</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">← ফিরে যান</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">পেমেন্ট করেছি — পরবর্তী →</button>
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 4 — Transaction ID + Description */}
        <StepCard n={4} title="Transaction ID ও বিবরণ" muted={step < 3}>
          <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
              <li>টাকা পাঠানোর পর bKash/Nagad থেকে পাওয়া Transaction ID দিন — অ্যাডমিন ম্যানুয়ালি যাচাই করবেন।</li>
              <li>ভুয়া Transaction ID দিলে অর্ডার বাতিল হবে।</li>
              <li>পেমেন্ট ভেরিফাই হলে ৫–৩০ মিনিটে ডেলিভারি; ব্যস্ত সময়ে সর্বোচ্চ ২ ঘণ্টা।</li>
            </ul>
          </div>
          {step < 3 ? (
            <p className="text-sm text-slate-500">আগে পেমেন্ট শেষ করুন — তারপর Transaction ID জমা দিতে পারবেন।</p>
          ) : (
            <form onSubmit={submitOrder} className="space-y-4">
              <div>
                <label className="label" htmlFor="trx">Transaction ID *</label>
                <input id="trx" className="input" value={trxId} onChange={(e) => setTrxId(e.target.value.trim())} placeholder="যেমন: 9HX7K2M4PQ" />
              </div>
              <div>
                <label className="label" htmlFor="sender">যে নম্বর থেকে টাকা পাঠিয়েছেন *</label>
                <input id="sender" className="input" inputMode="numeric" value={sender} onChange={(e) => setSender(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" />
              </div>
              {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1">← ফিরে যান</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'জমা হচ্ছে…' : `অর্ডার নিশ্চিত করুন — ${fmtBDT(product.price)}`}</button>
              </div>
            </form>
          )}
        </StepCard>
        <p className="text-xs text-slate-500 mt-4 text-center">অর্ডার সাবমিট করলে আপনি পেমেন্ট ভেরিফিকেশন ধাপে যাবেন। ভুয়া Transaction ID দিলে অর্ডার বাতিল হবে।</p>
      </div>
      <HowItWorks />
    </div>
  )
}
