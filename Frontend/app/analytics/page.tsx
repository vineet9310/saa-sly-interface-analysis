'use client'

import React, { useState } from 'react'
import { Download, TrendingUp, Users, DollarSign, Activity, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { RevenueChart } from '@/components/ui/RevenueChart'
import { revenueMonthlyData } from '@/lib/mock-data'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('2024')

  const handleExportCSV = () => {
    const headers = ['Month', 'Revenue ($)', 'Active Users']
    const rows = revenueMonthlyData.map((d) => [d.name, d.revenue, d.users])
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

  const kpiComparisons = [
    { label: 'Monthly Recurring Revenue (MRR)', current: '$24,893', previous: '$22,225', change: '+12.0%' },
    { label: 'Annual Run Rate (ARR)', current: '$298,716', previous: '$266,700', change: '+12.0%' },
    { label: 'Average Revenue Per User (ARPU)', current: '$48.50', previous: '$45.20', change: '+7.3%' },
    { label: 'Customer Churn Rate', current: '1.2%', previous: '1.8%', change: '-0.6%' },
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
          Compared against previous billing cycle metrics.
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
          <span className="text-[11px] text-slate-400">Fiscal Year 2024</span>
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
            {revenueMonthlyData.map((d, index) => {
              const prev = index > 0 ? revenueMonthlyData[index - 1].revenue : d.revenue
              const percent = (((d.revenue - prev) / prev) * 100).toFixed(1)
              return (
                <tr key={d.name}>
                  <td className="table-td font-semibold text-slate-800">{d.name} 2024</td>
                  <td className="table-td font-semibold text-slate-900">${d.revenue.toLocaleString()}</td>
                  <td className="table-td">{d.users.toLocaleString()} users</td>
                  <td className="table-td">
                    <span className={`text-xs font-semibold ${Number(percent) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {Number(percent) >= 0 ? `+${percent}%` : `${percent}%`}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="badge-green status-badge">Audited</span>
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
