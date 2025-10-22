const express = require("express");
const router = express.Router();
const { registerUser, validateUser } = require("../controllers/auth.controller");
const  verifyToken  = require("../middleware/jwtVerify");

router.post("/register", registerUser);
router.post("/login",validateUser);
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: req.user, // this will have { id, role } from the token
  });
});

module.exports = router;
