const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')


router.get("/",(req,res)=>{
    const q = "select * from review"
  
    db.query(q,(err,data)=>{
      if(err) res.json(err);
      return res.json(data);
    });
  })

router.post("/",(req,res)=>{
    const q = "INSERT INTO review (user_id, product_id, rating, comment, image_src) VALUES (?, ?, ?, ?, ?)";
    values=[
      req.body.user_id,
      req.body.product_id,
      req.body.rating,
      req.body.comment,
      req.body.image_src,
    ]
  
    db.query(q,values,(err,data)=>{
      if(err) res.json(err);
      return res.json(data);
    });
  })
  
  router.put("/", (req, res) => {
    const q = "UPDATE review SET approval = ? WHERE review_id = ?";
    const values = [
        req.body.approval,
        req.body.review_id
    ];
  
    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({ message: "Review approved", data: data });
    });
  });

  module.exports = router;