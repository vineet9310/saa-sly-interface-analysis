'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function SignUpPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', percent: 0, color: 'bg-gray-200' }
    if (password.length < 6) return { label: 'Weak', percent: 25, color: 'bg-red-500' }
    if (password.length < 10) return { label: 'Fair', percent: 60, color: 'bg-amber-500' }
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('You must accept the Terms of Service to proceed.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await register(name.trim(), email.trim(), password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left Pane - Form */}
      <div className="auth-left-pane">
        <div className="auth-box">
          <Link href="/" className="logo mb-8 inline-flex" aria-label="SaaSly home">
            <span className="logo-mark">✦</span>
            <strong>SaaSly</strong>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Start your 14-day free trial. No credit card required.
          </p>

          {/* Social Logins */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => {
                setName('Alex Carter')
                setEmail('alex@example.com')
              }}
              className="oauth-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setName('Alex Carter')
                setEmail('alex@example.com')
              }}
              className="oauth-btn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="divider-or">
            <span />
            OR
            <span />
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg text-xs border border-red-200">
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 cursor-pointer leading-tight">
                I agree to the{' '}
                <a href="#terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="button button-primary w-full text-center py-2.5 text-xs font-semibold mt-2"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Feature Showcase */}
      <div className="auth-right-pane">
        <div className="auth-feature-card">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white grid place-items-center mb-6 shadow-md shadow-blue-500/20">
            <span className="text-xl">✦</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Join 10,000+ teams building with SaaSly
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Gain complete visibility across projects, team workloads, and revenue streams in seconds.
          </p>

          <div className="space-y-3.5 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>No credit card required to start</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Full 14-day free trial on Pro tier</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Cancel or upgrade anytime with one click</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Full access to all AI features & analytics</span>
            </div>
          </div>

          {/* Social Proof Avatars */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
            <div className="avatar-group">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80"
                alt="Member"
                className="avatar-group-item w-7 h-7"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60&q=80"
                alt="Member"
                className="avatar-group-item w-7 h-7"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60&q=80"
                alt="Member"
                className="avatar-group-item w-7 h-7"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Trusted by teams worldwide
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
