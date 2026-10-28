'use client'

import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle, Clock, Tag } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface TaskItem {
  id: string
  title: string
  project: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  done: boolean
}

const initialTasks: TaskItem[] = [
  { id: '1', title: 'Prepare Q2 executive pitch deck', project: 'Marketing Campaign', priority: 'High', dueDate: 'Today', done: false },
  { id: '2', title: 'Review Stripe checkout webhook payloads', project: 'API Integration', priority: 'High', dueDate: 'Tomorrow', done: false },
  { id: '3', title: 'Finalize mobile responsive nav tokens', project: 'Website Redesign', priority: 'Medium', dueDate: 'May 2', done: true },
  { id: '4', title: 'Conduct user feedback session with beta testers', project: 'Mobile App', priority: 'Low', dueDate: 'May 5', done: false },
  { id: '5', title: 'Set up automated database index routine', project: 'Dashboard Analytics', priority: 'Medium', dueDate: 'May 8', done: false },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      project: 'General',
      priority: 'Medium',
      dueDate: 'This week',
      done: false,
    }
    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
    setShowAdd(false)
  }

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Tasks & Workflows</h1>
          <p className="dash-page-subtitle">Track your individual and team deliverables.</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="button button-primary text-xs py-2.5 px-4 font-semibold"
        >
          <Plus size={15} /> Add Task
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddTask} className="mb-6 p-4 bg-white border border-blue-200 rounded-xl shadow-sm flex gap-3">
          <input
            type="text"
            className="input-field flex-1 text-xs"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="button button-primary text-xs px-4 py-2">
            Create
          </button>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleDone(task.id)}
              className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {task.done ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} />
                  )}
                </button>
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Tag size={10} /> {task.project}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    task.priority === 'High'
                      ? 'bg-red-50 text-red-600'
                      : task.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={11} /> {task.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
