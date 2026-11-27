// Firebase init — env var না থাকলে null (ডেমো মোড)।
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Boolean(cfg.apiKey && cfg.projectId)

let app = null, auth = null, db = null
if (firebaseConfigured) {
  try {
    app = initializeApp(cfg)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (e) {
    console.warn('Firebase init failed, demo mode:', e)
  }
}
export { app, auth, db }
