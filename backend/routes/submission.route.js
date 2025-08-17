const express = require("express");
const router = express.Router();
const { submitCode } = require("../controllers/submission.controller");

// Submit solution for a problem
router.post("/:id/submit", submitCode);

module.exports = router;
