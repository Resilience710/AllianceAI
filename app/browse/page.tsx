import type { Metadata } from 'next'

import { BrowseClient } from './_components/browse-client'

export const metadata: Metadata = {
  title: 'Browse AI Solutions | Alliance AI',
  description: 'Explore curated AI agents, training programs, and consulting services tailored to your needs.',
  openGraph: {
    title: 'Browse AI Solutions',
    description: 'Discover AI agents, education, and consulting services in the Alliance AI.',
  },
}

export default function BrowsePage() {
  return <BrowseClient />
}
