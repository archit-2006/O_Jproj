const Comment = require("../models/Comment");
const Discussion = require("../models/Discussion");

/**
 * Add comment to discussion
 */
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { discussionId } = req.params;

    if (!content)
      return res.status(400).json({ message: "Content required" });

    const comment = await Comment.create({
      content,
      discussion: discussionId,
      author: req.user.id,
    });

    await Discussion.findByIdAndUpdate(discussionId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get comments for discussion
 */
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      discussion: req.params.discussionId,
    })
      .sort({ createdAt: 1 })
      .populate("author", "userhandle avatar");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle upvote comment
 */
const User = require("../models/User");

exports.toggleCommentUpvote = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.user.id;

    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    // ❌ Prevent self-upvote
    if (comment.author.toString() === userId)
      return res.status(400).json({ message: "Cannot upvote your own comment" });

    const index = comment.upvotedBy.indexOf(userId);

    if (index === -1) {
      comment.upvotedBy.push(userId);
      comment.upvotes += 1;

      // ✅ Reputation only increases
      await User.findByIdAndUpdate(comment.author, {
        $inc: { reputation: 2 },
      });
    } else {
      comment.upvotedBy.splice(index, 1);
      comment.upvotes -= 1;
    }

    await comment.save();
    res.json({ upvotes: comment.upvotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

