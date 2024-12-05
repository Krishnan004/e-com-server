const express = require('express')
const router = express.Router()
const upload = require('./storage/imgStorage');
const db = require('./databade/db_config')




router.get("/", (req, res) => {
    const q = "SELECT * FROM products";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  router.post("/", upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(500).json({ error: "File upload is required." });
    }
    const q = "INSERT INTO products (name,design,price,stock,category,description,product_src) VALUES (?,?,?,?,?,?,?)";
    const values = [
      req.body.name,
      req.body.design,
      req.body.price,
      req.body.stock,
      req.body.category,
      req.body.description,
      req.file.filename // Corrected to req.file.filename
    ];
    db.query(q, values, (err, data) => { 
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  
  router.put("/", upload.single('file'), (req, res) => {
    const {
      name,
      design,
      price,
      stock,
      category,
      description,
      product_id,
      product_src
    } = req.body;
  
    const filename = req.file ? req.file.filename : product_src;
  
    const values = [name, design, price, stock, category, description, filename, product_id];
    const q = "UPDATE products SET name = ?, design = ?, price = ?, stock = ?, category = ?, description = ?, product_src = ? WHERE product_id = ?";
    
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "Product updated successfully", data });
    });
  });

  module.exports = router;