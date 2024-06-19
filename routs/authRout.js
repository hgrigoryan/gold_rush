const express = require("express");
const outhController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;