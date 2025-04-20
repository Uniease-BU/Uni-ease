const express = require('express');
const router = express.Router();
const SalonSlot = require('../models/SalonSlot');
const { authenticate } = require('../middleware/auth'); // Updated import
const Salon = require('../models/Salon')
const cron = require('node-cron');

// routes/salon.js - Updated cron job
cron.schedule('0 0 * * *', async () => {
    try {
      // 1. Reset yesterday's slots (UTC time)
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);
  
      await SalonSlot.updateMany(
        { date: yesterday },
        { $set: { isAvailable: true } }
      );
  
      // 2. Add new slots for 7th day ahead (UTC time)
      const futureDate = new Date();
      futureDate.setUTCDate(futureDate.getUTCDate() + 7);
      futureDate.setUTCHours(0, 0, 0, 0);
  
      if (!(await SalonSlot.exists({ date: futureDate }))) {
        await generateDailySlots(futureDate);
      }
  
      console.log('Daily maintenance completed');
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
  
  // Updated generateDailySlots function
  async function generateDailySlots(date) {
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  
  // Ensure UTC date storage - extract date parts for consistency
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0, 0
  ));
  
  console.log(`Generating slots for ${utcDate.toISOString()}`);

  const slots = times.map(time => ({
    date: utcDate,
    time,
    isAvailable: true
  }));

  // Check if slots already exist for this date to avoid duplicates
  const existingSlots = await SalonSlot.find({ 
    date: utcDate 
  });
  
  if (existingSlots.length > 0) {
    console.log(`Slots already exist for ${utcDate.toISOString()}, skipping generation`);
    return;
  }

  await SalonSlot.insertMany(slots);
  console.log(`Slots generated for ${utcDate.toISOString().split('T')[0]}`);
  }


// Get available slots endpoint
router.get('/available-slots',authenticate, async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) return res.status(400).json({ error: 'Date required' });
    
        // Create date in UTC (critical fix)
        const targetDate = new Date(`${date}T00:00:00Z`);
        
        const slots = await SalonSlot.find({
          date: targetDate,
          isAvailable: true
        }).select('time -_id');
    
        res.json({
          date: targetDate.toISOString().split('T')[0], // Return UTC date
          availableSlots: slots.map(s => s.time)
        });
    
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
  });

  router.post('/bookings', authenticate, async (req, res) => {
    try {
        const { date, time } = req.body;
        
        if (!date || !time) {
          return res.status(400).json({ error: 'Date and time required' });
        }
    
        // Parse the date correctly
        const dateParts = date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript
        const day = parseInt(dateParts[2]);
        
        // Create date with UTC midnight
        const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        
        console.log('Attempting to book:', {
          requestDate: date,
          parsedUTCDate: utcDate,
          isoString: utcDate.toISOString(),
          time
        });
    
        // First find if the slot exists and is available (for debugging)
        const slotExists = await SalonSlot.findOne({
          date: utcDate,
          time,
        });
        
        console.log('Slot exists check:', slotExists);
        
        if (!slotExists) {
          return res.status(404).json({ error: 'Slot not found' });
        }
        
        if (!slotExists.isAvailable) {
          return res.status(400).json({ error: 'Slot already booked' });
        }
    
        // Update the slot to not available
        slotExists.isAvailable = false;
        await slotExists.save();
    
        // Create booking
        const booking = await Salon.create({
          user: req.user._id,
          date: utcDate,
          time,
          status: 'Pending'
        });
    
        res.status(201).json({
          message: 'Booking request submitted',
          bookingId: booking._id
        });
    
      } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Booking failed' });
      }
  });

  // Get user's salon bookings
  router.get('/my-bookings', authenticate, async (req, res) => {
    try {
      // Find all bookings for the current user
      const bookings = await Salon.find({ 
        user: req.user._id 
      }).sort({ date: 1, time: 1 });
      
      // Format the bookings data for frontend
      const formattedBookings = bookings.map(booking => ({
        id: booking._id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        bookedAt: booking.bookedAt
      }));
      
      res.json(formattedBookings);
      
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Failed to retrieve your bookings' });
    }
  });

  // Cancel a booking
  router.delete('/bookings/:id', authenticate, async (req, res) => {
    try {
      // Find the booking and ensure it belongs to the current user
      const booking = await Salon.findOne({
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      // Check if booking can be canceled (only Pending or Confirmed)
      if (!['Pending', 'Confirmed'].includes(booking.status)) {
        return res.status(400).json({ 
          error: `Cannot cancel booking with status: ${booking.status}` 
        });
      }
      
      // Update status to Cancelled
      booking.status = 'Cancelled';
      await booking.save();
      
      // Make the slot available again
      await SalonSlot.updateOne(
        { 
          date: booking.date, 
          time: booking.time 
        },
        { isAvailable: true }
      );
      
      res.json({ message: 'Booking cancelled successfully' });
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  });

module.exports = router;
