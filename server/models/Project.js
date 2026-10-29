const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    team: [
      {
        id: { type: String },
        name: { type: String },
        avatar: { type: String },
      },
    ],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Not Started', 'Archived'],
      default: 'In Progress',
    },
    dueDate: { type: String, default: 'May 30, 2024' },
    budget: { type: String, default: '$15,000' },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
)

projectSchema.index({ workspaceId: 1, createdAt: -1 })

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema)
