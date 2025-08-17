const Problem = require("../models/Problem");
const axios = require("axios"); // to call compiler server

const submitCode = async (req, res) => {
  try {
    const { id } = req.params; // problem id
    const { code, language } = req.body;

    // Find problem
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // -------- Step 1: Run Sample Test Cases --------
    for (let i = 0; i < problem.sampleTestCases.length; i++) {
      const tc = problem.sampleTestCases[i];

      const response = await axios.post("http://localhost:4000/run", {
        language,
        code,
        input: tc.input,
      });

      const output = response.data.output;

      if (output.trim() !== tc.output.trim()) {
        return res.json({
          status: "failed",
          stage: "sample",
          testcase: i + 1,
          expected: tc.output,
          got: output,
          message: `Wrong Answer on Sample Test Case ${i + 1}`,
        });
      }
    }

    // -------- Step 2: Run Judge Test Cases --------
    for (let i = 0; i < problem.judgeTestCases.length; i++) {
      const tc = problem.judgeTestCases[i];

      const response = await axios.post("http://localhost:4000/run", {
        language,
        code,
        input: tc.input,
      });

      const output = response.data.output;

      if (output.trim() !== tc.output.trim()) {
        return res.json({
          status: "failed",
          stage: "judge",
          testcase: i + 1,
          expected: tc.output,
          got: output,
          message: `Wrong Answer on Judge Test Case ${i + 1}`,
        });
      }
    }

    // ✅ All passed
    return res.json({
      status: "success",
      message: "Code Submitted Successfully 🎉",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while submitting code" });
  }
};

module.exports = { submitCode };
