// seedMenuItems.js
const mongoose = require('mongoose');
const FoodOutlet = require('../models/FoodOutlets');
const MenuItem = require('../models/MenuItems');
require('dotenv').config();

const menuItems = {
  "Southern Stories": [
    { name: "Classic Cheeseburger", price: 199, dietary_tags: ["non-vegetarian"] },
    { name: "Garden Salad", price: 149, dietary_tags: ["vegetarian"] },
    { name: "Margherita Pizza", price: 249, dietary_tags: ["vegetarian"] },
    { name: "Chicken Pasta", price: 179, dietary_tags: ["non-vegetarian"] },
    { name: "Veg Wrap", price: 129, dietary_tags: ["vegetarian"] }
  ],
  "Snap Eats": [
    { name: "Grilled Chicken Sandwich", price: 179, dietary_tags: ["non-vegetarian"] },
    { name: "Paneer Tikka", price: 159, dietary_tags: ["vegetarian"] },
    { name: "Fish & Chips", price: 299, dietary_tags: ["non-vegetarian"] },
    { name: "Vegetable Biryani", price: 189, dietary_tags: ["vegetarian"] },
    { name: "Falafel Plate", price: 169, dietary_tags: ["vegetarian"] }
  ]
};

async function seedMenu() {
  try {
    console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to database');
        
            // Clear existing slots
        await MenuItem.deleteMany({});
            console.log('Cleared existing slots');
    // Find outlets
    const southern = await FoodOutlet.findOne({ name: "Southern Stories" });
    const snap = await FoodOutlet.findOne({ name: "Snap Eats" });

    if (!southern || !snap) {
      throw new Error('Outlets not found. Seed outlets first');
    }


    // Create menu items
    const southernItems = menuItems["Southern Stories"].map(item => ({
      ...item,
      outlet_id: southern._id
    }));

    const snapItems = menuItems["Snap Eats"].map(item => ({
      ...item,
      outlet_id: snap._id
    }));

    await MenuItem.insertMany([...southernItems, ...snapItems]);

    console.log('Menu items seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Menu seeding failed:', err);
    process.exit(1);
  }
}

seedMenu();