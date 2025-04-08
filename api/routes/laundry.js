const express = require('express');
const router = express.Router();
const {User} = require('./../models/User'); // Import your User model
const jwt = require('jsonwebtoken'); // Add this at the top
const LaundryRequest = require('../models/LaundryRequest');


// Updated Auth Middleware
const authenticate = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) throw new Error();
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Please authenticate' });
    }
  };

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
};

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
                paymentStatus: request.paymentStatus,
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
