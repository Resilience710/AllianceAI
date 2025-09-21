import { Timestamp } from 'firebase/firestore'

export type ServiceVisibility = 'public' | 'draft'

export type Service = {
  id: string
  ownerUid: string
  providerName: string
  title: string
  shortDescription: string
  category: string
  price: number | null
  tags: string[]
  visibility: ServiceVisibility
  coverImageUrl?: string | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
