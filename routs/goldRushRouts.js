const express = require("express");
const goldRushController = require("../controllers/goldRushController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.get("/event", verifyJWT, goldRushController.getCurrentEvent);
router.patch("/report/:userId/:eventId/:gold_amount", verifyJWT, goldRushController.addReportedGoldAmount);
router.get("/leaderboard/:userId", verifyJWT, goldRushController.getLeaderboard);
router.put("/claim/:userId", verifyJWT, goldRushController.claim);

module.exports = router;