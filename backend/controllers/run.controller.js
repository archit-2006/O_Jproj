// import Problem from "../models/Problem.js";
// import fetch from "node-fetch";

// export const runCode = async (req, res) => {
//   try {
//     const {id}=req.params;
//     const { code, language, customInput, useCustomInput} = req.body;

//     // Decide input:
//     let inputToSend;
//     if (useCustomInput) {
//       inputToSend = customInput;
//     } else {
//       const problem = await Problem.findById(id);
//       if (!problem) return res.status(404).json({ message: "Problem not found" });
//       inputToSend = problem.sampleTests[0].input; // ✅ only sample test for run
//     }

//     // Forward to compiler server
//     const compileRes = await fetch("http://localhost:4000/run", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code, language, input: inputToSend }),
//     });

//     const result = await compileRes.json();

//     // Verdict logic
//     if (result.error) {
//       if (result.error.includes("error:")) {
//         return res.json({ verdict: "Compilation Error", details: result.error });
//       }
//       return res.json({ verdict: "Runtime Error", details: result.error });
//     }

//     if (result.tle) {
//       return res.json({ verdict: "Time Limit Exceeded" });
//     }

//     // If sample test, check correctness
//     if (!useCustomInput) {
//       const problem = await Problem.findById(id);
//       const expected = problem.sampleTests[0].output.trim();
//       const got = (result.output || "").trim();

//       if (expected === got) {
//         return res.json({ verdict: "Accepted", output: got });
//       } else {
//         return res.json({
//           verdict: "Wrong Answer",
//           expected,
//           got,
//         });
//       }
//     }

//     // Custom input → just return output
//     return res.json({ verdict: "Success", output: result.output });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ verdict: "Server Error", details: err.message });
//   }
// };

const axios = require("axios");
const Problem = require("../models/Problem");

// POST /api/run/:id
const runCode = async (req, res) => {
  try {
    // const { id } = req.params;
    const { code, language,id, useCustomInput, input } = req.body;

    // fetch problem
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

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
        if (err.response?.data?.error?.includes("Compilation")) {
          return { output: null, error: "CE" };
        } else if (err.code === "ECONNABORTED") {
          return { output: null, error: "TLE" };
        } else {
          return { output: null, error: "RE" };
        }
      }
    };

    if (useCustomInput) {
  // Run only with custom input
  const { output, error } = await execute(input);
  return res.json({
    stage: "custom",
    output: error ? null : output,
    error, // keep error explicitly
  });
}
 else {
      // Run with **sample test cases only**
      for (let i = 0; i < problem.sampleTestCases.length; i++) {
        const tc = problem.sampleTestCases[i];
        const { output, error } = await execute(tc.input);

        if (error) {
          return res.json({
            status: "failed",
            verdict: error,
            testcase: i + 1,
          });
        }

        if (output !== tc.output.trim()) {
          return res.json({
            status: "failed",
            verdict: "WA",
            testcase: i + 1,
            expected: tc.output,
            got: output,
          });
        }
      }

      return res.json({
        status: "success",
        verdict: "AC",
        message: "All sample test cases passed 🎉",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while running code" });
  }
};

module.exports = { runCode };

