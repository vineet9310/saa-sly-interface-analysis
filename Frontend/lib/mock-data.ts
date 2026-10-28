import { Project, TeamMember, Activity, MetricStat, AppNotification } from './types'

export const initialCurrentUser = {
  id: 'usr_1',
  name: 'Alex Carter',
  email: 'alex@example.com',
  role: 'Owner' as const,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  bio: 'Product designer and developer.',
  company: 'SaaSly Inc.',
  plan: 'Pro' as const,
  createdAt: '2024-01-15',
}

export const initialStats: MetricStat[] = [
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

export const initialProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Website Redesign',
    description: 'Modernizing corporate marketing website with high conversion design system.',
    team: [
      { id: '1', name: 'Alex Carter' },
      { id: '2', name: 'Sarah Khan' },
      { id: '3', name: 'Mike Johnson' },
    ],
    progress: 80,
    status: 'In Progress',
    dueDate: 'Apr 25, 2024',
    budget: '$18,500',
    category: 'Design & Web',
  },
  {
    id: 'proj_2',
    name: 'Mobile App',
    description: 'iOS and Android client application for on-the-go workspace analytics.',
    team: [
      { id: '1', name: 'Alex Carter' },
      { id: '4', name: 'Emily Davis' },
    ],
    progress: 60,
    status: 'In Progress',
    dueDate: 'May 10, 2024',
    budget: '$34,000',
    category: 'Mobile Dev',
  },
  {
    id: 'proj_3',
    name: 'Marketing Campaign',
    description: 'Q2 product launch campaigns across LinkedIn, Twitter, and paid search.',
    team: [
      { id: '2', name: 'Sarah Khan' },
      { id: '5', name: 'David Wilson' },
    ],
    progress: 100,
    status: 'Completed',
    dueDate: 'Apr 12, 2024',
    budget: '$12,000',
    category: 'Marketing',
  },
  {
    id: 'proj_4',
    name: 'Dashboard Analytics',
    description: 'Real-time telemetry and reporting engine for enterprise customers.',
    team: [
      { id: '3', name: 'Mike Johnson' },
      { id: '4', name: 'Emily Davis' },
    ],
    progress: 40,
    status: 'In Progress',
    dueDate: 'May 20, 2024',
    budget: '$22,500',
    category: 'Engineering',
  },
  {
    id: 'proj_5',
    name: 'API Integration',
    description: 'Stripe, Slack, and Webhook bi-directional automation connectors.',
    team: [
      { id: '1', name: 'Alex Carter' },
      { id: '5', name: 'David Wilson' },
    ],
    progress: 20,
    status: 'Not Started',
    dueDate: 'Jun 5, 2024',
    budget: '$15,000',
    category: 'Backend',
  },
]

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm_1',
    name: 'Alex Carter',
    email: 'alex@example.com',
    role: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    status: 'Active',
    joinedAt: 'Jan 2023',
  },
  {
    id: 'tm_2',
    name: 'Sarah Khan',
    email: 'sarah@example.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    status: 'Active',
    joinedAt: 'Mar 2023',
  },
  {
    id: 'tm_3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    status: 'Active',
    joinedAt: 'Jul 2023',
  },
  {
    id: 'tm_4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
    status: 'Active',
    joinedAt: 'Nov 2023',
  },
  {
    id: 'tm_5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    status: 'Active',
    joinedAt: 'Feb 2024',
  },
]

export const initialActivities: Activity[] = [
  {
    id: 'act_1',
    title: 'New user registered',
    time: '2 minutes ago',
    color: 'blue',
  },
  {
    id: 'act_2',
    title: 'Project “Website Redesign” updated',
    time: '12 minutes ago',
    color: 'violet',
  },
  {
    id: 'act_3',
    title: 'Payment of $99 received',
    time: '1 hour ago',
    color: 'green',
  },
  {
    id: 'act_4',
    title: 'New team member added',
    time: '3 hours ago',
    color: 'purple',
  },
  {
    id: 'act_5',
    title: 'System backup completed',
    time: '5 hours ago',
    color: 'orange',
  },
]

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Payment Successful',
    description: 'Pro plan renewed successfully for $29/mo.',
    time: '10m ago',
    read: false,
    type: 'payment',
  },
  {
    id: 'notif_2',
    title: 'Milestone reached',
    description: 'Website Redesign achieved 80% completion!',
    time: '45m ago',
    read: false,
    type: 'project',
  },
  {
    id: 'notif_3',
    title: 'Sarah Khan joined project',
    description: 'Added to Marketing Campaign sprint.',
    time: '2h ago',
    read: true,
    type: 'user',
  },
  {
    id: 'notif_4',
    title: 'Weekly Analytics Report',
    description: 'Total revenue grew by +12% this month.',
    time: '1d ago',
    read: true,
    type: 'system',
  },
]

export const revenueMonthlyData = [
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
