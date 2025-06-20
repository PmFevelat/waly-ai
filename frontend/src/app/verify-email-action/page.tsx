'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailActionPage() {
  const searchParams = useSearchParams();
  // const router = useRouter(); // Commenté pour éviter l'erreur ESLint
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid verification link');
      setVerifying(false);
      return;
    }

    // Appeler l'API backend pour vérifier l'email
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/verify-email-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        if (response.ok) {
          setVerified(true);
        } else {
          const error = await response.json();
          setError(error.detail || 'Verification failed');
        }
              } catch {
        setError('Error verifying email');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, email]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {verified ? (
          <>
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900">
              Email verified successfully!
            </h1>

            {/* Description */}
            <p className="text-gray-600">
              Your email has been verified. You can now sign in to your account.
            </p>

            {/* Login button */}
            <Button
              asChild
              className="w-full py-3">
              <Link href="/login">Sign in to your account</Link>
            </Button>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900">
              Verification failed
            </h1>

            {/* Error message */}
            <p className="text-gray-600">
              {error || 'The verification link is invalid or has expired.'}
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Link href="/signup">Create a new account</Link>
              </Button>
              
              <Button
                asChild
                variant="link"
                className="text-sm">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 