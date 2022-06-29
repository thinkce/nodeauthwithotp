const userController = require('../controllers/users.controllers');
const express = require('express');

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/home", userController.home);
router.post("/create-otp", userController.otplogin);
router.post("/verifycode", userController.verifyOtp);

module.exports = router;