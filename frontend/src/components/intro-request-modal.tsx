'use client';

import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface IntroRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  credits: number;
  contactName: string;
  company: string;
}

export const IntroRequestModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  credits, 
  contactName, 
  company 
}: IntroRequestModalProps) => {
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
          <h2 className="text-base font-semibold text-gray-900">Confirm Introduction Request</h2>
          <p className="text-xs text-gray-600 mt-1">
            Request an introduction to {contactName} at {company}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          {/* Credits display */}
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-full mb-3">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-yellow-800">{credits}</span>
                <Crown className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Credits Required
            </h3>
          </div>

          {/* Explanation */}
          <div className="text-xs text-gray-600 space-y-2">
            <p>
              <strong>{credits} credits</strong> will be spent only if your request is accepted.
            </p>
            <p>
              You&apos;ll be notified once they respond.
            </p>
          </div>
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
            onClick={onConfirm}
            size="sm"
            className="flex-1 h-8 text-xs">
            Accept & Send
          </Button>
        </div>
      </div>
    </div>
  );
}; 