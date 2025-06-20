'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

// Données factices pour l'historique des crédits
const creditHistory = [
  {
    id: 1,
    introName: "Introduction email to Sarah Johnson",
    date: "2025-01-20",
    cost: 2,
    type: "intro"
  },
  {
    id: 2,
    introName: "Follow-up email to Michael Chen",
    date: "2025-01-19",
    cost: 1,
    type: "follow-up"
  },
  {
    id: 3,
    introName: "Introduction email to Emma Williams",
    date: "2025-01-18",
    cost: 2,
    type: "intro"
  },
  {
    id: 4,
    introName: "Introduction email to David Brown",
    date: "2025-01-17",
    cost: 2,
    type: "intro"
  },
  {
    id: 5,
    introName: "Follow-up email to Lisa Anderson",
    date: "2025-01-16",
    cost: 1,
    type: "follow-up"
  }
]

export const CreditsContent: React.FC = () => {
  const totalCredits = 7

  return (
    <div className="space-y-6">
      {/* Section crédits restants - même alignement que My Account */}
      <div className="mb-6">
        <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-0.5">Total Credits Left</h2>
              <p className="text-xl font-bold text-gray-900">{totalCredits}</p>
            </div>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-lg text-xs h-6">
            ↗ Get more credits
          </Button>
        </div>
      </Card>
      </div>

      {/* Section historique des crédits */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Credit consumption details</h3>
        </div>

        {/* Table d'historique - style épuré Notion/Clay */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Introduction Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="pl-16 pr-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits Used
                </th>
              </tr>
            </thead>
            <tbody>
              {creditHistory.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50/50 transition-colors ${
                    index !== creditHistory.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <td className="px-0 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {item.introName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="pl-16 pr-8 py-3">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-3 h-3 text-yellow-600" />
                      <span className="text-sm text-gray-900 font-medium">{item.cost}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* CTA discret en fin de table */}
          <div className="border-t border-gray-200 pt-3 mt-2">
            <div className="flex justify-center">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1">
                <span className="text-gray-400">+</span>
                Show more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 