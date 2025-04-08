const {User} = require('./../models/User'); // Import your User model
const jwt = require('jsonwebtoken'); // Add this at the top

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

  module.exports = authenticate;