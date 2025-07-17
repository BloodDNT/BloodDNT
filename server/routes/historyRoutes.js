const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/:userId", historyController.getDonationHistory);
router.get("/all", historyController.getAllDonationHistory);

module.exports = router;
