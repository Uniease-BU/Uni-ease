const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate, isAdmin } = require('../middleware/auth');
const FoodOutlet = require('../models/FoodOutlets');

const isOutletAdmin = async (req, res, next) => {
  try {
    const outlet = await FoodOutlet.findById(req.params.outlet_id);
    
    if (!outlet.vendor_id.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized for this outlet' });
    }
    
    req.outlet = outlet;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get all orders for outlet
router.get('/:outlet_id/orders', authenticate, isAdmin, isOutletAdmin, async (req, res) => {
    try {
      const orders = await Order.find({
        outlet_id: req.params.outlet_id,
        status: { $ne: 'cart' }
      })
      .populate('user_id', 'name email')
      .populate('items.item_id', 'name price')
      .sort('-createdAt');
  
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  // Get order details
  router.get('/:outlet_id/orders/:order_id', authenticate, isAdmin, isOutletAdmin, async (req, res) => {
    try {
      const order = await Order.findById(req.params.order_id)
        .populate('user_id', 'name email phone')
        .populate('items.item_id', 'name price');
  
      if (!order || !order.outlet_id.equals(req.params.outlet_id)) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  // Update order status
  router.patch('/:outlet_id/orders/:order_id', authenticate, isAdmin, isOutletAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['preparing', 'ready', 'completed', 'cancelled'];
  
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
  
      const order = await Order.findOneAndUpdate(
        {
          _id: req.params.order_id,
          outlet_id: req.params.outlet_id
        },
        { status },
        { new: true }
      ).populate('user_id');
  
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;