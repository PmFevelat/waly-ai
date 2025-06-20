'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';
import { resendVerificationEmail } from '@/lib/auth';

interface EmailVerificationProps {
  email: string;
}

export default function EmailVerification({ email }: EmailVerificationProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    setResending(true);
    setError(null);

    try {
      await resendVerificationEmail(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error sending email');
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16">
      <div className="max-w-92 m-auto h-fit w-full">
        <div className="p-6 text-center">
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <Mail className="w-12 h-12 text-gray-600" />
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Check your email
          </h1>

          {/* Description */}
          <div className="mb-4">
            <p className="text-muted-foreground text-sm mb-1">
              We've sent a verification link to
            </p>
            <p className="font-semibold text-base">
              {email}
            </p>
          </div>

          {/* Info message */}
          <div className="text-sm text-muted-foreground mb-6">
            <p>Click the link in your email to verify your account.</p>
            <p>After verification, you'll need to sign in to access your account.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-sm mb-4">
              {error}
            </div>
          )}

          {/* Success message */}
          {resent && (
            <div className="p-2 bg-green-50 border border-green-200 text-green-600 rounded flex items-center justify-center text-sm mb-4">
              <CheckCircle className="w-3 h-3 mr-2" />
              <span>Email sent successfully!</span>
            </div>
          )}

          {/* Resend link */}
          <p className="text-muted-foreground text-sm mb-6">
            Didn't receive the email?{' '}
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="font-semibold text-foreground hover:underline">
              Click here to resend
            </button>
          </p>

          {/* Go to login button */}
          <Button
            asChild
            className="w-full">
            <Link href="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 