const express = require("express");
const router = express.Router();
const { getProfile, updateProfile,updateAvatar,updateBio } = require("../controllers/profile.controller");
const  verifyToken  = require("../middleware/jwtVerify");
const {upload} = require("../middleware/upload");

// Profile routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/avatar",verifyToken, upload.single("avatar"), updateAvatar);
router.put("/bio", verifyToken, updateBio);


module.exports = router;
