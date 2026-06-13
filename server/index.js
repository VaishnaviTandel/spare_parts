const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

// API routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/parts', require('./routes/parts'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/logs',  require('./routes/logs'))

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// Health check
app.get('/ping', (req, res) => res.json({ message: 'Spare Parts API running ✅' }))

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    )
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })
