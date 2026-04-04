const Discussion = require("../models/Discussion");

/**
 * Create a discussion for a problem
 */
exports.createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { problemId } = req.params;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const discussion = await Discussion.create({
      title,
      content,
      problem: problemId,
      author: req.user.id,
      useravatar: req.user.avatar,
    });

    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all discussions for a problem
 * ?sort=new | top
 */
exports.getDiscussionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { sort = "new" } = req.query;
    const sortOption =
      sort === "top" ? { upvotes: -1 } : { createdAt: -1 };
    const discussions = await Discussion.find({ problem: problemId })
      .sort(sortOption)
      .populate("author", "userhandle avatar")
      .lean();
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single discussion
 */
exports.getSingleDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("author", "userhandle avatar");

    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle upvote discussion
 */
const User = require("../models/User");

exports.toggleDiscussionUpvote = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    const userId = req.user.id;

    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    // ❌ Prevent self-upvote
    if (discussion.author.toString() === userId)
      return res.status(400).json({ message: "Cannot upvote your own post" });

    const index = discussion.upvotedBy.indexOf(userId);

    if (index === -1) {
      // ✅ UPVOTE
      discussion.upvotedBy.push(userId);
      discussion.upvotes += 1;

      // reputation only on first upvote
      await User.findByIdAndUpdate(discussion.author, {
        $inc: { reputation: 5 },
      });
    } else {
      // ✅ REMOVE UPVOTE
      discussion.upvotedBy.splice(index, 1);
      discussion.upvotes -= 1;
    }

    await discussion.save();

    // 🔥 SYNC RESPONSE (THIS IS THE KEY)
    res.json({
      upvotes: discussion.upvotes,
      upvotedBy: discussion.upvotedBy,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
