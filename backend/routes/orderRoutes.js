const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// router.post("/", userController.createUser);
router.get("/getOrderDetails", orderController.getOrderDetails);
router.post("/syncOrderData", orderController.syncOrderData);

module.exports = router;
