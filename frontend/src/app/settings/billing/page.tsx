'use client'
import React from 'react'
import { IntrosHeader } from '@/components/intros-header'
import { IntrosFooter } from '@/components/intros-footer'
import { SettingsSidebar } from '@/components/settings-sidebar'
import { CurrentPlan } from '@/components/current-plan'
import { InvoicesBilling } from '@/components/invoices-billing'

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-background flex flex-col">
      <IntrosHeader />
      
      <main className="flex-1 pt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 min-h-full">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - à gauche, réduite avec même espacement */}
            <div className="col-span-12 lg:col-span-2">
              <div className="mb-6">
                <SettingsSidebar activeItem="billing" />
              </div>
            </div>
            
            {/* Content principal - même largeur et position que /profile */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Billing & Plans</h1>
                <p className="text-sm text-gray-600">Manage your subscription and billing information.</p>
              </div>
              
              <div className="space-y-4 pb-16">
                <CurrentPlan />
                <InvoicesBilling />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <IntrosFooter />
    </div>
  )
} 