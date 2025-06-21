'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InviteMemberModal } from './invite-member-modal'

interface Member {
  id: number
  name?: string
  email: string
  permission: string
  status: 'active' | 'invited'
}

// Données factices pour les membres
const initialMembers: Member[] = [
  {
    id: 1,
    name: "Pierre-Marie Fevelat",
    email: "pierre-marie.fevelat@hec.edu",
    permission: "Owner",
    status: "active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@hec.edu", 
    permission: "Admin",
    status: "active"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@hec.edu",
    permission: "Member",
    status: "active"
  },
  {
    id: 4,
    name: "Emma Williams",
    email: "emma.williams@hec.edu",
    permission: "Member",
    status: "active"
  }
]

export const MembersContent: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [members, setMembers] = useState<Member[]>(initialMembers)

  const handleInviteMember = (invitedMembers: { email: string; permission: string }[]) => {
    // Créer les nouveaux membres avec statut "invited"
    const newMembers = invitedMembers.map((invitedMember, index) => ({
      id: Math.max(...members.map(m => m.id)) + index + 1,
      email: invitedMember.email,
      permission: invitedMember.permission,
      status: 'invited' as const
    }))

    // Ajouter les nouveaux membres à la liste
    setMembers(prevMembers => [...prevMembers, ...newMembers])
    
    // TODO: Appeler l'API pour inviter les membres
    console.log('Inviting members:', invitedMembers)
  }

  const getStatusBadge = (status: 'active' | 'invited') => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">
          Active
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 text-xs">
          Invited
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Section titre et bouton invite */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Members</h1>
          <p className="text-sm text-gray-600">Manage who has access to this workspace.</p>
        </div>
        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-lg text-xs h-8 flex items-center gap-1"
        >
          <span className="text-sm">+</span>
          Invite members
        </Button>
      </div>

      {/* Table des membres - style épuré Notion/Clay */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="pl-8 pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="pl-8 pr-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr 
                key={member.id} 
                className={`hover:bg-gray-50/50 transition-colors ${
                  index !== members.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <td className="px-0 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.name || member.email.split('@')[0]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.email}
                    </div>
                  </div>
                </td>
                <td className="pl-8 pr-4 py-3">
                  <div className="text-sm text-gray-900">
                    {member.permission}
                  </div>
                </td>
                <td className="pl-8 pr-8 py-3">
                  {getStatusBadge(member.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </div>
  )
} 