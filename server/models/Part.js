const mongoose = require('mongoose')

const partSchema = new mongoose.Schema(
  {
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hp:       { type: String, enum: ['2.5', '6'], required: true },
    category: { type: String, required: true, trim: true },
    name:     { type: String, required: true, trim: true },
    price:    { type: Number, required: true, min: 0 },
    qty:      { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Part', partSchema)
