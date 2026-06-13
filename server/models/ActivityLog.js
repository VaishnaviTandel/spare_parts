const mongoose = require('mongoose')

const logSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    msg:   { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ActivityLog', logSchema)
