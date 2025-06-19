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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Check your email
        </h1>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-gray-600">
            We've sent a verification link to
          </p>
          <p className="font-semibold text-gray-900">
            {email}
          </p>
        </div>

        {/* Info message */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>Click the link in your email to verify your account.</p>
          <p>After verification, you'll need to sign in to access your account.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success message */}
        {resent && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>Email sent successfully!</span>
          </div>
        )}

        {/* Resend link */}
        <p className="text-gray-500">
          Didn't receive the email?{' '}
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="font-semibold text-gray-900 hover:text-gray-700 underline">
            Click here to resend
          </button>
        </p>

        {/* Back to login button */}
        <Button
          asChild
          variant="outline"
          className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    </div>
  );
} 