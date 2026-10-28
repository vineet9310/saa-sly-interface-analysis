const express = require('express')
const router = express.Router()
const Project = require('../models/Project')

// In-memory initial projects store
let memoryProjects = [
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

// GET all projects
router.get('/', async (req, res) => {
  try {
    try {
      const dbProjects = await Project.find().sort({ createdAt: -1 })
      if (dbProjects && dbProjects.length > 0) {
        return res.json({
          projects: dbProjects.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            team: p.team,
            progress: p.progress,
            status: p.status,
            dueDate: p.dueDate,
            budget: p.budget,
          })),
        })
      }
    } catch (e) {}

    res.json({ projects: memoryProjects })
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving projects' })
  }
})

// POST create project
router.post('/', async (req, res) => {
  try {
    const { name, description, progress, status, dueDate, budget, team } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    let createdProject = null
    try {
      const p = await Project.create({
        name,
        description: description || '',
        progress: progress || 0,
        status: status || 'In Progress',
        dueDate: dueDate || 'May 30, 2024',
        budget: budget || '$10,000',
        team: team || [{ id: '1', name: 'Alex Carter' }],
      })
      createdProject = {
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        progress: p.progress,
        status: p.status,
        dueDate: p.dueDate,
        budget: p.budget,
        team: p.team,
      }
    } catch (e) {
      createdProject = {
        id: `proj_${Date.now()}`,
        name,
        description: description || '',
        progress: Number(progress) || 0,
        status: status || 'In Progress',
        dueDate: dueDate || 'May 30, 2024',
        budget: budget || '$10,000',
        team: team || [{ id: '1', name: 'Alex Carter' }],
      }
      memoryProjects.unshift(createdProject)
    }

    res.status(201).json({ project: createdProject })
  } catch (err) {
    res.status(500).json({ message: 'Error creating project' })
  }
})

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    try {
      const updated = await Project.findByIdAndUpdate(id, updates, { new: true })
      if (updated) {
        return res.json({
          project: {
            id: updated._id.toString(),
            name: updated.name,
            description: updated.description,
            progress: updated.progress,
            status: updated.status,
            dueDate: updated.dueDate,
            budget: updated.budget,
            team: updated.team,
          },
        })
      }
    } catch (e) {}

    // Memory update
    memoryProjects = memoryProjects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    const proj = memoryProjects.find((p) => p.id === id)
    res.json({ project: proj })
  } catch (err) {
    res.status(500).json({ message: 'Error updating project' })
  }
})

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    try {
      await Project.findByIdAndDelete(id)
    } catch (e) {}

    memoryProjects = memoryProjects.filter((p) => p.id !== id)
    res.json({ message: 'Project deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' })
  }
})

module.exports = router
