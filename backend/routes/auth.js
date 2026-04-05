const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  protect,
} = require("../controllers/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(protect, getUserProfile);
router.route("/password/update").put(protect, updatePassword);
router.route("/me/update").put(protect, updateProfile);

module.exports = router;
