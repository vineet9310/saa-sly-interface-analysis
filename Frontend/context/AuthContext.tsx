'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { api } from '@/lib/api'
import { initialCurrentUser } from '@/lib/mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password?: string) => Promise<User>
  register: (name: string, email: string, password?: string) => Promise<User>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await api.auth.me()
        setUser(currentUser)
      } catch (err) {
        setUser(initialCurrentUser)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (email: string, password?: string) => {
    setIsLoading(true)
    try {
      const u = await api.auth.login(email, password)
      setUser(u)
      return u
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password?: string) => {
    setIsLoading(true)
    try {
      const u = await api.auth.register(name, email, password)
      setUser(u)
      return u
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    api.auth.logout()
    setUser(null)
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('saasly_user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
