'use client'

import React, { useState } from 'react'
import { Plus, Search, MoreHorizontal, Edit, Trash2, FolderKanban } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProjectModal } from '@/components/ui/ProjectModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useData } from '@/context/DataContext'
import { Project, ProjectStatus } from '@/lib/types'

type FilterTab = 'All' | 'Active' | 'Completed' | 'Archived'

export default function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject } = useData()

  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // Filter projects by tab and search
  const filteredProjects = projects.filter((p) => {
    // Tab filter
    if (activeTab === 'Active' && p.status !== 'In Progress') return false
    if (activeTab === 'Completed' && p.status !== 'Completed') return false
    if (activeTab === 'Archived' && p.status !== 'Archived') return false

    // Search query
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const handleOpenCreate = () => {
    setEditingProject(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setModalOpen(true)
    setActionMenuOpen(null)
  }

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project)
    setDeleteConfirmOpen(true)
    setActionMenuOpen(null)
  }

  const [errorBanner, setErrorBanner] = useState('')

  const handleSaveProject = async (data: Partial<Project>) => {
    setErrorBanner('')
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data)
      } else {
        await createProject(data)
      }
      setModalOpen(false)
    } catch (err: any) {
      setErrorBanner(err?.message || 'Failed to save project.')
    }
  }

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      setErrorBanner('')
      try {
        await deleteProject(projectToDelete.id)
        setProjectToDelete(null)
      } catch (err: any) {
        setErrorBanner(err?.message || 'Failed to delete project.')
      }
    }
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Projects</h1>
          <p className="dash-page-subtitle">
            Manage and track all your projects in one place.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="button button-primary text-xs py-2.5 px-4 font-semibold"
        >
          <Plus size={15} /> New Project
        </button>
      </div>

      {errorBanner && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
          {errorBanner}
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['All', 'Active', 'Completed', 'Archived'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Projects Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Team</th>
              <th className="table-th">Progress</th>
              <th className="table-th">Status</th>
              <th className="table-th">Due Date</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No projects found matching your search.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p, idx) => {
                const isNearBottom = idx >= Math.max(0, filteredProjects.length - 2)
                return (
                  <tr key={p.id}>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 grid place-items-center flex-shrink-0">
                          <FolderKanban size={14} />
                        </div>
                        <div>
                          <strong className="block text-xs font-semibold text-slate-800">
                            {p.name}
                          </strong>
                          {p.description && (
                            <span className="block text-[10px] text-slate-400 truncate max-w-xs">
                              {p.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="table-td">
                      <div className="avatar-group">
                        {p.team.map((m, tIdx) => (
                          <div key={tIdx} className="avatar-group-item" title={m.name}>
                            {m.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="table-td">
                      <div className="progress-wrap">
                        <div className="progress-bg">
                          <div
                            className="progress-fill"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="progress-val">{p.progress}%</span>
                      </div>
                    </td>

                    <td className="table-td">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="table-td text-xs text-slate-500">{p.dueDate}</td>

                    <td className="table-td text-right relative">
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                        onClick={() =>
                          setActionMenuOpen(actionMenuOpen === p.id ? null : p.id)
                        }
                        aria-label="Actions menu"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {actionMenuOpen === p.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20 cursor-default"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActionMenuOpen(null)
                            }}
                          />
                          <div
                            className={`absolute right-4 ${
                              isNearBottom ? 'bottom-8' : 'top-8'
                            } bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 w-28 text-left`}
                          >
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleOpenDelete(p)}
                              className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProject}
        initialData={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        danger={true}
      />
    </DashboardLayout>
  )
}
