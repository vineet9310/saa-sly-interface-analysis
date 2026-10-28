'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Project, ProjectStatus } from '@/lib/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Project>) => void
  initialData?: Project | null
}

export function ProjectModal({ isOpen, onClose, onSubmit, initialData }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('In Progress')
  const [progress, setProgress] = useState(50)
  const [dueDate, setDueDate] = useState('')
  const [budget, setBudget] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
      setStatus(initialData.status)
      setProgress(initialData.progress)
      setDueDate(initialData.dueDate)
      setBudget(initialData.budget || '')
    } else {
      setName('')
      setDescription('')
      setStatus('In Progress')
      setProgress(30)
      setDueDate('May 25, 2024')
      setBudget('$15,000')
    }
    setError('')
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a project name')
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      status,
      progress: Number(progress),
      dueDate: dueDate || 'Jun 1, 2024',
      budget: budget || '$10,000',
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Website Redesign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="input-field h-20 resize-none"
            placeholder="Brief overview of project objectives..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. May 30, 2024"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Budget</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. $20,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="button button-outline text-xs px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary text-xs px-4 py-2"
          >
            {initialData ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
