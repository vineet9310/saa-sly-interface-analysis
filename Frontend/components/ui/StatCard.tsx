import React from 'react'
import { DollarSign, Users, FolderKanban, TrendingUp, Grid2X2 } from 'lucide-react'
import { MetricStat } from '@/lib/types'

interface StatCardProps {
  stat: MetricStat
  index?: number
}

export function StatCard({ stat, index = 0 }: StatCardProps) {
  const getIcon = () => {
    switch (stat.iconType) {
      case 'revenue':
        return <DollarSign size={15} />
      case 'users':
        return <Users size={15} />
      case 'projects':
        return <FolderKanban size={15} />
      case 'conversion':
        return <TrendingUp size={15} />
      default:
        return <Grid2X2 size={15} />
    }
  }

  const iconClasses = [
    'text-blue-600 bg-blue-50',
    'text-indigo-600 bg-indigo-50',
    'text-emerald-600 bg-emerald-50',
    'text-purple-600 bg-purple-50',
  ]

  const colorClass = iconClasses[index % iconClasses.length]

  return (
    <div className="dash-stat-card">
      <div className={`dash-stat-icon ${colorClass}`}>
        {getIcon()}
      </div>
      <span className="dash-stat-label">{stat.label}</span>
      <strong className="dash-stat-value">{stat.value}</strong>
      <div className="dash-stat-footer">
        <span className="dash-stat-change">{stat.change}</span>
        <span className="dash-stat-caption">{stat.caption}</span>
      </div>
    </div>
  )
}
