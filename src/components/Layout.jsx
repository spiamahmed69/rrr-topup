import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth, adminLogout, isAdminLoggedIn } from '../lib/auth.jsx'
import { getSettings, isDemoMode, latestOrdersForHome, getOrders, SAMPLE_ORDERS } from '../lib/store.js'
import { fmtBDT, GAMES } from '../data/products.js'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#02B53D] to-[#028a2e] flex items-center justify-center font-extrabold text-white text-lg shadow-md shadow-green-200">RR</span>
      <span className="leading-none">
        <span className="block font-extrabold text-lg tracking-tight text-slate-900">RRR <span className="text-[#02B53D]">TopUp</span></span>
        <span className="block text-[11px] text-slate-500">প্রিমিয়াম গেমিং টপ-আপ</span>
      </span>
    </Link>
  )
}

const NAV = [
  { to: '/', label: 'হোম' },
  { to: '/free-fire', label: 'UID টপ আপ' },
  { to: '/pubg', label: 'টপ আপ' },
  { to: '/track', label: 'অর্ডার ট্র্যাক' },
  { to: '/contact', label: 'যোগাযোগ' },
]

/* ---------- Header: white + solid blue Notice bar ---------- */

export function NoticeBar() {
  const [closed, setClosed] = useState(false)
  if (closed) return null
  const text = getSettings().offerBanner
  return (
    <div className="bg-[#02B53D] text-white">
      <div className="max-w-[1180px] mx-auto px-3 sm:px-4 py-2 flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M12 22a2.4 2.4 0 0 0 2.4-2.4H9.6A2.4 2.4 0 0 0 12 22zm7-5.5v.5H5v-.5l1.8-1.8V10a5.2 5.2 0 0 1 3.9-5V4.5a1.3 1.3 0 0 1 2.6 0V5a5.2 5.2 0 0 1 3.9 5v4.7L19 16.5z" /></svg>
        <p className="flex-1 text-sm font-semibold truncate">{text}</p>
        <button onClick={() => setClosed(true)} aria-label="বন্ধ করুন" className="text-white/80 hover:text-white font-bold px-1 shrink-0">✕</button>
      </div>
    </div>
  )
}

export function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-50 bg-[#F9F7F5] border-b border-slate-200">
      <div className="max-w-[1180px] mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/my-orders" className="hidden sm:inline-flex bg-white border border-slate-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:border-[#02B53D] hover:text-[#028a2e]">আমার অর্ডার</Link>
              <Link to="/profile" className="hidden sm:inline-flex bg-white border border-slate-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:border-[#02B53D] hover:text-[#028a2e]">{user.name}</Link>
              <button onClick={() => { logout(); nav('/') }} className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 px-2">লগআউট</button>
            </>
          ) : (
            <>
              <Link to="/register" className="hidden sm:inline-flex bg-white border border-slate-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:border-[#02B53D] hover:text-[#028a2e]">Sign Up</Link>
              <Link to="/login" className="inline-flex bg-[#02B53D] hover:bg-[#028a2e] text-white font-bold px-4 py-2 rounded-lg text-sm">Sign In</Link>
            </>
          )}
          <button className="text-slate-900 p-2" onClick={() => setOpen(!open)} aria-label="মেনু">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 px-4 py-3 space-y-1 bg-[#F9F7F5]">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-slate-800 font-semibold hover:bg-green-50">{n.label}</NavLink>
          ))}
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-slate-800 font-semibold">আমার অর্ডার</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-slate-800 font-semibold">প্রোফাইল ({user.name})</Link>
              <button onClick={() => { logout(); setOpen(false); nav('/') }} className="block px-3 py-2 text-slate-500">লগআউট</button>
            </>
          ) : (
            <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-slate-800 font-semibold">Sign Up — নতুন অ্যাকাউন্ট খুলুন</Link>
          )}
        </div>
      )}
      <NoticeBar />
    </header>
  )
}

/* ---------- Footer: deep navy ---------- */

export function Footer() {
  const s = getSettings()
  return (
    <footer className="bg-[#FFF6F2] text-slate-800 mt-16 border-t border-slate-200">
      <div className="max-w-[1180px] mx-auto px-4 py-10 text-center">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#02B53D] to-[#028a2e] flex items-center justify-center font-extrabold text-white text-lg">RR</span>
          <span className="font-extrabold text-lg text-slate-900">RRR <span className="text-[#02B53D]">TopUp</span></span>
        </div>
        <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto">{s.tagline}। Free Fire ডায়মন্ড ও PUBG UC — শুধু UID দিয়ে, বিকাশ ও নগদে নিরাপদ পেমেন্ট। খোলার সময়: Mo–Su 00:00–23:59</p>
        <div className="landing-card max-w-md mx-auto mt-6 p-4 flex items-center gap-4 text-left">
          <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#02B53D] to-[#028a2e] flex items-center justify-center font-extrabold text-white text-lg shrink-0">RR</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900">RRR TopUp অ্যাপ</p>
            <p className="text-xs text-slate-500">হোম স্ক্রিনে যোগ করে দ্রুত টপ আপ করুন</p>
          </div>
          <a href="/manifest.webmanifest" className="bg-[#02B53D] hover:bg-[#028a2e] text-white font-bold px-4 py-2 rounded-lg text-sm shrink-0">Install</a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-7 text-sm font-semibold">
          <Link className="text-slate-600 hover:text-[#028a2e]" to="/terms">Terms</Link>
          <Link className="text-slate-600 hover:text-[#028a2e]" to="/privacy">Privacy</Link>
          <Link className="text-slate-600 hover:text-[#028a2e]" to="/refund">রিফান্ড নীতি</Link>
          <Link className="text-slate-600 hover:text-[#028a2e]" to="/contact">যোগাযোগ</Link>
          <Link className="text-slate-600 hover:text-[#028a2e]" to="/track">অর্ডার ট্র্যাক</Link>
        </div>
        {isAdminLoggedIn() && <button onClick={() => { adminLogout(); window.location.href = '/' }} className="text-xs text-slate-500 underline mt-3">অ্যাডমিন লগআউট</button>}
        <p className="text-xs text-slate-400 mt-5">© {new Date().getFullYear()} RRR TopUp — সর্বস্বত্ব সংরক্ষিত। Powered by RRR TopUp</p>
        <p className="text-[11px] text-slate-400 mt-1">RRR TopUp Garena বা PUBG-এর অফিসিয়াল পার্টনার নয়; Free Fire ও PUBG Mobile সংশ্লিষ্ট কোম্পানির ট্রেডমার্ক।</p>
      </div>
    </footer>
  )
}

export function FloatingSupport() {
  return (
    <Link to="/contact" className="fixed bottom-5 right-5 z-50 group" aria-label="সাপোর্ট">
      <span className="w-14 h-14 rounded-full bg-[#02B53D] text-white flex items-center justify-center shadow-lg shadow-green-600/40 group-hover:bg-[#028a2e]">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0 1 12 4zm-3.2 5.2c-.3 0-.7.1-.9.4-.3.4-.7 1-.7 2s.5 1.9 1.3 2.9c.9 1.1 2 2.1 3.4 2.7 1 .5 1.8.6 2.4.4.6-.2 1-.9 1.2-1.6.1-.4 0-.7-.2-.9l-.5-.4c-.2-.2-.5-.3-.8-.1l-.7.5c-.3.2-.6.2-.9 0-.5-.3-1.6-1.3-2-1.8-.3-.4-.2-.7 0-.9l.5-.7c.2-.3.1-.6 0-.8l-.8-1.2c-.2-.3-.5-.5-.8-.5z" /></svg>
      </span>
    </Link>
  )
}

export function DemoBanner() {
  if (!isDemoMode()) return null
  return (
    <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm rounded-xl px-4 py-2.5 mb-4">
      ডেমো মোড: Firebase এখনো কনফিগার করা হয়নি — অর্ডার ও অ্যাকাউন্ট এই ব্রাউজারের localStorage-এ সংরক্ষিত হচ্ছে। আসল ডেটার জন্য README-এর Firebase সেটআপ ধাপ দেখুন।
    </div>
  )
}

/* ---------- Shared landing sections ---------- */

export function PageHero({ badge, title, sub, chips = [], gold = false, children }) {
  return (
    <section className={`landing-hero ${gold ? 'landing-hero-gold' : ''}`}>
      <div className="relative">
        {badge && <span className="eyebrow">{badge}</span>}
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mt-3">{title}</h1>
        {sub && <p className="text-green-50 mt-3 text-base sm:text-lg max-w-2xl mx-auto">{sub}</p>}
        {chips.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {chips.map((c) => <span key={c} className="trust-chip">{c}</span>)}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function SectionHeader({ title, sub, link, linkLabel, centre = false }) {
  if (centre) {
    return (
      <div className="section-centre">
        <h2>{title}</h2>
        {sub && <p className="text-sm text-slate-500 mt-2">{sub}</p>}
        {link && <Link to={link} className="inline-block mt-2 text-sm font-bold text-[#028a2e] hover:underline">{linkLabel} →</Link>}
      </div>
    )
  }
  return (
    <div>
      <div className="section-head">
        <span className="section-head-bar" aria-hidden="true" />
        <h2>{title}</h2>
        <span className="section-head-rule" aria-hidden="true" />
        {link && <Link to={link} className="text-sm font-bold text-[#028a2e] hover:underline shrink-0">{linkLabel} →</Link>}
      </div>
      {sub && <p className="text-sm text-slate-500 mt-1.5 pl-[18px]">{sub}</p>}
    </div>
  )
}

export function TrustStrip() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
      {[
        ['শুধু UID দরকার', 'আপনার গেম অ্যাকাউন্টের পাসওয়ার্ড কখনো চাওয়া হয় না।'],
        ['দ্রুত ডেলিভারি', 'পেমেন্ট ভেরিফাই হলেই ৫–৩০ মিনিটে ডেলিভারি।'],
        ['নিরাপদ পেমেন্ট', 'bKash ও Nagad Send Money — ম্যানুয়াল ভেরিফিকেশন।'],
        ['২৪/৭ সাপোর্ট', 'যেকোনো সমস্যায় যোগাযোগ পেজ থেকে মেসেজ করুন।'],
      ].map(([t, d]) => (
        <div key={t} className="landing-card p-4">
          <p className="font-bold text-slate-900">{t}</p>
          <p className="text-xs text-slate-500 mt-1">{d}</p>
        </div>
      ))}
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="mt-10">
      <SectionHeader centre title="কীভাবে টপ আপ করবেন?" sub="মাত্র ৩ ধাপে আপনার গেম অ্যাকাউন্টে ডায়মন্ড বা UC পৌঁছে যাবে।" />
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          ['১', 'প্যাকেজ বেছে নিন', 'পছন্দের ডায়মন্ড বা UC প্যাকেজটি সিলেক্ট করুন।'],
          ['২', 'UID ও পেমেন্ট দিন', 'আপনার Player UID ও মোবাইল নম্বর দিন, bKash/Nagad দিয়ে পেমেন্ট করে Transaction ID জমা দিন।'],
          ['৩', 'ডেলিভারি পান', 'পেমেন্ট ভেরিফাই হলেই ৫–৩০ মিনিটে আপনার অ্যাকাউন্টে ডায়মন্ড/UC পৌঁছে যাবে।'],
        ].map(([n, t, d]) => (
          <div key={n} className="landing-card p-5">
            <span className="w-10 h-10 rounded-full bg-[#02B53D] flex items-center justify-center font-extrabold text-white">{n}</span>
            <p className="font-bold text-slate-900 mt-3">{t}</p>
            <p className="text-sm text-slate-500 mt-1">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SupportPills() {
  const s = getSettings()
  const pills = [
    { label: 'WhatsApp সাপোর্ট', to: '/contact', internal: true },
    { label: 'Telegram চ্যানেল', to: '/contact', internal: true },
    { label: `ইমেইল: ${s.supportEmail}`, to: `mailto:${s.supportEmail}`, internal: false },
  ]
  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
      {pills.map((p) => p.internal ? (
        <Link key={p.label} to={p.to} className="bg-[#02B53D] hover:bg-[#028a2e] text-white text-center text-xs sm:text-sm font-bold rounded-xl px-2 py-3 shadow-sm">{p.label}</Link>
      ) : (
        <a key={p.label} href={p.to} className="bg-[#02B53D] hover:bg-[#028a2e] text-white text-center text-xs sm:text-sm font-bold rounded-xl px-2 py-3 shadow-sm truncate">{p.label}</a>
      ))}
    </section>
  )
}

export function PremiumSection() {
  return (
    <section className="mt-10">
      <SectionHeader centre title="PREMIUM CUSTOMER" sub="প্রিমিয়াম গ্রাহকদের জন্য অগ্রাধিকার সুবিধা" />
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-6 max-w-3xl mx-auto">
        {[
          { to: '/free-fire', grad: 'from-amber-500 to-orange-600', icon: 'crown', title: 'অগ্রাধিকার ডেলিভারি', sub: 'প্রিমিয়াম অর্ডার আগে ডেলিভারি হয়' },
          { to: '/contact', grad: 'from-[#02B53D] to-[#028a2e]', icon: 'gift', title: '২৪/৭ প্রিমিয়াম সাপোর্ট', sub: 'যেকোনো সমস্যায় দ্রুত উত্তর' },
        ].map((c) => (
          <Link key={c.title} to={c.to} className="landing-card overflow-hidden card-hover block">
            <div className={`tile-art bg-gradient-to-br ${c.grad}`}>
              <span className="relative animate-floaty">{ICONS[c.icon]}</span>
            </div>
            <div className="px-3 py-3 text-center border-b-2 border-[#028a2e]">
              <p className="font-extrabold text-slate-900 uppercase text-sm tracking-wide">{c.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function SupportCTA() {
  const s = getSettings()
  return (
    <section className="mt-10 rounded-xl bg-[#02B53D] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
      <div>
        <h3 className="text-xl font-extrabold text-white">কোনো সমস্যা বা প্রশ্ন আছে?</h3>
        <p className="text-green-100 text-sm mt-1">আমাদের সাপোর্ট টিম ২৪ ঘণ্টা আপনার পাশে আছে। {s.supportHours}</p>
      </div>
      <Link to="/contact" className="bg-white text-[#02B53D] font-bold px-5 py-2.5 rounded-xl shrink-0">সাপোর্টে যোগাযোগ করুন</Link>
    </section>
  )
}

export function Avatar({ name }) {
  const ch = (name || 'গ্রাহক').trim().charAt(0).toUpperCase()
  return <span className="avatar-circle" aria-hidden="true">{ch}</span>
}

export function LatestOrders({ limit = 6, title = 'সাম্প্রতিক অর্ডার' }) {
  const [orders, setOrders] = useState([])
  useEffect(() => { setOrders(latestOrdersForHome()) }, [])
  const list = orders.slice(0, limit)
  return (
    <section className="mt-10">
      <div className="landing-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">সর্বশেষ আপডেট: এইমাত্র · {isDemoMode() ? 'ডেমো মোডে নমুনা ডেটা দেখানো হচ্ছে।' : 'আসল অর্ডার থেকে।'}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#E10600] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />LIVE
          </span>
        </div>
        <div className="flex items-center justify-between px-4 sm:px-5 py-2 bg-slate-50/60 text-[11px] font-bold tracking-wide text-slate-400">
          <span>CUSTOMER</span><span>STATUS</span>
        </div>
        {isDemoMode() && <p className="text-center pt-3"><span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-full font-bold">নমুনা অর্ডার</span></p>}
        <div className="divide-y divide-slate-100">
          {list.length === 0 && <p className="p-6 text-slate-500 text-sm text-center">এখনো কোনো অর্ডার নেই।</p>}
          {list.map((o, i) => (
            <div key={o.id} className={`flex items-center gap-3 px-4 sm:px-5 py-3 ${i % 2 === 1 ? 'bg-[#F9F7F5]/60' : ''}`}>
              <Avatar name={o.name} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 truncate">{o.name || 'গ্রাহক'} <span className="text-slate-500 font-normal">— {o.productName}</span></p>
                <p className="text-xs text-slate-500">{o.id} · {timeAgo(o.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-slate-900">{o.amount}৳</p>
                {o.status === 'Completed'
                  ? <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#028a2e]">Done</span>
                  : <StatusBadge status={o.status} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function maskName(name) {
  return (name || 'গ্রাহক').split(' ').map((w) => (w.length <= 2 ? `${w.charAt(0)}***` : `${w.slice(0, 2)}***`)).join(' ')
}

/* Top Ranked Users — derived ONLY from RRR's own orders (real, else labelled sample). */
export function TopRankedUsers() {
  const [rows, setRows] = useState([])
  const [demo, setDemo] = useState(false)
  useEffect(() => {
    const real = getOrders()
    const source = real.length ? real : SAMPLE_ORDERS
    setDemo(!real.length)
    const byName = new Map()
    for (const o of source) {
      const name = o.name || o.customerName || 'গ্রাহক'
      const cur = byName.get(name) || { name, total: 0, count: 0 }
      cur.total += o.amount || 0
      cur.count += 1
      byName.set(name, cur)
    }
    setRows([...byName.values()].sort((a, b) => b.total - a.total).slice(0, 10))
  }, [])
  function tier(total) {
    if (total >= 2000) return { label: 'Platinum', cls: 'bg-purple-100 text-purple-700 border border-purple-300' }
    if (total >= 500) return { label: 'Gold', cls: 'bg-amber-100 text-amber-800 border border-amber-300' }
    return { label: 'Silver', cls: 'bg-slate-100 text-slate-600 border border-slate-300' }
  }
  return (
    <section className="mt-10">
      <div className="landing-card overflow-hidden">
        <div className="bg-[#01AC34] px-4 sm:px-5 py-4 text-white">
          <h2 className="text-lg sm:text-xl font-extrabold">টপ র‍্যাঙ্কড ইউজার</h2>
          <p className="text-sm text-green-50 mt-0.5">Highest spenders — সর্বোচ্চ খরচ করা গ্রাহকরা</p>
        </div>
        {demo && <p className="text-center pt-3"><span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-full font-bold">নমুনা র‍্যাঙ্কিং</span></p>}
        <div className="divide-y divide-slate-100">
          {rows.length === 0 && <p className="p-6 text-slate-500 text-sm text-center">এখনো কোনো অর্ডার নেই।</p>}
          {rows.map((r, i) => {
            const t = tier(r.total)
            return (
              <div key={r.name} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <span className="w-6 text-center font-extrabold text-slate-400 shrink-0">{i + 1}</span>
                <Avatar name={r.name} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate">{maskName(r.name)}</p>
                  <p className="text-xs text-slate-500">{r.count}টি অর্ডার · মোট {r.total.toLocaleString('en-IN')}৳</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${t.cls}`}>{t.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* Numbered step card: blue circle number overlapping the top-left edge. */
export function StepCard({ n, title, children, muted = false }) {
  return (
    <section className={`step-card ${muted ? 'opacity-70' : ''}`}>
      <span className="step-num">{n}</span>
      <h2 className="step-title">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/* ---------- Category tiles: image-top ~70%, white label strip, blue bottom line ---------- */

export const CATEGORY_META = {
  diamonds: { gradient: 'from-orange-500 to-rose-600', icon: 'diamond' },
  weekly: { gradient: 'from-violet-500 to-purple-700', icon: 'weekly' },
  monthly: { gradient: 'from-fuchsia-500 to-violet-700', icon: 'monthly' },
  'weekly-lite': { gradient: 'from-sky-500 to-indigo-600', icon: 'lite' },
  'level-up': { gradient: 'from-emerald-500 to-teal-600', icon: 'level' },
  special: { gradient: 'from-amber-500 to-orange-600', icon: 'gift' },
  like: { gradient: 'from-pink-500 to-rose-600', icon: 'heart' },
  uc: { gradient: 'from-amber-400 to-orange-600', icon: 'uc' },
  'royale-pass': { gradient: 'from-yellow-400 to-amber-600', icon: 'crown' },
}

export const FF_TILES = [
  { cat: 'diamonds', title: 'UID টপ আপ [BD]', sub: 'ডায়মন্ড প্যাক' },
  { cat: 'weekly', title: 'উইকলি', sub: 'মেম্বারশিপ' },
  { cat: 'monthly', title: 'মান্থলি', sub: 'মেম্বারশিপ' },
  { cat: 'special', title: 'উইকলি + মান্থলি', sub: 'কম্বো অফার' },
  { cat: 'weekly-lite', title: 'উইকলি লাইট [BD সার্ভার]', sub: 'লাইট প্যাক' },
  { cat: 'level-up', title: 'লেভেল আপ প্যাকেজ', sub: 'রিওয়ার্ড আনলক' },
  { cat: 'like', title: '১০০ লাইক প্রতিদিন', sub: 'লাইক সার্ভিস' },
  { cat: 'all', title: 'সব প্যাকেজ দেখুন', sub: 'ফ্রি ফায়ার' },
]

export const PUBG_TILES = [
  { cat: 'uc', title: 'UC প্যাকেজ', sub: '৬০–৮১০০ UC' },
  { cat: 'royale-pass', title: 'রয়্যাল পাস', sub: 'সিজন রিওয়ার্ড' },
  { cat: 'special', title: 'স্পেশাল UC', sub: 'বোনাসসহ' },
  { cat: 'all', title: 'সব প্যাকেজ দেখুন', sub: 'PUBG Mobile' },
]

export function CategoryTile({ to, title, sub, gradient, icon }) {
  const art = ICONS[icon] || ICONS.diamond
  return (
    <Link to={to} className="landing-card overflow-hidden card-hover block">
      <div className={`tile-art bg-gradient-to-br ${gradient}`}>
        <span className="relative animate-floaty">{art}</span>
      </div>
      <div className="px-2 py-2.5 text-center border-b-2 border-[#028a2e]">
        <p className="font-extrabold text-slate-900 uppercase text-[11px] sm:text-sm tracking-wide leading-tight">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
      </div>
    </Link>
  )
}

export function CategoryTileGrid({ game }) {
  const tiles = game === 'pubg' ? PUBG_TILES : FF_TILES
  const base = game === 'pubg' ? '/pubg' : '/free-fire'
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
      {tiles.map((t) => {
        const meta = CATEGORY_META[t.cat] || { gradient: 'from-[#02B53D] to-[#028a2e]', icon: 'diamond' }
        const to = t.cat === 'all' ? base : `${base}?cat=${t.cat}`
        return <CategoryTile key={t.title} to={to} title={t.title} sub={t.sub} gradient={meta.gradient} icon={meta.icon} />
      })}
    </div>
  )
}

/* Coming-soon tile: clearly labelled, disabled, no price, no fake product page. */
export function ComingSoonTile({ title, sub, gradient, icon }) {
  const art = ICONS[icon] || ICONS.gift
  return (
    <div className="landing-card overflow-hidden opacity-90" aria-disabled="true">
      <div className={`tile-art bg-gradient-to-br ${gradient}`}>
        <span className="relative">{art}</span>
      </div>
      <div className="px-2 py-2.5 text-center border-b-2 border-slate-200">
        <p className="font-extrabold text-slate-900 uppercase text-[11px] sm:text-sm tracking-wide leading-tight">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
        <span className="inline-block mt-1.5 text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">শীঘ্রই আসছে</span>
      </div>
    </div>
  )
}

/* ---------- Product art / cards ---------- */

const ICONS = {
  diamond: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M12 2 20 9l-8 13L4 9l8-7zm0 2.6L6.6 9 12 18.6 17.4 9 12 4.6zM8 9h8l-4 6.5L8 9z" /></svg>
  ),
  uc: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.2 2.6 5.4V19a2 2 0 0 0 2 2h4.8a2 2 0 0 0 2-2v-4.6C17.8 13.2 19 11.4 19 9a7 7 0 0 0-7-7zm-2 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
  ),
  weekly: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" /></svg>
  ),
  monthly: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
  ),
  lite: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
  ),
  level: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M5 3h14v2H5V3zm2 4h10v2H7V7zm-2 4h14v2H5v-2zm3 4h8v2H8v-2zm-1 4h10v2H7v-2z" /></svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M20 6h-2.18A3 3 0 1 0 15.5 3.5c-.5 1.5-1 3.5-2 5.5h6.5V6zM9.5 3.5A3 3 0 1 0 6.18 6H4v3h6.5c-1-2-1.5-4-2-5.5zM4 11v9h7v-6h2v6h7v-9H4z" /></svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 5.7-8 11-8 11z" /></svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M3 7l4 4 5-6 5 6 4-4v10H3V7zm2 12h14v2H5v-2z" /></svg>
  ),
}

export function ProductArt({ product, size = 'md' }) {
  const icon = ICONS[product.icon] || ICONS.diamond
  return (
    <div className={`bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center text-white relative overflow-hidden ${size === 'lg' ? 'h-52' : 'h-28'}`}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0, transparent 40%), radial-gradient(circle at 75% 80%, white 0, transparent 35%)' }} />
      <span className="relative animate-floaty">{icon}</span>
      <span className="relative font-extrabold text-sm mt-1 drop-shadow">{product.qty}</span>
      <span className="relative text-[11px] opacity-90">{GAMES[product.game]?.nameBn}</span>
    </div>
  )
}

export function ProductCard({ product }) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  return (
    <div className="landing-card overflow-hidden card-hover flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative">
        <ProductArt product={product} />
        {product.badge && <span className="absolute top-2 left-2 bg-amber-500 text-black text-[11px] font-bold px-2 py-0.5 rounded-full">{product.badge}</span>}
        {discount > 0 && <span className="absolute top-2 right-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
        {!product.inStock && <span className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-white">স্টক শেষ</span>}
      </Link>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="font-bold text-slate-900 hover:text-[#02B53D] leading-snug text-sm sm:text-base">{product.name}</Link>
        <p className="hidden sm:block text-xs text-slate-500 mt-1 line-clamp-2 flex-1">{product.desc}</p>
        <div className="flex items-end gap-2 mt-2 sm:mt-3">
          <span className="text-base sm:text-lg font-extrabold text-[#0f172a]">{fmtBDT(product.price)}</span>
          {product.oldPrice && <span className="hidden sm:inline text-sm text-slate-400 line-through">{fmtBDT(product.oldPrice)}</span>}
        </div>
        <Link to={`/product/${product.id}`} className="btn-primary w-full mt-3 !py-2 text-sm">
          {product.inStock ? 'এখনই কিনুন' : 'স্টক শেষ'}
        </Link>
      </div>
    </div>
  )
}

const STATUS_STYLE = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  'Payment Verification': 'bg-green-100 text-green-800 border-green-300',
  Processing: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-300',
  Cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
  'Pending Verification': 'bg-amber-100 text-amber-800 border-amber-300',
  Verified: 'bg-emerald-100 text-emerald-700 border-emerald-300',
}
export function StatusBadge({ status }) {
  return <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>
}

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'এইমাত্র'
  if (s < 3600) return `${Math.floor(s / 60)} মিনিট আগে`
  if (s < 86400) return `${Math.floor(s / 3600)} ঘণ্টা আগে`
  return new Date(ts).toLocaleString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
export function fmtDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
