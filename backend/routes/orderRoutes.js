const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// router.post("/", userController.createUser);
router.get("/getAllOrders", orderController.getAllOrders);

module.exports = router;
