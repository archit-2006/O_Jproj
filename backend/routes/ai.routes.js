const express = require("express");
const { aiSuggestion, aiReview } = require( "../controllers/ai.controller.js");

const router = express.Router();

router.post("/suggestion", aiSuggestion);
router.post("/review", aiReview);

module.exports = router;