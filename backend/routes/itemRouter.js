const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// router.post("/", userController.createUser);
router.post("/createItem", itemController.createItem);
router.get("/getAllItems", itemController.getAllItems);
module.exports = router;
