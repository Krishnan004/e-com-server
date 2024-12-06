const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieparser = require('cookie-parser');
require('dotenv').config()
const port=process.env.port || 5500;
// const upload =multer({dest:'upload/'})

const app = express();


// main e-com website seprate domain and admin-panel in different domain
app.use(cors({
  origin: [
    "https://e-panel.netlify.app", 
    "https://e-commerce-dev-web.netlify.app", 
    "http://localhost:2000", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],  
  credentials: true
}));

app.use(express.json());
app.use(cookieparser());
app.use('/upload', express.static(path.join(__dirname, 'upload')));



app.get("/", (req, res) => {
  return res.json("frontend connected");
});


const productRouter = require('./module/product')
const reviewRouter = require('./module/review')
const cartRouter = require('./module/cart')
const orderRouter = require('./module/order')
const homeProductRouter = require('./module/homeProduct')
const salesRouter = require('./module/sales')
const hotdealRouter =require('./module/hotdeal')
const clientreviewRouter = require('./module/clientreview')
const userRouter = require('./module/user')
const adminRouter = require('./module/admin')
const checkauthRouter = require('./module/checkauth')
const registerRouter = require('./module/register')


app.use("/product",productRouter)
app.use("/review",reviewRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)
app.use("/homeproduct",homeProductRouter)
app.use("/sales",salesRouter)
app.use("/hotdeal",hotdealRouter)
app.use("/clientreview",clientreviewRouter)
app.use("/user",userRouter)
app.use("/admin",adminRouter)
app.use("/checkauth",checkauthRouter)
app.use("/register",registerRouter)


app.listen(port, () => {
  console.log("server is connected with port 5500");
});



















































