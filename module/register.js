const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../databade/db_config')
const salt = 10;

router.post("/", (req, res) => {
    const q = "INSERT INTO user (`first_name`, `last_name`, `username`, `email`, `password`) VALUES (?)";
    
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) return res.json("error in hashing password");
  
      const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.email,
        hash
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
    });
  });

module.exports = router;