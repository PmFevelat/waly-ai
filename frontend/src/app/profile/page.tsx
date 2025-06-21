'use client';

import { useState } from 'react';
import { ProfileHeader } from '@/components/profile-header'
import { IntrosFooter } from '@/components/intros-footer'
import { WhatsAppPrepModal } from '@/components/whatsapp-prep-modal'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-background flex flex-col">
      <ProfileHeader />
      
      <main className="flex-1 pt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 min-h-full">
          {/* Grid container with 12 columns */}
          <div className="grid grid-cols-12 gap-6">
            {/* Content area - 8 columns on desktop, full width on mobile */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              {/* Header section */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">My Interview</h1>
                {/* Espacement supplémentaire pour aligner avec la page intros */}
                <div className="h-9"></div>
              </div>

              {/* Empty state */}
              <div className="space-y-4 pb-16">
                <div className="text-center py-12">
                  <Image
                    src="/images/emptystate.png"
                    alt="No interview done yet"
                    width={120}
                    height={120}
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No interview done yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Ready to get matched with your target accounts? Let&apos;s start the conversation.
                  </p>
                  <Button
                    onClick={handleOpenModal}
                    size="sm"
                    className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800 h-6">
                    <MessageCircle className="mr-2 h-3 w-3" />
                    <span className="text-nowrap">Message me on WhatsApp</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <IntrosFooter />
      
      {/* Modal */}
      <WhatsAppPrepModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  )
} 