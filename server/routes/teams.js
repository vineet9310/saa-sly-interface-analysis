const express = require('express')
const router = express.Router()
const TeamMember = require('../models/TeamMember')

let memoryMembers = [
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

// GET all team members
router.get('/', async (req, res) => {
  try {
    try {
      const dbMembers = await TeamMember.find().sort({ createdAt: 1 })
      if (dbMembers && dbMembers.length > 0) {
        return res.json({
          members: dbMembers.map((m) => ({
            id: m._id.toString(),
            name: m.name,
            email: m.email,
            role: m.role,
            avatar: m.avatar,
            status: m.status,
            joinedAt: m.joinedAt,
          })),
        })
      }
    } catch (e) {}

    res.json({ members: memoryMembers })
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving team members' })
  }
})

// POST invite member
router.post('/invite', async (req, res) => {
  try {
    const { name, email, role } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' })
    }

    let created = null
    try {
      const m = await TeamMember.create({
        name,
        email: email.toLowerCase(),
        role: role || 'Member',
        status: 'Active',
        joinedAt: 'Just now',
      })
      created = {
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        role: m.role,
        avatar: m.avatar,
        status: m.status,
        joinedAt: m.joinedAt,
      }
    } catch (e) {
      created = {
        id: `tm_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: role || 'Member',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        status: 'Active',
        joinedAt: 'Just now',
      }
      memoryMembers.push(created)
    }

    res.status(201).json({ member: created })
  } catch (err) {
    res.status(500).json({ message: 'Error inviting team member' })
  }
})

// PATCH update role
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    try {
      await TeamMember.findByIdAndUpdate(id, { role })
    } catch (e) {}

    memoryMembers = memoryMembers.map((m) => (m.id === id ? { ...m, role } : m))
    res.json({ message: 'Role updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating member role' })
  }
})

// DELETE remove member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    try {
      await TeamMember.findByIdAndDelete(id)
    } catch (e) {}

    memoryMembers = memoryMembers.filter((m) => m.id !== id)
    res.json({ message: 'Member removed from team' })
  } catch (err) {
    res.status(500).json({ message: 'Error removing team member' })
  }
})

module.exports = router
