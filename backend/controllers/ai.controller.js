import axios from "axios";

const COMPILER_URI = process.env.COMPILER_URI ; 
// 👆 change to your compiler server’s URL

// ✅ Get AI Suggestion (before/during solving)
export const aiSuggestion = async (req, res, next) => {
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
export const aiReview = async (req, res, next) => {
  try {
    const { problem,verdict,message, code } = req.body;

    const response = await axios.post(`${COMPILER_URI}/ai-review`, {
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
