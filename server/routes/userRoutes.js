const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/check/:idUser", userController.checkUserExists);

module.exports = router;
