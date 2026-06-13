const express = require('express')
const router  = express.Router()
const Part    = require('../models/Part')
const ActivityLog = require('../models/ActivityLog')
const auth = require('../middleware/auth')

router.use(auth)

// GET all parts (optionally filter by hp)
router.get('/', async (req, res) => {
  try {
    const filter = { owner: req.user.id }
    if (req.query.hp) filter.hp = req.query.hp
    const parts = await Part.find(filter).sort({ createdAt: -1 })
    res.json(parts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single part
router.get('/:id', async (req, res) => {
  try {
    const part = await Part.findOne({ _id: req.params.id, owner: req.user.id })
    if (!part) return res.status(404).json({ error: 'Part not found' })
    res.json(part)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create part
router.post('/', async (req, res) => {
  try {
    const { hp, category, name, price, qty } = req.body
    if (!hp || !category || !name || price === undefined || qty === undefined) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const part = await Part.create({ owner: req.user.id, hp, category, name, price, qty })
    await ActivityLog.create({ owner: req.user.id, msg: `Added ${name} (${hp} HP, ${category})` })
    res.status(201).json(part)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update part
router.put('/:id', async (req, res) => {
  try {
    const existing = await Part.findOne({ _id: req.params.id, owner: req.user.id })
    if (!existing) return res.status(404).json({ error: 'Part not found' })

    const updated = await Part.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    await ActivityLog.create({
      owner: req.user.id,
      msg: `Edited ${updated.name} — qty ${existing.qty}→${updated.qty}, ₹${existing.price}→₹${updated.price}`,
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH buy — decrease qty by 1
router.patch('/:id/buy', async (req, res) => {
  try {
    const part = await Part.findOne({ _id: req.params.id, owner: req.user.id })
    if (!part)       return res.status(404).json({ error: 'Part not found' })
    if (part.qty === 0) return res.status(400).json({ error: 'Out of stock' })

    part.qty -= 1
    await part.save()
    await ActivityLog.create({
      owner: req.user.id,
      msg: `Bought 1× ${part.name} (${part.hp} HP) — stock now ${part.qty}`,
    })
    res.json(part)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE part
router.delete('/:id', async (req, res) => {
  try {
    const part = await Part.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
    if (!part) return res.status(404).json({ error: 'Part not found' })
    await ActivityLog.create({ owner: req.user.id, msg: `Deleted ${part.name} (${part.hp} HP)` })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
