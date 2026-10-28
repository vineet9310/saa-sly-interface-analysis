export type UserRole = 'Owner' | 'Admin' | 'Member' | 'Viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  company?: string
  plan?: 'Starter' | 'Pro' | 'Business'
  createdAt?: string
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'Not Started' | 'Archived'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status: 'Active' | 'Invited' | 'Suspended'
  joinedAt?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  team: Array<{
    id: string
    name: string
    avatar?: string
  }>
  progress: number
  status: ProjectStatus
  dueDate: string
  budget?: string
  category?: string
  createdAt?: string
}

export interface Activity {
  id: string
  title: string
  time: string
  color: 'blue' | 'violet' | 'green' | 'purple' | 'orange'
  timestamp?: string
  user?: string
}

export interface MetricStat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  caption: string
  iconType?: string
}

export interface AppNotification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'project' | 'payment' | 'user' | 'system'
}
