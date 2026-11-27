// Auth: Firebase থাকলে আসল Firebase Auth, না থাকলে localStorage ডেমো অথ।
// ডেমো মোড UI-তে স্পষ্ট লেবেলসহ দেখানো হয়।
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, firebaseConfigured } from './firebase.js'
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut as fbSignOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile,
} from 'firebase/auth'
import { LS } from './store.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export const DEMO_ADMIN = { email: 'admin@rrrtopup.com', password: 'admin123' }

function readSession() {
  try { return JSON.parse(localStorage.getItem(LS.session) || 'null') } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (firebaseConfigured && auth) {
      return onAuthStateChanged(auth, (u) => {
        setUser(u ? { uid: u.uid, email: u.email, name: u.displayName || u.email?.split('@')[0] } : null)
        setLoading(false)
      })
    }
    setUser(readSession())
    setLoading(false)
  }, [])

  async function register(name, email, password) {
    if (firebaseConfigured && auth) {
      const c = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(c.user, { displayName: name })
      return { uid: c.user.uid, email, name }
    }
    const users = JSON.parse(localStorage.getItem('rrrtopup_users') || '[]')
    if (users.find((u) => u.email === email)) throw new Error('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।')
    const u = { uid: 'demo-' + Date.now(), email, name, password }
    users.push(u); localStorage.setItem('rrrtopup_users', JSON.stringify(users))
    const pub = { uid: u.uid, email, name }
    localStorage.setItem(LS.session, JSON.stringify(pub)); setUser(pub)
    return pub
  }

  async function login(email, password) {
    if (firebaseConfigured && auth) {
      const c = await signInWithEmailAndPassword(auth, email, password)
      return { uid: c.user.uid, email: c.user.email, name: c.user.displayName || email.split('@')[0] }
    }
    const users = JSON.parse(localStorage.getItem('rrrtopup_users') || '[]')
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) throw new Error('ইমেইল বা পাসওয়ার্ড ভুল।')
    const pub = { uid: u.uid, email: u.email, name: u.name }
    localStorage.setItem(LS.session, JSON.stringify(pub)); setUser(pub)
    return pub
  }

  async function logout() {
    if (firebaseConfigured && auth) await fbSignOut(auth)
    localStorage.removeItem(LS.session); setUser(null)
  }

  async function forgot(email) {
    if (firebaseConfigured && auth) { await sendPasswordResetEmail(auth, email); return }
    const users = JSON.parse(localStorage.getItem('rrrtopup_users') || '[]')
    if (!users.find((u) => u.email === email)) throw new Error('এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।')
    // ডেমো মোড: পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো যায় না — অ্যাডমিনের সাথে যোগাযোগ করতে বলা হয়।
    throw new Error('ডেমো মোডে ইমেইল পাঠানো যায় না। Firebase চালু করলে পাসওয়ার্ড রিসেট ইমেইল যাবে — আপাতত সাপোর্টে যোগাযোগ করুন।')
  }

  return (
    <AuthCtx.Provider value={{ user, loading, register, login, logout, forgot, demoMode: !firebaseConfigured }}>
      {children}
    </AuthCtx.Provider>
  )
}

// ---- Admin session (ডেমো: admin@rrrtopup.com / admin123; Firebase মোডে Firestore-এ adminUsers রোল চেক করতে হবে) ----
export function isAdminLoggedIn() {
  try { return JSON.parse(localStorage.getItem(LS.adminSession) || 'null')?.admin === true } catch { return false }
}
export function adminLogin(email, password) {
  if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    localStorage.setItem(LS.adminSession, JSON.stringify({ admin: true, email }))
    return true
  }
  return false
}
export function adminLogout() { localStorage.removeItem(LS.adminSession) }
