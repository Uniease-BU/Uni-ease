const express = require('express');
const router = express.Router();
const LaundryRequest = require('../models/LaundryRequest');
const { authenticate, isAdmin } = require('../middleware/auth');

// Laundry Routes
router.post('/washing', authenticate, async (req, res) => {
    try {
      const laundryRequest = new LaundryRequest({
        ...req.body,
        user: req.user._id,
        type: 'washing'
      });
      await laundryRequest.save();
      res.status(201).send(laundryRequest);
    } catch (error) {
      res.status(400).send(error);
    }
});

router.post('/dry-clean', authenticate, async (req, res) => {
    try {
        const laundryRequest = new LaundryRequest({
          ...req.body,
          user: req.user._id,
          type: 'dry-clean'
        });
        await laundryRequest.save();
        res.status(201).send(laundryRequest);
      } catch (error) {
        res.status(400).send(error);
      }
});

router.post('/ironing', authenticate, async (req, res) => {
    try {
        const laundryRequest = new LaundryRequest({
          ...req.body,
          user: req.user._id,
          type: 'ironing'
        });
        await laundryRequest.save();
        res.status(201).send(laundryRequest);
      } catch (error) {
        res.status(400).send(error);
      }
});

// Admin Routes (Add to your laundry routes file)
router.get('/laundries', authenticate, isAdmin, async (req, res) => {
    try {
        const requests = await LaundryRequest.find()
            .populate('user', 'name email phoneNumber')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests: requests.map(request => ({
                id: request._id,
                user: request.user.name,
                type: request.type,
                items: request.items,
                status: request.status,
                createdAt: request.createdAt,
                completedAt: request.completedAt
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 🟠 Get User's Laundry Requests (User)
router.get("/my", authenticate, async (req, res) => {
    try {
        const requests = await LaundryRequest.find({ user: req.user.id });
        res.json(requests);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
