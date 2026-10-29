const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const Workspace = require('../models/Workspace')

const JWT_SECRET = process.env.JWT_SECRET || 'saasly_super_secret_jwt_key_2024'

// In production, reject default/insecure secret
if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'saasly_super_secret_jwt_key_2024')
) {
  console.error('[FATAL] Insecure or missing JWT_SECRET in production environment.')
  process.exit(1)
}

// Authentication Rate Limiter (15 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
})

// General API Rate Limiter (300 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})

// Authenticate Bearer JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' })
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' })
    }
    if (!decoded || !decoded.id || !decoded.email) {
      return res.status(403).json({ message: 'Malformed token payload.' })
    }
    req.user = decoded
    next()
  })
}

// Workspace Authorization Middleware: guarantees tenant isolation
async function requireWorkspace(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' })
    }

    let workspace = null
    const requestedWorkspaceId = req.headers['x-workspace-id']

    if (requestedWorkspaceId) {
      workspace = await Workspace.findOne({
        _id: requestedWorkspaceId,
        $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
      })
    }

    if (!workspace) {
      // Find workspace where user is owner or member
      workspace = await Workspace.findOne({
        $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
      }).sort({ createdAt: 1 })
    }

    if (!workspace) {
      // If user has no workspace yet, auto-provision one
      const user = await User.findById(req.user.id)
      if (!user) {
        return res.status(401).json({ message: 'User account not found.' })
      }
      workspace = await Workspace.create({
        name: `${user.company || user.name}'s Workspace`,
        ownerId: user._id,
        members: [
          {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'Owner',
            status: 'Active',
            joinedAt: 'Just now',
          },
        ],
      })
      user.workspaceId = workspace._id
      await user.save()
    }

    // Determine user's role in this workspace
    let userRole = 'Member'
    if (workspace.ownerId.toString() === req.user.id.toString()) {
      userRole = 'Owner'
    } else {
      const membership = workspace.members.find(
        (m) => m.userId && m.userId.toString() === req.user.id.toString()
      )
      if (membership) {
        userRole = membership.role
      }
    }

    req.workspace = workspace
    req.workspaceId = workspace._id
    req.userRole = userRole

    next()
  } catch (err) {
    console.error('Workspace authorization error:', err)
    res.status(500).json({ message: 'Error establishing workspace context.' })
  }
}

// Role-based Access Control
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'No role assigned in this workspace.' })
    }
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Action not allowed for role '${req.userRole}'. Required: ${allowedRoles.join(', ')}.`,
      })
    }
    next()
  }
}

module.exports = {
  authenticateToken,
  requireWorkspace,
  requireRole,
  authLimiter,
  apiLimiter,
  JWT_SECRET,
}
