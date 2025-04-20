// routes/admin.js (new file)
const express = require('express');
const router = express.Router();
const LaundryRequest = require('../models/LaundryRequest');
const { authenticate, isAdmin } = require('../middleware/auth');

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
            req.params.id,
            { 
                status,
                ...(status === 'completed' && { completedAt: new Date() })
            },
            { new: true }
        ).populate('user');

        if (!laundry) {
            return res.status(404).json({ error: 'Laundry request not found' });
        }

        res.json({
            id: laundry._id,
            status: laundry.status,
            completedAt: laundry.completedAt
        });


    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;