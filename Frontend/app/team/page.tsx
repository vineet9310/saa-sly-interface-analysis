'use client'

import React, { useState } from 'react'
import { Plus, Search, MoreHorizontal, Mail, Shield, UserMinus } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { InviteModal } from '@/components/ui/InviteModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useData } from '@/context/DataContext'
import { TeamMember, UserRole } from '@/lib/types'

export default function TeamPage() {
  const { team, inviteMember, updateMemberRole, removeMember } = useData()

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('All')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  const filteredMembers = team.filter((m) => {
    if (roleFilter !== 'All' && m.role !== roleFilter) return false
    if (
      searchQuery &&
      !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const handleInvite = (data: { name: string; email: string; role: UserRole }) => {
    inviteMember(data)
  }

  const handleOpenRemove = (member: TeamMember) => {
    setMemberToRemove(member)
    setRemoveDialogOpen(true)
    setActionMenuOpen(null)
  }

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeMember(memberToRemove.id)
      setMemberToRemove(null)
    }
  }

  const handleChangeRole = (memberId: string, role: UserRole) => {
    updateMemberRole(memberId, role)
    setActionMenuOpen(null)
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Team Members</h1>
          <p className="dash-page-subtitle">
            Invite and manage your team members and permissions.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="button button-primary text-xs py-2.5 px-4 font-semibold"
        >
          <Plus size={15} /> Invite Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-1.5 text-xs"
          />
        </div>

        {/* Role Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {['All', 'Owner', 'Admin', 'Member'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                roleFilter === role
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="table-th">User</th>
              <th className="table-th">Role</th>
              <th className="table-th">Status</th>
              <th className="table-th">Joined</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                  No members found matching your query.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center font-bold text-slate-600 text-xs">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-900">
                          {m.name}
                        </strong>
                        <span className="block text-[11px] text-slate-400">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="table-td">
                    <StatusBadge status={m.role} type="role" />
                  </td>

                  <td className="table-td">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {m.status}
                    </span>
                  </td>

                  <td className="table-td text-xs text-slate-500">
                    {m.joinedAt || 'Jan 2024'}
                  </td>

                  <td className="table-td text-right relative">
                    {m.role !== 'Owner' ? (
                      <>
                        <button
                          className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                          onClick={() =>
                            setActionMenuOpen(actionMenuOpen === m.id ? null : m.id)
                          }
                          aria-label="Member options"
                        >
                          <MoreHorizontal size={15} />
                        </button>

                        {actionMenuOpen === m.id && (
                          <div className="absolute right-4 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 w-36 text-left">
                            <button
                              onClick={() =>
                                handleChangeRole(
                                  m.id,
                                  m.role === 'Admin' ? 'Member' : 'Admin'
                                )
                              }
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Shield size={12} />
                              Make {m.role === 'Admin' ? 'Member' : 'Admin'}
                            </button>
                            <button
                              onClick={() => handleOpenRemove(m)}
                              className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <UserMinus size={12} /> Remove Member
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Workspace Owner</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
      />

      {/* Remove Member Confirmation Dialog */}
      <ConfirmDialog
        isOpen={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.name} (${memberToRemove?.email}) from the workspace? They will immediately lose access.`}
        confirmText="Remove"
        danger={true}
      />
    </DashboardLayout>
  )
}
