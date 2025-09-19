import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  CheckCircle,
  GraduationCap,
  Star,
  Zap,
} from 'lucide-react'

import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    title: 'AI Agents',
    description:
      'Ready-made and custom AI agents for automation, customer service, and intelligence augmentation.',
    icon: Bot,
    items: [
      'Chatbots and virtual assistants',
      'Process automation agents',
      'Data analysis bots',
      'Custom AI integrations',
    ],
  },
  {
    title: 'AI Education & Training',
    description:
      'Comprehensive learning experiences to upskill teams on AI fundamentals and advanced practices.',
    icon: GraduationCap,
    items: [
      'Executive AI strategy workshops',
      'Machine learning bootcamps',
      'Hands-on product enablement',
      'Custom learning pathways',
    ],
  },
  {
    title: 'AI Solutions & Integration',
    description:
      'End-to-end implementations that connect AI capabilities with your existing systems and workflows.',
    icon: Zap,
    items: [
      'AI readiness assessments',
      'Data engineering support',
      'Enterprise integrations',
      'Change management playbooks',
    ],
  },
]

const featuredSolutions = [
  {
    name: 'Aurora Assist',
    category: 'AI Agents',
    rating: 4.9,
    reviews: 132,
    description: 'Enterprise-ready conversational agents for sales enablement and customer success.',
    price: 'From $2,500',
  },
  {
    name: 'DataMind Academy',
    category: 'AI Education',
    rating: 4.8,
    reviews: 89,
    description: 'Full-stack AI training programs for technical teams and business stakeholders.',
    price: 'From $499',
  },
  {
    name: 'Neural Consulting',
    category: 'AI Strategy',
    rating: 5,
    reviews: 45,
    description: 'Strategic advisory to guide AI transformation and roadmap execution.',
    price: 'From $5,000',
  },
]

const metrics = [
  {
    label: 'Qualified AI Experts',
    value: '750+',
  },
  {
    label: 'Solutions Delivered',
    value: '2,500+',
  },
  {
    label: 'Customer Satisfaction',
    value: '4.9 / 5',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24 pt-12">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-10 shadow-xl backdrop-blur">
          <div className="mx-auto flex flex-col items-center gap-10 text-center md:max-w-3xl">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI marketplace for teams
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Connect with AI Experts and Intelligent Agents
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                Discover curated AI providers, education programs, and solutions built to accelerate your transformation.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/onboarding">
                  Start Your AI Journey
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-gray-300 bg-white/80 px-8 text-base backdrop-blur"
              >
                <Link href="/browse">Browse AI Solutions</Link>
              </Button>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-4 text-center"
                >
                  <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <SectionHeader
            align="center"
            title="AI Solutions for Every Business Need"
            description="Browse dedicated marketplaces for agents, training, and AI strategy built for modern teams."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.title}
                className="h-full border border-gray-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <category.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-gray-900">{category.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <SectionHeader
            align="center"
            eyebrow="Featured Providers"
            title="Top-rated AI Experts"
            description="Handpicked providers delivering measurable outcomes across industries."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {featuredSolutions.map((solution) => (
              <Card
                key={solution.name}
                className="h-full border border-gray-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {solution.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      <span className="font-semibold text-gray-900">{solution.rating.toFixed(1)}</span>
                      <span>({solution.reviews})</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-gray-900">{solution.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {solution.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{solution.price}</span>
                  <Button size="sm" asChild>
                    <Link href="/browse">View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/30 bg-primary text-primary-foreground shadow-lg">
          <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold md:text-4xl">
                Ready to Transform Your Business with AI?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Join thousands of companies already leveraging strategic AI solutions to drive growth and innovation.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <Button variant="secondary" size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/onboarding">Find AI Solutions</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 border-white/70 px-8 text-base text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/onboarding?role=provider">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
