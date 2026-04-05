const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["payment_intent"],
  });
  console.log(session);

  const cart = await Cart.findOne({ user: req.user.id })
    .populate({ path: "items.foodItem", select: "name price images" })
    .populate({ path: "restaurant", select: "name" });
  console.log(cart);

  let deliveryInfo = {
    address: session.shipping_details.address.line1 + " " + (session.shipping_details.address.line2 || ""),
    city: session.shipping_details.address.city,
    phoneNo: session.customer_details.phone || session.shipping_details.phone || "0000000000",
    postalCode: session.shipping_details.address.postal_code,
    country: session.shipping_details.address.country,
  };

  let orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images[0].url,
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  let paymentInfo = {
    id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id || "unknown_id",
    status: session.payment_status,
  };

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: +session.shipping_cost.amount_total / 100,
    itemsPrice: +session.amount_subtotal / 100,
    finalTotal: +session.amount_total / 100,
    user: req.user.id,
    restaurant: cart.restaurant._id,
    paidAt: Date.now(),
  });

  console.log(order);

  await Cart.deleteOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = new ObjectId(req.user.id);
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});