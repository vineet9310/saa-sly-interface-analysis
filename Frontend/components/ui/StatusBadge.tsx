import React from 'react'
import { ProjectStatus, UserRole } from '@/lib/types'

interface StatusBadgeProps {
  status: ProjectStatus | UserRole | string
  type?: 'status' | 'role'
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'In Progress':
        return 'badge-blue'
      case 'Completed':
        return 'badge-green'
      case 'Not Started':
        return 'badge-gray'
      case 'Archived':
        return 'badge-muted'
      case 'Owner':
        return 'badge-emerald'
      case 'Admin':
        return 'badge-blue'
      case 'Member':
        return 'badge-neutral'
      case 'Viewer':
        return 'badge-muted'
      case 'Active':
        return 'badge-green'
      case 'Invited':
        return 'badge-amber'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <span className={`status-badge ${getBadgeStyle()}`}>
      {status}
    </span>
  )
}
