const axios = require("axios");

const COMPILER_URI = process.env.COMPILER_URI ; 
// 👆 change to your compiler server’s URL

// ✅ Get AI Suggestion (before/during solving)
const aiSuggestion = async (req, res, next) => {
  try {
    const { problem, code } = req.body;

    const response = await axios.post(`${COMPILER_URI}/suggestion`, {
      problem,
      code,
    });

    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// ✅ Get AI Review (after run/submit)
const aiReview = async (req, res, next) => {
  try {
    const { problem,verdict,message, code } = req.body;

    const response = await axios.post(`${COMPILER_URI}/ai-review`, {
      problem,
      code,
      verdict,
      message,
    });
     console.log("AI Review Response:", response.data); // Debug log
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  aiSuggestion,
  aiReview,
};