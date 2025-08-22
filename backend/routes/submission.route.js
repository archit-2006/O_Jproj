const express = require("express");
const router = express.Router();
const { submitCode,getSubmissions } = require("../controllers/submission.controller");
const auth = require("../middleware/jwtVerify"); // 👈 only if you use JWT auth

// Submit solution for a problem
router.post("/submit/:id/", auth,submitCode);

router.get("/submissions/:userId", auth,getSubmissions);


module.exports = router;
