const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Owner', 'Admin', 'Member', 'Viewer'], default: 'Member' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    company: { type: String, default: 'SaaSly Inc.' },
    plan: { type: String, enum: ['Starter', 'Pro', 'Business'], default: 'Pro' },
  },
  { timestamps: true }
)

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
