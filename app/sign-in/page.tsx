"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"

export default function SignInPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)

  const routedMessage = (() => {
    const msg = search?.get("msg")
    switch (msg) {
      case "no-profile":
        return "No account found. Please sign up first."
      case "permission-denied":
        return "Access denied. Please deploy the latest Firestore security rules."
      case "unavailable":
        return "Network issue while loading your account. Please try again."
      case "profile-load-failed":
        return "We could not load your account. Please try again."
      default:
        return null
    }
  })()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      setFormError("Please provide both email and password.")
      return
    }

    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const nextParam = search?.get("next")
      const destination = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard"
      router.replace(destination)
      router.refresh()
    } catch (error: unknown) {
      console.error("Sign-in failed", error)
      setFormError("Invalid credentials. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border border-white/60 bg-white/95 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl text-gray-900">Welcome back</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Sign in to manage your Alliance AI projects and profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {routedMessage ? (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
              {routedMessage}
            </p>
          ) : null}
          {formError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </p>
          ) : null}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Need an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80">
              Create one now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
