"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import {
  getFirebaseAuth,
  googleProvider,
  initAnalytics,
  isAdminEmail,
  isFirebaseConfigured,
} from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  configured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAnalytics().catch(() => {});
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    // Surface any error coming back from a redirect-based sign-in.
    getRedirectResult(auth).catch((e) => console.error("Sign-in redirect error:", e));
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function signIn() {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      // Popup got blocked or isn't supported here — fall back to a full redirect.
      if (
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      throw e;
    }
  }

  async function signOut() {
    const auth = getFirebaseAuth();
    if (auth) await fbSignOut(auth);
  }

  const value: AuthState = {
    user,
    loading,
    isAdmin: isAdminEmail(user?.email),
    configured: isFirebaseConfigured,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
