const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const router = express.Router()

const signToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'supersecret',
    { expiresIn: '7d' }
  )

const createTransport = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing in .env')
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

const sendResetEmail = async (email, token) => {
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const resetUrl = `${frontendUrl}/?resetPassword=true&token=${token}&email=${encodeURIComponent(email)}`
  const transporter = createTransport()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Spare Parts Inventory - Password Reset',
    html: `
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, just ignore this email.</p>
    `,
  })
}

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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(200).json({ message: 'If the email is registered, a reset link has been sent' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000
    await user.save()

    await sendResetEmail(user.email, token)
    res.json({ message: 'If the email is registered, a reset link has been sent' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body
    if (!email || !token || !password) {
      return res.status(400).json({ error: 'Email, token, and new password are required' })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })
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
