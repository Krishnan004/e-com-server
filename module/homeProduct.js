const express = require('express')
const router = express.Router()
const upload = require('../storage/imgStorage');
const db = require('../databade/db_config')

router.get("/",(req,res)=>{
    const q="SELECT * FROM homeproduct"
    db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
    })
    })

    router.put('/', upload.single('file'), (req, res) => {
      const { product_name, design, price, product_id } = req.body;
      const file = req.file.filename;
      if (!product_name || !design || !price || !product_id) {
          return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const q = "UPDATE homeproduct SET product_name = ?, design = ?, price = ?, product_src = ? WHERE product_id = ?;";
      const values = [product_name, design, price, file, product_id];
  
      db.query(q, values, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json({ message: 'Product updated successfully', data });
      });
  });

  module.exports = router;