const mongoose = require("mongoose");

const LaundrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model("Laundry", LaundrySchema);
