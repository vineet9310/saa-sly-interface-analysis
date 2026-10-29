require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const teamRoutes = require('./routes/teams')
const analyticsRoutes = require('./routes/analytics')
const { apiLimiter } = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saasly'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'
const IS_PROD = process.env.NODE_ENV === 'production'

// Middleware
app.use(
  cors({
    origin: IS_PROD ? CORS_ORIGIN : true,
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))

// Apply general API rate limiter
app.use('/api/', apiLimiter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'MongoDB Connected' : dbState === 2 ? 'Connecting' : 'Disconnected'

  res.json({
    status: 'online',
    app: 'SaaSly API Engine',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: true, message: `Route not found: ${req.method} ${req.url}` })
})

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[SaaSly Server Error]:', err.stack)
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error',
  })
})

// Connect to MongoDB
let serverInstance = null

function connectDatabase() {
  return mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('✓ Successfully connected to MongoDB:', MONGODB_URI)
    })
    .catch((err) => {
      console.error('✗ MongoDB connection error:', err.message)
      if (IS_PROD) {
        console.error('[FATAL] Database connection required in production mode. Aborting.')
        process.exit(1)
      } else {
        console.warn('ℹ Running without active database connection. Database queries may fail.')
      }
    })
}

// Start server when not imported by tests
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
    serverInstance = app.listen(PORT, () => {
      console.log(`🚀 SaaSly API Server running on http://localhost:${PORT}`)
    })
  })
}

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`)
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('HTTP server closed.')
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.')
        process.exit(0)
      })
    })
  } else {
    mongoose.connection.close(false).then(() => {
      process.exit(0)
    })
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

module.exports = app
