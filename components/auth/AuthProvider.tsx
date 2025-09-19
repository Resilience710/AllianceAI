"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { auth, db } from "@/lib/firebase"

export type Profile = {
  uid: string
  email: string
  role: "client" | "provider"
  displayName?: string | null
}

type AuthContextValue = {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

const AuthCtx = createContext<AuthContextValue>({ user: null, profile: null, loading: true, error: null })

async function waitForProfile(uid: string, timeoutMs = 8000, intervalMs = 350): Promise<Profile | null> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const snapshot = await getDoc(doc(db, "users", uid))
    if (snapshot.exists()) {
      return { uid, ...(snapshot.data() as Omit<Profile, "uid">) }
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const navigated = useRef(false)

  useEffect(() => {
    if (pathname !== "/sign-in" && pathname !== "/sign-up") {
      navigated.current = false
    }
  }, [pathname])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setUser(firebaseUser)
      setError(null)

      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        let profileDoc: Profile | null = null
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid))
        if (snapshot.exists()) {
          profileDoc = { uid: firebaseUser.uid, ...(snapshot.data() as Omit<Profile, "uid">) }
        } else {
          const fromSignup =
            pathname === "/sign-up" ||
            search?.get("from") === "signup" ||
            (typeof window !== "undefined" && localStorage.getItem("justSignedUp") === "1")

          if (fromSignup) {
            profileDoc = await waitForProfile(firebaseUser.uid)
            if (typeof window !== "undefined") {
              localStorage.removeItem("justSignedUp")
            }
          }
        }

        if (!profileDoc) {
          await signOut(auth)
          setProfile(null)
          setLoading(false)
          setError("no-profile")
          if (!pathname.startsWith("/sign-in")) {
            router.replace("/sign-in?msg=no-profile")
            router.refresh()
          }
          return
        }

        setProfile(profileDoc)
        setLoading(false)

        if (!navigated.current && (pathname === "/sign-in" || pathname === "/sign-up")) {
          navigated.current = true
          router.replace("/dashboard")
          router.refresh()
        }
      } catch (err: any) {
        console.error("AuthProvider load error", err)
        setProfile(null)
        setLoading(false)
        const message = err?.code ?? "profile-load-failed"
        setError(message)
        if (pathname !== "/sign-in") {
          router.replace("/sign-in?msg=error")
          router.refresh()
        }
      }
    })

    return () => unsubscribe()
  }, [pathname, router, search])

  const value = useMemo(() => ({ user, profile, loading, error }), [user, profile, loading, error])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)