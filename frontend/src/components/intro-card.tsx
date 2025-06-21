import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, Crown } from 'lucide-react'
import Image from 'next/image'
import { IntroRequestModal } from './intro-request-modal'
import { IntroAcceptModal } from './intro-accept-modal'
import { IntroEmailModal } from './intro-email-modal'

interface Intro {
  id: number
  industry: string
  company: string
  description: string
  avatar?: string
  type?: 'suggested' | 'received' | 'requested' | 'accepted'
  credits?: number
  category?: 'Internal Influence' | 'Internal Stakes'
}

interface IntroCardProps {
  intro: Intro
  onRemove?: () => void
  onStatusChange?: (id: number, newType: 'suggested' | 'received' | 'requested' | 'accepted') => void
}

export const IntroCard = ({ intro, onRemove, onStatusChange }: IntroCardProps) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleRequestClick = () => {
    if (intro.type === 'suggested') {
      setIsRequestModalOpen(true);
    } else if (intro.type === 'received') {
      setIsAcceptModalOpen(true);
    }
  };

  const handleConfirmRequest = () => {
    // Ici on pourrait faire l'appel API pour demander l'intro
    console.log('Intro requested for', intro.industry, 'at', intro.company);
    setIsRequestModalOpen(false);
    // Changer le statut de l'intro à "requested"
    if (onStatusChange) {
      onStatusChange(intro.id, 'requested');
    }
  };

  const handleConfirmAccept = () => {
    // Ici on pourrait faire l'appel API pour accepter l'intro
    console.log('Intro accepted for', intro.industry, 'at', intro.company);
    setIsAcceptModalOpen(false);
    // Changer le statut de l'intro à "accepted"
    if (onStatusChange) {
      onStatusChange(intro.id, 'accepted');
    }
  };

  return (
    <>
    <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2 relative" style={{ border: '1px solid #E6E6E6' }}>
      {/* Status chips */}
      {intro.type === 'received' && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Received
          </span>
        </div>
      )}
      {intro.type === 'requested' && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            Requested
          </span>
        </div>
      )}
      {intro.type === 'accepted' && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Accepted
          </span>
        </div>
      )}
      
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          {/* Header content */}
          <div className={`flex items-start space-x-2 ${intro.type === 'received' || intro.type === 'requested' || intro.type === 'accepted' ? 'pr-20' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              {intro.avatar ? (
                <Image
                  src={intro.avatar}
                  alt={`${intro.company} avatar`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-contain bg-gray-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                User in {intro.industry}
              </h3>
              <div className="mb-1">
                <span className="text-xs text-gray-600">Matched on: </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {intro.company}
                </span>
              </div>
              {/* Category chip */}
              {intro.category && (
                <div className="mb-2 -ml-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {intro.category}
                  </span>
                </div>
              )}
              <p className="text-gray-700 text-xs leading-relaxed">
                {intro.description}
              </p>
            </div>
          </div>

          {/* Action buttons - déplacés en bas */}
          <div className="flex items-center justify-end space-x-2 pt-1">
            {intro.type !== 'accepted' && (
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs text-gray-600 border-gray-300 hover:bg-gray-50 h-6"
                onClick={onRemove}>
                {intro.type === 'requested' ? 'Cancel' : 'Not now'}
              </Button>
            )}
            {intro.type !== 'accepted' && (
              <Button
                size="sm"
                className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800 h-6 flex items-center gap-1"
                onClick={handleRequestClick}>
                {intro.credits && (
                  <>
                    <span>{intro.credits}</span>
                    <Crown className="w-3 h-3" />
                  </>
                )}
                {intro.type === 'suggested' ? 'Request' : intro.type === 'received' ? 'Accept' : 'Pending'}
              </Button>
            )}
            {intro.type === 'accepted' && (
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs text-gray-600 border-gray-300 hover:bg-gray-50 h-6"
                  onClick={() => setIsEmailModalOpen(true)}>
                  View introduction email
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Request Modal */}
    <IntroRequestModal
      isOpen={isRequestModalOpen}
      onClose={() => setIsRequestModalOpen(false)}
      onConfirm={handleConfirmRequest}
      credits={intro.credits || 0}
      contactName={`User in ${intro.industry}`}
      company={intro.company}
    />

    {/* Accept Modal */}
    <IntroAcceptModal
      isOpen={isAcceptModalOpen}
      onClose={() => setIsAcceptModalOpen(false)}
      onConfirm={handleConfirmAccept}
      credits={intro.credits || 0}
      contactName={`User in ${intro.industry}`}
      company={intro.company}
    />

    {/* Email Modal */}
    <IntroEmailModal
      isOpen={isEmailModalOpen}
      onClose={() => setIsEmailModalOpen(false)}
      fromUser="You"
      toUser={`User in ${intro.industry}`}
      fromCompany="Your Company"
      toCompany={intro.company}
      industry={intro.industry}
      category={intro.category || ''}
    />
    </>
  )
} 