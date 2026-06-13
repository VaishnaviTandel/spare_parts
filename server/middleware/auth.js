const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authentication token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    req.user = { id: payload.id, username: payload.username, email: payload.email }
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = auth
