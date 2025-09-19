import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Marketplace',
  description: 'Learn how AI Marketplace collects, uses, and protects your information.',
  openGraph: {
    title: 'AI Marketplace Privacy Policy',
    description: 'Understand our data practices, security, and compliance commitments.',
  },
}

const lastUpdated = 'September 15, 2025'

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    paragraphs: [
      'We collect contact information, company details, payment data, and usage analytics when you engage with the AI Marketplace platform.',
      'Provider applicants may also submit case studies, credentials, and compliance documentation to support vetting processes.',
    ],
    list: [
      'Account information: name, email address, role, and authentication credentials.',
      'Transaction information: billing contact, payment method, and purchase history.',
      'Usage information: activity logs, device data, and feature interactions to improve product experience.',
    ],
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    paragraphs: [
      'We use collected data to deliver services, personalize recommendations, and ensure a secure experience for buyers and providers.',
      'Aggregated data may be used to improve our marketplace insights and product roadmap.',
    ],
    list: [
      'Facilitate marketplace matchmaking and project collaboration.',
      'Send transactional and educational communications aligned with your preferences.',
      'Monitor and prevent fraud, abuse, and violations of our policies.',
      'Analyze product performance to prioritize enhancements.',
    ],
  },
  {
    id: 'data-sharing',
    title: 'Data sharing and disclosures',
    paragraphs: [
      'We do not sell personal information. We share data with vetted providers and service partners only when necessary to deliver contracted services.',
      'Third-party processors comply with confidentiality commitments and data protection regulations.',
    ],
    list: [
      'Service providers supporting payments, analytics, security, and communications.',
      'Authorized providers engaged by customers through our marketplace.',
      'Legal authorities when required to comply with applicable laws and regulations.',
    ],
  },
  {
    id: 'security',
    title: 'Security and data retention',
    paragraphs: [
      'We employ encryption, access controls, and continuous monitoring to protect data.',
      'Information is retained for as long as required to provide services or comply with legal obligations.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your rights and choices',
    paragraphs: [
      'Depending on your location, you may request access, correction, deletion, or portability of your data.',
      'You can manage communication preferences within your account or by contacting support@aimarketplace.com.',
    ],
  },
  {
    id: 'contact-us',
    title: 'Contact us',
    paragraphs: [
      'For privacy questions or requests, contact privacy@aimarketplace.com or write to AI Marketplace, 548 Market Street, San Francisco, CA.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Privacy"
          title="Privacy policy"
          description="We are committed to transparency and protecting the information you share with us."
          align="center"
        >
          <p className="text-sm font-medium text-gray-500">Last updated: {lastUpdated}</p>
        </PageHero>
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[280px,1fr]">
          <aside className="space-y-4 rounded-2xl border border-white/60 bg-white/90 p-6 text-sm text-gray-600 lg:sticky lg:top-24 lg:h-max">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Table of contents</h2>
            <nav className="flex flex-col gap-3">
              {sections.map((section) => (
                <Link key={section.id} href={`#${section.id}`} className="transition hover:text-primary">
                  {section.title}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="space-y-10">
            {sections.map((section) => (
              <Card key={section.id} id={section.id} className="border border-white/60 bg-white/90 shadow-sm">
                <CardContent className="space-y-4 p-8 text-sm text-gray-600">
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}