const User = require("../models/User");

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("stats.easySolved stats.mediumSolved stats.hardSolved", "title");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Return extra computed stats
    const profileData = {
      ...user.toObject(),
      statsSummary: {
        easySolvedCount: user.stats.easySolved.length,
        mediumSolvedCount: user.stats.mediumSolved.length,
        hardSolvedCount: user.stats.hardSolved.length,
        totalSolved:
          user.stats.easySolved.length +
          user.stats.mediumSolved.length +
          user.stats.hardSolved.length,
        successRate:
          user.stats.totalSubmissions > 0
            ? (
                (user.stats.successfulSubmissions /
                  user.stats.totalSubmissions) *
                100
              ).toFixed(2) + "%"
            : "0%",
      },
    };

    res.json(profileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update profile (bio, avatar URL, etc.)
const updateProfile = async (req, res) => {
  try {
    const updates = {
      bio: req.body.bio,
      avatar: req.body.avatar, // expects direct URL (Cloudinary/local upload result)
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl =  `/assets/avatar/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    if (!bio) {
      return res.status(400).json({ error: "Bio is required" });
    }

    const userId = req.user.id; // from JWT middleware

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Bio updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Bio Error:", err);
    res.status(500).json({ error: "Failed to update bio" });
  }
};

module.exports = { getProfile, updateProfile, updateAvatar ,updateBio};
