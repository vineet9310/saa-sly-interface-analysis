const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {
  authenticateToken,
  requireWorkspace,
  requireRole,
} = require('../middleware/auth')
const TeamMember = require('../models/TeamMember')
const Workspace = require('../models/Workspace')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Apply authentication and workspace isolation
router.use(authenticateToken)
router.use(requireWorkspace)

// GET /api/teams — List members for workspace
router.get('/', async (req, res) => {
  try {
    const dbMembers = await TeamMember.find({ workspaceId: req.workspaceId }).sort({
      createdAt: 1,
    })

    const members = dbMembers.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
      avatar:
        m.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      status: m.status,
      joinedAt: m.joinedAt,
    }))

    res.json({ members })
  } catch (err) {
    console.error('Error fetching team members:', err)
    res.status(500).json({ message: 'Error retrieving team members.' })
  }
})

// POST /api/teams/invite — Invite a new member
router.post('/invite', requireRole(['Owner', 'Admin']), async (req, res) => {
  try {
    const { name, email, role } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' })
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }

    const allowedRoles = ['Owner', 'Admin', 'Member', 'Viewer']
    const assignedRole = allowedRoles.includes(role) ? role : 'Member'

    // Only Owner can invite someone directly as Owner
    if (assignedRole === 'Owner' && req.userRole !== 'Owner') {
      return res.status(403).json({ message: 'Only workspace owners can assign Owner role.' })
    }

    // Check duplicate in workspace
    const existing = await TeamMember.findOne({
      workspaceId: req.workspaceId,
      email: normalizedEmail,
    })
    if (existing) {
      return res.status(400).json({ message: 'A team member with this email already exists in this workspace.' })
    }

    const member = await TeamMember.create({
      workspaceId: req.workspaceId,
      name: name.trim(),
      email: normalizedEmail,
      role: assignedRole,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (Math.floor(Math.random() * 900000000))}?auto=format&fit=crop&w=120&h=120&q=80`,
      status: 'Active',
      joinedAt: 'Just now',
    })

    // Also sync to workspace.members
    await Workspace.findByIdAndUpdate(req.workspaceId, {
      $push: {
        members: {
          name: member.name,
          email: member.email,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
        },
      },
    })

    res.status(201).json({
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        status: member.status,
        joinedAt: member.joinedAt,
      },
    })
  } catch (err) {
    console.error('Error inviting team member:', err)
    res.status(500).json({ message: 'Error inviting team member.' })
  }
})

// PATCH /api/teams/:id — Update role
router.patch('/:id', requireRole(['Owner', 'Admin']), async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid member ID format.' })
    }

    const allowedRoles = ['Owner', 'Admin', 'Member', 'Viewer']
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(', ')}` })
    }

    const member = await TeamMember.findOne({ _id: id, workspaceId: req.workspaceId })
    if (!member) {
      return res.status(404).json({ message: 'Team member not found in this workspace.' })
    }

    // Protection: Non-owners cannot modify an Owner's role
    if (member.role === 'Owner' && req.userRole !== 'Owner') {
      return res.status(403).json({ message: 'Only workspace owners can modify owner privileges.' })
    }

    // Protection: Only current Owner can promote someone to Owner
    if (role === 'Owner' && req.userRole !== 'Owner') {
      return res.status(403).json({ message: 'Only workspace owners can promote members to Owner.' })
    }

    member.role = role
    await member.save()

    // Sync in workspace.members array
    await Workspace.updateOne(
      { _id: req.workspaceId, 'members.email': member.email },
      { $set: { 'members.$.role': role } }
    )

    res.json({
      message: 'Role updated successfully',
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        status: member.status,
        joinedAt: member.joinedAt,
      },
    })
  } catch (err) {
    console.error('Error updating member role:', err)
    res.status(500).json({ message: 'Error updating member role.' })
  }
})

// DELETE /api/teams/:id — Remove member
router.delete('/:id', requireRole(['Owner', 'Admin']), async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid member ID format.' })
    }

    const member = await TeamMember.findOne({ _id: id, workspaceId: req.workspaceId })
    if (!member) {
      return res.status(404).json({ message: 'Team member not found in this workspace.' })
    }

    // Protection: Cannot remove workspace Owner
    if (member.role === 'Owner') {
      return res.status(400).json({
        message: 'Cannot remove workspace owner. Transfer workspace ownership before removing this user.',
      })
    }

    await TeamMember.findByIdAndDelete(id)

    // Remove from workspace.members array
    await Workspace.findByIdAndUpdate(req.workspaceId, {
      $pull: { members: { email: member.email } },
    })

    res.json({ message: 'Team member removed successfully' })
  } catch (err) {
    console.error('Error removing team member:', err)
    res.status(500).json({ message: 'Error removing team member.' })
  }
})

module.exports = router
