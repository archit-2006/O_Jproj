const mongoose = require("mongoose");
const User = require("../models/User");

async function updateUserStats(userId, problemId, difficulty, success) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 🔹 Ensure stats object + arrays exist (backward compatibility)
  if (!user.stats) user.stats = {};
  if (!Array.isArray(user.stats.easySolved)) user.stats.easySolved = [];
  if (!Array.isArray(user.stats.mediumSolved)) user.stats.mediumSolved = [];
  if (!Array.isArray(user.stats.hardSolved)) user.stats.hardSolved = [];

  // update submissions
  user.stats.totalSubmissions = (user.stats.totalSubmissions || 0) + 1;
  if (success) user.stats.successfulSubmissions = (user.stats.successfulSubmissions || 0) + 1;

  // ensure problemId is an ObjectId
  const problemObjectId = new mongoose.Types.ObjectId(problemId);

  // track solved problems uniquely
  if (success) {
    if (difficulty === "Easy" && !user.stats.easySolved.includes(problemObjectId)) {
      user.stats.easySolved.push(problemObjectId);
    }
    if (difficulty === "Medium" && !user.stats.mediumSolved.includes(problemObjectId)) {
      user.stats.mediumSolved.push(problemObjectId);
    }
    if (difficulty === "Hard" && !user.stats.hardSolved.includes(problemObjectId)) {
      user.stats.hardSolved.push(problemObjectId);
    }
  }

  // streak logic
  const today = new Date().setHours(0, 0, 0, 0);
  const last = user.stats.lastSubmissionDate
    ? new Date(user.stats.lastSubmissionDate).setHours(0, 0, 0, 0)
    : null;

  if (!last || today - last > 24 * 60 * 60 * 1000) {
    // streak reset
    user.stats.currentStreak = 1;
  } else if (today - last === 24 * 60 * 60 * 1000) {
    // continued streak
    user.stats.currentStreak = (user.stats.currentStreak || 0) + 1;
  }

  user.stats.longestStreak = Math.max(user.stats.longestStreak || 0, user.stats.currentStreak || 0);
  user.stats.lastSubmissionDate = new Date();

  await user.save();
}

module.exports = updateUserStats;
