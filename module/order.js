const express = require('express')
const router = express.Router()
const db = require('../databade/db_config')

router.get("/",(req,res)=>{
    const q="SELECT * FROM orders"
    db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
    })
    })
  
    router.post("/", (req, res) => {
      const {
        first_name, last_name, product_name, company_name, email, quantity, total, user_id, product_id, 
        address_line_1, address_line_2, city, state, zip_code, country, mobile_number, notes
      } = req.body;
    
      const q = `
        INSERT INTO orders (
          first_name, last_name, product_name, company_name, email, quantity, total,user_id, product_id, 
          address_line_1, city, state, zip_code , mobile_number, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    
      const values = [
        first_name,
        last_name,
        product_name || '', // Provide default value if missing
        company_name || '', // Provide default value if missing
        email,
        quantity,
        total,
        user_id || null, // Provide default value if missing
        product_id || null, // Provide default value if missing
        address_line_1,
        city,
        state,
        zip_code,
        mobile_number,
        notes || '' // Provide default value if missing
      ];
    
      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Error inserting order:", err);
          return res.json(err);
        }
        return res.json(data);
      });
    });

    module.exports=router;