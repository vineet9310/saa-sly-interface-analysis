import {
  Bell,
  CalendarDays,
  ChevronDown,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  LineChart,
  MoreHorizontal,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Analytics', icon: LineChart },
  { label: 'Team', icon: Users },
  { label: 'Integrations', icon: SlidersHorizontal },
  { label: 'Settings', icon: Settings },
]

const points = '0,116 22,105 44,110 66,99 88,103 110,91 132,96 154,82 176,88 198,72 220,81 242,61 264,67 286,49 308,54 330,35 352,42 374,19'

export function SaaslyDashboardPreview() {
  return (
    <div className="dashboard-preview" aria-label="SaaSly dashboard preview">
      <aside className="preview-sidebar">
        <div className="preview-brand"><span className="brand-mark">✦</span><strong>SaaSly</strong></div>
        <div className="preview-nav">
          {navItems.map(({ label, icon: Icon, active }) => (
            <div className={`preview-nav-item ${active ? 'active' : ''}`} key={label}>
              <Icon size={13} /> <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="preview-upgrade"><span>✦</span><strong>Upgrade to Pro</strong><small>Get more features</small></div>
      </aside>
      <div className="preview-main">
        <header className="preview-topbar">
          <div className="preview-search"><Search size={12} /> Search anything...</div>
          <div className="preview-top-actions"><Bell size={13} /><span className="dot" /><div className="mini-avatar">AC</div><span className="preview-name">Alex Carter</span><MoreHorizontal size={14} /></div>
        </header>
        <div className="preview-content">
          <div className="preview-heading"><div><h3>Good morning, Alex</h3><p>Here&apos;s what&apos;s happening with your business today.</p></div><button className="date-button"><CalendarDays size={12} /> Apr 1, 2024 - Apr 30, 2024 <ChevronDown size={12} /></button></div>
          <div className="metric-grid">
            {[['Total Revenue', '$24,893', '+12%', 'from last month'], ['Active Users', '12,482', '+8%', 'from last month'], ['Projects', '28', '+4%', 'from last month'], ['Conversion Rate', '4.8%', '+2.1%', 'from last month']].map(([label, value, change, caption], index) => (
              <div className="metric-card" key={label}><div className={`metric-icon icon-${index}`}><Grid2X2 size={13} /></div><span>{label}</span><strong>{value}</strong><small><b>{change}</b> {caption}</small></div>
            ))}
          </div>
          <div className="preview-columns">
            <div className="chart-card"><div className="card-heading"><div><strong>Revenue Overview</strong><small>Monthly performance</small></div><button>Monthly <ChevronDown size={11} /></button></div><div className="chart-area"><div className="chart-y"><span>$20K</span><span>$15K</span><span>$10K</span><span>$5K</span><span>$0</span></div><div className="chart"><div className="chart-tooltip"><strong>$12,450</strong><small>+7.2% from last month</small></div><svg viewBox="0 0 374 130" preserveAspectRatio="none" role="img" aria-label="Revenue line chart"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4c61f2" stopOpacity=".23" /><stop offset="1" stopColor="#4c61f2" stopOpacity="0" /></linearGradient></defs><path d={`${points} L374,130 L0,130 Z`} fill="url(#chart-fill)" /><polyline points={points} fill="none" stroke="#4358e8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="chart-x"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div></div></div>
            <div className="activity-card"><div className="card-heading"><div><strong>Recent Activity</strong><small>Latest updates</small></div><button><MoreHorizontal size={14} /></button></div><div className="activity-list">{[['New user registered','2 minutes ago','blue'],['Project “Website Redesign” updated','12 minutes ago','violet'],['Payment of $99 received','1 hour ago','green'],['New team member added','3 hours ago','purple'],['Feedback survey completed','5 hours ago','orange']].map(([title,time,color]) => <div className="activity-item" key={title}><span className={`activity-dot ${color}`}>✦</span><div><strong>{title}</strong><small>{time}</small></div></div>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
