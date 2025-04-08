const mongoose = require('mongoose');

const SalonSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('SalonSlot', SalonSlotSchema);