// routes/admin.js (new file)
const express = require('express');
const { sendStatusNotification } = require('../utils/emailService');
const router = express.Router();
const LaundryRequest = require('../models/LaundryRequest');
// const { authenticate, isAdmin } = require('./authMiddleware');
// Updated auth middleware (authMiddleware.js)
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.id,
            role: decoded.role // Ensure role is in JWT
        });

        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).send({ error: 'Admin access required' });
    }
    next();
};


// Admin Laundry Routes
router.get('/laundries', authenticate, isAdmin, async (req, res) => {
    try {
        const requests = await LaundryRequest.find()
            .populate('user', 'name email')
            .sort({ requestedAt: -1 });

        res.json(requests.map(request => ({
            id: request._id,
            user: request.user.name,
            items: request.items,
            status: request.status,
            requestedAt: request.requestedAt,
            completedAt: request.completedAt
        })));
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/laundries/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'completed'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const laundry = await LaundryRequest.findByIdAndUpdate(
            req.params._id,
            { 
                status,
                ...(status === 'completed' && { completedAt: new Date() })
            },
            { new: true }
        ).populate('user');

        if (!laundry) {
            return res.status(404).json({ error: 'Laundry request not found' });
        }

        // Send notification only when marked completed
        if (status === 'completed') {
            await sendStatusNotification(
                laundry.email,  // Use the stored email
                {
                    id: laundry._id,
                    items: laundry.items,
                    completedAt: laundry.completedAt
                }
            );
        }
  
      res.json({
        id: laundry._id,
        status: laundry.status,
        completedAt: laundry.completedAt,
        notification: status === 'completed' ? 'Email sent to user' : 'Status updated'
      });

        // Send notification
        console.log(`Notification sent to ${laundry.email}: Status changed to ${status}`);


    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;