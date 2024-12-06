const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')


router.get("/", (req, res) => {
    const q = "SELECT * FROM cart WHERE user_id = ?";
    const values = [req.query.user_id];
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  
  router.post("/", (req, res) => {
    const q = "INSERT INTO cart (user_id,product_id, product_src, name, design, price) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.user_id,
      req.body.product_id,
      req.body.product_src,
      req.body.name,
      req.body.design,
      req.body.price
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM cart WHERE product_id = ?";
    
    db.query(q, [id], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  module.exports=router;