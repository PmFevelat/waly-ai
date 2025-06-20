'use client';

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export const InvoicesBilling = () => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Invoices & Billing</h2>
            <p className="text-xs text-gray-600 mt-1">Manage your invoice history and billing details for your subscriptions</p>
          </div>
          <Button 
            size="sm"
            variant="outline" 
            className="text-xs h-6 px-3 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Manage Billing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 