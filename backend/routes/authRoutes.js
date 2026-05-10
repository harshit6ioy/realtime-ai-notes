const express = require("express");
const router = express.Router();

// ✅ Import controllers
const { register } = require("../controllers/auth/registerController");
const { login } = require("../controllers/auth/loginController");


// 🔐 AUTH ROUTES

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);


module.exports = router;