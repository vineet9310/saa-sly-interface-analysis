'use client'

import React, { useState } from 'react'
import { Modal } from './Modal'
import { TeamMember, UserRole } from '@/lib/types'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (data: { name: string; email: string; role: UserRole }) => void
}

export function InviteModal({ isOpen, onClose, onInvite }: InviteModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Member')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter member name')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    onInvite({ name: name.trim(), email: email.trim(), role })
    setName('')
    setEmail('')
    setRole('Member')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
          <select
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="Admin">Admin (Full access to all resources)</option>
            <option value="Member">Member (Can edit and manage assigned projects)</option>
            <option value="Viewer">Viewer (Read-only access)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="button button-outline text-xs px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary text-xs px-4 py-2"
          >
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  )
}
