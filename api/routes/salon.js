const express = require("express");
const auth = require("../middleware/auth");
const Salon = require("../models/Salon");
const router = express.Router();

// 🟢 Book a Salon Appointment (User)
router.post("/", auth, async (req, res) => {
    try {
        const { service, date, time } = req.body;
        const newBooking = new Salon({ user: req.user.id, service, date, time });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟡 Get All Salon Appointments (Admin)
router.get("/", auth, async (req, res) => {
    try {
        const bookings = await Salon.find().populate("user", "name email");
        res.json(bookings);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟠 Get User's Salon Appointments (User)
router.get("/my", auth, async (req, res) => {
    try {
        const bookings = await Salon.find({ user: req.user.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔵 Update Appointment Status (Admin)
router.put("/:id", auth, async (req, res) => {
    try {
        const { status } = req.body;
        let appointment = await Salon.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔴 Cancel an Appointment (User)
router.delete("/:id", auth, async (req, res) => {
    try {
        let appointment = await Salon.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        await appointment.deleteOne();
        res.json({ msg: "Appointment cancelled" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
