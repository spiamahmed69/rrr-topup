import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { getOrders } from '../lib/store.js'
import { StatusBadge, fmtDate, DemoBanner, PageHero, TrustStrip } from '../components/Layout.jsx'
import { fmtBDT } from '../data/products.js'

function AuthCard({ title, sub, children }) {
  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="landing-card p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 text-center">{title}</h1>
        {sub && <p className="text-sm text-slate-500 mt-1 text-center">{sub}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

function AuthHero({ badge, title, sub }) {
  return <PageHero badge={badge} title={title} sub={sub} chips={['শুধু UID — পাসওয়ার্ড লাগে না', '৫–৩০ মিনিটে ডেলিভারি', '২৪/৭ সাপোর্ট']} />
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { document.title = 'লগইন | RRR TopUp' }, [])
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await login(email.trim(), password); nav('/my-orders') }
    catch (e2) { setErr(e2.message || 'লগইন ব্যর্থ হয়েছে।') }
    finally { setBusy(false) }
  }
  return (
    <div>
      <DemoBanner />
      <AuthHero badge="লগইন" title="লগইন করুন" sub="আপনার RRR TopUp অ্যাকাউন্টে প্রবেশ করুন।" />
      <AuthCard title="লগইন করুন" sub="আপনার RRR TopUp অ্যাকাউন্টে প্রবেশ করুন।">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="email">ইমেইল *</label><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div><label className="label" htmlFor="pass">পাসওয়ার্ড *</label><input id="pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
          <button disabled={busy} className="btn-primary w-full">{busy ? 'লগইন হচ্ছে…' : 'লগইন করুন'}</button>
        </form>
        <div className="flex justify-between text-sm mt-4">
          <Link to="/forgot" className="text-[#02B53D] hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
          <Link to="/register" className="text-[#02B53D] hover:underline">নতুন অ্যাকাউন্ট খুলুন</Link>
        </div>
      </AuthCard>
      <TrustStrip />
    </div>
  )
}

export function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { document.title = 'রেজিস্টার | RRR TopUp' }, [])
  async function submit(e) {
    e.preventDefault(); setErr('')
    if (name.trim().length < 2) return setErr('সঠিক নাম দিন।')
    if (password.length < 6) return setErr('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।')
    setBusy(true)
    try { await register(name.trim(), email.trim(), password); nav('/my-orders') }
    catch (e2) { setErr(e2.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।') }
    finally { setBusy(false) }
  }
  return (
    <div>
      <DemoBanner />
      <AuthHero badge="রেজিস্টার" title="অ্যাকাউন্ট খুলুন" sub="অর্ডার হিস্ট্রি দেখতে ও দ্রুত কিনতে অ্যাকাউন্ট খুলুন — গেস্ট হিসেবেও কেনা যায়।" />
      <AuthCard title="অ্যাকাউন্ট খুলুন" sub="অর্ডার হিস্ট্রি দেখতে ও দ্রুত কিনতে অ্যাকাউন্ট খুলুন — গেস্ট হিসেবেও কেনা যায়।">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="name">আপনার নাম *</label><input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: সিয়াম আহমেদ" required /></div>
          <div><label className="label" htmlFor="email">ইমেইল *</label><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div><label className="label" htmlFor="pass">পাসওয়ার্ড *</label><input id="pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" required /></div>
          {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
          <button disabled={busy} className="btn-primary w-full">{busy ? 'অ্যাকাউন্ট খোলা হচ্ছে…' : 'অ্যাকাউন্ট খুলুন'}</button>
        </form>
        <p className="text-sm text-slate-500 mt-4 text-center">ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-[#02B53D] hover:underline">লগইন করুন</Link></p>
      </AuthCard>
      <TrustStrip />
    </div>
  )
}

export function Forgot() {
  const { forgot } = useAuth()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { document.title = 'পাসওয়ার্ড রিসেট | RRR TopUp' }, [])
  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('')
    try { await forgot(email.trim()); setMsg('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স (ও স্প্যাম) যাচাই করুন।') }
    catch (e2) { setErr(e2.message) }
  }
  return (
    <div>
      <DemoBanner />
      <AuthHero badge="পাসওয়ার্ড রিসেট" title="পাসওয়ার্ড ভুলে গেছেন?" sub="ইমেইল দিন — রিসেট লিংক পাঠানো হবে (Firebase চালু থাকলে)।" />
      <AuthCard title="পাসওয়ার্ড ভুলে গেছেন?" sub="ইমেইল দিন — রিসেট লিংক পাঠানো হবে (Firebase চালু থাকলে)।">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="email">ইমেইল *</label><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
          {msg && <p className="text-emerald-600 text-sm font-semibold">{msg}</p>}
          <button className="btn-primary w-full">রিসেট লিংক পাঠান</button>
        </form>
        <p className="text-sm text-slate-500 mt-4 text-center"><Link to="/login" className="text-[#02B53D] hover:underline">লগইনে ফিরুন</Link></p>
      </AuthCard>
      <TrustStrip />
    </div>
  )
}

export function Profile() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [orders, setOrders] = useState([])
  useEffect(() => { document.title = 'আমার প্রোফাইল | RRR TopUp'; setOrders(getOrders()) }, [])
  if (!user) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="প্রোফাইল" title="প্রোফাইল দেখতে লগইন করুন" sub="অ্যাকাউন্টে প্রবেশ করলে আপনার অর্ডার ও প্রোফাইল দেখতে পারবেন।" />
        <div className="text-center mt-6"><Link to="/login" className="btn-primary inline-flex">লগইন করুন</Link></div>
      </div>
    )
  }
  const mine = orders.filter((o) => o.customerEmail === user.email || o.mobile)
  return (
    <div>
      <DemoBanner />
      <PageHero badge="আমার প্রোফাইল" title={user.name} sub={user.email} chips={['অর্ডার হিস্ট্রি', 'দ্রুত টপ আপ', '২৪/৭ সাপোর্ট']} />
      <div className="max-w-2xl mx-auto mt-6">
        <div className="landing-card p-6 space-y-3">
          <div className="flex items-center gap-4">
            <span className="avatar-circle !w-14 !h-14 !text-2xl">{(user.name || 'S')[0].toUpperCase()}</span>
            <div>
              <p className="text-xl font-bold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-[#0f172a]">{mine.length}</p><p className="text-xs text-slate-500">মোট অর্ডার</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-emerald-600">{mine.filter((o) => o.status === 'Completed').length}</p><p className="text-xs text-slate-500">সম্পন্ন</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-2xl font-extrabold text-[#02B53D]">{mine.filter((o) => o.status === 'Completed').reduce((s, o) => s + (o.amount || 0), 0)}৳</p><p className="text-xs text-slate-500">মোট খরচ</p></div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/my-orders" className="btn-primary">আমার অর্ডার দেখুন</Link>
            <button onClick={() => { logout(); nav('/') }} className="btn-ghost">লগআউট</button>
          </div>
          <p className="text-xs text-slate-500">অ্যাকাউন্টের নিরাপত্তা: আপনার পাসওয়ার্ড কখনো কারো সাথে শেয়ার করবেন না। RRR TopUp কখনো আপনার গেম অ্যাকাউন্টের পাসওয়ার্ড চায় না।</p>
        </div>
      </div>
      <TrustStrip />
    </div>
  )
}

export function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  useEffect(() => { document.title = 'আমার অর্ডার | RRR TopUp'; setOrders(getOrders()) }, [])
  if (!user) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="আমার অর্ডার" title="অর্ডার দেখতে লগইন করুন" sub="অথবা অর্ডার আইডি দিয়ে ট্র্যাক করুন — লগইন ছাড়াই।" />
        <div className="text-center mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="btn-primary inline-flex">লগইন করুন</Link>
          <Link to="/track" className="btn-ghost inline-flex">অর্ডার ট্র্যাক করুন</Link>
        </div>
      </div>
    )
  }
  const mine = orders.filter((o) => (user.email && o.customerEmail === user.email) || true)
  const list = filter === 'all' ? mine : mine.filter((o) => o.status === filter)
  return (
    <div>
      <DemoBanner />
      <PageHero badge="আমার অর্ডার" title="আমার অর্ডার" sub={`${user.name} — ${user.email}`} />
      <div className="flex flex-wrap gap-2 mt-6">
        {['all', 'Pending', 'Payment Verification', 'Processing', 'Completed', 'Rejected', 'Cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-pill ${filter === f ? 'grad-btn text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
            {f === 'all' ? 'সবগুলো' : f}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="landing-card p-10 text-center text-slate-500 mt-5">
          <p>এখনো কোনো অর্ডার নেই।</p>
          <Link to="/free-fire" className="btn-primary mt-4 inline-flex">প্রথম অর্ডার করুন</Link>
        </div>
      ) : (
        <div className="landing-card divide-y divide-slate-100 mt-5 overflow-hidden">
          {list.map((o) => (
            <Link key={o.id} to={`/track?order=${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-green-50/50">
              <div>
                <p className="font-bold text-slate-900">{o.id} <span className="text-slate-500 font-normal">· {o.productName}</span></p>
                <p className="text-xs text-slate-500">{o.gameBn} · UID {o.uid} · {fmtDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0f172a]">{fmtBDT(o.amount)}</p>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
