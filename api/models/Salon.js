const mongoose = require("mongoose");

const SalonSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Salon", SalonSchema);
