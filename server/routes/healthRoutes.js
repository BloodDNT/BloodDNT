const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

router.post("/:idUser", healthController.addHealthCheck);
router.get("/history", healthController.getHealthCheckHistory); // Loại bỏ :idUser
router.get("/history/all", healthController.getAllHealthCheckHistory);

module.exports = router;
