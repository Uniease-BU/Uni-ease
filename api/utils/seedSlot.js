// utils/seedSlots.js (initial setup)
const mongoose = require('mongoose');
const SalonSlot = require('../models/SalonSlot');
require('dotenv').config();

async function seedInitialSlots() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Clear existing slots
    await SalonSlot.deleteMany({});
    console.log('Cleared existing slots');

    // Add specific test date
    // const testDate = new Date('2025-04-05T00:00:00Z');
    // await generateDailySlots(testDate);

    // Generate slots for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0); // Reset to UTC midnight
      date.setUTCDate(date.getUTCDate() + i); // Add days in UTC
      
      await generateDailySlots(date);
    }

    console.log('Initial slots seeded');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

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
seedInitialSlots();