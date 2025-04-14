// models/MenuItem.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  outlet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodOutlet',
    required: [true, 'Outlet reference is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  dietary_tags: [{
    type: String,
    enum: ['vegetarian', 'non-vegetarian']
  }]
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);