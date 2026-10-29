'use client'

import React, { useState } from 'react'
import {
  User,
  Shield,
  Bell,
  CreditCard,
  SlidersHorizontal,
  Check,
  Download,
  KeyRound,
  ExternalLink,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing' | 'integrations'

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuth()

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  // Profile form state
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [company, setCompany] = useState(user?.company || '')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // Sync with user once loaded
  React.useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setBio(user.bio || '')
      setCompany(user.company || '')
    }
  }, [user])

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [securitySuccess, setSecuritySuccess] = useState(false)
  const [securityError, setSecurityError] = useState('')
  const [securitySaving, setSecuritySaving] = useState(false)

  // Notifications state
  const [notifEmailProjects, setNotifEmailProjects] = useState(true)
  const [notifEmailBilling, setNotifEmailBilling] = useState(true)
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(false)
  const [notifPush, setNotifPush] = useState(true)

  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', desc: 'Real-time notification channel alerts', connected: true },
    { id: 'github', name: 'GitHub', desc: 'Sync repository commits and PR tasks', connected: true },
    { id: 'gdrive', name: 'Google Drive', desc: 'Export documents and telemetry data', connected: false },
    { id: 'stripe', name: 'Stripe', desc: 'Subscription and invoice webhook processing', connected: true },
  ])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileError('')
    try {
      await updateProfile({ name, bio, company })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      setSecurityError('Please enter both current and new password.')
      return
    }
    if (newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long.')
      return
    }

    setSecuritySaving(true)
    setSecurityError('')
    try {
      await changePassword(currentPassword, newPassword)
      setSecuritySuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setSecuritySuccess(false), 3000)
    } catch (err: any) {
      setSecurityError(err?.message || 'Failed to update password. Please check your current password.')
    } finally {
      setSecuritySaving(false)
    }
  }

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Settings</h1>
          <p className="dash-page-subtitle">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'security', label: 'Security' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'billing', label: 'Billing' },
          { id: 'integrations', label: 'Integrations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`pb-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Profile Information
          </h3>

          {savedSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <Check size={14} /> Profile updated successfully!
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">
              {profileError}
            </div>
          )}

          {/* Avatar Edit */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
                }
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <button
                type="button"
                className="button button-outline text-xs px-3 py-1.5"
                onClick={() =>
                  updateProfile({
                    avatar:
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
                  })
                }
              >
                Change avatar
              </button>
              <p className="text-[10px] text-slate-400 mt-1">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                className="input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                className="input-field h-24 resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-3">
              <button type="submit" className="button button-primary text-xs px-5 py-2.5">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Change Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ensure your account is using a long, random password to stay secure.
            </p>

            {securitySuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                <Check size={14} /> Password updated successfully!
              </div>
            )}

            {securityError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                {securityError}
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="button button-primary text-xs px-4 py-2 mt-2">
                Update Password
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add an extra layer of security to your account with 2FA authenticator apps.
            </p>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 grid place-items-center">
                  <KeyRound size={16} />
                </div>
                <div>
                  <strong className="block text-xs text-slate-900">
                    Authenticator App
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    {twoFactorEnabled ? 'Configured and active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`button text-xs px-3 py-1.5 ${
                  twoFactorEnabled ? 'button-outline' : 'button-primary'
                }`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Notification Preferences
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3.5 flex justify-between items-center">
              <div>
                <strong className="block text-slate-800">Project status updates</strong>
                <span className="text-slate-400">Receive emails when team members update project milestones</span>
              </div>
              <input
                type="checkbox"
                checked={notifEmailProjects}
                onChange={(e) => setNotifEmailProjects(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="py-3.5 flex justify-between items-center">
              <div>
                <strong className="block text-slate-800">Billing & Payment receipts</strong>
                <span className="text-slate-400">Receive invoice confirmations and upcoming renewal warnings</span>
              </div>
              <input
                type="checkbox"
                checked={notifEmailBilling}
                onChange={(e) => setNotifEmailBilling(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="py-3.5 flex justify-between items-center">
              <div>
                <strong className="block text-slate-800">Weekly Executive Digest</strong>
                <span className="text-slate-400">A high level overview of revenue, telemetry, and team activity</span>
              </div>
              <input
                type="checkbox"
                checked={notifWeeklyDigest}
                onChange={(e) => setNotifWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="py-3.5 flex justify-between items-center">
              <div>
                <strong className="block text-slate-800">Browser In-App Push notifications</strong>
                <span className="text-slate-400">Immediate popups for mentions and urgent task assignments</span>
              </div>
              <input
                type="checkbox"
                checked={notifPush}
                onChange={(e) => setNotifPush(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Billing */}
      {activeTab === 'billing' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Current Plan
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                Pro Plan ($29/month)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your subscription renews automatically on May 15, 2024.
              </p>
            </div>
            <a
              href="/pricing"
              className="button button-outline text-xs px-3.5 py-2 font-semibold"
            >
              Change Plan
            </a>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-blue-900 text-white rounded flex items-center justify-center font-bold text-[10px]">
                VISA
              </div>
              <div>
                <strong className="block text-xs text-slate-900">
                  Visa ending in 4242
                </strong>
                <span className="text-[11px] text-slate-500">
                  Expires 08/2026 • Default method
                </span>
              </div>
            </div>
            <button className="text-xs text-blue-600 font-semibold hover:underline">
              Edit
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              Invoice History
            </h4>
            <div className="border border-slate-100 rounded-lg divide-y divide-slate-100 text-xs">
              {[
                { date: 'Apr 15, 2024', amount: '$29.00', id: 'INV-2024-004' },
                { date: 'Mar 15, 2024', amount: '$29.00', id: 'INV-2024-003' },
                { date: 'Feb 15, 2024', amount: '$29.00', id: 'INV-2024-002' },
              ].map((inv) => (
                <div key={inv.id} className="py-2.5 px-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-700">{inv.date}</span>
                    <span className="text-slate-400 ml-2">({inv.id})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-900">{inv.amount}</span>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Download size={13} /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Connected Apps & Workflows
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Extend SaaSly by connecting your team tools and cloud services.
          </p>

          <div className="space-y-3">
            {integrations.map((app) => (
              <div
                key={app.id}
                className="p-3.5 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <strong className="block text-xs text-slate-900">{app.name}</strong>
                  <span className="text-[11px] text-slate-500">{app.desc}</span>
                </div>

                <button
                  onClick={() => toggleIntegration(app.id)}
                  className={`button text-xs px-3 py-1.5 ${
                    app.connected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'button-outline'
                  }`}
                >
                  {app.connected ? 'Connected ✓' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
