'use client'

import React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const upcomingEvents = [
  { id: '1', title: 'Sprint Retrospective & Demo', time: '10:00 AM - 11:30 AM', date: 'Today', type: 'Sprint' },
  { id: '2', title: 'Client Onboarding Sync - Acme Corp', time: '2:00 PM - 3:00 PM', date: 'Today', type: 'Sales' },
  { id: '3', title: 'Product Roadmap Q3 Review', time: '11:00 AM - 12:00 PM', date: 'Tomorrow', type: 'Product' },
  { id: '4', title: 'Design System Alignment', time: '4:00 PM - 5:00 PM', date: 'May 3', type: 'Design' },
]

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dates = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Calendar & Schedules</h1>
          <p className="dash-page-subtitle">Coordinate milestones, sprints, and stakeholder reviews.</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="button button-outline text-xs px-2.5 py-1.5"><ChevronLeft size={14} /></button>
          <span className="text-xs font-bold text-slate-800">April 2024</span>
          <button className="button button-outline text-xs px-2.5 py-1.5"><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-3">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Offset for starting day */}
            <div className="h-16 rounded border border-transparent bg-slate-50/50" />
            {dates.map((d) => {
              const isToday = d === 15
              const hasEvent = d === 15 || d === 18 || d === 25
              return (
                <div
                  key={d}
                  className={`h-16 p-1.5 border rounded-lg flex flex-col justify-between transition-all ${
                    isToday
                      ? 'border-blue-500 bg-blue-50/30'
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold w-5 h-5 grid place-items-center rounded-full ${
                      isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                    }`}
                  >
                    {d}
                  </span>
                  {hasEvent && (
                    <span className="text-[9px] truncate bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-medium">
                      {d === 15 ? 'Sprint Demo' : d === 18 ? 'Client Sync' : 'Launch'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4">Upcoming Schedule</h3>
          <div className="space-y-3.5">
            {upcomingEvents.map(ev => (
              <div key={ev.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  {ev.type} • {ev.date}
                </span>
                <strong className="text-xs text-slate-900 block mb-1">{ev.title}</strong>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={11} /> {ev.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
