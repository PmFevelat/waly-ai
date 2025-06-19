'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { resendVerificationEmail } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface EmailVerificationProps {
  email: string;
}

export default function EmailVerification({ email }: EmailVerificationProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isEmailVerified } = useAuth();
  const router = useRouter();

  // Vérifier périodiquement si l'email a été vérifié
  useEffect(() => {
    if (isEmailVerified) {
      router.push('/intros');
      return;
    }

    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          router.push('/intros');
        }
      }
    }, 2000); // Vérifier toutes les 2 secondes

    return () => clearInterval(interval);
  }, [user, isEmailVerified, router]);

  const handleResendEmail = async () => {
    setResending(true);
    setError(null);

    try {
      await resendVerificationEmail(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
      <div className="max-w-92 m-auto h-fit w-full">
        <div className="p-6">
          <div>
            {/* Back button */}
            <div className="mb-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground -ml-3">
                <Link href="/login" aria-label="Retour à la connexion">
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
            </div>
            <Link
              href="/"
              aria-label="Accueil">
              <Logo />
            </Link>
            <h1 className="mt-6 text-balance text-xl font-semibold">
              <span className="text-muted-foreground">Presque terminé !</span> Vérifiez votre email
            </h1>
          </div>

          <div className="mt-8 text-center">
            <div className="mb-6">
              <Mail className="size-16 mx-auto text-blue-500 mb-4" />
              <p className="text-muted-foreground mb-2">
                Nous avons envoyé un email de vérification à :
              </p>
              <p className="font-semibold text-lg">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Cliquez sur le lien dans l&apos;email pour vérifier votre compte. 
                L&apos;email peut prendre quelques minutes à arriver.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {resent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-center">
                <CheckCircle className="size-4 text-green-600 mr-2" />
                <p className="text-sm text-green-800">Email renvoyé avec succès !</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                variant="outline"
                className="w-full">
                {resending ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="size-4 mr-2" />
                    Renvoyer l&apos;email
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                Pas reçu l&apos;email ? Vérifiez vos spams ou
                <Button
                  variant="link"
                  className="px-1 text-sm"
                  onClick={handleResendEmail}
                  disabled={resending}>
                  cliquez ici pour le renvoyer
                </Button>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          <p className="text-muted-foreground text-sm text-center">
            Vous avez déjà vérifié votre email ?
            <Button
              asChild
              variant="link"
              className="px-2">
              <Link href="/login">Se connecter</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
} 