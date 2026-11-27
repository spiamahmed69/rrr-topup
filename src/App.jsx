import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './lib/auth.jsx'
import { Header, Footer, FloatingSupport, MobileNav } from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import { FreeFirePage, PubgPage } from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Track from './pages/Track.jsx'
import { AddMoney, Referrals } from './pages/MobilePages.jsx'
import { Login, Register, Forgot, Profile, MyOrders } from './pages/AuthPages.jsx'
import { Contact, Terms, Privacy, Refund, NotFound } from './pages/Info.jsx'
import Admin from './pages/Admin.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F9F7F5] pb-[76px] lg:pb-0">
          <Header />
          <main className="flex-1 w-full max-w-[1180px] mx-auto px-3 sm:px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/free-fire" element={<FreeFirePage />} />
              <Route path="/pubg" element={<PubgPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/track" element={<Track />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingSupport />
          <MobileNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
