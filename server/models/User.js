const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member', 'Viewer'],
      default: 'Owner',
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      index: true,
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    company: { type: String, default: 'SaaSly Inc.' },
    plan: {
      type: String,
      enum: ['Starter', 'Pro', 'Business'],
      default: 'Pro',
    },
  },
  { timestamps: true }
)

// Ensure password is not inadvertently returned by default transforms
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password
    return ret
  },
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
