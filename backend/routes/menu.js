
const express = require("express"),
  router = express["Router"]({ mergeParams: !![] }),
  {
    getAllMenus,
    createMenu,
    deleteMenu,
  } = require("../controllers/menuController");
router["route"]("/")["get"](getAllMenus)["post"](createMenu),
  router["route"]("/:menuId")["delete"](deleteMenu),
  (module["exports"] = router);
