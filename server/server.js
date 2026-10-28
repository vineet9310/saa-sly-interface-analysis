require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const teamRoutes = require('./routes/teams')
const analyticsRoutes = require('./routes/analytics')

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saasly'

// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/analytics', analyticsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SaaSly API Engine',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Store Active',
    timestamp: new Date().toISOString(),
  })
})

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[SaaSly Server Error]:', err.stack)
  res.status(500).json({
    error: true,
    message: err.message || 'Internal server error',
  })
})

// Database Connection with graceful fallback
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 2000,
  })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB:', MONGODB_URI)
  })
  .catch((err) => {
    console.log('ℹ Local MongoDB not detected. Operating seamlessly with resilient in-memory mock store!')
  })

const server = app.listen(PORT, () => {
  console.log(`🚀 SaaSly API Server running on http://localhost:${PORT}`)
})

module.exports = app
