const express = require("express");
const auth = require("../middleware/auth");
const Laundry = require("../models/Laundry");
const router = express.Router();

// 🟢 Submit a Laundry Request (User)
router.post("/", auth, async (req, res) => {
    try {
        const { items } = req.body;
        const newRequest = new Laundry({ user: req.user.id, items });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟡 Get All Laundry Requests (Admin)
router.get("/", auth, async (req, res) => {
    try {
        const requests = await Laundry.find().populate("user", "name email");
        res.json(requests);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟠 Get User's Laundry Requests (User)
router.get("/my", auth, async (req, res) => {
    try {
        const requests = await Laundry.find({ user: req.user.id });
        res.json(requests);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔵 Update Laundry Status (Admin)
router.put("/:id", auth, async (req, res) => {
    try {
        const { status } = req.body;
        let laundry = await Laundry.findById(req.params.id);

        if (!laundry) return res.status(404).json({ msg: "Request not found" });

        laundry.status = status;
        if (status === "Completed") laundry.completedAt = Date.now();

        await laundry.save();
        res.json(laundry);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔴 Delete Laundry Request (Admin)
router.delete("/:id", auth, async (req, res) => {
    try {
        let laundry = await Laundry.findById(req.params.id);

        if (!laundry) return res.status(404).json({ msg: "Request not found" });

        await laundry.deleteOne();
        res.json({ msg: "Laundry request deleted" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
