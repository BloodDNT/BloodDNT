const express = require("express");
const router = express.Router();
const bloodDonationController = require("../controllers/bloodDonationController");

router.post("/:idUser", bloodDonationController.addBloodDonation);
router.get("/history", bloodDonationController.getBloodDonationHistory);

module.exports = router;
