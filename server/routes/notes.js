const express = require('express')
const router  = express.Router()
const Note    = require('../models/Note')
const auth    = require('../middleware/auth')

router.use(auth)

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create note
router.post('/', async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' })
    const note = await Note.create({ owner: req.user.id, text: text.trim() })
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
    if (!note) return res.status(404).json({ error: 'Note not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
