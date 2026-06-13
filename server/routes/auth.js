const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const signToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'supersecret',
    { expiresIn: '7d' }
  )

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' })
    }

    const existingUser = await User.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] })
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use' })
    }

    const user = await User.create({ username, email, password })
    const token = signToken(user)
    res.status(201).json({ user: { id: user._id, username: user.username, email: user.email }, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' })
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = signToken(user)
    res.json({ user: { id: user._id, username: user.username, email: user.email }, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing auth token' })

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    res.json({ id: payload.id, username: payload.username, email: payload.email })
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router
