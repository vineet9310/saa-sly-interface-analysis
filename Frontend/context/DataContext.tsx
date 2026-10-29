'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Project, TeamMember, MetricStat, AppNotification, Activity } from '@/lib/types'
import { api } from '@/lib/api'
import { initialStats, initialActivities } from '@/lib/mock-data'
import { useAuth } from './AuthContext'

interface DataContextType {
  projects: Project[]
  team: TeamMember[]
  stats: MetricStat[]
  activities: Activity[]
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  reload: () => Promise<void>
  createProject: (data: Partial<Project>) => Promise<Project>
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<boolean>
  inviteMember: (data: { name: string; email: string; role: TeamMember['role'] }) => Promise<TeamMember>
  updateMemberRole: (id: string, role: TeamMember['role']) => Promise<TeamMember>
  removeMember: (id: string) => Promise<boolean>
  markNotificationRead: (id: string) => void
  addActivity: (title: string, color?: Activity['color']) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<MetricStat[]>(initialStats)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) {
      setProjects([])
      setTeam([])
      setStats(initialStats)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [projList, teamList, statsList, notifList] = await Promise.all([
        api.projects.getAll(),
        api.team.getAll(),
        api.analytics.getStats(),
        api.notifications.getAll(),
      ])
      setProjects(projList)
      setTeam(teamList)
      setStats(statsList && statsList.length > 0 ? statsList : initialStats)
      setNotifications(notifList)
    } catch (err) {
      console.error('Error loading workspace data:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const addActivity = (title: string, color: Activity['color'] = 'blue') => {
    const newAct: Activity = {
      id: `act_${Date.now()}`,
      title,
      time: 'Just now',
      color,
    }
    setActivities((prev) => [newAct, ...prev.slice(0, 9)])
  }

  const createProject = async (data: Partial<Project>) => {
    const created = await api.projects.create(data)
    setProjects((prev) => [created, ...prev])
    addActivity(`Project "${created.name}" created`, 'blue')
    // Refresh stats to reflect new project counts
    api.analytics.getStats().then((s) => s && s.length && setStats(s)).catch(() => {})
    return created
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = await api.projects.update(id, data)
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
    addActivity(`Project "${updated.name}" updated`, 'violet')
    api.analytics.getStats().then((s) => s && s.length && setStats(s)).catch(() => {})
    return updated
  }

  const deleteProject = async (id: string) => {
    const proj = projects.find((p) => p.id === id)
    await api.projects.delete(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    if (proj) addActivity(`Project "${proj.name}" deleted`, 'orange')
    api.analytics.getStats().then((s) => s && s.length && setStats(s)).catch(() => {})
    return true
  }

  const inviteMember = async (data: { name: string; email: string; role: TeamMember['role'] }) => {
    const member = await api.team.invite(data)
    setTeam((prev) => [...prev, member])
    addActivity(`Invited ${member.name} as ${member.role}`, 'purple')
    api.analytics.getStats().then((s) => s && s.length && setStats(s)).catch(() => {})
    return member
  }

  const updateMemberRole = async (id: string, role: TeamMember['role']) => {
    const updated = await api.team.updateRole(id, role)
    setTeam((prev) => prev.map((m) => (m.id === id ? updated : m)))
    addActivity(`Updated role for ${updated.name} to ${updated.role}`, 'green')
    return updated
  }

  const removeMember = async (id: string) => {
    const mem = team.find((m) => m.id === id)
    await api.team.remove(id)
    setTeam((prev) => prev.filter((m) => m.id !== id))
    if (mem) addActivity(`Removed team member ${mem.name}`, 'orange')
    api.analytics.getStats().then((s) => s && s.length && setStats(s)).catch(() => {})
    return true
  }

  const markNotificationRead = (id: string) => {
    api.notifications.markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DataContext.Provider
      value={{
        projects,
        team,
        stats,
        activities,
        notifications,
        unreadCount,
        loading,
        reload: loadData,
        createProject,
        updateProject,
        deleteProject,
        inviteMember,
        updateMemberRole,
        removeMember,
        markNotificationRead,
        addActivity,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
