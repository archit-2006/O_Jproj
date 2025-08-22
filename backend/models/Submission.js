const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    enum: ["cpp", "python", "java"], // extend later
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "TLE"],
    required: true,
  },
  executionTime: {
    type: Number, // ms
  },
  memoryUsed: {
    type: Number, // KB/MB
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
