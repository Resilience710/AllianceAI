import Link from 'next/link'
import type { Metadata } from 'next'
import { Building2, Coffee, Heart, Rocket } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Careers | Alliance AI',
  description: 'Join the Alliance AI team to build the platform that connects companies with trusted AI expertise.',
  openGraph: {
    title: 'Careers at Alliance AI',
    description: 'Help shape the future of responsible AI adoption by joining our distributed team.',
  },
}

const jobs = [
  {
    title: 'Senior Product Designer',
    location: 'Remote (North America)',
    type: 'Full-time',
    description: 'Shape intuitive workflows for customers and providers alongside our product trio. Experience designing complex SaaS or marketplace products required.',
    link: 'https://jobs.example.com/product-designer',
  },
  {
    title: 'AI Partnerships Lead',
    location: 'New York, NY or Remote',
    type: 'Full-time',
    description: 'Own strategic relationships with top AI consultancies, agents, and training partners. Ideal for candidates with ecosystem or BD experience.',
    link: 'https://jobs.example.com/ai-partnerships',
  },
  {
    title: 'Developer Advocate',
    location: 'Remote (Global)',
    type: 'Contract-to-hire',
    description: 'Create content, demos, and workshops that help teams integrate AI responsibly. Strong communication and technical skills needed.',
    link: 'https://jobs.example.com/developer-advocate',
  },
]

const benefits = [
  {
    title: 'Distributed first',
    description: 'We embrace asynchronous collaboration and provide stipends to build your ideal remote workspace.',
    icon: Building2,
    accent: 'primary' as const,
  },
  {
    title: 'Invested in you',
    description: 'Competitive compensation, equity grants, and professional development budgets from day one.',
    icon: Rocket,
    accent: 'purple' as const,
  },
  {
    title: 'Inclusive culture',
    description: 'Employee resource groups, mental health days, and a values-driven environment where every voice matters.',
    icon: Heart,
    accent: 'green' as const,
  },
  {
    title: 'Wellbeing first',
    description: 'Comprehensive health benefits, parental leave, and global coworking support for hybrid lifestyles.',
    icon: Coffee,
    accent: 'secondary' as const,
  },
]

export default function CareersPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Careers"
          title="Build the marketplace powering responsible AI"
          description="We are a distributed team of builders, strategists, and educators passionate about helping organizations unlock AI safely."
          align="center"
          actions={
            <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
              <Link href="https://jobs.example.com" target="_blank" rel="noreferrer">
                View all openings
              </Link>
            </Button>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Open roles"
            title="Join our distributed team"
            description="We hire people who love tackling complex problems with empathy and curiosity."
          />
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.title} className="border border-white/60 bg-white/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                  <p className="text-sm text-gray-500">{job.location} ? {job.type}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
                  <p className="md:max-w-2xl">{job.description}</p>
                  <Button asChild variant="outline" className="h-11 rounded-xl px-6 text-sm">
                    <Link href={job.link} target="_blank" rel="noreferrer">
                      Apply now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Why Alliance AI"
            title="How we support our teammates"
            description="We design our culture, rituals, and benefits to help you produce your best work and maintain balance."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={<benefit.icon className="h-6 w-6" aria-hidden="true" />}
                title={benefit.title}
                description={benefit.description}
                accent={benefit.accent}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-5xl border border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl md:text-4xl">No perfect resume required</CardTitle>
            <p className="text-lg text-primary-foreground/85">
              We value potential, curiosity, and your unique perspective. If you are excited about our mission but do not see a perfect fit, reach out anyway.
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-base">
              <Link href="mailto:careers@aimarketplace.com">Share your story</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


