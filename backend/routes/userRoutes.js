// routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

router.get("/getAllUsers", UserController.getAllUsers);
router.post("/createUser", UserController.createUser);
router.put("/updateUser/:userId", UserController.updateUser);
router.get("/checkForApproval/:userId", UserController.checkForApproval);
router.post("/checkPhoneNumber", UserController.checkPhoneNumber);

module.exports = router;
