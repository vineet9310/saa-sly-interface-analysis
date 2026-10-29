const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        role: {
          type: String,
          enum: ['Owner', 'Admin', 'Member', 'Viewer'],
          default: 'Member',
        },
        status: {
          type: String,
          enum: ['Active', 'Invited', 'Suspended'],
          default: 'Active',
        },
        joinedAt: { type: String, default: 'Just now' },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema)

