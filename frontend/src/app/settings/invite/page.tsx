'use client'
import React from 'react'
import { IntrosHeader } from '@/components/intros-header'
import { IntrosFooter } from '@/components/intros-footer'
import { SettingsSidebar } from '@/components/settings-sidebar'
import { MembersContent } from '@/components/members-content'

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-background flex flex-col">
      <IntrosHeader />
      
      <main className="flex-1 pt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 min-h-full">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - à gauche, réduite avec même espacement */}
            <div className="col-span-12 lg:col-span-2">
              <div className="mb-6">
                <SettingsSidebar activeItem="members" />
              </div>
            </div>
            
            {/* Content principal - même largeur et position que /profile */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              <div className="space-y-4 pb-16">
                <MembersContent />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <IntrosFooter />
    </div>
  )
} 