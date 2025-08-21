const express = require("express");
const router = express.Router();
const { runCode } = require("../controllers/run.controller");

// Submit solution for a problem
router.post("/run/:id", runCode);

module.exports = router;
