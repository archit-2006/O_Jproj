const express = require("express");
const router = express.Router();
const { registerUser, validateUser } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login",validateUser);

module.exports = router;
