const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  JWT_SECRET,
  authenticateToken,
  authLimiter,
} = require('../middleware/auth')
const User = require('../models/User')
const Workspace = require('../models/Workspace')
const Project = require('../models/Project')
const TeamMember = require('../models/TeamMember')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Helper to seed demo user and workspace in development
async function ensureDemoData() {
  const demoEmail = 'alex@example.com'
  let user = await User.findOne({ email: demoEmail })

  if (!user) {
    const passwordHash = await bcrypt.hash('demo123456', 10)
    user = await User.create({
      name: 'Alex Carter',
      email: demoEmail,
      password: passwordHash,
      role: 'Owner',
      company: 'SaaSly Inc.',
      bio: 'Product designer and developer.',
      plan: 'Pro',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    })

    const workspace = await Workspace.create({
      name: "Alex's Workspace",
      ownerId: user._id,
      members: [
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: 'Owner',
          status: 'Active',
          joinedAt: 'Jan 2023',
        },
      ],
    })

    user.workspaceId = workspace._id
    await user.save()

    // Seed Demo Team Members
    await TeamMember.insertMany([
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        role: 'Owner',
        avatar: user.avatar,
        status: 'Active',
        joinedAt: 'Jan 2023',
      },
      {
        workspaceId: workspace._id,
        name: 'Sarah Khan',
        email: 'sarah@example.com',
        role: 'Admin',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
        status: 'Active',
        joinedAt: 'Mar 2023',
      },
      {
        workspaceId: workspace._id,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'Member',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        status: 'Active',
        joinedAt: 'Jul 2023',
      },
      {
        workspaceId: workspace._id,
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Member',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
        status: 'Active',
        joinedAt: 'Nov 2023',
      },
      {
        workspaceId: workspace._id,
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'Viewer',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
        status: 'Active',
        joinedAt: 'Feb 2024',
      },
    ])

    // Seed Demo Projects
    await Project.insertMany([
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: 'Website Redesign',
        description: 'Modernizing corporate marketing website with high conversion design system.',
        progress: 80,
        status: 'In Progress',
        dueDate: 'Apr 25, 2024',
        budget: '$18,500',
        category: 'Design & Web',
        team: [{ id: '1', name: 'Alex Carter' }, { id: '2', name: 'Sarah Khan' }],
      },
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: 'Mobile App',
        description: 'iOS and Android client application for on-the-go workspace analytics.',
        progress: 60,
        status: 'In Progress',
        dueDate: 'May 10, 2024',
        budget: '$34,000',
        category: 'Mobile Dev',
        team: [{ id: '1', name: 'Alex Carter' }, { id: '4', name: 'Emily Davis' }],
      },
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: 'Marketing Campaign',
        description: 'Q2 product launch campaigns across LinkedIn, Twitter, and paid search.',
        progress: 100,
        status: 'Completed',
        dueDate: 'Apr 12, 2024',
        budget: '$12,000',
        category: 'Marketing',
        team: [{ id: '2', name: 'Sarah Khan' }],
      },
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: 'Dashboard Analytics',
        description: 'Real-time telemetry and reporting engine for enterprise customers.',
        progress: 40,
        status: 'In Progress',
        dueDate: 'May 20, 2024',
        budget: '$22,500',
        category: 'Engineering',
        team: [{ id: '3', name: 'Mike Johnson' }],
      },
      {
        workspaceId: workspace._id,
        userId: user._id,
        name: 'API Integration',
        description: 'Stripe, Slack, and Webhook bi-directional automation connectors.',
        progress: 20,
        status: 'Not Started',
        dueDate: 'Jun 5, 2024',
        budget: '$15,000',
        category: 'Backend',
        team: [{ id: '1', name: 'Alex Carter' }],
      },
    ])
  }

  return user
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' })
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required.' })
    }
    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'Owner',
      plan: 'Starter',
      company: `${name.trim()}'s Team`,
    })

    // Create user's initial workspace
    const workspace = await Workspace.create({
      name: `${newUser.company || newUser.name}'s Workspace`,
      ownerId: newUser._id,
      members: [
        {
          userId: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: 'Owner',
          status: 'Active',
          joinedAt: 'Just now',
        },
      ],
    })

    newUser.workspaceId = workspace._id
    await newUser.save()

    // Add user as owner in TeamMember collection
    await TeamMember.create({
      workspaceId: workspace._id,
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: 'Owner',
      status: 'Active',
      joinedAt: 'Just now',
    })

    // Seed 2 default starter projects so user sees active workspace immediately
    await Project.insertMany([
      {
        workspaceId: workspace._id,
        userId: newUser._id,
        name: 'Workspace Setup & Onboarding',
        description: 'Complete team setup, invite members, and configure workspace settings.',
        progress: 25,
        status: 'In Progress',
        dueDate: 'Next week',
        budget: '$5,000',
        category: 'Operations',
        team: [{ id: '1', name: newUser.name }],
      },
      {
        workspaceId: workspace._id,
        userId: newUser._id,
        name: 'Product Roadmap Q3',
        description: 'Define core deliverables and prioritize customer feedback milestones.',
        progress: 0,
        status: 'Not Started',
        dueDate: 'Next month',
        budget: '$10,000',
        category: 'Product',
        team: [{ id: '1', name: newUser.name }],
      },
    ])

    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
        workspaceId: workspace._id.toString(),
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const sanitizedUser = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      plan: newUser.plan,
      avatar: newUser.avatar,
      bio: newUser.bio,
      company: newUser.company,
      workspaceId: workspace._id.toString(),
    }

    res.status(201).json({
      user: sanitizedUser,
      token,
      message: 'Account created successfully.',
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'Registration failed due to a server error.' })
  }
})

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required.' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Find registered user
    let user = await User.findOne({ email: normalizedEmail })

    // If demo user in dev environment, auto seed if missing
    if (!user && normalizedEmail === 'alex@example.com' && process.env.NODE_ENV !== 'production') {
      user = await ensureDemoData()
    }

    // STRICT: Reject non-existent user with 401
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // STRICT: Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId ? user.workspaceId.toString() : undefined,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      workspaceId: user.workspaceId ? user.workspaceId.toString() : undefined,
    }

    res.json({
      user: sanitizedUser,
      token,
      message: 'Login successful.',
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed due to a server error.' })
  }
})

// POST /api/auth/demo-login — Development controlled demo login
router.post('/demo-login', authLimiter, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Demo login is disabled in production.' })
    }

    const demoUser = await ensureDemoData()
    const token = jwt.sign(
      {
        id: demoUser._id.toString(),
        email: demoUser.email,
        role: demoUser.role,
        workspaceId: demoUser.workspaceId ? demoUser.workspaceId.toString() : undefined,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const sanitizedUser = {
      id: demoUser._id.toString(),
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      plan: demoUser.plan,
      avatar: demoUser.avatar,
      bio: demoUser.bio,
      company: demoUser.company,
      workspaceId: demoUser.workspaceId ? demoUser.workspaceId.toString() : undefined,
    }

    res.json({
      user: sanitizedUser,
      token,
      message: 'Logged in as demo user.',
    })
  } catch (err) {
    console.error('Demo login error:', err)
    res.status(500).json({ message: 'Demo login failed.' })
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' })
    }

    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      workspaceId: user.workspaceId ? user.workspaceId.toString() : undefined,
    }

    res.json({ user: sanitizedUser })
  } catch (err) {
    console.error('Fetch me error:', err)
    res.status(500).json({ message: 'Failed to retrieve profile.' })
  }
})

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, company } = req.body
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (name && name.trim()) user.name = name.trim()
    if (typeof bio === 'string') user.bio = bio.trim()
    if (typeof company === 'string') user.company = company.trim()

    await user.save()

    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      workspaceId: user.workspaceId ? user.workspaceId.toString() : undefined,
    }

    res.json({ user: sanitizedUser, message: 'Profile updated successfully.' })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ message: 'Failed to update profile.' })
  }
})

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const matches = await bcrypt.compare(currentPassword, user.password)
    if (!matches) {
      return res.status(401).json({ message: 'Incorrect current password.' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ message: 'Failed to change password.' })
  }
})

module.exports = router
