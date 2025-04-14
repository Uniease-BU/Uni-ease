// models/Order.js
const mongoose = require('mongoose');
const MenuItem = require('./MenuItems');

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  outlet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodOutlet',
    required: [true, 'Outlet reference is required']
  },
  items: [{
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Menu item reference is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Minimum quantity is 1']
    }
  }],
  status: {
    type: String,
    enum: ['cart', 'pending', 'preparing', 'ready', 'picked_up', 'cancelled'],
    default: 'cart'
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate total before saving
OrderSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    try {
      const populatedOrder = await this.populate('items.item_id');
      this.total = populatedOrder.items.reduce((acc, item) => {
        return acc + (item.item_id.price * item.quantity);
      }, 0);
    } catch (err) {
      return next(err);
    }
  }
  next();
});
const Order = mongoose.model('Order', OrderSchema)
// Add this post-save hook after existing middleware
OrderSchema.post('save', async function(doc) {
  try {
    // Get total order count
    const count = await Order.countDocuments();
    
    if (count > 100) {
      // Find the 100th newest order's creation date
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(100)
        .limit(1)
        .select('createdAt');

      if (orders.length > 0) {
        // Delete orders older than the 100th newest
        await Order.deleteMany({
          createdAt: { $lt: orders[0].createdAt }
        });
      }
    }
  } catch (err) {
    console.error('Order cleanup error:', err);
  }
});

module.exports = Order;
// module.exports = mongoose.model('Order', OrderSchema);