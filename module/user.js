const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post("/", (req, res) => {
    const q = "SELECT * FROM user WHERE email = ?";
  
    db.query(q, [req.body.email], (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Database query error" });
      }
      if (data.length > 0) {
        bcrypt.compare(req.body.password.toString(), data[0].password, (error, response) => {
          if (error) {
            return res.status(500).json({ error: "Password comparison error" });
          }
          if (response) {
            const user = {
              user_id: data[0].user_id,
              username: data[0].username,
              email: data[0].email
            };
            const token = jwt.sign({ user }, "jwt_secret_key", { expiresIn: "1h" });
            return res.json({ message: "Authentication success", user,token });
          } else {
            return res.status(401).json({ message: "Password incorrect" });
          }
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    });
  });

  module.exports = router;