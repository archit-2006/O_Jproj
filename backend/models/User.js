// const mongoose= require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstname:{
//         type:String,
//         default : null,
//         required: true,
//     },
//     lastname:{
//         type:String,
//         default : null,
//         required: true,
//     },
//     email:{
//         type:String,
//         default : null,
//         required: true,
//         unique: true,
//     },
//     password:{
//         type: String,
//         required: true,
//     },
//     role:{
//         type: String,
//         default: 'user',
//         required: true,

//     }
    
// });

// module.exports = mongoose.model("user", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic info
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    userhandle: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, default: "user" },
    avatar: { type: String, default: "/assets/avatar/default.png" }, // profile picture url
    bio: { type: String, default: "" }, // short intro

    // Stats info
    stats: {
      easySolved: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
        default: [], // ✅ prevent undefined → cast errors
      },
      mediumSolved: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
        default: [],
      },
      hardSolved: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
        default: [],
      },

      totalSubmissions: { type: Number, default: 0 },
      successfulSubmissions: { type: Number, default: 0 },

      // streaks
      currentStreak: { type: Number, default: 0 }, // ongoing streak
      longestStreak: { type: Number, default: 0 }, // max streak achieved
      lastSubmissionDate: { type: Date, default: null }, // ✅ safe default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
