'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Project, TeamMember, MetricStat, AppNotification, Activity } from '@/lib/types'
import { api } from '@/lib/api'
import { initialStats, initialActivities } from '@/lib/mock-data'

interface DataContextType {
  projects: Project[]
  team: TeamMember[]
  stats: MetricStat[]
  activities: Activity[]
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  createProject: (data: Partial<Project>) => Promise<Project>
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<boolean>
  inviteMember: (data: { name: string; email: string; role: TeamMember['role'] }) => Promise<TeamMember>
  updateMemberRole: (id: string, role: TeamMember['role']) => Promise<boolean>
  removeMember: (id: string) => Promise<boolean>
  markNotificationRead: (id: string) => void
  addActivity: (title: string, color?: Activity['color']) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<MetricStat[]>(initialStats)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const [projList, teamList, statsList, notifList] = await Promise.all([
          api.projects.getAll(),
          api.team.getAll(),
          api.analytics.getStats(),
          api.notifications.getAll(),
        ])
        setProjects(projList)
        setTeam(teamList)
        setStats(statsList)
        setNotifications(notifList)
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const addActivity = (title: string, color: Activity['color'] = 'blue') => {
    const newAct: Activity = {
      id: `act_${Date.now()}`,
      title,
      time: 'Just now',
      color,
    }
    setActivities(prev => [newAct, ...prev.slice(0, 7)])
  }

  const createProject = async (data: Partial<Project>) => {
    const created = await api.projects.create(data)
    setProjects(prev => [created, ...prev])
    addActivity(`Project "${created.name}" created`, 'blue')
    return created
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = await api.projects.update(id, data)
    setProjects(prev => prev.map(p => (p.id === id ? updated : p)))
    addActivity(`Project "${updated.name}" updated`, 'violet')
    return updated
  }

  const deleteProject = async (id: string) => {
    const proj = projects.find(p => p.id === id)
    await api.projects.delete(id)
    setProjects(prev => prev.filter(p => p.id !== id))
    if (proj) addActivity(`Project "${proj.name}" deleted`, 'orange')
    return true
  }

  const inviteMember = async (data: { name: string; email: string; role: TeamMember['role'] }) => {
    const member = await api.team.invite(data)
    setTeam(prev => [...prev, member])
    addActivity(`Invited ${member.name} as ${member.role}`, 'purple')
    return member
  }

  const updateMemberRole = async (id: string, role: TeamMember['role']) => {
    await api.team.updateRole(id, role)
    setTeam(prev => prev.map(m => m.id === id ? { ...m, role } : m))
    return true
  }

  const removeMember = async (id: string) => {
    const mem = team.find(m => m.id === id)
    await api.team.remove(id)
    setTeam(prev => prev.filter(m => m.id !== id))
    if (mem) addActivity(`Removed ${mem.name} from team`, 'orange')
    return true
  }

  const markNotificationRead = (id: string) => {
    api.notifications.markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
