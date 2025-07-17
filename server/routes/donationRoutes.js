const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

router.get("/", donationController.getDonationRequests);
router.put("/:id", donationController.updateRequestStatus);

module.exports = router;
