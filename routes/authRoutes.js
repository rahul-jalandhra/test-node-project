const express = require("express");
const { signup, login, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

// Signup & Login Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
