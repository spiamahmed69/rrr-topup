import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSettings } from '../lib/store.js'
import { DemoBanner, PageHero, TrustStrip } from '../components/Layout.jsx'

function Page({ title, children }) {
  useEffect(() => { document.title = `${title} | RRR TopUp` }, [title])
  return (
    <div>
      <PageHero badge={title} title={title} sub="" />
      <div className="max-w-3xl mx-auto mt-6">
        <div className="landing-card p-6 space-y-4 text-slate-600 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export function Contact() {
  const s = getSettings()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [orderId, setOrderId] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => { document.title = 'যোগাযোগ ও সাপোর্ট | RRR TopUp' }, [])
  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    const list = JSON.parse(localStorage.getItem('rrrtopup_messages') || '[]')
    list.unshift({ name: name.trim(), mobile, orderId, message: msg.trim(), createdAt: Date.now() })
    localStorage.setItem('rrrtopup_messages', JSON.stringify(list))
    setSent(true)
  }
  return (
    <div>
      <DemoBanner />
      <PageHero
        badge="যোগাযোগ ও সাপোর্ট"
        title="যোগাযোগ ও সাপোর্ট"
        sub={`অর্ডার সংক্রান্ত যেকোনো সমস্যায় মেসেজ করুন — সাপোর্ট টিম ${s.supportHours} উত্তর দেয়।`}
        chips={['২৪/৭ সাপোর্ট', 'দ্রুত উত্তর', 'অর্ডার আইডি দিয়ে ট্র্যাক করুন']}
      />
      <div className="max-w-3xl mx-auto mt-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="landing-card p-5"><p className="font-bold text-slate-900">ইমেইল</p><p className="text-slate-600 mt-1">{s.supportEmail}</p></div>
          <div className="landing-card p-5"><p className="font-bold text-slate-900">ফোন</p><p className="text-slate-600 mt-1">{s.supportPhone}</p></div>
        </div>
        {sent ? (
          <div className="landing-card p-8 mt-5 text-center">
            <p className="text-xl font-bold text-emerald-600">মেসেজ পাঠানো হয়েছে ✓</p>
            <p className="text-slate-500 mt-2">আমাদের সাপোর্ট টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে। অর্ডার আইডি থাকলে ট্র্যাক পেজেও অবস্থা দেখতে পারেন।</p>
            <Link to="/track" className="btn-primary mt-5 inline-flex">অর্ডার ট্র্যাক করুন</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="landing-card p-5 mt-5 space-y-4">
            <div><label className="label" htmlFor="cname">আপনার নাম *</label><input id="cname" className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label className="label" htmlFor="cmob">মোবাইল নম্বর</label><input id="cmob" className="input" inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" /></div>
            <div><label className="label" htmlFor="coid">অর্ডার আইডি (যদি থাকে)</label><input id="coid" className="input" value={orderId} onChange={(e) => setOrderId(e.target.value.toUpperCase())} placeholder="RRR-XXXXXX" /></div>
            <div><label className="label" htmlFor="cmsg">আপনার বার্তা *</label><textarea id="cmsg" rows={4} className="input" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন…" required /></div>
            <button className="btn-primary w-full">মেসেজ পাঠান</button>
          </form>
        )}
      </div>
      <TrustStrip />
    </div>
  )
}

export function Terms() {
  return (
    <Page title="শর্তাবলী">
      <p>১. RRR TopUp একটি গেমিং টপ-আপ প্ল্যাটফর্ম। আমরা Free Fire ডায়মন্ড ও PUBG Mobile UC তৃতীয় পক্ষের মাধ্যমে আপনার গেম অ্যাকাউন্টে পৌঁছে দিই।</p>
      <p>২. অর্ডার করার সময় সঠিক Player UID / Character ID দেওয়া গ্রাহকের দায়িত্ব। ভুল UID-এর কারণে ভুল অ্যাকাউন্টে ডেলিভারি হলে RRR TopUp দায়ী থাকবে না।</p>
      <p>৩. পেমেন্ট bKash/Nagad Send Money-এর মাধ্যমে করতে হবে। পেমেন্টের পর Transaction ID সঠিকভাবে জমা দিতে হবে। ভুয়া Transaction ID দিলে অর্ডার বাতিল হবে।</p>
      <p>৪. পেমেন্ট ভেরিফাই হওয়ার পর সাধারণত ৫–৩০ মিনিটের মধ্যে ডেলিভারি হয়। ব্যস্ত সময়ে সর্বোচ্চ ২ ঘণ্টা লাগতে পারে।</p>
      <p>৫. দাম যেকোনো সময় পরিবর্তন হতে পারে। অর্ডার সাবমিটের সময়ের দামই চূড়ান্ত।</p>
      <p>৬. RRR TopUp Garena বা PUBG-এর অফিসিয়াল পার্টনার নয়। গেম কোম্পানির নীতিমালা পরিবর্তনের কারণে ডেলিভারি বিলম্বিত হলে গ্রাহককে জানানো হবে।</p>
      <p>৭. এই শর্তাবলী যেকোনো সময় পরিবর্তন করা হতে পারে।</p>
    </Page>
  )
}

export function Privacy() {
  return (
    <Page title="গোপনীয়তা নীতি">
      <p>১. আমরা শুধু অর্ডার সম্পন্ন করার জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি: Player UID, মোবাইল নম্বর, Transaction ID ও (অ্যাকাউন্ট খুললে) নাম-ইমেইল।</p>
      <p>২. আপনার গেম অ্যাকাউন্টের পাসওয়ার্ড আমরা কখনো চাই না এবং সংগ্রহ করি না। কেউ RRR TopUp-এর নামে পাসওয়ার্ড চাইলে সেটি প্রতারণা — সাথে সাথে জানান।</p>
      <p>৩. আপনার তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়া দেওয়া হয় না। অর্ডার ডেলিভারি ও সাপোর্টের কাজ ছাড়া তথ্য ব্যবহার করা হয় না।</p>
      <p>৪. পেমেন্ট তথ্য (bKash/Nagad Transaction ID) শুধু পেমেন্ট যাচাইয়ের কাজে ব্যবহৃত হয়।</p>
      <p>৫. আপনার তথ্য মুছে ফেলতে চাইলে সাপোর্টে যোগাযোগ করুন।</p>
    </Page>
  )
}

export function Refund() {
  return (
    <Page title="রিফান্ড নীতি">
      <p>১. ডেলিভারি সম্পন্ন হওয়ার পর (ডায়মন্ড/UC আপনার অ্যাকাউন্টে পৌঁছে গেলে) রিফান্ড দেওয়া হয় না।</p>
      <p>২. পেমেন্ট ভেরিফাই না হলে বা অর্ডার বাতিল হলে, পেমেন্ট করা টাকা একই নম্বরে ফেরত দেওয়া হবে — সাধারণত ২৪–৭২ ঘণ্টার মধ্যে।</p>
      <p>৩. ভুল UID দেওয়ার কারণে ডেলিভারি ভুল অ্যাকাউন্টে গেলে রিফান্ড দেওয়া সম্ভব নয়।</p>
      <p>৪. ডেলিভারি ২ ঘণ্টার বেশি বিলম্বিত হলে গ্রাহক রিফান্ড বা পুনরায় ডেলিভারি — যেকোনো একটি বেছে নিতে পারবেন।</p>
      <p>৫. রিফান্ডের জন্য অর্ডার আইডি ও Transaction ID সহ সাপোর্টে যোগাযোগ করুন।</p>
    </Page>
  )
}

export function NotFound() {
  useEffect(() => { document.title = 'পেজ পাওয়া যায়নি | RRR TopUp' }, [])
  return (
    <div>
      <PageHero badge="404" title="এই পেজটি পাওয়া যায়নি" sub="লিংকটি ভুল হতে পারে বা পেজটি সরিয়ে নেওয়া হয়েছে।" />
      <div className="text-center mt-6"><Link to="/" className="btn-primary inline-flex">হোমে ফিরুন</Link></div>
    </div>
  )
}
