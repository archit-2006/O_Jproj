const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwtVerify");

const {
  createDiscussion,
  getDiscussionsByProblem,
  getSingleDiscussion,
  toggleDiscussionUpvote,
} = require("../controllers/discussion.controller");

router.post("/:problemId", auth, createDiscussion);
router.get("/:problemId", getDiscussionsByProblem);
router.get("/single/:id", getSingleDiscussion);
router.post("/upvote/:id", auth, toggleDiscussionUpvote);

module.exports = router;
