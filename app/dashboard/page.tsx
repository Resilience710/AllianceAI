"use client"

import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { FeatureCard } from "@/components/shared/FeatureCard"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"
import { auth } from "@/lib/firebase"

const clientLinks = [
  {
    title: "Browse marketplace",
    description: "Explore vetted AI providers, agents, and training programs tailored to your goals.",
    href: "/browse",
  },
  {
    title: "My Messages",
    description: "View and manage conversations with AI providers.",
    href: "/messages",
  },
  {
    title: "My Bookings",
    description: "Track your active projects and booking history.",
    href: "/bookings",
  },
  {
    title: "Post a project brief",
    description: "Share your requirements so our partner team can match the right experts.",
    href: "/contact",
  },
]

const providerLinks = [
  {
    title: "Manage services",
    description: "Create, edit, and publish offerings for Alliance AI clients.",
    href: "/dashboard/services",
  },
  {
    title: "My Messages",
    description: "Communicate with potential and existing clients.",
    href: "/messages",
  },
  {
    title: "My Bookings",
    description: "Manage your active projects and client bookings.",
    href: "/bookings",
  },
  {
    title: "Review client requests",
    description: "See the latest opportunities submitted by teams exploring AI initiatives.",
    href: "/browse",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { profile } = useAuth()

  const handleSignOut = async () => {
    await signOut(auth)
    router.replace("/")
    router.refresh()
  }

  const roleLabel = profile?.role === "provider" ? "Provider" : "Client"
  const quickLinks = profile?.role === "client" ? clientLinks : providerLinks

  return (
    <RequireAuth>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8">
          <Card className="border border-white/60 bg-white/90 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl text-gray-900">
                    Welcome back, {profile?.displayName ?? profile?.email}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Manage your Alliance AI activity, track progress, and take the next step on your AI roadmap.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="h-max rounded-full px-4 py-2 text-sm uppercase">
                  {roleLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">Account email</p>
                <p>{profile?.email}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  Manage profile
                </Button>
                <Button onClick={handleSignOut}>Sign out</Button>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-8">
            <SectionHeader
              title="Quick actions"
              description={
                profile?.role === "client"
                  ? "Find trusted AI partners or get help scoping your next initiative."
                  : "Keep your provider profile compelling and connect with ready-to-buy teams."
              }
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((item) => (
                <Card key={item.title} className="border border-white/60 bg-white/85 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                    <CardDescription className="text-gray-600">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => router.push(item.href)}>
                      Go now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Analytics Section */}
          <section className="space-y-8">
            <SectionHeader
              title="Your Analytics"
              description="Track your performance and activity on the platform."
            />
            <AnalyticsDashboard userRole={profile?.role || 'client'} />
          </section>

          <section className="space-y-8">
            <SectionHeader
              title="Recommended next steps"
              description="Stay on top of your AI journey with curated suggestions."
            />
            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                title="Join the community"
                description="Connect with peers in the Alliance AI forum to share best practices."
                icon={<span className="text-lg font-semibold">🤝</span>}
              >
                <Button variant="secondary" onClick={() => router.push("/community")}>
                  Visit community
                </Button>
              </FeatureCard>
              <FeatureCard
                title="Get help from our team"
                description="Need guidance on adoption, packaging, or go-to-market? We are here to help."
                icon={<span className="text-lg font-semibold">💬</span>}
                accent="green"
              >
                <Button variant="outline" onClick={() => router.push("/contact")}>
                  Contact support
                </Button>
              </FeatureCard>
            </div>
          </section>
        </div>
      </div>
    </RequireAuth>
  )
}
