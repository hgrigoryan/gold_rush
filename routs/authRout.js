const express = require("express");
const outhController = require("../controllers/outhController");

const router = express.Router();

router
    .get("/register", outhController.getRegistrationPage)
    .post("/register", outhController.register);

router
    .get("/login", outhController.getLoginPage)
    .post("/login", outhController.login);

router.get("/logout", outhController.logout);
module.exports = router;