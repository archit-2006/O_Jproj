
const axios = require("axios");
const Problem = require("../models/Problem");

// POST /api/run/:id
const runCode = async (req, res) => {
  const { code, language, id, useCustomInput, input } = req.body;

  try {
    // fetch problem
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.json({
        status: "failed",
        verdict: "Problem Not Found",
        message: "No problem found with given ID",
      });
    }

    // helper to send code to compiler server
    const execute = async (testInput) => {
      try {
        const response = await axios.post("http://localhost:4000/run", {
          code,
          language,
          input: testInput,
        });
        return { output: response.data.output?.trim(), error: null };
      } catch (err) {
        const errMsg = err.response?.data?.error|| err.message;
        // console.log(errMsg);
        if (typeof errMsg === "string" && (errMsg.includes("Compilation") || errMsg.toLowerCase().includes("error") ||
          errMsg.toLowerCase().includes("expected"))) {
          return { output: null, error: "Compilation Error" };
        } else if (errMsg.toUpperCase().includes("TLE") ) {
          return { output: null, error: "Time Limit Exceeded" };
        } else {
          return { output: null, error: "Runtime Error" };
        }
      }
    };

    // ✅ Run with custom input only
    if (useCustomInput) {
      const { output, error } = await execute(input);
      return res.json({
        status: error ? "failed" : "success",
        verdict: error ? error : "OK",
        stage: "custom",
        got : output,
        message: error ? "Execution failed" : "Executed successfully",
      });
    }

    // ✅ Otherwise, run with sample testcases
    for (let i = 0; i < problem.sampleTestCases.length; i++) {
      const tc = problem.sampleTestCases[i];
      const { output, error } = await execute(tc.input);

      if (error) {
        return res.json({
          status: "failed",
          verdict: error,
          stage: "sample testcase",
          testcase: i + 1,
          message: `Error occurred on testcase ${i + 1}`,
        });
      }

      if (output !== tc.output.trim()) {
        return res.json({
          status: "failed",
          verdict: "Wrong Answer",
          stage: "checking",
          testcase: i + 1,
          expected: tc.output.trim(),
          got: output,
          message: `Wrong Answer on testcase ${i + 1}`,
        });
      }
    }

    return res.json({
      status: "success",
      verdict: "Accepted",
      message: "All sample test cases passed 🎉",
    });
  } catch (err) {
    console.error("Server error in runCode:", err);
    return res.json({
      status: "failed",
      verdict: "Server Error",
      message: "Unexpected error while running code",
    });
  }
};

module.exports = { runCode };
