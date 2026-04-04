const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwtVerify");

const {addComment,getComments,toggleCommentUpvote} = require("../controllers/comment.controller");

router.post("/:discussionId", auth, addComment);
router.get("/:discussionId", getComments);
router.post("/upvote/:id", auth, toggleCommentUpvote);

module.exports = router;
