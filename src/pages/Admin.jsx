import { useEffect, useMemo, useState } from 'react'
import { adminLogin, adminLogout, isAdminLoggedIn, DEMO_ADMIN } from '../lib/auth.jsx'
import { getOrders, getProducts, saveProducts, getSettings, saveSettings, saveOrder, isDemoMode, getTopups, updateTopup } from '../lib/store.js'
import { StatusBadge, fmtDate, DemoBanner, PageHero } from '../components/Layout.jsx'
import { fmtBDT, GAMES } from '../data/products.js'

const TABS = [
  ['overview', 'ড্যাশবোর্ড'], ['products', 'প্রোডাক্ট'], ['orders', 'অর্ডার'], ['payments', 'পেমেন্ট'], ['settings', 'সেটিংস'],
]

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminLoggedIn())
  const [tab, setTab] = useState('overview')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { document.title = 'অ্যাডমিন | RRR TopUp' }, [])

  if (!authed) {
    return (
      <div>
        <DemoBanner />
        <PageHero badge="অ্যাডমিন" title="অ্যাডমিন লগইন" sub="শুধু অনুমোদিত অ্যাডমিন এই প্যানেলে প্রবেশ করতে পারেন।" />
        <div className="max-w-md mx-auto mt-6">
          <div className="landing-card p-6 sm:p-8">
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              if (adminLogin(email, password)) setAuthed(true)
              else setErr('ইমেইল বা পাসওয়ার্ড ভুল।')
            }}>
              <div><label className="label" htmlFor="aemail">ইমেইল *</label><input id="aemail" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><label className="label" htmlFor="apass">পাসওয়ার্ড *</label><input id="apass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              {err && <p className="text-rose-600 text-sm font-semibold">{err}</p>}
              <button className="btn-primary w-full">অ্যাডমিন প্যানেলে প্রবেশ করুন</button>
            </form>
            {isDemoMode() && (
              <div className="mt-5 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800">
                ডেমো অ্যাডমিন: <b>{DEMO_ADMIN.email}</b> / <b>{DEMO_ADMIN.password}</b><br />
                <span className="text-xs">লাইভে যাওয়ার আগে এই পাসওয়ার্ড অবশ্যই বদলাতে হবে (README দেখুন)।</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <DemoBanner />
      <PageHero badge="অ্যাডমিন ড্যাশবোর্ড" title="অ্যাডমিন ড্যাশবোর্ড" sub="অর্ডার, প্রোডাক্ট, পেমেন্ট ও সেটিংস — সব এক জায়গায়।">
        <button onClick={() => { adminLogout(); setAuthed(false) }} className="bg-white text-[#02B53D] font-bold px-5 py-2.5 rounded-xl mt-5">লগআউট</button>
      </PageHero>
      <div className="flex flex-wrap gap-2 mt-6">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`tab-pill ${tab === k ? 'grad-btn text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>{label}</button>
        ))}
      </div>
      <div className="mt-6">
        {tab === 'overview' && <Overview />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'payments' && <PaymentsTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

function useOrdersState() {
  const [orders, setOrders] = useState([])
  useEffect(() => { setOrders(getOrders()) }, [])
  const refresh = () => setOrders(getOrders())
  return [orders, refresh]
}

function Overview() {
  const [orders] = useOrdersState()
  const stats = useMemo(() => {
    const by = (s) => orders.filter((o) => o.status === s).length
    const revenue = orders.filter((o) => o.paymentStatus === 'Verified' || o.status === 'Completed').reduce((s, o) => s + (o.amount || 0), 0)
    const byGame = {}
    for (const o of orders) byGame[o.gameBn || o.game] = (byGame[o.gameBn || o.game] || 0) + (o.amount || 0)
    return { total: orders.length, pending: by('Pending') + by('Payment Verification'), processing: by('Processing'), completed: by('Completed'), revenue, byGame }
  }, [orders])
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          ['মোট অর্ডার', stats.total], ['পেন্ডিং', stats.pending], ['প্রসেসিং', stats.processing],
          ['সম্পন্ন', stats.completed], ['ভেরিফাইড রেভিনিউ', `${stats.revenue.toLocaleString('en-IN')}৳`],
        ].map(([label, v]) => (
          <div key={label} className="landing-card p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{v}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-5">
        <div className="landing-card p-5">
          <h3 className="font-bold text-slate-900">গেম অনুযায়ী বিক্রি</h3>
          {Object.keys(stats.byGame).length === 0 ? <p className="text-sm text-slate-500 mt-3">এখনো কোনো অর্ডার নেই।</p> : (
            <div className="mt-3 space-y-2">
              {Object.entries(stats.byGame).map(([g, v]) => (
                <div key={g} className="flex justify-between text-sm"><span className="text-slate-600">{g}</span><b className="text-[#0f172a]">{fmtBDT(v)}</b></div>
              ))}
            </div>
          )}
        </div>
        <div className="landing-card p-5">
          <h3 className="font-bold text-slate-900">সাম্প্রতিক অর্ডার</h3>
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex justify-between items-center gap-2 py-2 border-b border-slate-100 text-sm">
              <span className="text-slate-600">{o.id} · {o.productName}</span>
              <span className="flex items-center gap-2"><b className="text-[#0f172a]">{fmtBDT(o.amount)}</b><StatusBadge status={o.status} /></span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-slate-500 mt-3">এখনো কোনো অর্ডার নেই।</p>}
        </div>
      </div>
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', qty: '', price: '', oldPrice: '', game: 'ff', category: 'diamonds', desc: '', badge: '', featured: false, inStock: true })
  const [msg, setMsg] = useState('')
  useEffect(() => { setProducts(getProducts()) }, [])
  const persist = (list) => { setProducts(list); saveProducts(list) }

  function startEdit(p) {
    setEditing(p ? p.id : 'new')
    setForm(p ? { ...p, price: String(p.price), oldPrice: String(p.oldPrice || '') } : { name: '', qty: '', price: '', oldPrice: '', game: 'ff', category: 'diamonds', desc: '', badge: '', featured: false, inStock: true })
  }
  function save(e) {
    e.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !price || price <= 0) return setMsg('নাম ও সঠিক দাম দিন।')
    const item = { ...form, id: editing === 'new' ? `custom-${Date.now()}` : editing, price, oldPrice: Number(form.oldPrice) || 0, gradient: form.game === 'pubg' ? 'from-amber-400 to-orange-600' : 'from-orange-500 to-rose-600', icon: form.game === 'pubg' ? 'uc' : 'diamond' }
    const list = editing === 'new' ? [item, ...products] : products.map((p) => (p.id === editing ? item : p))
    persist(list); setEditing(null); setMsg('সংরক্ষণ হয়েছে ✓')
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg">প্রোডাক্ট ম্যানেজমেন্ট ({products.length})</h3>
        <button onClick={() => startEdit(null)} className="btn-primary !py-2 text-sm">+ নতুন প্রোডাক্ট</button>
      </div>
      {msg && <p className="text-emerald-600 text-sm mt-2">{msg}</p>}
      {editing && (
        <form onSubmit={save} className="landing-card p-5 mt-4 grid sm:grid-cols-2 gap-4">
          <div><label className="label">নাম *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">পরিমাণ/কোয়ান্টিটি</label><input className="input" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="যেমন: 115 ডায়মন্ড" /></div>
          <div><label className="label">দাম (৳) *</label><input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div><label className="label">পুরনো দাম (৳)</label><input className="input" type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} /></div>
          <div><label className="label">গেম</label><select className="input" value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })}><option value="ff">Free Fire</option><option value="pubg">PUBG Mobile</option></select></div>
          <div><label className="label">ক্যাটাগরি</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">বিবরণ</label><input className="input" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
          <div><label className="label">ব্যাজ (যেমন: জনপ্রিয়)</label><input className="input" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
          <div className="flex gap-4 items-end pb-2">
            <label className="text-sm text-slate-600 flex gap-2 items-center"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> ফিচার্ড</label>
            <label className="text-sm text-slate-600 flex gap-2 items-center"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> স্টকে আছে</label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button className="btn-primary">সংরক্ষণ করুন</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost">বাতিল</button>
          </div>
        </form>
      )}
      <div className="landing-card divide-y divide-slate-100 mt-4 overflow-hidden">
        {products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-bold text-slate-900">{p.name} <span className="text-slate-500 font-normal">· {GAMES[p.game]?.nameBn} · {p.category}</span></p>
              <p className="text-xs text-slate-500">{fmtBDT(p.price)}{p.oldPrice ? ` (ছিল ${fmtBDT(p.oldPrice)})` : ''} · {p.inStock ? 'স্টকে আছে' : 'স্টক শেষ'} {p.featured ? '· ফিচার্ড' : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => persist(products.map((x) => (x.id === p.id ? { ...x, inStock: !x.inStock } : x)))} className="btn-ghost !py-1.5 !px-3 text-xs">{p.inStock ? 'স্টক বন্ধ' : 'স্টক চালু'}</button>
              <button onClick={() => startEdit(p)} className="btn-ghost !py-1.5 !px-3 text-xs">এডিট</button>
              <button onClick={() => { if (confirm(`"${p.name}" মুছে ফেলবেন?`)) persist(products.filter((x) => x.id !== p.id)) }} className="btn-ghost !py-1.5 !px-3 text-xs !text-rose-600">মুছুন</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab() {
  const [orders, refresh] = useOrdersState()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const list = orders.filter((o) =>
    (filter === 'all' || o.status === filter) &&
    (q === '' || o.id.toLowerCase().includes(q.toLowerCase()) || o.uid.includes(q) || (o.trxId || '').toLowerCase().includes(q.toLowerCase()) || (o.mobile || '').includes(q))
  )
  function update(o, patch) {
    const next = { ...o, ...patch, updatedAt: Date.now() }
    saveOrder(next); refresh(); setSelected(next)
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input className="input !w-64" placeholder="অর্ডার ID / UID / TrxID / মোবাইল খুঁজুন…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input !w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">সব স্ট্যাটাস</option>
          {['Pending', 'Payment Verification', 'Processing', 'Completed', 'Rejected', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-3 landing-card divide-y divide-slate-100 overflow-hidden">
          {list.length === 0 && <p className="p-6 text-slate-500 text-sm">কোনো অর্ডার পাওয়া যায়নি।</p>}
          {list.map((o) => (
            <button key={o.id} onClick={() => { setSelected(o); setNote(o.notes || '') }} className={`w-full text-left px-4 py-3 hover:bg-green-50/60 ${selected?.id === o.id ? 'bg-green-50' : ''}`}>
              <span className="flex justify-between gap-2"><b className="text-slate-900">{o.id}</b><b className="text-[#0f172a]">{fmtBDT(o.amount)}</b></span>
              <span className="flex justify-between gap-2 mt-1 text-xs text-slate-500"><span>{o.productName} · UID {o.uid}</span><StatusBadge status={o.status} /></span>
              <span className="text-xs text-slate-500">{fmtDate(o.createdAt)} · {o.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} · {o.paymentStatus}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="landing-card p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">{selected.id}</h3>
              <Detail k="গেম" v={`${selected.gameBn} — ${selected.productName} (${selected.qty})`} />
              <Detail k="Player UID" v={`${selected.uid} (${selected.server || 'BD'})`} />
              <Detail k="মোবাইল" v={selected.mobile} />
              <Detail k="পরিমাণ" v={fmtBDT(selected.amount)} />
              <Detail k="পেমেন্ট" v={`${selected.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} — নম্বর ${selected.paymentNumber}`} />
              <Detail k="Transaction ID" v={selected.trxId} />
              <Detail k="পাঠানো নম্বর" v={selected.sender} />
              <Detail k="পেমেন্ট স্ট্যাটাস" v={<StatusBadge status={selected.paymentStatus} />} />
              <Detail k="অর্ডার স্ট্যাটাস" v={<StatusBadge status={selected.status} />} />
              <Detail k="সময়" v={fmtDate(selected.createdAt)} />
              <div>
                <p className="label">পেমেন্ট যাচাই</p>
                <div className="flex gap-2">
                  <button onClick={() => update(selected, { paymentStatus: 'Verified', status: 'Processing' })} className="btn-primary !py-2 text-sm flex-1">✓ পেমেন্ট ভেরিফাই</button>
                  <button onClick={() => update(selected, { paymentStatus: 'Rejected', status: 'Rejected' })} className="btn-ghost !py-2 text-sm flex-1 !text-rose-600">✕ রিজেক্ট</button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Transaction ID নিজে যাচাই না করে কখনো ভেরিফাই করবেন না। ভেরিফাই করলে অর্ডার Processing-এ যাবে।</p>
              </div>
              <div>
                <label className="label" htmlFor="ostatus">অর্ডার স্ট্যাটাস পরিবর্তন</label>
                <select id="ostatus" className="input" value={selected.status} onChange={(e) => update(selected, { status: e.target.value })}>
                  {['Pending', 'Payment Verification', 'Processing', 'Completed', 'Rejected', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="onote">অভ্যন্তরীণ নোট (শুধু অ্যাডমিন দেখবে)</label>
                <textarea id="onote" rows={2} className="input" value={note} onChange={(e) => setNote(e.target.value)} />
                <button onClick={() => update(selected, { notes: note })} className="btn-ghost !py-2 text-sm mt-2">নোট সংরক্ষণ</button>
              </div>
              {selected.notes && <p className="text-xs text-slate-500">নোট: {selected.notes}</p>}
            </div>
          ) : (
            <div className="landing-card p-6 text-slate-500 text-sm">বিস্তারিত দেখতে বাম থেকে একটি অর্ডার বেছে নিন।</div>
          )}
        </div>
      </div>
    </div>
  )
}
function Detail({ k, v }) {
  return <div className="flex justify-between gap-3 text-sm border-b border-slate-100 pb-2"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-900 text-right">{v}</span></div>
}

function PaymentsTab() {
  const [settings, setSettings] = useState(getSettings())
  const [msg, setMsg] = useState('')
  const [topups, setTopups] = useState(() => getTopups())
  function save(e) {
    e.preventDefault(); saveSettings(settings); setMsg('পেমেন্ট সেটিংস সংরক্ষণ হয়েছে ✓')
  }
  return (
    <div className="space-y-6">
      {/* Wallet top-up requests from Add Money — verify TrxID before approving. */}
      <div className="landing-card p-5">
        <h3 className="font-bold text-slate-900 text-lg">ব্যালেন্স অনুরোধ ({topups.filter((t) => t.status === 'Pending').length}টি পেন্ডিং)</h3>
        <p className="text-xs text-slate-500 mt-1">গ্রাহকের Add Money অনুরোধ — Transaction ID নিজে যাচাই না করে কখনো ভেরিফাই করবেন না। ভেরিফাই করলে টাকাটা গ্রাহকের ওয়ালেট ব্যালেন্সে যোগ হবে।</p>
        {topups.length === 0 && <p className="text-sm text-slate-500 mt-3">কোনো ব্যালেন্স অনুরোধ আসেনি।</p>}
        <div className="divide-y divide-slate-100 mt-3">
          {topups.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-bold text-slate-900">{t.id} <span className="text-slate-500 font-normal">· {t.method === 'bkash' ? 'bKash' : 'Nagad'} · TrxID {t.trxid}</span></p>
                <p className="text-xs text-slate-500">{t.mobile} · {fmtDate(t.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{fmtBDT(t.amount)}</p>
                <StatusBadge status={t.status === 'Verified' ? 'Verified' : t.status === 'Rejected' ? 'Rejected' : 'Pending Verification'} />
                {t.status === 'Pending' && (
                  <>
                    <button onClick={() => setTopups(getTopups().map((x) => x.id === t.id ? updateTopup(t.id, { status: 'Verified' }) : x))} className="btn-primary !py-1.5 !px-3 text-sm">✓ ভেরিফাই</button>
                    <button onClick={() => setTopups(getTopups().map((x) => x.id === t.id ? updateTopup(t.id, { status: 'Rejected' }) : x))} className="btn-ghost !py-1.5 !px-3 text-sm">বাতিল</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    <form onSubmit={save} className="space-y-4 max-w-2xl">
      {msg && <p className="text-emerald-600 text-sm font-semibold">{msg}</p>}
      {Object.entries(settings.payments).map(([key, m]) => (
        <div key={key} className="landing-card p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">{key === 'bkash' ? 'bKash' : 'Nagad'}</h3>
            <label className="text-sm text-slate-600 flex gap-2 items-center"><input type="checkbox" checked={m.enabled} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, [key]: { ...m, enabled: e.target.checked } } })} /> চালু</label>
          </div>
          <div><label className="label">Send Money নম্বর *</label><input className="input" value={m.number} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, [key]: { ...m, number: e.target.value } } })} placeholder="01XXXXXXXXX" /></div>
          <div><label className="label">লেবেল</label><input className="input" value={m.label} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, [key]: { ...m, label: e.target.value } } })} /></div>
          <div><label className="label">পেমেন্ট নির্দেশনা</label><textarea rows={2} className="input" value={m.instructions} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, [key]: { ...m, instructions: e.target.value } } })} /></div>
        </div>
      ))}
      <button className="btn-primary">পেমেন্ট সেটিংস সংরক্ষণ করুন</button>
      <p className="text-xs text-slate-500">আসল bKash/Nagad নম্বর এখানে বসান — নম্বর ছাড়া গ্রাহক পেমেন্ট করতে পারবে না।</p>
    </form>
    </div>
  )
}

function SettingsTab() {
  const [settings, setSettings] = useState(getSettings())
  const [msg, setMsg] = useState('')
  const [messages] = useState(() => JSON.parse(localStorage.getItem('rrrtopup_messages') || '[]'))
  function save(e) {
    e.preventDefault(); saveSettings(settings); setMsg('সেটিংস সংরক্ষণ হয়েছে ✓')
  }
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form onSubmit={save} className="landing-card p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">ওয়েবসাইট সেটিংস</h3>
        {msg && <p className="text-emerald-600 text-sm font-semibold">{msg}</p>}
        <div><label className="label">অফার ব্যানার</label><input className="input" value={settings.offerBanner} onChange={(e) => setSettings({ ...settings, offerBanner: e.target.value })} /></div>
        <div><label className="label">হিরো শিরোনাম</label><input className="input" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></div>
        <div><label className="label">হিরো সাবটাইটেল</label><textarea rows={2} className="input" value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} /></div>
        <div><label className="label">সাপোর্ট ফোন</label><input className="input" value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} /></div>
        <div><label className="label">সাপোর্ট ইমেইল</label><input className="input" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></div>
        <div><label className="label">সাপোর্ট সময়</label><input className="input" value={settings.supportHours} onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })} /></div>
        <div><label className="label">ডেলিভারি নোট</label><textarea rows={2} className="input" value={settings.deliveryNote} onChange={(e) => setSettings({ ...settings, deliveryNote: e.target.value })} /></div>
        <button className="btn-primary">সেটিংস সংরক্ষণ করুন</button>
      </form>
      <div className="landing-card p-5">
        <h3 className="font-bold text-slate-900 text-lg">সাপোর্ট মেসেজ ({messages.length})</h3>
        {messages.length === 0 && <p className="text-sm text-slate-500 mt-3">কোনো মেসেজ আসেনি।</p>}
        <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-bold text-slate-900">{m.name} <span className="text-slate-500 font-normal">· {m.mobile || ''} {m.orderId ? `· ${m.orderId}` : ''}</span></p>
              <p className="text-slate-600 mt-1">{m.message}</p>
              <p className="text-xs text-slate-500 mt-1">{fmtDate(m.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
