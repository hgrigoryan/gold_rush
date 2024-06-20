const express = require("express");
const goldRushController = require("../controllers/goldRushController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();


router.get("/event", verifyJWT, goldRushController.getCurrentEvent);
router.post("/report/:userId/:eventId/:gold_amount", verifyJWT, goldRushController.addReportedGoldAmount);
router.get("/leaderboard/:userId/:eventId", verifyJWT, goldRushController.getLeaderboard);
router.patch("/claim/:userId/:eventId", verifyJWT, goldRushController.claim);

module.exports = router;