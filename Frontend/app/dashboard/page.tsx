'use client'

import React from 'react'
import Link from 'next/link'
import { CalendarDays, ChevronDown, MoreHorizontal, ArrowRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RevenueChart } from '@/components/ui/RevenueChart'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, activities, projects } = useData()

  const displayName = user?.name ? user.name.split(' ')[0] : 'Alex'

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Good morning, {displayName}</h1>
          <p className="dash-page-subtitle">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <button className="dash-date-badge cursor-pointer hover:bg-slate-50">
          <CalendarDays size={13} className="text-slate-500" />
          <span>Apr 1, 2024 - Apr 30, 2024</span>
          <ChevronDown size={12} className="text-slate-400" />
        </button>
      </div>

      {/* 4 KPI Stat Cards */}
      <section className="dash-stats-grid">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </section>

      {/* Middle Section: Chart & Activity Feed */}
      <section className="dash-middle-grid">
        {/* Left: Revenue Overview Chart */}
        <RevenueChart />

        {/* Right: Recent Activity Card */}
        <div className="dash-activity-card">
          <div className="dash-activity-header">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Recent Activity</h4>
              <span className="text-[10px] text-slate-400">Latest business events</span>
            </div>
            <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="dash-activity-list">
            {activities.slice(0, 5).map((act) => {
              const dotColors = {
                blue: 'bg-blue-100 text-blue-600',
                violet: 'bg-purple-100 text-purple-600',
                green: 'bg-emerald-100 text-emerald-600',
                purple: 'bg-indigo-100 text-indigo-600',
                orange: 'bg-amber-100 text-amber-600',
              }
              const colorClass = dotColors[act.color] || dotColors.blue

              return (
                <div key={act.id} className="dash-activity-item">
                  <span className={`dash-activity-dot ${colorClass}`}>✦</span>
                  <div className="dash-activity-content">
                    <strong>{act.title}</strong>
                    <small>{act.time}</small>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom Section: Recent Projects */}
      <section className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Projects</h3>
            <span className="text-[11px] text-slate-400">Your high priority ongoing tasks</span>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th">Team</th>
                <th className="table-th">Progress</th>
                <th className="table-th">Status</th>
                <th className="table-th">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 4).map((p) => (
                <tr key={p.id}>
                  <td className="table-td font-semibold text-slate-800">
                    <Link href="/projects" className="hover:text-blue-600">
                      {p.name}
                    </Link>
                  </td>
                  <td className="table-td">
                    <div className="avatar-group">
                      {p.team.map((m, idx) => (
                        <div key={idx} className="avatar-group-item">
                          {m.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="progress-wrap">
                      <div className="progress-bg">
                        <div
                          className="progress-fill"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="progress-val">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="table-td text-xs text-slate-500">{p.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  )
}
