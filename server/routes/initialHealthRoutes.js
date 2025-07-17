const express = require("express");
const router = express.Router();
const initialHealthController = require("../controllers/initialHealthController");

router.get("/", initialHealthController.getInitialHealthDeclaration); // Loại bỏ :id

module.exports = router;
