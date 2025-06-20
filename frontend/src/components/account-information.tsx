'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const AccountInformation = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Sauvegarde automatique des champs
  // const handleFieldSave = async (field: string, value: string) => {
  //   try {
  //     // TODO: Appeler l'API pour sauvegarder les données
  //     const idToken = await user?.getIdToken();
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/profile`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${idToken}`,
  //       },
  //       body: JSON.stringify({
  //         [field]: value
  //       }),
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('Failed to save');
  //     }
  //   } catch (error) {
  //     console.error('Error saving field:', error);
  //   }
  // };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Your profile */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Your profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Pierre-Marie"
                className="h-8 text-sm"
                style={{ border: '1px solid #E6E6E6' }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Fevelat"
                className="h-8 text-sm"
                style={{ border: '1px solid #E6E6E6' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your email */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Your email</h2>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 text-sm"
              style={{ border: '1px solid #E6E6E6' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Security</h2>
          {!showPasswordForm ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-700">Change your password</p>
              <Button 
                size="sm"
                variant="outline" 
                className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 text-xs h-6"
                onClick={() => setShowPasswordForm(true)}
              >
                Set a new password
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="currentPassword" className="text-xs font-medium text-gray-700">
                  Current password
                </Label>
                <div className="relative max-w-sm">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-8 text-sm pr-8"
                    style={{ border: '1px solid #E6E6E6' }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-xs font-medium text-gray-700">
                  New password
                </Label>
                <div className="relative max-w-sm">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-8 text-sm pr-8"
                    style={{ border: '1px solid #E6E6E6' }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button 
                  size="sm"
                  variant="outline" 
                  className="text-xs h-6 px-3"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800 text-xs h-6 px-3"
                  onClick={() => {
                    // TODO: Implement password change logic
                    console.log('Change password');
                  }}
                >
                  Change password
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 