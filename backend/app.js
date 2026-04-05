const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errors");

// Essential Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Proxy route (likely for development or specific Stripe checkout integration)
app.use("/proxy", (req, res) => {
  const targetUrl = "https://checkout.stripe.com" + req.url;
  req.pipe(request(targetUrl)).pipe(res);
});

// Import Routes
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const coupon = require("./routes/couponRoutes");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

// Rate limit / Body size limit settings
const bodyLimit = { limit: "30kb" };
app.use(express.json(bodyLimit));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

// Route Middleware
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/eats/cart", cart);

// View Engine Setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Handle Undefined Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server !`,
  });
});

// Global Error Middleware
app.use(errorMiddleware);

module.exports = app;
