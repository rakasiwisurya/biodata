import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** True only when the public Firebase config has been provided. */
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore | null {
  if (!dbInstance) {
    const a = getApp();
    if (a) dbInstance = getFirestore(a);
  }
  return dbInstance;
}

export function getFirebaseAuth(): Auth | null {
  if (!authInstance) {
    const a = getApp();
    if (a) authInstance = getAuth(a);
  }
  return authInstance;
}

export const googleProvider = new GoogleAuthProvider();

/** Optional Google Analytics — client-only, no-op if unsupported/unconfigured. */
export async function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!isFirebaseConfigured || !firebaseConfig.measurementId) return;
  const app = getApp();
  if (!app) return;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) getAnalytics(app);
}

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  // If no allowlist is configured client-side, fall back to allowing any
  // signed-in user (Firestore rules are still the real gate).
  if (ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
