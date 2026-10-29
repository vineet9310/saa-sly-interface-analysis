'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@/lib/types'
import { api } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password?: string) => Promise<User>
  demoLogin: () => Promise<User>
  register: (name: string, email: string, password?: string) => Promise<User>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<User>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await api.auth.me()
      setUser(currentUser)
    } catch (err) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

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

  const demoLogin = async () => {
    setIsLoading(true)
    try {
      const u = await api.auth.demoLogin()
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

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await api.auth.updateProfile(updates)
    setUser(updated)
    return updated
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    return api.auth.changePassword(currentPassword, newPassword)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
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
