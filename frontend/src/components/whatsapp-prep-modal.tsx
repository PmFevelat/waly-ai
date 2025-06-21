'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { X, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface WhatsAppPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppPrepModal = ({ isOpen, onClose }: WhatsAppPrepModalProps) => {
  const [companyUrl, setCompanyUrl] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const competitorInputRef = useRef<HTMLInputElement>(null);

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (competitor: string) => {
    setCompetitors(competitors.filter(c => c !== competitor));
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 bg-opacity-5 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Help Waly before the call</h2>
          <p className="text-xs text-gray-600 mt-1">
            Share some context to make our conversation more effective
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Company URL */}
          <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-1" style={{ border: '1px solid #E6E6E6' }}>
            <CardContent className="p-2">
              <div className="space-y-1">
                <Label htmlFor="companyUrl" className="text-xs font-medium text-gray-700">
                  Company URL
                </Label>
                <Input
                  id="companyUrl"
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://your-company.com"
                  className="h-7 text-xs"
                  style={{ border: '1px solid #E6E6E6' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Competitors to Exclude */}
          <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-1" style={{ border: '1px solid #E6E6E6' }}>
            <CardContent className="p-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Competitors to Exclude</h3>
              <p className="text-xs text-gray-600 mb-2">Select companies you compete with to avoid introductions</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
            className="flex-1 h-8 text-xs">
            Back
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 h-8 text-xs">
            <Link href="/profile/results">
              <MessageCircle className="mr-1.5 h-3 w-3" />
              Go to WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 