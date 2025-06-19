'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DebugAuthPage() {
  const { user, loading, isAuthenticated, isEmailVerified } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Debug Auth State</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          
          <div>
            <strong>Is Email Verified:</strong> {isEmailVerified ? 'Yes' : 'No'}
          </div>
          
          {user && (
            <>
              <hr />
              <h2 className="text-xl font-semibold">User Details:</h2>
              <div className="space-y-2">
                <div><strong>UID:</strong> {user.uid}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Display Name:</strong> {user.displayName || 'Not set'}</div>
                <div><strong>Email Verified (Firebase):</strong> {user.emailVerified ? 'Yes' : 'No'}</div>
              </div>
            </>
          )}
          
          <hr />
          
          <div className="space-y-2">
            <Button onClick={handleLogout} variant="destructive">
              Force Logout
            </Button>
            
            <div className="space-x-2">
              <Button onClick={() => router.push('/login')} variant="outline">
                Go to Login
              </Button>
              <Button onClick={() => router.push('/signup')} variant="outline">
                Go to Signup
              </Button>
              <Button onClick={() => router.push('/intros')} variant="outline">
                Go to Intros
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 