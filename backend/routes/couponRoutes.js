const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  couponValidate,
} = require("../controllers/couponController");

router.route("/")
  .get(getCoupon)
  .post(createCoupon);

router.route("/validate")
  .post(couponValidate);

router.route("/:couponId")
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
