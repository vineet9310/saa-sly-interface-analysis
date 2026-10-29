'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  LineChart,
  ListTodo,
  SlidersHorizontal,
  Sparkles,
  Shield,
  Code,
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user } = useAuth()
  const navRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (name: string) => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setActiveDropdown(name)
    }
  }

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null)
      }, 220)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  const closeAll = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(null)
    setMobileOpen(false)
  }

  return (
    <header className="navbar-container relative z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/80">
      <nav className="navbar" ref={navRef}>
        {/* Brand Logo */}
        <Link href="/" className="logo" aria-label="SaaSly home" onClick={closeAll}>
          <span className="logo-mark">✦</span>
          <strong>SaaSly</strong>
        </Link>

        {/* Navigation Links with Dropdowns */}
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {/* 1. Product Dropdown */}
          <div
            className="nav-item-dropdown relative"
            onMouseEnter={() => handleMouseEnter('product')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-link-btn flex items-center gap-1.5 py-2 font-medium cursor-pointer transition-colors ${
                activeDropdown === 'product' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={(e) => handleDropdownToggle('product', e)}
            >
              <span>Product</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  activeDropdown === 'product' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`}
              />
            </button>

            {activeDropdown === 'product' && (
              <div
                className="nav-dropdown-menu product-menu animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={() => handleMouseEnter('product')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 w-72 md:w-[420px]">
                  <Link
                    href="/dashboard"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <LayoutDashboard size={16} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                        Interactive Dashboard
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Real-time revenue, telemetry & KPI metrics.
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/projects"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FolderKanban size={16} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                        Project Management
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Plan, track milestones & deliver with clarity.
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/analytics"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <LineChart size={16} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-900 group-hover:text-emerald-600">
                        Smart AI Analytics
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Financial reports & predictive forecasting.
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/tasks"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <ListTodo size={16} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-900 group-hover:text-purple-600">
                        Tasks & Workflows
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-tight block">
                        Automate workflows & sprint deliverables.
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="bg-slate-50 p-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href="/integrations"
                    onClick={closeAll}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <SlidersHorizontal size={12} /> Explore all 30+ integrations →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 2. Solutions Dropdown */}
          <div
            className="nav-item-dropdown relative"
            onMouseEnter={() => handleMouseEnter('solutions')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-link-btn flex items-center gap-1.5 py-2 font-medium cursor-pointer transition-colors ${
                activeDropdown === 'solutions' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={(e) => handleDropdownToggle('solutions', e)}
            >
              <span>Solutions</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  activeDropdown === 'solutions' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`}
              />
            </button>

            {activeDropdown === 'solutions' && (
              <div
                className="nav-dropdown-menu solutions-menu animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={() => handleMouseEnter('solutions')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-3 space-y-1 w-64 md:w-72">
                  <Link
                    href="/#solutions"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-blue-100/70 text-blue-600">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        For High-Growth Startups
                      </strong>
                      <span className="text-[10px] text-slate-500">Fast setup, zero credit card needed</span>
                    </div>
                  </Link>

                  <Link
                    href="/#solutions"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-purple-100/70 text-purple-600">
                      <Shield size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-purple-600">
                        For Enterprise Teams
                      </strong>
                      <span className="text-[10px] text-slate-500">SOC2, audit logs & dedicated SLA</span>
                    </div>
                  </Link>

                  <Link
                    href="/#solutions"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-emerald-100/70 text-emerald-600">
                      <Code size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-emerald-600">
                        For Product & Engineering
                      </strong>
                      <span className="text-[10px] text-slate-500">GitHub sync & telemetry tracking</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. Pricing Link */}
          <Link
            href="/pricing"
            onClick={closeAll}
            className="py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Pricing
          </Link>

          {/* 4. Resources Dropdown */}
          <div
            className="nav-item-dropdown relative"
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-link-btn flex items-center gap-1.5 py-2 font-medium cursor-pointer transition-colors ${
                activeDropdown === 'resources' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={(e) => handleDropdownToggle('resources', e)}
            >
              <span>Resources</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  activeDropdown === 'resources' ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`}
              />
            </button>

            {activeDropdown === 'resources' && (
              <div
                className="nav-dropdown-menu resources-menu animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-3 space-y-1 w-64 md:w-72">
                  <Link
                    href="/team"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-blue-100/70 text-blue-600">
                      <Users size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        Team Directory
                      </strong>
                      <span className="text-[10px] text-slate-500">Meet workspace members & roles</span>
                    </div>
                  </Link>

                  <Link
                    href="/calendar"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-amber-100/70 text-amber-600">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-amber-600">
                        Roadmap & Events
                      </strong>
                      <span className="text-[10px] text-slate-500">Sprint reviews and milestone dates</span>
                    </div>
                  </Link>

                  <Link
                    href="/#resources"
                    onClick={closeAll}
                    className="dropdown-card group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-slate-100 text-slate-600">
                      <HelpCircle size={14} />
                    </div>
                    <div>
                      <strong className="block text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                        Help & FAQs
                      </strong>
                      <span className="text-[10px] text-slate-500">Common questions & guides</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {user && (
            <Link
              href="/dashboard"
              className="text-blue-600 font-semibold md:hidden py-2"
              onClick={closeAll}
            >
              Go to Dashboard →
            </Link>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="nav-actions">
          {user ? (
            <Link href="/dashboard" className="button button-primary button-small" onClick={closeAll}>
              Dashboard <ArrowRight size={13} />
            </Link>
          ) : (
            <>
              <Link className="login-link text-xs font-semibold hover:text-blue-600" href="/login">
                Log in
              </Link>
              <Link className="button button-primary button-small" href="/signup">
                Get Started <ArrowRight size={13} />
              </Link>
            </>
          )}

          <button
            className="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
