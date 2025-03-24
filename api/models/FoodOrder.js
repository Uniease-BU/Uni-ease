const mongoose = require("mongoose");

const FoodOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"], 
        default: "Pending" 
    },
    orderAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FoodOrder", FoodOrderSchema);
