'use client'

import React, { useState } from 'react'
import { SlidersHorizontal, Check, ExternalLink, Plus } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const allIntegrations = [
  { id: 'slack', name: 'Slack', category: 'Communication', desc: 'Real-time project updates and incident alerting in channels.', connected: true, icon: '💬' },
  { id: 'github', name: 'GitHub', category: 'Developer Tools', desc: 'Link commits, pull requests, and automated deployment status.', connected: true, icon: '🐙' },
  { id: 'stripe', name: 'Stripe', category: 'Billing & Finance', desc: 'Sync customer payments, invoices, and webhook telemetry.', connected: true, icon: '💳' },
  { id: 'gdrive', name: 'Google Drive', category: 'Storage', desc: 'Automatically back up reports, deliverables, and team assets.', connected: false, icon: '📁' },
  { id: 'notion', name: 'Notion', category: 'Productivity', desc: 'Embed SaaSly real-time KPI metrics in company Notion wikis.', connected: false, icon: '📝' },
  { id: 'figma', name: 'Figma', category: 'Design', desc: 'Preview design files and sync token updates with projects.', connected: false, icon: '🎨' },
]

export default function IntegrationsPage() {
  const [items, setItems] = useState(allIntegrations)

  const toggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, connected: !item.connected } : item))
  }

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Integrations Directory</h1>
          <p className="dash-page-subtitle">Supercharge your workspace with 30+ enterprise connectors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((app) => (
          <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{app.icon}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded">
                  {app.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{app.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{app.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {app.connected ? 'Active & Synced' : 'Not configured'}
              </span>
              <button
                onClick={() => toggle(app.id)}
                className={`button text-xs px-3.5 py-1.5 ${
                  app.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'button-outline'
                }`}
              >
                {app.connected ? 'Connected ✓' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
