import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurer Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// URL de l'API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types pour les réponses API
export interface AuthUser {
  uid: string;
  email: string;
  display_name?: string;
  email_verified: boolean;
}

export interface SignupResponse {
  message: string;
  uid: string;
  verification_email_sent: boolean;
}

export interface LoginResponse {
  message: string;
  custom_token: string;
  user: AuthUser;
}

// Fonction pour créer un compte
export async function signupWithEmailPassword(
  email: string, 
  password: string, 
  displayName?: string
): Promise<SignupResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        display_name: displayName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la création du compte');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur signup:', error);
    throw error;
  }
}

// Fonction pour se connecter
export async function loginWithEmailPassword(
  email: string, 
  password: string
): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la connexion');
    }

    const data: LoginResponse = await response.json();
    
    // Utiliser le token personnalisé pour se connecter avec Firebase côté client
    const userCredential = await signInWithCustomToken(auth, data.custom_token);
    
    return userCredential.user;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
}

// Fonction pour renvoyer l'email de vérification
export async function resendVerificationEmail(email: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de l\'envoi de l\'email');
    }
  } catch (error) {
    console.error('Erreur resend verification:', error);
    throw error;
  }
}

// Fonction pour obtenir le profil utilisateur depuis le backend
export async function getUserProfile(): Promise<AuthUser> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const idToken = await user.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la récupération du profil');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur getUserProfile:', error);
    throw error;
  }
}

// Fonction pour vérifier si le token est valide
export async function verifyToken(): Promise<{ valid: boolean; user?: AuthUser }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { valid: false };
    }

    const idToken = await user.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      return { valid: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur verifyToken:', error);
    return { valid: false };
  }
}

// Fonction pour se connecter avec Google
export async function signInWithGoogle(): Promise<User> {
  try {
    // Forcer la sélection du compte à chaque fois
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Envoyer les informations au backend pour synchronisation
    const idToken = await user.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/google-signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        display_name: user.displayName,
        photo_url: user.photoURL,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la connexion Google');
    }

    return user;
  } catch (error) {
    console.error('Erreur Google Sign-In:', error);
    throw error;
  }
}

// Fonction pour se déconnecter
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erreur logout:', error);
    throw error;
  }
}

// Hook pour écouter les changements d'état d'authentification
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Fonction pour vérifier si l'utilisateur est connecté et son email vérifié
export async function checkAuthState(): Promise<{
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  user: User | null;
}> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Se désabonner immédiatement
      
      if (user) {
        // Forcer le rechargement du token pour avoir les informations les plus récentes
        await user.reload();
        resolve({
          isAuthenticated: true,
          isEmailVerified: user.emailVerified,
          user,
        });
      } else {
        resolve({
          isAuthenticated: false,
          isEmailVerified: false,
          user: null,
        });
      }
    });
  });
} 