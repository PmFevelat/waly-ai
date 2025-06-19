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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Missing Email</h1>
          <p className="text-gray-600">
            No email address provided for verification.
          </p>
          <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium underline">
            Back to sign up
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
} 