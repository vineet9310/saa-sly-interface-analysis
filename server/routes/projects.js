const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {
  authenticateToken,
  requireWorkspace,
  requireRole,
} = require('../middleware/auth')
const Project = require('../models/Project')

// Apply authentication and workspace isolation to all project endpoints
router.use(authenticateToken)
router.use(requireWorkspace)

// GET /api/projects — List projects for current workspace
router.get('/', async (req, res) => {
  try {
    const dbProjects = await Project.find({ workspaceId: req.workspaceId }).sort({
      createdAt: -1,
    })

    const projects = dbProjects.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      team: p.team,
      progress: p.progress,
      status: p.status,
      dueDate: p.dueDate,
      budget: p.budget,
      category: p.category,
      createdAt: p.createdAt,
    }))

    res.json({ projects })
  } catch (err) {
    console.error('Error fetching projects:', err)
    res.status(500).json({ message: 'Error retrieving projects.' })
  }
})

// POST /api/projects — Create project in current workspace
router.post('/', requireRole(['Owner', 'Admin', 'Member']), async (req, res) => {
  try {
    const { name, description, progress, status, dueDate, budget, category, team } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required.' })
    }

    const sanitizedProgress = Math.max(0, Math.min(100, Number(progress) || 0))
    const allowedStatuses = ['In Progress', 'Completed', 'Not Started', 'Archived']
    const sanitizedStatus = allowedStatuses.includes(status) ? status : 'In Progress'

    const project = await Project.create({
      workspaceId: req.workspaceId,
      userId: req.user.id,
      name: name.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      progress: sanitizedProgress,
      status: sanitizedStatus,
      dueDate: dueDate || 'May 30, 2024',
      budget: budget || '$10,000',
      category: category || 'General',
      team: Array.isArray(team) && team.length > 0 ? team : [{ id: '1', name: req.user.email.split('@')[0] }],
    })

    res.status(201).json({
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        progress: project.progress,
        status: project.status,
        dueDate: project.dueDate,
        budget: project.budget,
        category: project.category,
        team: project.team,
        createdAt: project.createdAt,
      },
    })
  } catch (err) {
    console.error('Error creating project:', err)
    res.status(500).json({ message: 'Error creating project.' })
  }
})

// PUT /api/projects/:id — Update project
router.put('/:id', requireRole(['Owner', 'Admin', 'Member']), async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID format.' })
    }

    const project = await Project.findOne({ _id: id, workspaceId: req.workspaceId })
    if (!project) {
      return res.status(404).json({ message: 'Project not found in this workspace.' })
    }

    const { name, description, progress, status, dueDate, budget, category, team } = req.body

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Project name cannot be empty.' })
      }
      project.name = name.trim()
    }
    if (description !== undefined) project.description = String(description).trim()
    if (progress !== undefined) {
      project.progress = Math.max(0, Math.min(100, Number(progress) || 0))
    }
    if (status !== undefined) {
      const allowed = ['In Progress', 'Completed', 'Not Started', 'Archived']
      if (allowed.includes(status)) project.status = status
    }
    if (dueDate !== undefined) project.dueDate = String(dueDate)
    if (budget !== undefined) project.budget = String(budget)
    if (category !== undefined) project.category = String(category)
    if (Array.isArray(team)) project.team = team

    await project.save()

    res.json({
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        progress: project.progress,
        status: project.status,
        dueDate: project.dueDate,
        budget: project.budget,
        category: project.category,
        team: project.team,
        createdAt: project.createdAt,
      },
    })
  } catch (err) {
    console.error('Error updating project:', err)
    res.status(500).json({ message: 'Error updating project.' })
  }
})

// DELETE /api/projects/:id — Delete project
router.delete('/:id', requireRole(['Owner', 'Admin']), async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID format.' })
    }

    const result = await Project.findOneAndDelete({ _id: id, workspaceId: req.workspaceId })
    if (!result) {
      return res.status(404).json({ message: 'Project not found in this workspace.' })
    }

    res.json({ message: 'Project deleted successfully' })
  } catch (err) {
    console.error('Error deleting project:', err)
    res.status(500).json({ message: 'Error deleting project.' })
  }
})

module.exports = router
