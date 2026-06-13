const express = require('express')
const router  = express.Router()
const ActivityLog = require('../models/ActivityLog')
const auth = require('../middleware/auth')

router.use(auth)

// GET all logs (newest first, max 100)
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ owner: req.user.id }).sort({ createdAt: -1 }).limit(100)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
