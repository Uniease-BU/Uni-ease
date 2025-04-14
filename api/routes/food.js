const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Models
const FoodOutlet = require('../models/FoodOutlets');
const MenuItem = require('../models/MenuItems');
const Order = require('../models/Order');
const User = require('../models/User');



// --------------------------
// 1. GET /food/outlets - List all outlets
// --------------------------
router.get('/outlets', auth, async (req, res) => {
  try {
    const outlets = await FoodOutlet.find()
      .populate('vendor_id', 'name')
      .select('name operating_hours');
    
    res.json(outlets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 2. GET /food/outlets/:outlet_id/menu - View menu
// --------------------------
router.get('/outlets/:outlet_id/menu', async (req, res) => {
  try {
    const outlet = await FoodOutlet.findById(req.params.outlet_id);
    if (!outlet) return res.status(404).json({ error: 'Outlet not found' });

    const menu = await MenuItem.find({ outlet_id: req.params.outlet_id })
      .select('name price dietary_tags');

    res.json({
      outlet: outlet.name,
      menu
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 3. POST /food/outlets/:outlet_id/cart - Add to cart
// --------------------------
router.post('/outlets/:outlet_id/cart', auth, async (req, res) => {
  try {
    const { outlet_id } = req.params;
    const { item_id, quantity } = req.body;

    // Validate menu item
    const menuItem = await MenuItem.findOne({
      _id: item_id,
      outlet_id
    });

    if (!menuItem) {
      return res.status(400).json({ error: 'Invalid item for this outlet' });
    }

    // Find or create cart
    let cart = await Order.findOne({
      user_id: req.user.id,
      outlet_id,
      status: 'cart'
    });

    if (!cart) {
      cart = new Order({
        user_id: req.user.id,
        outlet_id,
        items: [],
        total: 0
      });
    }

    // Update cart
    cart.items.push({ item_id, quantity });
    await cart.save();

    res.json(await cart.populate('items.item_id', 'name price'));
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 4. GET /food/outlets/:outlet_id/cart - View cart
// --------------------------
router.get('/outlets/:outlet_id/cart', auth, async (req, res) => {
  try {
    const cart = await Order.findOne({
      user_id: req.user.id,
      outlet_id: req.params.outlet_id,
      status: 'cart'
    }).populate('items.item_id', 'name price');

    if (!cart) return res.json({ items: [], total: 0 });

    res.json({
      items: cart.items.map(item => ({
        item: item.item_id.name,
        price: item.item_id.price,
        quantity: item.quantity
      })),
      total: cart.total
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 5. POST /food/outlets/:outlet_id/checkout - Checkout
// --------------------------
router.post('/outlets/:outlet_id/checkout', auth, async (req, res) => {
  try {
    const { outlet_id } = req.params;
    
    // Validate cart exists with items
    const cart = await Order.findOne({
      user_id: req.user.id,
      outlet_id,
      status: 'cart'
    }).populate('items.item_id');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Empty cart cannot checkout' });
    }

    // Convert to pending order
    const order = await Order.findByIdAndUpdate(
      cart._id,
      { status: 'pending' },
      { new: true }
    );

    res.json({
      order_id: order._id,
      total: order.total,
      next_step: 'Proceed to payment'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 6. GET /orders/:order_id/status - Order status
// --------------------------
router.get('/orders/:order_id/status', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id)
      .populate('outlet_id', 'name');

    if (!order || order.user_id.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      status: order.status,
      outlet: order.outlet_id.name,
      last_updated: order.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --------------------------
// 7. POST /orders/:order_id/confirm - Confirm pickup
// --------------------------
router.post('/orders/:order_id/confirm', auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.order_id,
        user_id: req.user.id,
        status: 'ready'
      },
      { status: 'picked_up' },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ 
        error: 'Order not ready for pickup or already collected'
      });
    }

    res.json({ 
      success: true,
      message: 'Pickup confirmed successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;