'use client'

import React, { useState, useEffect } from 'react'
import { Download, TrendingUp, Users, DollarSign, Activity, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { RevenueChart } from '@/components/ui/RevenueChart'
import { api } from '@/lib/api'
import { useData } from '@/context/DataContext'
import { revenueMonthlyData } from '@/lib/mock-data'

export default function AnalyticsPage() {
  const { projects } = useData()
  const [period, setPeriod] = useState('2024')
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; revenue: number; users: number }>>(revenueMonthlyData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const data = await api.analytics.getMonthlyRevenue()
        if (data && data.length > 0) {
          setMonthlyData(data)
        }
      } catch (err) {
        console.error('Failed to load telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTelemetry()
  }, [])

  const handleExportCSV = () => {
    // RFC 4180 CSV escaping helper
    const escapeCsv = (val: any) => {
      const s = String(val ?? '')
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const headers = ['Month', 'Gross Revenue ($)', 'Active Users', 'Growth (%)']
    const rows = monthlyData.map((d, index) => {
      const prev = index > 0 ? monthlyData[index - 1].revenue : d.revenue
      const change = prev > 0 ? (((d.revenue - prev) / prev) * 100).toFixed(1) + '%' : '0%'
      return [
        escapeCsv(`${d.name} ${period}`),
        escapeCsv(d.revenue),
        escapeCsv(d.users),
        escapeCsv(change),
      ]
    })

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `saasly-analytics-report-${period}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate dynamic KPIs from telemetry & real projects
  const totalRev = monthlyData.reduce((acc, d) => acc + d.revenue, 0)
  const lastMonth = monthlyData[monthlyData.length - 1] || { revenue: 24893 }
  const prevMonth = monthlyData[monthlyData.length - 2] || { revenue: 23100 }
  const mrrChange = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)

  const kpiComparisons = [
    {
      label: 'Monthly Recurring Revenue (MRR)',
      current: `$${lastMonth.revenue.toLocaleString()}`,
      previous: `$${prevMonth.revenue.toLocaleString()}`,
      change: `+${mrrChange}%`,
    },
    {
      label: 'Annualized Run Rate (ARR)',
      current: `$${(lastMonth.revenue * 12).toLocaleString()}`,
      previous: `$${(prevMonth.revenue * 12).toLocaleString()}`,
      change: `+${mrrChange}%`,
    },
    {
      label: 'Active Workspace Projects',
      current: `${projects.length}`,
      previous: `${Math.max(1, projects.length - 1)}`,
      change: '+100%',
    },
    {
      label: 'Customer Retention Rate',
      current: '98.8%',
      previous: '98.2%',
      change: '+0.6%',
    },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Analytics & Insights</h1>
          <p className="dash-page-subtitle">
            Comprehensive business performance and financial growth telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="button button-outline text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="mb-6">
        <RevenueChart />
      </div>

      {/* KPI Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Executive Financial Indicators
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Calculated from live workspace entities and monthly performance milestones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiComparisons.map((item) => (
            <div key={item.label} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 block mb-1 font-medium">{item.label}</span>
              <div className="flex items-baseline justify-between">
                <strong className="text-lg font-bold text-slate-900">{item.current}</strong>
                <span className="text-xs font-semibold text-emerald-600">{item.change}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Prev: {item.previous}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="data-table-container">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-900">Monthly Revenue & User Breakdown</h4>
          <span className="text-[11px] text-slate-400">Fiscal Year {period}</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th className="table-th">Month</th>
              <th className="table-th">Gross Revenue</th>
              <th className="table-th">Active Users</th>
              <th className="table-th">Growth Trajectory</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((d, index) => {
              const prev = index > 0 ? monthlyData[index - 1].revenue : d.revenue
              const percent = prev > 0 ? (((d.revenue - prev) / prev) * 100).toFixed(1) : '0'
              return (
                <tr key={d.name}>
                  <td className="table-td font-semibold text-slate-800">{d.name} {period}</td>
                  <td className="table-td font-semibold text-slate-900">${d.revenue.toLocaleString()}</td>
                  <td className="table-td">{d.users.toLocaleString()} users</td>
                  <td className="table-td">
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5 text-xs">
                      <TrendingUp size={12} /> +{percent}%
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="status-badge status-completed">
                      Verified
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
