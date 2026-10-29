const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
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
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member', 'Viewer'],
      default: 'Member',
    },
    avatar: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Invited', 'Suspended'],
      default: 'Active',
    },
    joinedAt: { type: String, default: 'Just now' },
  },
  { timestamps: true }
)

teamMemberSchema.index({ workspaceId: 1, email: 1 })

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema)
