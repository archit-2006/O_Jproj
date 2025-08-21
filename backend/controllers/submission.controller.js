const Problem = require("../models/Problem");
const axios = require("axios"); // to call compiler server

const submitCode = async (req, res) => {
  try {
    const { id } = req.params; // problem id
    const { code, language } = req.body;

    // Find problem
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // ---------- Helper to Run One Test ----------
    const runTest = async (input) => {
      try {
        const response = await axios.post("http://localhost:4000/run", {
          language,
          code,
          input,
        });
        return { output: response.data.output?.trim(), error: null };
      } catch (err) {
        if (err.response?.data?.error?.includes("Compilation")) {
          return { output: null, error: "CE" }; // Compilation Error
        } else if (err.code === "ECONNABORTED") {
          return { output: null, error: "TLE" }; // Timeout
        } else {
          return { output: null, error: "RE" }; // Runtime Error
        }
      }
    };

    // -------- Step 1: Run Sample Test Cases --------
    for (let i = 0; i < problem.sampleTestCases.length; i++) {
      const tc = problem.sampleTestCases[i];

      const { output, error } = await runTest(tc.input);

      if (error) {
        return res.json({
          status: "failed",
          verdict: error,
          stage: "sample",
          testcase: i + 1,
        });
      }

      if (output !== tc.output.trim()) {
        return res.json({
          status: "failed",
          verdict: "WA",
          stage: "sample",
          testcase: i + 1,
          expected: tc.output,
          got: output,
        });
      }
    }

    // -------- Step 2: Run Judge Test Cases --------
    for (let i = 0; i < problem.judgeTestCases.length; i++) {
      const tc = problem.judgeTestCases[i];

      const { output, error } = await runTest(tc.input);

      if (error) {
        return res.json({
          status: "failed",
          verdict: error,
          stage: "judge",
          testcase: i + 1,
        });
      }

      if (output !== tc.output.trim()) {
        return res.json({
          status: "failed",
          verdict: "WA",
          stage: "judge",
          testcase: i + 1,
          
        });
      }
    }

    // ✅ All passed
    return res.json({
      status: "success",
      verdict: "AC",
      message: "All test cases passed 🎉",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error while submitting code" });
  }
};

module.exports = { submitCode };

