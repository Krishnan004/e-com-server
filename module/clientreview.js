const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')

router.get("/", (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
  
    const q = "SELECT * FROM review WHERE user_id = ? AND approval = true";
    const values = [userId];
  
    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
    });
  });

 module.exports = router; 