"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { usePathname, useRouter } from "next/navigation"

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

const WAIT_TIMEOUT_MS = 6000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const navigatedRef = useRef(false)
  const profileUnsubRef = useRef<() => void>()

  useEffect(() => {
    if (pathname !== "/sign-in" && pathname !== "/sign-up") {
      navigatedRef.current = false
    }
  }, [pathname])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const run = async () => {
        setLoading(true)
        setUser(currentUser)
        setError(null)

        if (profileUnsubRef.current) {
          profileUnsubRef.current()
          profileUnsubRef.current = undefined
        }

        if (!currentUser) {
          setProfile(null)
          setLoading(false)
          return
        }

        const docRef = doc(db, "users", currentUser.uid)
        let resolved = false
        let waitTimer: ReturnType<typeof setTimeout> | undefined

        const handleFailure = async (reason: string) => {
          if (resolved) return
          resolved = true
          if (waitTimer) {
            clearTimeout(waitTimer)
            waitTimer = undefined
          }
          if (profileUnsubRef.current) {
            profileUnsubRef.current()
            profileUnsubRef.current = undefined
          }
          await signOut(auth)
          setProfile(null)
          setLoading(false)
          setError(reason)
          if (!pathname.startsWith("/sign-in")) {
            router.replace(`/sign-in?msg=${encodeURIComponent(reason)}`)
            router.refresh()
          }
        }

        const applyProfile = (data: Omit<Profile, "uid">) => {
          resolved = true
          if (waitTimer) {
            clearTimeout(waitTimer)
            waitTimer = undefined
          }
          setProfile({ uid: currentUser.uid, ...data })
          setLoading(false)
          if (!navigatedRef.current && (pathname === "/sign-in" || pathname === "/sign-up")) {
            navigatedRef.current = true
            router.replace("/dashboard")
            router.refresh()
          }
        }

        try {
          const initialSnapshot = await getDoc(docRef)
          if (initialSnapshot.exists()) {
            applyProfile(initialSnapshot.data() as Omit<Profile, "uid">)
          }
        } catch (err: any) {
          const reason = typeof err?.code === "string" ? err.code : "profile-load-failed"
          console.error("Initial profile load error", err)
          await handleFailure(reason)
          return
        }

        if (!resolved) {
          waitTimer = setTimeout(() => {
            void handleFailure("no-profile")
          }, WAIT_TIMEOUT_MS)
        }

        profileUnsubRef.current = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              applyProfile(docSnap.data() as Omit<Profile, "uid">)
            }
          },
          async (err) => {
            console.error("Profile listener error", err)
            const reason = typeof err?.code === "string" ? err.code : "profile-load-failed"
            await handleFailure(reason)
          }
        )
      }

      run().catch(async (err) => {
        console.error("AuthProvider error", err)
        const reason = typeof err?.code === "string" ? err.code : "auth-failed"
        await signOut(auth)
        setProfile(null)
        setLoading(false)
        setError(reason)
        router.replace(`/sign-in?msg=${encodeURIComponent(reason)}`)
        router.refresh()
      })
    })

    return () => {
      if (profileUnsubRef.current) {
        profileUnsubRef.current()
        profileUnsubRef.current = undefined
      }
      unsubscribe()
    }
  }, [pathname, router])

  const value = useMemo(() => ({ user, profile, loading, error }), [user, profile, loading, error])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
