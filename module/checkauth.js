const express = require('express')
const jwt = require('jsonwebtoken');
const router = express.Router()

const verifyAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message:   
   'Unauthorized: No token provided' });
  
    try {
      const decoded = jwt.verify(token,   
   'jwt_secret_key');
      req.user = decoded.user; // Attach user data to the request object
      next();
    } catch (err) {
      res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
  };
  
  router.get('/', verifyAuth, (req, res) => {
    res.json(req.user);
  });

module.exports = router;