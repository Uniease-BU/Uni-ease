// models/FoodOutlet.js
const mongoose = require('mongoose');

const FoodOutletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Outlet name is required'],
    trim: true
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor reference is required']
  },
  operating_hours: {
    type: String,
    required: [true, 'Operating hours are required']
  }
}, { timestamps: true });

module.exports = mongoose.model('FoodOutlet', FoodOutletSchema);