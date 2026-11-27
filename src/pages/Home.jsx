import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProducts, getSettings } from '../lib/store.js'
import { ProductArt, DemoBanner, PageHero, SectionHeader, CategoryTileGrid, LatestOrders, TopRankedUsers, SupportPills, ComingSoonTile } from '../components/Layout.jsx'
import { fmtBDT } from '../data/products.js'

/* Badge mapping: RRR's own badges -> reference-style pills (blue Best Selling/Trending, purple Hot Deal). */
function badgePill(badge) {
  if (badge === 'জনপ্রিয়') return { label: 'Best Selling', cls: 'bg-blue-600 text-white' }
  if (badge === 'বেস্ট ভ্যালু') return { label: 'Trending', cls: 'bg-blue-600 text-white' }
  if (badge === 'অফার') return { label: 'Hot Deal', cls: 'bg-purple-600 text-white' }
  return null
}

function SpecialItemCard({ product }) {
  const pill = badgePill(product.badge)
  return (
    <Link to={`/product/${product.id}`} className="landing-card overflow-hidden card-hover block text-left">
      <div className="relative">
        <ProductArt product={product} size="lg" />
        {pill && <span className={`absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${pill.cls}`}>{pill.label}</span>}
      </div>
      <div className="px-3 py-3 text-center border-b-2 border-[#028a2e]">
        <p className="font-extrabold text-slate-900 uppercase text-sm tracking-wide leading-tight">{product.name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{product.qty}</p>
        <p className="font-extrabold text-slate-900 mt-1">{fmtBDT(product.price)}</p>
      </div>
    </Link>
  )
}

const OTHER_GAMES = [
  { title: 'PUBG Mobile', sub: 'UC ও রয়্যাল পাস', gradient: 'from-amber-400 to-orange-600', icon: 'uc', real: true },
  { title: 'Clash Of Clans', sub: 'গেম প্যাক', gradient: 'from-emerald-500 to-teal-600', icon: 'crown', real: false },
  { title: 'eFootball', sub: 'কয়েন প্যাক', gradient: 'from-sky-500 to-indigo-600', icon: 'lite', real: false },
  { title: 'Roblox', sub: 'Robux', gradient: 'from-rose-500 to-red-600', icon: 'gift', real: false },
  { title: 'Minecraft', sub: 'গেম প্যাক', gradient: 'from-lime-500 to-green-700', icon: 'diamond', real: false },
]

const SUBSCRIPTIONS = [
  { title: 'YouTube Premium', sub: 'মাসিক সাবস্ক্রিপশন' },
  { title: 'Crunchyroll Premium', sub: 'অ্যানিমে স্ট্রিমিং' },
  { title: 'Netflix Subscription', sub: 'স্ট্রিমিং' },
  { title: 'Canva Pro', sub: 'ডিজাইন টুল' },
  { title: 'Prime Video', sub: 'স্ট্রিমিং' },
  { title: 'Telegram Premium', sub: 'প্রিমিয়াম সাবস্ক্রিপশন' },
  { title: 'Gemini Pro', sub: 'AI সাবস্ক্রিপশন' },
  { title: 'ChatGPT Premium', sub: 'AI সাবস্ক্রিপশন' },
  { title: 'Facebook Star', sub: 'স্টার প্যাক' },
]

const SMM_SERVICES = [
  { title: 'TikTok Service', sub: 'ফলোয়ার ও লাইক' },
  { title: 'Facebook Service', sub: 'ফলোয়ার ও লাইক' },
  { title: 'Instagram Service', sub: 'ফলোয়ার ও লাইক' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const s = getSettings()
  useEffect(() => { setProducts(getProducts()); document.title = 'RRR TopUp — ফ্রি ফায়ার ডায়মন্ড ও PUBG UC টপ আপ' }, [])

  const special = products.filter((p) => p.featured).slice(0, 3)

  return (
    <div>
      <DemoBanner />
      {/* 1. Hero banner — dark green gradient */}
      <PageHero
        badge="বাংলাদেশের প্রিমিয়াম টপ-আপ সার্ভিস"
        title={<>{s.heroTitle.split(' ').slice(0, 4).join(' ')} <span className="text-green-300">{s.heroTitle.split(' ').slice(4).join(' ')}</span></>}
        sub={s.heroSubtitle}
        chips={['শুধু UID — পাসওয়ার্ড লাগে না', '৫–৩০ মিনিটে ডেলিভারি', 'bKash / Nagad', '২৪/৭ সাপোর্ট']}
      >
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link to="/free-fire" className="bg-[#02B53D] hover:bg-[#028a2e] text-white font-bold px-5 py-2.5 rounded-full">ফ্রি ফায়ার টপ আপ করুন</Link>
          <Link to="/pubg" className="bg-white text-[#028a2e] font-bold px-5 py-2.5 rounded-full">PUBG UC দেখুন</Link>
        </div>
      </PageHero>

      {/* 2. Referral / offer banner strip */}
      <div className="landing-card-solid px-4 py-3 mt-4 flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#028a2e] shrink-0" fill="currentColor" aria-hidden="true"><path d="M20 6h-2.18A3 3 0 1 0 15.5 3.5c-.5 1.5-1 3.5-2 5.5h6.5V6zM9.5 3.5A3 3 0 1 0 6.18 6H4v3h6.5c-1-2-1.5-4-2-5.5zM4 11v9h7v-6h2v6h7v-9H4z" /></svg>
        <p className="text-sm font-semibold text-slate-800">{s.offerBanner}</p>
      </div>

      {/* 3. Special Item — 3 featured cards, left-aligned */}
      <section className="mt-10">
        <SectionHeader title="Special Item" sub="আজকের সেরা অফার" link="/free-fire" linkLabel="সব প্যাকেজ দেখুন" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-5">
          {special.map((p) => <SpecialItemCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* 4. Free Fire Item — 6-column grid of 8 categories */}
      <section className="mt-10">
        <SectionHeader title="Free Fire Item" sub="UID দিয়ে টপ আপ — ক্যাটাগরি বেছে নিন" link="/free-fire" linkLabel="সব প্যাকেজ দেখুন" />
        <div className="mt-5"><CategoryTileGrid game="ff" /></div>
      </section>

      {/* 5. Other Games — only PUBG is real; the rest are coming soon */}
      <section className="mt-10">
        <SectionHeader title="Other Games" sub="অন্যান্য গেমের প্যাক শীঘ্রই আসছে" />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mt-5">
          {OTHER_GAMES.map((g) => g.real ? (
            <Link key={g.title} to="/pubg" className="landing-card overflow-hidden card-hover block">
              <div className={`tile-art bg-gradient-to-br ${g.gradient}`}>
                <span className="relative animate-floaty">
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.2 2.6 5.4V19a2 2 0 0 0 2 2h4.8a2 2 0 0 0 2-2v-4.6C17.8 13.2 19 11.4 19 9a7 7 0 0 0-7-7zm-2 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
                </span>
              </div>
              <div className="px-2 py-2.5 text-center border-b-2 border-[#028a2e]">
                <p className="font-extrabold text-slate-900 uppercase text-[11px] sm:text-sm tracking-wide leading-tight">{g.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{g.sub}</p>
              </div>
            </Link>
          ) : (
            <ComingSoonTile key={g.title} title={g.title} sub={g.sub} gradient={g.gradient} icon={g.icon} />
          ))}
        </div>
      </section>

      {/* 6. Subscription — all coming soon */}
      <section className="mt-10">
        <SectionHeader title="Subscription" sub="সাবস্ক্রিপশন সার্ভিস শীঘ্রই আসছে" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mt-5">
          {SUBSCRIPTIONS.map((t) => (
            <ComingSoonTile key={t.title} title={t.title} sub={t.sub} gradient="from-slate-500 to-slate-700" icon="gift" />
          ))}
        </div>
      </section>

      {/* 7. SMM Panel Service — all coming soon */}
      <section className="mt-10">
        <SectionHeader title="SMM Panel Service" sub="সোশ্যাল মিডিয়া সার্ভিস শীঘ্রই আসছে" />
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">
          {SMM_SERVICES.map((t) => (
            <ComingSoonTile key={t.title} title={t.title} sub={t.sub} gradient="from-emerald-500 to-teal-600" icon="heart" />
          ))}
        </div>
      </section>

      {/* 8. Recent Orders */}
      <LatestOrders limit={6} />

      {/* 9. Top Ranked Users */}
      <TopRankedUsers />

      {/* 10. Contact & support pills above footer */}
      <SupportPills />
    </div>
  )
}

export function Section({ title, sub, link, linkLabel, children }) {
  return (
    <section className="mt-10">
      <SectionHeader title={title} sub={sub} link={link} linkLabel={linkLabel} />
      <div className="mt-6">{children}</div>
    </section>
  )
}
