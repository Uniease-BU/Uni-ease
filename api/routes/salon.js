const express = require('express');
const router = express.Router();
const SalonSlot = require('../models/SalonSlot');
const authenticate = require('./../middleware/auth'); // Your existing auth middleware
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

  const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  };

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


// Admin

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


  
  module.exports = router;


// // 🟢 Book a Salon Appointment (User)
// router.post("/", auth, async (req, res) => {
//     try {
//         const { service, date, time } = req.body;
//         const newBooking = new Salon({ user: req.user.id, service, date, time });
//         await newBooking.save();
//         res.status(201).json(newBooking);
//     } catch (err) {
//         res.status(500).send("Server error");
//     }
// });

// // 🟡 Get All Salon Appointments (Admin)
// router.get("/", auth, async (req, res) => {
//     try {
//         const bookings = await Salon.find().populate("user", "name email");
//         res.json(bookings);
//     } catch (err) {
//         res.status(500).send("Server error");
//     }
// });

// // 🟠 Get User's Salon Appointments (User)
// router.get("/my", auth, async (req, res) => {
//     try {
//         const bookings = await Salon.find({ user: req.user.id });
//         res.json(bookings);
//     } catch (err) {
//         res.status(500).send("Server error");
//     }
// });

// // 🔵 Update Appointment Status (Admin)
// router.put("/:id", auth, async (req, res) => {
//     try {
//         const { status } = req.body;
//         let appointment = await Salon.findById(req.params.id);

//         if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

//         appointment.status = status;
//         await appointment.save();
//         res.json(appointment);
//     } catch (err) {
//         res.status(500).send("Server error");
//     }
// });

// // 🔴 Cancel an Appointment (User)
// router.delete("/:id", auth, async (req, res) => {
//     try {
//         let appointment = await Salon.findById(req.params.id);

//         if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

//         if (appointment.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: "Not authorized" });
//         }

//         await appointment.deleteOne();
//         res.json({ msg: "Appointment cancelled" });
//     } catch (err) {
//         res.status(500).send("Server error");
//     }
// });

// module.exports = {
//     router,
//     ensureBusinessConfig
//   };











// Salon Slot Model
// const SalonSlotSchema = new mongoose.Schema({
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     serviceType: { type: String, required: true },
//     isAvailable: { type: Boolean, default: true }
//   });
//   const SalonSlot = mongoose.model('SalonSlot', SalonSlotSchema);