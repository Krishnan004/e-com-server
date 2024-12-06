const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')

router.get("/",(req,res)=>{
    const q="SELECT * FROM sales"
    db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
    })
    })

module.exports = router;