const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, enum: ['Owner', 'Admin', 'Member', 'Viewer'], default: 'Member' },
    avatar: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Invited', 'Suspended'], default: 'Active' },
    joinedAt: { type: String, default: 'Jan 2024' },
  },
  { timestamps: true }
)

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema)
