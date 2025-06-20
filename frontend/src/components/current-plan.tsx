'use client';

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const CurrentPlan = () => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
      <CardContent className="p-3">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Current Plan</h2>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">Professional Plan</h3>
            <p className="text-xs text-gray-600">500 credits per month</p>
            <p className="text-xs text-gray-500">Next billing: March 15, 2025</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-lg font-bold text-gray-900">$29/month</p>
            <Button 
              size="sm"
              variant="outline" 
              className="text-xs h-6 px-3"
            >
              Change Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};