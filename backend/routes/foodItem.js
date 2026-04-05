
const express = require("express"),
  router = express["Router"]({ mergeParams: !![] }),
  {
    getFoodItem,
    createFoodItem,
    getAllFoodItems,
    deleteFoodItem,
    updateFoodItem,
  } = require("../controllers/foodItemController");
router["route"]("/item")["post"](createFoodItem),
  router["route"]("/items/:storeId")["get"](getAllFoodItems),
  router["route"]("/item/:foodId")
    ["get"](getFoodItem)
    ["patch"](updateFoodItem)
    ["delete"](deleteFoodItem),
  (module["exports"] = router);
