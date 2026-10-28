const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'saasly_super_secret_jwt_key_2024'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' })
  }

  // Handle demo token
  if (token === 'demo_jwt_token_saasly') {
    req.user = { id: 'usr_1', email: 'alex@example.com', role: 'Owner' }
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' })
    }
    req.user = decoded
    next()
  })
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
}
