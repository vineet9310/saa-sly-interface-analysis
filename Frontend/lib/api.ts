import { Project, TeamMember, User, MetricStat, AppNotification } from './types'
import {
  initialCurrentUser,
  initialProjects,
  initialTeamMembers,
  initialStats,
  initialNotifications,
  revenueMonthlyData,
} from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper to check if running in browser
const isClient = typeof window !== 'undefined'

// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'saasly_token',
  USER: 'saasly_user',
  PROJECTS: 'saasly_projects',
  TEAM: 'saasly_team',
  NOTIFS: 'saasly_notifications',
}

// Local Storage Helper
function getLocal<T>(key: string, fallback: T): T {
  if (!isClient) return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!isClient) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to set localStorage', e)
  }
}

// Base Fetcher with graceful fallback
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; isFallback: boolean }> {
  const token = isClient ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.message || `Request failed: ${res.status}`)
    }

    const data = await res.json()
    return { data, isFallback: false }
  } catch (err) {
    // If backend connection fails, we log and indicate fallback mode
    return { data: null as unknown as T, isFallback: true }
  }
}

export const api = {
  auth: {
    async login(email: string, password?: string): Promise<User> {
      const { data, isFallback } = await request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!isFallback && data?.user) {
        if (isClient) localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        setLocal(STORAGE_KEYS.USER, data.user)
        return data.user
      }

      // Fallback
      const user: User = {
        ...initialCurrentUser,
        email: email || initialCurrentUser.email,
        name: email.split('@')[0].replace('.', ' ') || 'Alex Carter',
      }
      if (isClient) localStorage.setItem(STORAGE_KEYS.TOKEN, 'demo_jwt_token_saasly')
      setLocal(STORAGE_KEYS.USER, user)
      return user
    },

    async register(name: string, email: string, password?: string): Promise<User> {
      const { data, isFallback } = await request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      if (!isFallback && data?.user) {
        if (isClient) localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        setLocal(STORAGE_KEYS.USER, data.user)
        return data.user
      }

      // Fallback
      const user: User = {
        ...initialCurrentUser,
        name,
        email,
      }
      if (isClient) localStorage.setItem(STORAGE_KEYS.TOKEN, 'demo_jwt_token_saasly')
      setLocal(STORAGE_KEYS.USER, user)
      return user
    },

    async me(): Promise<User | null> {
      const localUser = getLocal<User | null>(STORAGE_KEYS.USER, null)
      const { data, isFallback } = await request<{ user: User }>('/auth/me')

      if (!isFallback && data?.user) {
        setLocal(STORAGE_KEYS.USER, data.user)
        return data.user
      }

      return localUser || initialCurrentUser
    },

    logout() {
      if (isClient) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    },
  },

  projects: {
    async getAll(): Promise<Project[]> {
      const cached = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects)
      const { data, isFallback } = await request<{ projects: Project[] }>('/projects')
      if (!isFallback && data?.projects) {
        setLocal(STORAGE_KEYS.PROJECTS, data.projects)
        return data.projects
      }
      return cached
    },

    async create(project: Partial<Project>): Promise<Project> {
      const { data, isFallback } = await request<{ project: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      })

      const newProj: Project = !isFallback && data?.project ? data.project : {
        id: `proj_${Date.now()}`,
        name: project.name || 'New Project',
        description: project.description || '',
        team: project.team || [{ id: '1', name: 'Alex Carter' }],
        progress: project.progress || 0,
        status: project.status || 'Not Started',
        dueDate: project.dueDate || 'May 30, 2024',
        budget: project.budget || '$10,000',
        category: project.category || 'General',
      }

      const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects)
      setLocal(STORAGE_KEYS.PROJECTS, [newProj, ...existing])
      return newProj
    },

    async update(id: string, updates: Partial<Project>): Promise<Project> {
      const { data, isFallback } = await request<{ project: Project }>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })

      const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects)
      const updatedList = existing.map(p => (p.id === id ? { ...p, ...updates } : p))
      setLocal(STORAGE_KEYS.PROJECTS, updatedList)
      return !isFallback && data?.project ? data.project : updatedList.find(p => p.id === id)!
    },

    async delete(id: string): Promise<boolean> {
      await request(`/projects/${id}`, { method: 'DELETE' })
      const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects)
      setLocal(STORAGE_KEYS.PROJECTS, existing.filter(p => p.id !== id))
      return true
    },
  },

  team: {
    async getAll(): Promise<TeamMember[]> {
      const cached = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, initialTeamMembers)
      const { data, isFallback } = await request<{ members: TeamMember[] }>('/teams')
      if (!isFallback && data?.members) {
        setLocal(STORAGE_KEYS.TEAM, data.members)
        return data.members
      }
      return cached
    },

    async invite(member: { name: string; email: string; role: TeamMember['role'] }): Promise<TeamMember> {
      const { data, isFallback } = await request<{ member: TeamMember }>('/teams/invite', {
        method: 'POST',
        body: JSON.stringify(member),
      })

      const newMember: TeamMember = !isFallback && data?.member ? data.member : {
        id: `tm_${Date.now()}`,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`,
        status: 'Active',
        joinedAt: 'Just now',
      }

      const existing = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, initialTeamMembers)
      setLocal(STORAGE_KEYS.TEAM, [...existing, newMember])
      return newMember
    },

    async updateRole(id: string, role: TeamMember['role']): Promise<boolean> {
      await request(`/teams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
      const existing = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, initialTeamMembers)
      setLocal(STORAGE_KEYS.TEAM, existing.map(m => m.id === id ? { ...m, role } : m))
      return true
    },

    async remove(id: string): Promise<boolean> {
      await request(`/teams/${id}`, { method: 'DELETE' })
      const existing = getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, initialTeamMembers)
      setLocal(STORAGE_KEYS.TEAM, existing.filter(m => m.id !== id))
      return true
    },
  },

  analytics: {
    async getStats(): Promise<MetricStat[]> {
      const { data, isFallback } = await request<{ stats: MetricStat[] }>('/analytics/stats')
      if (!isFallback && data?.stats) return data.stats
      return initialStats
    },

    async getMonthlyRevenue() {
      const { data, isFallback } = await request<{ data: typeof revenueMonthlyData }>('/analytics/revenue')
      if (!isFallback && data?.data) return data.data
      return revenueMonthlyData
    },
  },

  notifications: {
    async getAll(): Promise<AppNotification[]> {
      const cached = getLocal<AppNotification[]>(STORAGE_KEYS.NOTIFS, initialNotifications)
      return cached
    },
    async markAsRead(id: string): Promise<void> {
      const existing = getLocal<AppNotification[]>(STORAGE_KEYS.NOTIFS, initialNotifications)
      setLocal(STORAGE_KEYS.NOTIFS, existing.map(n => n.id === id ? { ...n, read: true } : n))
    },
  },
}
