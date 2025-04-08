// Laundry Request Model
const mongoose = require('mongoose');
const {User} = require('./User')

const LaundryRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: {  // New field
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    type: { type: String, enum: ['washing', 'dry-clean', 'ironing'], required: true },
    items: [{
      name: String,
      quantity: Number,
      stains: [String],
      specialInstructions: String
    }],
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date
  });

  LaundryRequestSchema.pre('save', async function(next) {
    try {
            const user = await User.findById(this.user);
            if (!user) throw new Error('User not found');
            this.email = user.email;
        next();
    } catch (error) {
        next(error);
    }
});
  
const LaundryRequest = mongoose.model('LaundryRequest', LaundryRequestSchema);

module.exports = LaundryRequest;
