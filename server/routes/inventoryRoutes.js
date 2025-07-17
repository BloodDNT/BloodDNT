const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Check if inventoryController is loaded correctly
console.log("Inventory Controller:", inventoryController);

router.post("/", inventoryController.addInventory);
router.put("/remove/:idBlood", inventoryController.removeInventory);
router.get("/summary", inventoryController.getInventorySummary);
router.get("/alerts", inventoryController.checkAlerts);
router.get("/history/:idBlood", inventoryController.getTransactionHistory);

module.exports = router;
