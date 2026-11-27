import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../lib/store.js'
import { ProductCard, DemoBanner, PageHero, SectionHeader, CategoryTileGrid, LatestOrders, HowItWorks } from '../components/Layout.jsx'
import { FF_CATEGORIES, PUBG_CATEGORIES } from '../data/products.js'

function CatalogPage({ game, title, sub, categories, badge }) {
  const [products, setProducts] = useState([])
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState(params.get('cat') || 'all')
  const [q, setQ] = useState('')
  useEffect(() => { setProducts(getProducts()); document.title = `${title} | RRR TopUp` }, [title])
  useEffect(() => { setCat(params.get('cat') || 'all') }, [params])
  const list = useMemo(() => products.filter((p) =>
    p.game === game && (cat === 'all' || p.category === cat) &&
    (q === '' || p.name.toLowerCase().includes(q.toLowerCase()) || p.qty.includes(q))
  ), [products, game, cat, q])
  function pickCat(id) {
    setCat(id)
    if (id === 'all') setParams({}, { replace: true })
    else setParams({ cat: id }, { replace: true })
  }
  const activeCat = categories.find((c) => c.id === cat)
  return (
    <div>
      <DemoBanner />
      <PageHero
        badge={badge}
        title={title}
        sub={sub}
        chips={['শুধু UID — পাসওয়ার্ড লাগে না', '৫–৩০ মিনিটে ডেলিভারি', 'bKash / Nagad', '২৪/৭ সাপোর্ট']}
      />

      {/* Category tiles — 3 columns even on mobile */}
      <section className="mt-8">
        <SectionHeader centre title="ক্যাটাগরি বেছে নিন" sub="টাইলে ক্লিক করলেই সেই ক্যাটাগরির প্যাকেজ দেখাবে" />
        <div className="mt-6"><CategoryTileGrid game={game} /></div>
      </section>

      {/* Search + filter */}
      <section className="mt-8">
        <SectionHeader title={activeCat ? activeCat.nameBn : 'সব প্যাকেজ'} sub={`${list.length}টি প্যাকেজ পাওয়া গেছে`} />
        <input className="input mt-4 max-w-md" placeholder="প্যাকেজ খুঁজুন… (যেমন: 115, Weekly, 660 UC)" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => pickCat('all')} className={`tab-pill ${cat === 'all' ? 'grad-btn text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>সবগুলো</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => pickCat(c.id)} className={`tab-pill ${cat === c.id ? 'grad-btn text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>{c.nameBn}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="landing-card p-10 text-center text-slate-500 mt-6">এই ক্যাটাগরিতে কোনো প্যাকেজ পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-6">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <p className="text-xs text-slate-500 mt-6">দামগুলো শুরু-দাম; অ্যাডমিন প্যানেল থেকে যেকোনো সময় পরিবর্তন করা যায়। ডেলিভারির জন্য শুধু UID/Character ID দরকার — পাসওয়ার্ড কখনো চাওয়া হয় না।</p>
      </section>

      <HowItWorks />
      <LatestOrders limit={6} />
    </div>
  )
}

export function FreeFirePage() {
  return <CatalogPage game="ff" badge="ফ্রি ফায়ার টপ আপ" title="ফ্রি ফায়ার টপ আপ" sub="ডায়মন্ড, উইকলি/মান্থলি মেম্বারশিপ, লেভেল আপ পাস ও লাইক সার্ভিস — BD সার্ভার, UID দিয়ে টপ আপ।" categories={FF_CATEGORIES} />
}
export function PubgPage() {
  return <CatalogPage game="pubg" badge="PUBG Mobile UC" title="PUBG Mobile UC" sub="UC প্যাকেজ ও রয়্যাল পাস — Character ID দিয়ে টপ আপ।" categories={PUBG_CATEGORIES} />
}
