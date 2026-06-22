require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path')
const passport = require("passport");
const session = require("express-session");

const userLoginRouter = require("./Routes/UserloginRoute");
const adminLoginRouter = require("./Routes/AdminLoginRoutes");
const CategoryData = require("./Routes/CategoryRoutes");
const productData = require("./Routes/ProductRoute");
const cartData = require("./Routes/CartRoutes")
const orderData = require('./Routes/OrderRoutes')
const adminOrderData = require('./Routes/AdminOrderRoutes')
const adminDashboardData = require('./Routes/AdminDashboardRoutes')
const userOrderData = require('./Routes/UserOrderRoutes')
const userProfileRoutes  = require("./Routes/UserProfileRoutes")
const adminUserRoutes  = require('./Routes/AdminUserRoute')
const Reviewss  = require('./Routes/ReviewRoutes')

require("./db/DbConnect");

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api", userLoginRouter);
app.use("/api/admin", adminLoginRouter);
app.use("/api/category", CategoryData);
app.use("/api/product", productData);
app.use('/api/cart', cartData)
app.use('/api/order', orderData)
app.use("/api/admin/order", adminOrderData)
app.use("/api/admin", adminDashboardData)
app.use("/api/dashboard", userOrderData)
app.use('/api/user/profile', userProfileRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use('/api/review', Reviewss)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
