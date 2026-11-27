import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById, getProducts, getSettings } from '../lib/store.js'
import { ProductCard, DemoBanner, PageHero, SectionHeader, LatestOrders } from '../components/Layout.jsx'
import { fmtBDT, GAMES } from '../data/products.js'
import { validateUID, validateMobile } from '../lib/price.js'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [allGame, setAllGame] = useState([])
  const [uid, setUid] = useState('')
  const [mobile, setMobile] = useState('')
  const [method, setMethod] = useState('bkash')
  const [err, setErr] = useState('')
  const settings = getSettings()
  const methods = Object.entries(settings.payments).filter(([, v]) => v.enabled)
  useEffect(() => {
    const p = getProductById(id)
    setProduct(p || null)
    if (p) {
      document.title = `${p.name} | RRR TopUp`
      const same = getProducts().filter((x) => x.game === p.game)
      setAllGame(same)
      setRelated(same.filter((x) => x.id !== p.id).slice(0, 4))
    }
  }, [id])

  if (!product) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="প্যাকেজ পাওয়া যায়নি" title="প্যাকেজটি পাওয়া যায়নি" sub="লিংকটি ভুল হতে পারে বা প্যাকেজটি সরিয়ে নেওয়া হয়েছে।" />
        <div className="text-center mt-6"><Link to="/" className="btn-primary inline-flex">হোমে ফিরুন</Link></div>
      </div>
    )
  }
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const game = GAMES[product.game]
  const grid = [product, ...allGame.filter((x) => x.id !== product.id)].slice(0, 9)

  function buyNow(e) {
    e.preventDefault()
    if (!validateUID(uid)) return setErr('সঠিক Player UID দিন (৬–১২ সংখ্যা)।')
    if (!validateMobile(mobile)) return setErr('সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX, ১১ সংখ্যা)।')
    setErr('')
    nav(`/checkout?product=${product.id}&uid=${uid.trim()}&mobile=${mobile.trim()}&method=${method}`)
  }

  return (
    <div>
      <DemoBanner />
      <Link to={game.id === 'ff' ? '/free-fire' : '/pubg'} className="inline-block text-sm font-bold text-[#028a2e] hover:underline mb-4">← {game.nameBn} প্যাকেজে ফিরুন</Link>

      {/* Product header card: small square icon + H1 + subline */}
      <div className="landing-card p-4 sm:p-5 flex items-center gap-4">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center text-white shrink-0`}>
          <span className="font-extrabold text-xs sm:text-sm leading-tight text-center px-1">{product.qty}</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{product.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{product.qty} · {game.nameBn} ({game.name}) — {product.desc}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{fmtBDT(product.price)}</span>
            {product.oldPrice && <span className="text-base text-slate-400 line-through">{fmtBDT(product.oldPrice)}</span>}
            {discount > 0 && <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}% ছাড়</span>}
            {product.badge && <span className="bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">{product.badge}</span>}
          </div>
        </div>
      </div>

      <form onSubmit={buyNow} className="grid lg:grid-cols-5 gap-5 mt-6 items-start">
        {/* Step 1 — Select package (left, ~62%) */}
        <section className="step-card lg:col-span-3 !mt-0">
          <span className="step-num">1</span>
          <h2 className="step-title">Select package — প্যাকেজ বেছে নিন</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {grid.map((p) => (
              <button key={p.id} type="button" onClick={() => { if (p.id !== product.id) nav(`/product/${p.id}`) }} className={`pkg-btn ${p.id === product.id ? 'pkg-btn-selected' : ''}`}>
                <span className="pkg-btn-name truncate">{p.name}</span>
                <span className="pkg-btn-price">{fmtBDT(p.price)}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">দামটি শুরু-দাম; চূড়ান্ত দাম চেকআউটে সার্ভার থেকে যাচাই করা হয়।</p>
        </section>

        {/* Step 2 — Checkout (right, ~34%) */}
        <section className="step-card lg:col-span-2 !mt-0">
          <span className="step-num">2</span>
          <h2 className="step-title">Checkout — চেকআউট</h2>
          <div className="mt-4 space-y-4">
            <div className="border-l-4 border-[#02B53D] pl-3">
              <p className="text-xs font-bold tracking-wide text-slate-500">YOUR DETAILS</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{product.name} <span className="text-slate-500 font-normal">· {game.nameBn}</span></p>
            </div>
            <div>
              <label className="label" htmlFor="uid">Player Id {product.game === 'pubg' ? '(Character ID)' : ''} *</label>
              <input id="uid" className="input" inputMode="numeric" placeholder={product.game === 'pubg' ? 'যেমন: 5123456789' : 'যেমন: 123456789'} value={uid} onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ''))} />
              <p className="text-xs text-slate-500 mt-1">গেমের ভেতরে আপনার প্রোফাইল থেকে UID কপি করুন।</p>
            </div>
            <div>
              <label className="label" htmlFor="mobile">যোগাযোগের মোবাইল নম্বর *</label>
              <input id="mobile" className="input" inputMode="numeric" placeholder="01XXXXXXXXX" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-500 mb-2">PAYMENT METHOD</p>
              {methods.length === 0 && <p className="text-rose-600 text-sm">এই মুহূর্তে কোনো পেমেন্ট পদ্ধতি চালু নেই। সাপোর্টে যোগাযোগ করুন।</p>}
              <div className="grid grid-cols-2 gap-3">
                {methods.map(([key, m]) => (
                  <button key={key} type="button" onClick={() => setMethod(key)} className={`rounded-xl border-2 p-3 text-left ${method === key ? 'border-[#02B53D] bg-[#F0FDF4]' : 'border-slate-200 bg-white'}`}>
                    <span className={`text-sm sm:text-base font-extrabold ${key === 'bkash' ? 'text-pink-600' : 'text-orange-500'}`}>{m.label}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Send Money — {fmtBDT(product.price)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#F0FDF4] border border-green-200 px-4 py-3">
              <div className="flex justify-between text-sm"><span className="text-slate-600">ORDER TOTAL</span><span className="font-extrabold text-slate-900">{fmtBDT(product.price)}</span></div>
              <p className="text-xs text-slate-500 mt-1">{product.name} — {product.qty}</p>
            </div>
            {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
            <button type="submit" disabled={!product.inStock} className="btn-primary w-full !py-3.5 text-base">
              {product.inStock ? `Buy Now — ${fmtBDT(product.price)}` : 'স্টক শেষ'}
            </button>
            <p className="text-xs text-slate-500 text-center">গেস্ট হিসেবে কেনা যাবে — অ্যাকাউন্ট খোলা বাধ্যতামূলক নয়। <Link to="/login" className="font-bold text-[#028a2e] hover:underline">লগইন</Link> করলে অর্ডার হিস্ট্রি দেখতে পারবেন।</p>
          </div>
        </section>
      </form>

      {/* Note card — Description (step 4 content, kept as a note) */}
      <div className="landing-card p-5 mt-6">
        <p className="font-bold text-slate-900 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#028a2e]" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          জেনে রাখুন
        </p>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 mt-3">
          <li>শুধু UID দিয়েই ডেলিভারি — আপনার গেম অ্যাকাউন্টের পাসওয়ার্ড কখনো চাওয়া হয় না।</li>
          <li>পেমেন্ট ভেরিফাই হলে ৫–৩০ মিনিটে ডেলিভারি; ব্যস্ত সময়ে সর্বোচ্চ ২ ঘণ্টা লাগতে পারে।</li>
          <li>ভুল UID দিলে ডেলিভারি ব্যর্থ হতে পারে — UID ভালো করে যাচাই করে দিন।</li>
          <li>bKash/Nagad Send Money-এর পর Transaction ID চেকআউটে জমা দিতে হবে। ভুয়া Transaction ID দিলে অর্ডার বাতিল হবে।</li>
          <li>ডেলিভারি সম্পন্ন হওয়ার পর রিফান্ড দেওয়া হয় না; বিস্তারিত রিফান্ড নীতিতে দেখুন।</li>
        </ul>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="সম্পর্কিত প্যাকেজ" sub="এই গেমের আরও জনপ্রিয় প্যাকেজ" />
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
      <LatestOrders limit={4} />
    </div>
  )
}
