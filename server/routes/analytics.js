const express = require('express')
const router = express.Router()

const stats = [
  {
    label: 'Total Revenue',
    value: '$24,893',
    change: '+12%',
    trend: 'up',
    caption: 'from last month',
    iconType: 'revenue',
  },
  {
    label: 'Active Users',
    value: '12,482',
    change: '+8%',
    trend: 'up',
    caption: 'from last month',
    iconType: 'users',
  },
  {
    label: 'Projects',
    value: '28',
    change: '+4%',
    trend: 'up',
    caption: 'from last month',
    iconType: 'projects',
  },
  {
    label: 'Conversion Rate',
    value: '4.8%',
    change: '+1.2%',
    trend: 'up',
    caption: 'from last month',
    iconType: 'conversion',
  },
]

const monthlyRevenue = [
  { name: 'Jan', revenue: 4200, users: 1100 },
  { name: 'Feb', revenue: 6800, users: 2400 },
  { name: 'Mar', revenue: 8400, users: 3800 },
  { name: 'Apr', revenue: 10200, users: 5100 },
  { name: 'May', revenue: 9500, users: 6200 },
  { name: 'Jun', revenue: 12450, users: 7900 },
  { name: 'Jul', revenue: 14100, users: 8900 },
  { name: 'Aug', revenue: 16800, users: 10200 },
  { name: 'Sep', revenue: 19400, users: 11400 },
  { name: 'Oct', revenue: 21200, users: 11900 },
  { name: 'Nov', revenue: 23100, users: 12150 },
  { name: 'Dec', revenue: 24893, users: 12482 },
]

router.get('/stats', (req, res) => {
  res.json({ stats })
})

router.get('/revenue', (req, res) => {
  res.json({ data: monthlyRevenue })
})

module.exports = router
