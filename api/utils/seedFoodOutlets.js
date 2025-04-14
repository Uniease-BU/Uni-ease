const mongoose = require('mongoose');
const { User } = require('../models/User');
const FoodOutlet = require('../models/FoodOutlets');
require('dotenv').config();

const sampleOutlets = [
  {
    name: "Southern Stories",
    operating_hours: "9:00 AM - 9:00 PM",
    vendor_id: null
  },
  {
    name: "Snap Eats",
    operating_hours: "8:00 AM - 10:00 PM",
    vendor_id: null
  }
];

async function seedOutlets() {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');
    
        // Clear existing slots
        await FoodOutlet.deleteMany({});
        console.log('Cleared existing slots');

    // Find specific food admins by email
    const southernAdmin = await User.findOne({ 
      email: process.env.SOUTHERN_STORIES_EMAIL,
      role: 'admin'
    });

    
    const snapAdmin = await User.findOne({
      email: process.env.SNAP_EATS_EMAIL,
      role: 'admin'
    });

    if (!southernAdmin || !snapAdmin) {
      throw new Error('Food admins not found. Create admin accounts first');
    }

    // Assign admins as vendors to outlets
    await FoodOutlet.findOneAndUpdate(
      { name: "Southern Stories" },
      { vendor_id: southernAdmin._id },
      { upsert: true }
    );

    await FoodOutlet.findOneAndUpdate(
      { name: "Snap Eats" },
      { vendor_id: snapAdmin._id },
      { upsert: true }
    );

    console.log('Food outlets linked to admins successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedOutlets();