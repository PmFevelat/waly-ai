'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

export const InterviewRecap = () => {
  const [competitors, setCompetitors] = useState<string[]>(['Stripe', 'Square', 'PayPal']);
  const [newCompetitor, setNewCompetitor] = useState('');
  const competitorInputRef = useRef<HTMLInputElement>(null);
  
  const knownAccounts = ['Qonto', 'Doctolib', 'Revolut', 'N26'];
  const wantToLearnAccounts = ['Swile', 'Spendesk', 'Klarna', 'Wise'];

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (competitor: string) => {
    setCompetitors(competitors.filter(c => c !== competitor));
  };

  return (
    <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Interview Recap</h2>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-xs h-6">
            Redo Interview
          </Button>
        </div>
        <p className="text-xs text-gray-600 mb-4">Voice interview completed on March 15, 2024</p>
        
        <div className="space-y-4">
          {/* Accounts you know */}
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
          
          {/* Accounts you want to learn about */}
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

          {/* Competitors to Exclude */}
          <div>
            <h3 className="text-xs font-medium text-gray-900 mb-1">Competitors to Exclude</h3>
            <p className="text-xs text-gray-600 mb-2">Select companies you compete with to avoid introductions</p>
            <div className="flex flex-wrap gap-1.5">
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 