const express = require("express");
const router = express.Router();
const {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItem,
} = require("../controllers/cartController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.route("/").get(getCartItem).post(addItemToCart);
router.route("/update").put(updateCartItemQuantity);
router.route("/delete").delete(deleteCartItem);

module.exports = router;
