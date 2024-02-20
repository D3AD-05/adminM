const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// router.post("/", userController.createUser);
router.get("/getAllOrders", orderController.getAllOrders);
router.get("/getOrderDetails", orderController.getOrderDetails);
router.post("/syncOrderData", orderController.syncOrderData);
router.put("/updateOrderMaster/:orderId", orderController.updateOrderMaster);
router.get("/getApprovedOrderDetails", orderController.getApprovedOrderDetails);

module.exports = router;
