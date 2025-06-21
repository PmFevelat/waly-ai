'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface Member {
  id: number
  email: string
  permission: string
  isDropdownOpen: boolean
}

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (members: { email: string; permission: string }[]) => void
}

export const InviteMemberModal = ({ 
  isOpen, 
  onClose, 
  onInvite 
}: InviteMemberModalProps) => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, email: '', permission: 'Admin', isDropdownOpen: false }
  ])
  const modalRef = useRef<HTMLDivElement>(null)

  const permissions = [
    {
      name: 'Admin',
      description: 'Manage Billing, Invite Teammates, Create Introductions, Access all features'
    },
    {
      name: 'Member', 
      description: 'Create Introductions, View contacts'
    }
  ]

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        // Vérifier si le clic est sur un dropdown ouvert
        const clickedElement = event.target as HTMLElement
        const isClickOnDropdown = clickedElement.closest('[data-dropdown]')
        
        if (!isClickOnDropdown) {
          // Fermer tous les dropdowns
          setMembers(prevMembers => 
            prevMembers.map(member => ({ 
              ...member, 
              isDropdownOpen: false 
            }))
          )
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const updateMember = (id: number, field: keyof Member, value: string | boolean) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    )
  }

  const addMember = () => {
    const newId = Math.max(...members.map(m => m.id)) + 1
    setMembers([...members, { id: newId, email: '', permission: 'Admin', isDropdownOpen: false }])
  }

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id))
    }
  }

  const handleInvite = () => {
    const validMembers = members.filter(member => member.email.trim())
    if (validMembers.length > 0) {
      onInvite(validMembers.map(({ email, permission }) => ({ email, permission })))
      setMembers([{ id: 1, email: '', permission: 'Admin', isDropdownOpen: false }])
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 bg-gray-900 bg-opacity-5 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}>
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Invite members</h2>
          <p className="text-xs text-gray-600 mt-1">
            Enter the email address of member you would like to invite, and choose permissions they should have.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <Label className="text-xs font-medium text-gray-700">Email Address</Label>
            </div>
            <div className="col-span-6">
              <Label className="text-xs font-medium text-gray-700">Permissions</Label>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="grid grid-cols-12 gap-3 items-center">
                {/* Email Input */}
                <div className="col-span-5">
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    placeholder="john@doe.com"
                    className="h-8 text-sm"
                    style={{ border: '1px solid #E6E6E6' }}
                  />
                </div>

                {/* Permissions Dropdown */}
                <div className="col-span-6 relative" data-dropdown>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Fermer tous les autres dropdowns
                      setMembers(prevMembers => 
                        prevMembers.map(m => ({
                          ...m,
                          isDropdownOpen: m.id === member.id ? !m.isDropdownOpen : false
                        }))
                      )
                    }}
                    className="w-full h-8 px-3 text-left text-sm bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-900">{member.permission}</span>
                    {member.isDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {member.isDropdownOpen && (
                    <div className="absolute top-9 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50" data-dropdown>
                      {permissions.map((perm) => (
                        <button
                          key={perm.name}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Selecting permission:', perm.name, 'for member:', member.id)
                            setMembers(prevMembers => 
                              prevMembers.map(m => 
                                m.id === member.id 
                                  ? { ...m, permission: perm.name, isDropdownOpen: false }
                                  : m
                              )
                            )
                          }}
                          className="w-full p-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                        >
                          <div className="text-sm text-gray-900">
                            {perm.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-center">
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Button */}
          <div>
            <button
              type="button"
              onClick={addMember}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Member
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-xs h-6 px-3"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleInvite}
            disabled={!members.some(member => member.email.trim())}
            className="bg-black text-white hover:bg-gray-800 text-xs h-6 px-3"
          >
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  )
} 