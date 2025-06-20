'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const ProfileForm = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['Stripe', 'Square', 'PayPal']);
  const [newCompetitor, setNewCompetitor] = useState('');
  const competitorInputRef = useRef<HTMLInputElement>(null);
  
  const knownAccounts = ['Qonto', 'Doctolib', 'Revolut', 'N26'];
  const wantToLearnAccounts = ['Swile', 'Spendesk', 'Klarna', 'Wise'];

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);



  // Sauvegarde automatique des champs
  const handleFieldSave = async (field: string, value: string) => {
    try {
      // TODO: Appeler l'API pour sauvegarder les données
      const idToken = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          [field]: value
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      const updatedCompetitors = [...competitors, newCompetitor.trim()];
      setCompetitors(updatedCompetitors);
      handleFieldSave('competitors', JSON.stringify(updatedCompetitors));
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (competitor: string) => {
    const updatedCompetitors = competitors.filter(c => c !== competitor);
    setCompetitors(updatedCompetitors);
    handleFieldSave('competitors', JSON.stringify(updatedCompetitors));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Company Information */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <Label htmlFor="company" className="text-xs font-medium text-gray-700">
                Company
              </Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company name"
                className="h-8 text-sm"
                style={{ border: '1px solid #E6E6E6' }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jobTitle" className="text-xs font-medium text-gray-700">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Your job title"
                className="h-8 text-sm"
                style={{ border: '1px solid #E6E6E6' }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="industry" className="text-xs font-medium text-gray-700">
              Industry
            </Label>
            <Input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Your industry"
              className="h-8 text-sm"
              style={{ border: '1px solid #E6E6E6' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Competitors to Exclude */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Competitors to Exclude</h2>
          <p className="text-xs text-gray-600 mb-3">Select companies you compete with to avoid introductions</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {competitors.map((competitor, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                {competitor}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-gray-900" 
                  onClick={() => handleRemoveCompetitor(competitor)}
                />
              </span>
            ))}
            {/* Chip d'ajout éditable */}
            <div className="inline-flex items-center px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs rounded-full">
              <Input
                ref={competitorInputRef}
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="+ Add"
                className="border-0 bg-transparent text-xs p-0 h-auto w-[40px] focus:ring-0 focus:border-0 placeholder:text-gray-400"
                style={{ boxShadow: 'none', width: newCompetitor ? `${Math.max(40, newCompetitor.length * 8)}px` : '40px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCompetitor();
                  }
                }}
                onBlur={() => {
                  if (newCompetitor.trim()) {
                    handleAddCompetitor();
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Recap */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Interview Recap</h2>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-xs h-6">
              Redo Interview
            </Button>
          </div>
          <p className="text-xs text-gray-600 mb-4">Voice interview completed on March 15, 2024</p>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">Accounts you know</h3>
              <div className="flex flex-wrap gap-1.5">
                {knownAccounts.map((account, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {account}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">Accounts you want to learn about</h3>
              <div className="flex flex-wrap gap-1.5">
                {wantToLearnAccounts.map((account, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {account}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 