import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config'

// Initialiser Firebase directement avec la configuration importée
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log('✅ Firebase initialisé avec succès')

  // En développement, connecter aux émulateurs si disponibles
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099')
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    } catch {
      // L'émulateur n'est pas disponible, continuer avec Firebase live
    }
  }
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase:', error)
}

export { auth, db }
export default app 