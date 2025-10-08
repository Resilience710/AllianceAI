import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// For server-side operations, we'll use the client SDK with proper initialization
import { initializeApp as initializeClientApp, getApps as getClientApps } from 'firebase/app'
import { getFirestore as getClientFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase app for server-side use
const app = getClientApps().length === 0 ? initializeClientApp(firebaseConfig) : getClientApps()[0]
export const serverDb = getClientFirestore(app)

export { firebaseConfig }
