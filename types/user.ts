import { Timestamp } from 'firebase/firestore'

export type UserRole = 'client' | 'provider'

export type UserProfile = {
  uid: string
  email: string
  role: UserRole
  displayName?: string | null
  createdAt: Timestamp
}
