'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login, demoLogin, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [oauthNotice, setOauthNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.')
      return
    }

    setSubmitting(true)
    setError('')
    setOauthNotice('')

    try {
      await login(email.trim(), password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('alex@example.com')
    setPassword('demo123456')
    setSubmitting(true)
    setError('')
    setOauthNotice('')
    try {
      await demoLogin()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Demo login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSocialClick = (provider: string) => {
    setOauthNotice(`${provider} OAuth requires client ID and callback configuration. Use demo login or email/password below.`)
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
            Welcome back!
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Sign in to your account to continue
          </p>

          {/* Social Logins */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleSocialClick('Google')}
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
              onClick={() => handleSocialClick('GitHub')}
              className="oauth-btn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {oauthNotice && (
            <div className="mb-4 p-2.5 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200">
              {oauthNotice}
            </div>
          )}

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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
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
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="button button-primary w-full text-center py-2.5 text-xs font-semibold"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="button button-outline w-full text-center py-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Zap size={13} className="text-blue-600" /> Instant Demo Login (Alex Carter)
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
              Create one
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
            Manage your business smarter with SaaSly
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            The next-generation operations engine for high-performing product and engineering teams.
          </p>

          <div className="space-y-3.5 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>All-in-one platform for projects & telemetry</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Powerful AI analytics with predictive trends</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Secure, reliable & SOC2 compliant</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xs">
                <Check size={12} />
              </span>
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
