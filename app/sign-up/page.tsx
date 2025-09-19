"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, deleteUser, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { auth, db } from "@/lib/firebase"
import type { UserRole } from "@/types/user"

const schema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[a-z]/, "Include at least one lowercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirmPassword: z.string(),
    role: z.enum(["client", "provider"], {
      required_error: "Select whether you are a client or provider.",
    }),
    displayName: z.string().trim().max(80, "Display name must be under 80 characters.").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: "client",
    label: "Client",
    description: "I want to discover AI providers, agents, or training.",
  },
  {
    value: "provider",
    label: "Provider",
    description: "I offer AI services, solutions, or education.",
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      displayName: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setFormError(null)
    try {
      const credential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const newUser = credential.user

      if (values.displayName) {
        await updateProfile(newUser, { displayName: values.displayName })
      }

      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: values.email,
        role: values.role,
        displayName: values.displayName?.trim() || null,
        createdAt: serverTimestamp(),
      })

      if (typeof window !== "undefined") {
        localStorage.setItem("justSignedUp", "1")
      }

      router.replace("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      console.error("Sign-up failed", error)
      setFormError("We could not create your account. Please try again.")

      if (auth.currentUser) {
        try {
          await deleteUser(auth.currentUser)
        } catch (cleanupError) {
          console.error("Failed to rollback user creation", cleanupError)
        }
      }
    }
  }

  const selectedRole = watch("role")

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl border border-white/60 bg-white/95 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl text-gray-900">Create your account</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Join AI Marketplace to match with AI experts or showcase your services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </p>
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" {...register("email")} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
                {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
                {errors.confirmPassword ? <p className="text-sm text-destructive">{errors.confirmPassword.message}</p> : null}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">I am signing up as</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const isSelected = role.value === selectedRole
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValue("role", role.value, { shouldValidate: true })}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/60 bg-white text-gray-700 hover:border-primary/50"
                      )}
                    >
                      <span className="block text-base font-semibold">{role.label}</span>
                      <span className="mt-1 block text-sm text-gray-500">{role.description}</span>
                    </button>
                  )
                })}
              </div>
              {errors.role ? <p className="text-sm text-destructive">{errors.role.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name (optional)</Label>
              <Input id="displayName" placeholder="Acme AI Team" {...register("displayName")} />
              {errors.displayName ? <p className="text-sm text-destructive">{errors.displayName.message}</p> : null}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
              Sign in instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}