'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  LineChart,
  ListTodo,
  Users,
  Calendar,
  SlidersHorizontal,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Menu,
  X,
  Check,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Analytics', href: '/analytics', icon: LineChart },
  { label: 'Tasks', href: '/tasks', icon: ListTodo },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Integrations', href: '/integrations', icon: SlidersHorizontal },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const { notifications, unreadCount, markNotificationRead } = useData()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-container">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="dash-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="dash-brand">
          <Link href="/" className="logo">
            <span className="brand-mark">✦</span>
            <strong>SaaSly</strong>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-800"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={label}
                href={href}
                className={`dash-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="dash-upgrade-box">
          <div className="dash-upgrade-sparkle">✦</div>
          <div>
            <strong>Upgrade to Pro</strong>
            <p>Get more features & analytics</p>
          </div>
          <Link href="/pricing" className="dash-upgrade-btn">
            Upgrade Plan
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="dash-main-wrap">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              className="dash-hamburger md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="dash-search">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="dash-topbar-right">
            {/* Notifications */}
            <div className="relative">
              <button
                className="dash-icon-btn"
                onClick={() => {
                  setNotifOpen(!notifOpen)
                  setProfileOpen(false)
                }}
                aria-label="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && <span className="dash-badge-dot" />}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="dash-dropdown notif-dropdown z-30">
                    <div className="dash-dropdown-header">
                      <strong>Notifications</strong>
                      <span className="text-xs text-blue-600 font-medium">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="dash-dropdown-list">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`dash-notif-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => markNotificationRead(n.id)}
                        >
                          <div className="flex-1">
                            <p className="dash-notif-title">{n.title}</p>
                            <p className="dash-notif-desc">{n.description}</p>
                            <span className="dash-notif-time">{n.time}</span>
                          </div>
                          {!n.read && <span className="unread-dot" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="dash-user-btn"
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNotifOpen(false)
                }}
              >
                <div className="dash-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user?.name ? user.name[0] : 'A'}</span>
                  )}
                </div>
                <div className="dash-user-info hidden sm:block">
                  <span className="dash-user-name">{user?.name || 'Alex Carter'}</span>
                  <span className="dash-user-role">{user?.role || 'Owner'}</span>
                </div>
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="dash-dropdown user-dropdown z-30">
                    <div className="dash-dropdown-user-card">
                      <div className="dash-avatar-lg">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <span>{user?.name ? user.name[0] : 'A'}</span>
                        )}
                      </div>
                      <div>
                        <strong className="block text-sm text-gray-900">{user?.name || 'Alex Carter'}</strong>
                        <span className="block text-xs text-gray-500">{user?.email || 'alex@example.com'}</span>
                      </div>
                    </div>

                    <div className="dash-dropdown-menu">
                      <Link
                        href="/settings"
                        className="dash-dropdown-link"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={14} /> Account Settings
                      </Link>
                      <Link
                        href="/"
                        className="dash-dropdown-link"
                        onClick={() => setProfileOpen(false)}
                      >
                        <ExternalLink size={14} /> View Marketing Site
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dash-dropdown-link text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="dash-content-area">{children}</main>
      </div>
    </div>
  )
}
