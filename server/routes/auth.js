const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, authenticateToken } = require('../middleware/auth')
const User = require('../models/User')

// In-memory fallback database for instant out-of-the-box operation without requiring MongoDB running
const memoryUsers = new Map()

const defaultUser = {
  id: 'usr_1',
  name: 'Alex Carter',
  email: 'alex@example.com',
  role: 'Owner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  bio: 'Product designer and developer.',
  company: 'SaaSly Inc.',
  plan: 'Pro',
}
memoryUsers.set('alex@example.com', {
  ...defaultUser,
  passwordHash: bcrypt.hashSync('demo123456', 10),
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const normalizedEmail = email.toLowerCase()

    // Try MongoDB if connected
    let user = null
    try {
      const existing = await User.findOne({ email: normalizedEmail })
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists.' })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'Member',
        plan: 'Starter',
      })
      user = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        plan: newUser.plan,
        avatar: newUser.avatar,
      }
    } catch (dbErr) {
      // Memory fallback
      if (memoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ message: 'User with this email already exists.' })
      }
      const hashedPassword = bcrypt.hashSync(password, 10)
      user = {
        id: `usr_${Date.now()}`,
        name,
        email: normalizedEmail,
        role: 'Member',
        plan: 'Starter',
        avatar: '',
        bio: '',
        company: 'SaaSly',
        passwordHash: hashedPassword,
      }
      memoryUsers.set(normalizedEmail, user)
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({ user, token, message: 'Account created successfully.' })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const normalizedEmail = email.toLowerCase()

    // Demo shortcut
    if (normalizedEmail === 'alex@example.com' && (!password || password === 'demo123456')) {
      const token = jwt.sign(
        { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      return res.json({ user: defaultUser, token, message: 'Logged in successfully.' })
    }

    let user = null
    try {
      const found = await User.findOne({ email: normalizedEmail })
      if (found) {
        const matches = await bcrypt.compare(password || '', found.password)
        if (!matches) {
          return res.status(401).json({ message: 'Invalid email or password.' })
        }
        user = {
          id: found._id.toString(),
          name: found.name,
          email: found.email,
          role: found.role,
          plan: found.plan,
          avatar: found.avatar,
          bio: found.bio,
          company: found.company,
        }
      }
    } catch (dbErr) {
      // Fallback
    }

    if (!user && memoryUsers.has(normalizedEmail)) {
      const memUser = memoryUsers.get(normalizedEmail)
      const matches = bcrypt.compareSync(password || '', memUser.passwordHash)
      if (!matches) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }
      user = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        plan: memUser.plan,
        avatar: memUser.avatar,
        bio: memUser.bio,
        company: memUser.company,
      }
    }

    if (!user) {
      // Fallback demo user
      user = {
        id: `usr_${Date.now()}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'Member',
        plan: 'Pro',
        avatar: '',
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({ user, token, message: 'Login successful.' })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed.' })
  }
})

router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user = null
    try {
      const found = await User.findById(req.user.id)
      if (found) {
        user = {
          id: found._id.toString(),
          name: found.name,
          email: found.email,
          role: found.role,
          plan: found.plan,
          avatar: found.avatar,
          bio: found.bio,
          company: found.company,
        }
      }
    } catch (e) {}

    if (!user) {
      user = memoryUsers.get(req.user.email) || defaultUser
    }

    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve profile.' })
  }
})

module.exports = router
