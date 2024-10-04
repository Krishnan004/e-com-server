const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieparser = require('cookie-parser');
const multer = require('multer');
const port=process.env.port || 5500;
// const upload =multer({dest:'upload/'})

const app = express();
app.use(cors({
  origin:["https://e-panel.netlify.app/","https://e-commerce-dev-web.netlify.app/","http://localhost:2000/","http://localhost:5173/"],
  methods: ["get","post","put","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieparser());
app.use('/upload', express.static(path.join(__dirname, 'upload')));
const salt = 10;

const db = mysql.createConnection({
  host: 'by8pf5yg2qnqqqc55fxp-mysql.services.clever-cloud.com',
  user: 'uvmuppek9hdyfgnh',
  password: 'Ma5utd5ah7mHfxvNgpMP',
  database: 'by8pf5yg2qnqqqc55fxp',
  port: '3306'
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


app.get("/", (req, res) => {
  return res.json("frontend connected");
});

app.get("/product", (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/product", upload.single('file'), (req, res) => {
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


app.put("/product", upload.single('file'), (req, res) => {
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



app.post("/user", (req, res) => {
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

app.get('/checkauth', verifyAuth, (req, res) => {
  res.json(req.user);
});
    


app.post("/register", (req, res) => {
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

app.get("/review",(req,res)=>{
  const q = "select * from review"

  db.query(q,(err,data)=>{
    if(err) res.json(err);
    return res.json(data);
  });
})

app.get("/clientreview", (req, res) => {
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


app.post("/review",(req,res)=>{
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

app.put("/review", (req, res) => {
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


app.get("/cart", (req, res) => {
  const q = "SELECT * FROM cart WHERE user_id = ?";
  const values = [req.query.user_id];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


app.post("/cart", (req, res) => {
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

app.delete("/cart/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM cart WHERE product_id = ?";
  
  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/hotdeal",(req,res)=>{
const q="SELECT * FROM hotdeal"
db.query(q,(err,data)=>{
if(err) return res.json(err);
return res.json(data);
})
})

app.get("/order",(req,res)=>{
  const q="SELECT * FROM orders"
  db.query(q,(err,data)=>{
  if(err) return res.json(err);
  return res.json(data);
  })
  })

  app.post("/order", (req, res) => {
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
  
  
  app.get("/homeproduct",(req,res)=>{
    const q="SELECT * FROM homeproduct"
    db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
    })
    })

    app.put('/homeproduct', upload.single('file'), (req, res) => {
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
   

  app.get("/sales",(req,res)=>{
    const q="SELECT * FROM sales"
    db.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
    })
    })


app.listen(port, () => {
  console.log("server is connected with port 5500");
});



















































