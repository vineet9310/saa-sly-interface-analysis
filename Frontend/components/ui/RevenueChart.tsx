'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const chartDataSets = {
  monthly: [
    { label: 'Jan', value: 4200, pointsY: 110 },
    { label: 'Feb', value: 6800, pointsY: 98 },
    { label: 'Mar', value: 8400, pointsY: 88 },
    { label: 'Apr', value: 10200, pointsY: 76 },
    { label: 'May', value: 9500, pointsY: 82 },
    { label: 'Jun', value: 12450, pointsY: 64 },
    { label: 'Jul', value: 14100, pointsY: 56 },
    { label: 'Aug', value: 16800, pointsY: 44 },
    { label: 'Sep', value: 19400, pointsY: 32 },
    { label: 'Oct', value: 21200, pointsY: 25 },
    { label: 'Nov', value: 23100, pointsY: 18 },
    { label: 'Dec', value: 24893, pointsY: 12 },
  ],
  quarterly: [
    { label: 'Q1', value: 19400, pointsY: 90 },
    { label: 'Q2', value: 32150, pointsY: 65 },
    { label: 'Q3', value: 50300, pointsY: 40 },
    { label: 'Q4', value: 69193, pointsY: 15 },
  ],
  halfYear: [
    { label: 'Jul', value: 14100, pointsY: 80 },
    { label: 'Aug', value: 16800, pointsY: 65 },
    { label: 'Sep', value: 19400, pointsY: 52 },
    { label: 'Oct', value: 21200, pointsY: 38 },
    { label: 'Nov', value: 23100, pointsY: 25 },
    { label: 'Dec', value: 24893, pointsY: 12 },
  ],
}

export function RevenueChart() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'halfYear'>('monthly')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string
    value: number
    x: number
    y: number
  } | null>({
    label: 'Jun',
    value: 12450,
    x: 45,
    y: 64,
  })

  const data = chartDataSets[period]

  // Generate SVG path coordinate strings
  const width = 500
  const height = 150
  const stepX = width / (data.length - 1)

  const pointsString = data
    .map((d, i) => `${i * stepX},${d.pointsY}`)
    .join(' ')

  const areaPath = `0,${data[0].pointsY} ${pointsString} L${width},${height} L0,${height} Z`

  return (
    <div className="dash-chart-card">
      <div className="dash-chart-header">
        <div>
          <h4 className="dash-chart-title">Revenue Overview</h4>
          <span className="dash-chart-subtitle">Monthly performance</span>
        </div>

        <div className="relative">
          <button
            className="dash-filter-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>
              {period === 'monthly' ? 'Monthly' : period === 'quarterly' ? 'Quarterly' : 'Last 6 months'}
            </span>
            <ChevronDown size={12} />
          </button>

          {dropdownOpen && (
            <div className="dash-dropdown-select">
              <button
                className={period === 'monthly' ? 'active' : ''}
                onClick={() => {
                  setPeriod('monthly')
                  setDropdownOpen(false)
                }}
              >
                Monthly
              </button>
              <button
                className={period === 'halfYear' ? 'active' : ''}
                onClick={() => {
                  setPeriod('halfYear')
                  setDropdownOpen(false)
                }}
              >
                Last 6 months
              </button>
              <button
                className={period === 'quarterly' ? 'active' : ''}
                onClick={() => {
                  setPeriod('quarterly')
                  setDropdownOpen(false)
                }}
              >
                Quarterly
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dash-chart-body">
        {/* Y Axis */}
        <div className="dash-chart-y">
          <span>$25K</span>
          <span>$20K</span>
          <span>$15K</span>
          <span>$10K</span>
          <span>$5K</span>
          <span>$0</span>
        </div>

        {/* Chart Canvas */}
        <div className="dash-chart-canvas-wrap">
          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="dash-chart-tooltip"
              style={{
                left: `${hoveredPoint.x}%`,
                top: `${hoveredPoint.y - 45}px`,
              }}
            >
              <strong>${hoveredPoint.value.toLocaleString()}</strong>
              <small>+7.2% from last month</small>
            </div>
          )}

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="dash-svg-chart"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4358e8" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4358e8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[25, 50, 75, 100, 125].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke="#f1f4f9"
                strokeWidth="1"
              />
            ))}

            {/* Gradient Area */}
            <polygon points={`0,${height} ${pointsString} ${width},${height}`} fill="url(#chartGradient)" />

            {/* Line */}
            <polyline
              points={pointsString}
              fill="none"
              stroke="#4358e8"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data interactive dots */}
            {data.map((d, i) => {
              const cx = i * stepX
              const cy = d.pointsY
              const isSelected = hoveredPoint?.label === d.label
              return (
                <g key={d.label}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#4358e8' : '#ffffff'}
                    stroke="#4358e8"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        label: d.label,
                        value: d.value,
                        x: (cx / width) * 100,
                        y: cy,
                      })
                    }
                  />
                </g>
              )
            })}
          </svg>

          {/* X Axis */}
          <div className="dash-chart-x">
            {data.map((d) => (
              <span
                key={d.label}
                className={hoveredPoint?.label === d.label ? 'text-blue-600 font-semibold' : ''}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
