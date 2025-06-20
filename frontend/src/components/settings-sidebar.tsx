'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SettingsSidebarProps {
  activeItem?: string
}

const sidebarItems = [
  {
    id: 'account',
    name: 'My account',
    href: '/settings/account',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
  {
    id: 'billing',
    name: 'Billing & Plans',
    href: '/settings/billing',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    id: 'credits',
    name: 'Credits Consumption',
    href: '/settings/credits',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C17.523 2 22 6.477 22 12s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 1a7 7 0 110 14 7 7 0 010-14zm-1 2v2h-1v2h1v2h2v-2h1v-2h-1V7h-2zm1 2v2h-1v-2h1z"/>
      </svg>
    )
  }
]

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeItem }) => {
  return (
    <div className="space-y-1">
      {sidebarItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "flex items-center gap-2 pl-2 pr-42 py-1.5 text-sm rounded-lg transition-colors",
            activeItem === item.id
              ? "bg-gray-200 text-gray-900 font-medium"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <span className={cn(
            "w-4 h-4",
            activeItem === item.id ? "text-gray-800" : "text-gray-400"
          )}>
            {item.icon}
          </span>
          <span className="whitespace-nowrap">{item.name}</span>
        </Link>
      ))}
    </div>
  )
} 