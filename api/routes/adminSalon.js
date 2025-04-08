const express = require('express');
const router = express.Router();
const authenticate = require('./../middleware/auth'); // Your existing auth middleware
const Salon = require('../models/Salon')
// Admin

  const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  };

// Update booking status (Admin)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
  
      const booking = await Salon.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      res.json({
        message: 'Status updated',
        bookingId: booking._id,
        newStatus: booking.status
      });
  
    } catch (error) {
      res.status(500).json({ error: 'Status update failed' });
    }
  });

// Get all pending bookings (Admin)
router.get('/pending', authenticate, isAdmin, async (req, res) => {
    try {
      const pendingBookings = await Salon.find({ status: 'Pending' })
        .populate('user', 'name email')
        .sort('date time');
  
      res.json(pendingBookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
  });

module.exports = router