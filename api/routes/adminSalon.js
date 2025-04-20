const express = require('express');
const router = express.Router();
const authenticate = require('./../middleware/auth'); // Your existing auth middleware
const Salon = require('../models/Salon');
const User = require('../models/User');
const mongoose = require('mongoose');
// Admin

  const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  };

// Get all salon bookings with optional filtering (Admin)
router.get('/bookings', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      try {
        // Create date range for the selected date (start of day to end of day)
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999);
        
        query.date = { $gte: startDate, $lte: endDate };
      } catch (dateError) {
        console.error('Invalid date format:', date, dateError);
        // Continue with query without date filter if date is invalid
      }
    }
    
    // Find bookings with populated user information in a single query
    const bookings = await Salon.find(query)
      .populate('user', 'name email')
      .sort({ date: 1, time: 1 });
    
    // Format the response with proper error handling
    const formattedBookings = bookings.map(booking => {
      return {
        id: booking._id,
        user: booking.user?.name || 'Unknown User',
        email: booking.user?.email || 'N/A',
        date: booking.date,
        time: booking.time,
        status: booking.status,
        bookedAt: booking.bookedAt
      };
    });
    
    res.json(formattedBookings);
    
  } catch (error) {
    console.error('Error fetching salon bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve salon bookings. ' + (error.message || '') });
  }
});

// Get salon statistics (Admin)
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    // Get counts by status
    const pendingCount = await Salon.countDocuments({ status: 'Pending' });
    const confirmedCount = await Salon.countDocuments({ status: 'Confirmed' });
    const completedCount = await Salon.countDocuments({ status: 'Completed' });
    const cancelledCount = await Salon.countDocuments({ status: 'Cancelled' });
    
    // Get today's appointments
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayCount = await Salon.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });
    
    res.json({
      byStatus: {
        Pending: pendingCount,
        Confirmed: confirmedCount,
        Completed: completedCount,
        Cancelled: cancelledCount
      },
      total: pendingCount + confirmedCount + completedCount + cancelledCount,
      today: todayCount
    });
    
  } catch (error) {
    console.error('Error fetching salon stats:', error);
    res.status(500).json({ error: 'Failed to retrieve salon statistics. ' + (error.message || '') });
  }
});

// Update booking status (Admin)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' });
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
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Status update failed. ' + (error.message || '') });
  }
});

// Get all pending bookings (Admin)
router.get('/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const pendingBookings = await Salon.find({ status: 'Pending' })
      .populate('user', 'name email')
      .sort({ date: 1, time: 1 });

    const formattedBookings = pendingBookings.map(booking => ({
      id: booking._id,
      user: booking.user?.name || 'Unknown User',
      email: booking.user?.email || 'N/A',
      date: booking.date,
      time: booking.time,
      status: booking.status,
      bookedAt: booking.bookedAt
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings. ' + (error.message || '') });
  }
});

module.exports = router;