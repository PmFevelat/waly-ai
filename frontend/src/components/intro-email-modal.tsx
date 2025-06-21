'use client';

import { Button } from '@/components/ui/button'

interface IntroEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromUser: string;
  toUser: string;
  fromCompany: string;
  toCompany: string;
  industry: string;
  category: string;
}

export const IntroEmailModal = ({ 
  isOpen, 
  onClose, 
  fromUser,
  toUser,
  fromCompany,
  toCompany,
  industry,
  category
}: IntroEmailModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 bg-opacity-5 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Introduction Email</h2>
          <p className="text-xs text-gray-600 mt-1">
            Connection facilitated between {fromUser} and {toUser}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* To Section */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-700">To:</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-900">{fromUser} ({fromCompany}), {toUser} ({toCompany})</p>
            </div>
          </div>

          {/* Subject Section */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-700">Subject:</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-900">Introduction: {fromUser} ({fromCompany}) ↔ {toUser} ({toCompany})</p>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-700">Body:</span>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-900 space-y-3">
              <p>Hi {fromUser} and {toUser},</p>
              
              <p>
                I&apos;m excited to introduce you both as I believe there&apos;s great potential for a valuable exchange 
                between your organizations.
              </p>

              <div>
                <p className="font-medium">{fromUser} ({fromCompany}):</p>
                <p className="text-gray-700 ml-2">
                  {category === 'Internal Influence' 
                    ? `Has strong relationships with key decision makers in the ${industry} space and valuable insights into organizational dynamics.`
                    : `Deep understanding of market dynamics and strategic challenges facing companies in the ${industry} industry.`
                  }
                </p>
              </div>

              <div>
                <p className="font-medium">{toUser} ({toCompany}):</p>
                <p className="text-gray-700 ml-2">
                  {category === 'Internal Influence'
                    ? `Looking to expand their network and understand internal processes and decision-making structures in similar organizations.`
                    : `Seeking insights into industry trends and strategic approaches to navigate current market challenges.`
                  }
                </p>
              </div>

              <p>
                I believe this connection could be mutually beneficial for both parties. Feel free to 
                continue the conversation directly, and I hope this leads to a productive exchange.
              </p>

              <p>
                Best regards,<br/>
                Waly
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <Button
            onClick={onClose}
            size="sm"
            className="w-full h-8 text-xs bg-black text-white hover:bg-gray-800">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}; 