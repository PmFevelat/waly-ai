'use client'
import React from 'react'
import Link from 'next/link'
import { Crown } from 'lucide-react'

interface CreditCounterProps {
  credits?: number
}

export const CreditCounter: React.FC<CreditCounterProps> = ({ credits = 7 }) => {
  return (
    <Link 
      href="/settings/credits"
      className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full hover:bg-yellow-100 hover:border-yellow-300 transition-colors cursor-pointer"
    >
      {/* Icône de couronne */}
      <Crown className="w-3 h-3 text-yellow-600" />
      {/* Texte "Credits" */}
      <span className="text-xs font-medium text-yellow-800">{credits} Credits</span>
    </Link>
  )
} 