import { Timestamp } from 'firebase/firestore'

// Types pour les documents Firestore
export interface UserProfile {
  email: string
  fullName: string
  avatarId: number
  company: string
  jobTitle: string
  industry: string
  competitors: string[]
  emailVerified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Types pour les données du formulaire (sans les timestamps)
export interface ProfileFormData {
  email: string
  fullName: string
  company: string
  jobTitle: string
  industry: string
  competitors: string[]
}

// Types pour les erreurs Firebase
export interface FirebaseError {
  code: string
  message: string
}

// Types pour les réponses d'authentification
export interface AuthResult {
  error: Error | null
}

// Configuration Firebase
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
} 