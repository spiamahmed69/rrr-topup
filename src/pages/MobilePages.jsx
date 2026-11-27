import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { getSettings, getTopups, makeTopupId, saveTopup, getWalletBalance, getReferralCode, isDemoMode } from '../lib/store.js'
import { DemoBanner, PageHero, StatusBadge, fmtDate } from '../components/Layout.jsx'
import { fmtBDT } from '../data/products.js'

const AMOUNTS = [100, 200, 500, 1000, 2000]

/* ---------- Add Money: real top-up request ----------
   User pays via bKash/Nagad Send Money and submits the TrxID. The request is
   saved (localStorage / Firestore) and the admin verifies it in the Payments
   tab — only Verified requests add to the wallet balance. The payment numbers
   come from settings; the 01XXXXXXXXX placeholder is labelled as sample. */
export function AddMoney() {
  const { user } = useAuth()
  const s = getSettings()
  const [amount, setAmount] = useState(500)
  const [custom, setCustom] = useState('')
  const [method, setMethod] = useState('bkash')
  const [mobile, setMobile] = useState('')
  const [trxid, setTrxid] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)
  const [mine, setMine] = useState([])

  const ownerKey = user?.email || ''
  const pay = s.payments[method]
  const isPlaceholder = !pay?.number || pay.number === '01XXXXXXXXX'
  const finalAmount = custom ? Number(custom) : amount

  useEffect(() => {
    document.title = 'টাকা যোগ করুন | RRR TopUp'
    setMine(getTopups())
  }, [])

  const myRequests = useMemo(
    () => mine.filter((t) => (ownerKey && t.ownerKey === ownerKey) || (mobile && t.mobile === mobile)),
    [mine, ownerKey, mobile],
  )
  const balance = getWalletBalance(ownerKey || mobile)

  function submit(e) {
    e.preventDefault()
    setErr('')
    if (!finalAmount || finalAmount < 10) return setErr('কমপক্ষে ৳১০ লিখুন।')
    if (!/^01[3-9]\d{8}$/.test(mobile.trim())) return setErr('সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01XXXXXXXXX)।')
    if (trxid.trim().length < 6) return setErr('সঠিক Transaction ID দিন (কমপক্ষে ৬ অক্ষর)।')
    if (isPlaceholder) return setErr('অ্যাডমিন এখনো আসল পেমেন্ট নম্বর বসাননি — আসল টাকা পাঠাবেন না।')
    const req = {
      id: makeTopupId(),
      ownerKey: ownerKey || mobile.trim(),
      mobile: mobile.trim(),
      amount: finalAmount,
      method,
      trxid: trxid.trim(),
      status: 'Pending',
      createdAt: Date.now(),
    }
    saveTopup(req)
    setMine(getTopups())
    setDone(req)
    setTrxid('')
  }

  if (done) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="টাকা যোগ করুন" title="অনুরোধ জমা হয়েছে ✓" sub="অ্যাডমিন যাচাই করে আপনার ওয়ালেটে ব্যালেন্স যোগ করবেন।" />
        <div className="landing-card max-w-lg mx-auto mt-6 p-6 text-center">
          <p className="text-sm text-slate-500">অনুরোধ আইডি</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{done.id}</p>
          <p className="text-2xl font-extrabold text-[#028a2e] mt-3">{fmtBDT(done.amount)}</p>
          <p className="text-sm text-slate-500 mt-1">{done.method === 'bkash' ? 'bKash' : 'Nagad'} · TrxID {done.trxid}</p>
          <p className="text-xs text-slate-500 mt-3">ভেরিফাই হওয়ার পর আপনার প্রোফাইলে ওয়ালেট ব্যালেন্স দেখা যাবে। স্ট্যাটাস দেখতে নিচের তালিকা দেখুন।</p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <button onClick={() => setDone(null)} className="btn-ghost">আরেকটি অনুরোধ করুন</button>
            <Link to="/profile" className="btn-primary">প্রোফাইল দেখুন</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <DemoBanner />
      <PageHero badge="Add Money" title="ওয়ালেটে টাকা যোগ করুন" sub="bKash / Nagad দিয়ে Send Money করুন, তারপর Transaction ID জমা দিন।" chips={[`ওয়ালেট ব্যালেন্স: ${fmtBDT(balance)}`, 'অ্যাডমিন ভেরিফিকেশন', '২৪/৭ সাপোর্ট']} />
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <form onSubmit={submit} className="landing-card p-5 sm:p-6 space-y-4">
          <div>
            <label className="label">পরিমাণ বেছে নিন *</label>
            <div className="flex flex-wrap gap-2">
              {AMOUNTS.map((a) => (
                <button type="button" key={a} onClick={() => { setAmount(a); setCustom('') }} className={`tab-pill ${!custom && amount === a ? 'grad-btn text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>{fmtBDT(a)}</button>
              ))}
            </div>
            <input className="input mt-3" type="number" min="10" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="অন্য পরিমাণ লিখুন (৳)" />
          </div>
          <div>
            <label className="label">পেমেন্ট মাধ্যম *</label>
            <div className="flex gap-2">
              {['bkash', 'nagad'].map((m) => (
                <button type="button" key={m} onClick={() => setMethod(m)} disabled={!s.payments[m]?.enabled} className={`flex-1 py-2.5 rounded-xl font-bold border ${method === m ? 'bg-[#F0FDF4] border-[#02B53D] text-[#028a2e]' : 'bg-white border-slate-200 text-slate-700'} disabled:opacity-50`}>
                  {m === 'bkash' ? 'bKash' : 'Nagad'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-4">
            <p className="text-sm font-bold text-slate-900">{pay?.label} — Send Money নম্বর</p>
            <p className="text-xl font-extrabold text-[#028a2e] mt-1 tracking-wide">{pay?.number}</p>
            <p className="text-xs text-slate-500 mt-1">{pay?.instructions}</p>
            {isPlaceholder && <p className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 rounded-lg px-2 py-1.5 mt-2">নমুনা নম্বর — অ্যাডমিন এখনো আসল নম্বর বসাননি। আসল টাকা পাঠাবেন না।</p>}
          </div>
          <div><label className="label" htmlFor="am-mobile">আপনার মোবাইল নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন) *</label><input id="am-mobile" className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" required /></div>
          <div><label className="label" htmlFor="am-trx">Transaction ID *</label><input id="am-trx" className="input" value={trxid} onChange={(e) => setTrxid(e.target.value)} placeholder="যেমন: 9HX7K2PQ1M" required /></div>
          {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
          <button className="btn-primary w-full">অনুরোধ জমা দিন — {fmtBDT(finalAmount || 0)}</button>
          <p className="text-xs text-slate-500">ভুল Transaction ID দিলে অনুরোধ বাতিল হবে। টাকা পাঠানোর আগে নম্বরটি যাচাই করে নিন।</p>
        </form>
        <div className="landing-card p-5 sm:p-6 h-fit">
          <h3 className="font-bold text-slate-900 text-lg">আমার অনুরোধ</h3>
          <p className="text-sm text-slate-500 mt-1">ওয়ালেট ব্যালেন্স: <span className="font-extrabold text-[#028a2e]">{fmtBDT(balance)}</span> {isDemoMode() && <span className="text-xs">(ডেমো মোড — এই ব্রাউজারে সংরক্ষিত)</span>}</p>
          {myRequests.length === 0 ? (
            <p className="text-sm text-slate-500 mt-4">এখনো কোনো অনুরোধ নেই। উপরের ফর্ম থেকে প্রথম অনুরোধ করুন।</p>
          ) : (
            <div className="divide-y divide-slate-100 mt-3">
              {myRequests.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-bold text-slate-900">{t.id} <span className="text-slate-500 font-normal">· {t.method === 'bkash' ? 'bKash' : 'Nagad'}</span></p>
                    <p className="text-xs text-slate-500">{fmtDate(t.createdAt)} · TrxID {t.trxid}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900">{fmtBDT(t.amount)}</p>
                    <StatusBadge status={t.status === 'Verified' ? 'Verified' : t.status === 'Rejected' ? 'Rejected' : 'Pending Verification'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- Referrals: real code + link, honest rewards state ---------- */
export function Referrals() {
  const { user } = useAuth()
  const [code] = useState(() => getReferralCode())
  const [copied, setCopied] = useState('')
  useEffect(() => { document.title = 'রেফারেল | RRR TopUp' }, [])
  const link = `https://rrr-topup.vercel.app/register?ref=${code}`
  async function copy(text, which) {
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
    }
    setCopied(which); setTimeout(() => setCopied(''), 2000)
  }
  return (
    <div>
      <DemoBanner />
      <PageHero badge="Referrals" title="বন্ধুদের রেফার করুন" sub="আপনার রেফারেল লিংক শেয়ার করুন — বন্ধু অ্যাকাউন্ট খুললেই আপনি রেফারার হিসেবে গণ্য হবেন।" chips={['আপনার কোড: ' + code, 'শেয়ার করুন', '২৪/৭ সাপোর্ট']} />
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="landing-card p-5 sm:p-6 space-y-4">
          <div>
            <label className="label">আপনার রেফারেল কোড</label>
            <div className="flex gap-2">
              <input className="input font-mono font-bold" value={code} readOnly />
              <button onClick={() => copy(code, 'code')} className="btn-primary shrink-0">{copied === 'code' ? 'কপি হয়েছে ✓' : 'কপি'}</button>
            </div>
          </div>
          <div>
            <label className="label">রেফারেল লিংক</label>
            <div className="flex gap-2">
              <input className="input text-sm" value={link} readOnly />
              <button onClick={() => copy(link, 'link')} className="btn-primary shrink-0">{copied === 'link' ? 'কপি হয়েছে ✓' : 'কপি'}</button>
            </div>
          </div>
          <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-4">
            <p className="font-bold text-slate-900">কীভাবে কাজ করে?</p>
            <ol className="text-sm text-slate-600 mt-2 space-y-1.5 list-decimal list-inside">
              <li>উপরের লিংকটি বন্ধুদের পাঠান।</li>
              <li>বন্ধু লিংক থেকে অ্যাকাউন্ট খুলবে।</li>
              <li>বন্ধুর প্রথম অর্ডার হলে আপনার রেফারেল গণনা হবে।</li>
            </ol>
          </div>
          {!user && <p className="text-sm text-slate-500">রেফারেল গণনা আপনার অ্যাকাউন্টের সাথে যুক্ত হয় — লিংক শেয়ার করার আগে <Link to="/login" className="text-[#02B53D] font-bold">লগইন করুন</Link>।</p>}
        </div>
        <div className="landing-card p-5 sm:p-6 h-fit">
          <h3 className="font-bold text-slate-900 text-lg">আমার রেফারেল</h3>
          <p className="text-sm text-slate-500 mt-2">আপনার কোড দিয়ে এখনো কেউ অ্যাকাউন্ট খোলেনি।</p>
          <p className="text-xs text-slate-500 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">রেফারেল বোনাস শীঘ্রই আসছে — বোনাস চালু হলে এখানেই দেখতে পাবেন।</p>
          <Link to="/free-fire" className="btn-primary mt-5 inline-flex">নিজে টপ আপ করুন</Link>
        </div>
      </div>
    </div>
  )
}
