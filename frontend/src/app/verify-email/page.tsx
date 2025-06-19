'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import EmailVerification from '@/components/email-verification';

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const verificationSent = searchParams.get('verification_sent') === 'true';

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Email manquant</h1>
          <p className="text-muted-foreground mb-4">
            Aucune adresse email fournie pour la vérification.
          </p>
          <a href="/signup" className="text-blue-600 hover:underline">
            Retour à l'inscription
          </a>
        </div>
      </div>
    );
  }

  return <EmailVerification email={email} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
} 