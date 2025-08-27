import axios from "axios";

const COMPILER_AI_BASE = process.env.COMPILER_AI_BASE || "http://localhost:4000"; 
// 👆 change to your compiler server’s URL

// ✅ Get AI Suggestion (before/during solving)
export const aiSuggestion = async (req, res, next) => {
  try {
    const { problem, code } = req.body;

    const response = await axios.post(`${COMPILER_AI_BASE}/suggestion`, {
      problem,
      code,
    });

    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// ✅ Get AI Review (after run/submit)
export const aiReview = async (req, res, next) => {
  try {
    const { problem,verdict,message, code } = req.body;

    const response = await axios.post(`${COMPILER_AI_BASE}/ai-review`, {
      problem,
      code,
      verdict,
      message,
    });

    res.json(response.data);
  } catch (err) {
    next(err);
  }
};
