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
export const STORAGE_KEYS = {
  TOKEN: 'saasly_token',
  USER: 'saasly_user',
  PROJECTS: 'saasly_projects',
  TEAM: 'saasly_team',
  NOTIFS: 'saasly_notifications',
}

function getStoredToken(): string | null {
  if (!isClient) return null
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

function getStoredUser(): User | null {
  if (!isClient) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Robust API Request with proper HTTP error handling
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`
    try {
      const errBody = await res.json()
      if (errBody && errBody.message) {
        errorMessage = errBody.message
      }
    } catch {
      // Non-JSON response
    }

    if (res.status === 401 && isClient) {
      // Clear token if server explicitly invalidated it
      if (token && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }

    throw new Error(errorMessage)
  }

  return res.json()
}

export const api = {
  auth: {
    async login(email: string, password?: string): Promise<User> {
      const data = await request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (isClient && data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      }
      return data.user
    },

    async demoLogin(): Promise<User> {
      const data = await request<{ user: User; token: string }>('/auth/demo-login', {
        method: 'POST',
      })

      if (isClient && data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      }
      return data.user
    },

    async register(name: string, email: string, password?: string): Promise<User> {
      const data = await request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      if (isClient && data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      }
      return data.user
    },

    async me(): Promise<User | null> {
      const token = getStoredToken()
      if (!token) return null

      try {
        const data = await request<{ user: User }>('/auth/me')
        if (data?.user && isClient) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        }
        return data.user
      } catch (err) {
        // Token was invalid or server was unreachable
        if (isClient) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
        return null
      }
    },

    async updateProfile(updates: Partial<User>): Promise<User> {
      const data = await request<{ user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      if (isClient && data?.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      }
      return data.user
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
      return request<{ message: string }>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
    },

    logout() {
      if (isClient) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.PROJECTS)
        localStorage.removeItem(STORAGE_KEYS.TEAM)
        localStorage.removeItem(STORAGE_KEYS.NOTIFS)
      }
    },
  },

  projects: {
    async getAll(): Promise<Project[]> {
      try {
        const data = await request<{ projects: Project[] }>('/projects')
        return data.projects || []
      } catch (err) {
        console.warn('Projects API request failed:', err)
        return []
      }
    },

    async create(project: Partial<Project>): Promise<Project> {
      const data = await request<{ project: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      })
      return data.project
    },

    async update(id: string, updates: Partial<Project>): Promise<Project> {
      const data = await request<{ project: Project }>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return data.project
    },

    async delete(id: string): Promise<boolean> {
      await request(`/projects/${id}`, { method: 'DELETE' })
      return true
    },
  },

  team: {
    async getAll(): Promise<TeamMember[]> {
      try {
        const data = await request<{ members: TeamMember[] }>('/teams')
        return data.members || []
      } catch (err) {
        console.warn('Teams API request failed:', err)
        return []
      }
    },

    async invite(member: { name: string; email: string; role: TeamMember['role'] }): Promise<TeamMember> {
      const data = await request<{ member: TeamMember }>('/teams/invite', {
        method: 'POST',
        body: JSON.stringify(member),
      })
      return data.member
    },

    async updateRole(id: string, role: TeamMember['role']): Promise<TeamMember> {
      const data = await request<{ message: string; member: TeamMember }>(`/teams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
      return data.member
    },

    async remove(id: string): Promise<boolean> {
      await request(`/teams/${id}`, { method: 'DELETE' })
      return true
    },
  },

  analytics: {
    async getStats(): Promise<MetricStat[]> {
      try {
        const data = await request<{ stats: MetricStat[] }>('/analytics/stats')
        return data.stats || []
      } catch (err) {
        console.warn('Analytics stats API request failed:', err)
        return initialStats
      }
    },

    async getMonthlyRevenue(): Promise<Array<{ name: string; revenue: number; users: number }>> {
      try {
        const data = await request<{ data: Array<{ name: string; revenue: number; users: number }> }>('/analytics/revenue')
        return data.data || []
      } catch (err) {
        console.warn('Analytics revenue API request failed:', err)
        return revenueMonthlyData
      }
    },
  },

  notifications: {
    async getAll(): Promise<AppNotification[]> {
      if (!isClient) return initialNotifications
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.NOTIFS)
        return raw ? JSON.parse(raw) : initialNotifications
      } catch {
        return initialNotifications
      }
    },
    async markAsRead(id: string): Promise<void> {
      if (!isClient) return
      try {
        const notifs = await api.notifications.getAll()
        const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n))
        localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(updated))
      } catch {}
    },
  },
}
