const express = require("express");
const auth = require("../middleware/auth");
const FoodOrder = require("../models/FoodOrder");
const router = express.Router();

// 🟢 Place a Food Order (User)
router.post("/", auth, async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        const newOrder = new FoodOrder({ user: req.user.id, items, totalPrice });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟡 Get All Food Orders (Admin)
router.get("/", auth, async (req, res) => {
    try {
        const orders = await FoodOrder.find().populate("user", "name email");
        res.json(orders);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🟠 Get User's Food Orders (User)
router.get("/my", auth, async (req, res) => {
    try {
        const orders = await FoodOrder.find({ user: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔵 Update Order Status (Admin)
router.put("/:id", auth, async (req, res) => {
    try {
        const { status } = req.body;
        let order = await FoodOrder.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: "Order not found" });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔴 Cancel an Order (User)
router.delete("/:id", auth, async (req, res) => {
    try {
        let order = await FoodOrder.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: "Order not found" });

        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        await order.deleteOne();
        res.json({ msg: "Order cancelled" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
