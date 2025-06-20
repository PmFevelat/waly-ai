'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
  className?: string
}

export const UserDropdown = ({ className }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none">
        <Image
          src="/images/avatar2.png"
          alt="Profile avatar"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full object-contain bg-gray-100 hover:ring-2 hover:ring-gray-200 transition-all"
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User info section */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/avatar2.png"
                alt="Profile avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-contain bg-gray-100"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-0.5">
            <Link
              href="/settings/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}>
              My Account
            </Link>
            <Link
              href="/settings/billing"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}>
              Billing & Plans
            </Link>
            <Link
              href="/settings/credits"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}>
              Credits Consumption
            </Link>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Logout */}
          <div className="py-0.5">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 