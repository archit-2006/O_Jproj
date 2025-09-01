// const Problem = require("../models/Problem");
// const Submission = require("../models/Submission");
// const axios = require("axios"); // compiler server


// const submitCode = async (req, res) => {
//   try {
//     const { id } = req.params; // problem id
//     const { code, language } = req.body;
//     const userId = req.user.id; // 👈 assuming you store user in req.user via auth middleware

//     // Find problem
//     const problem = await Problem.findById(id);
//     if (!problem) return res.status(404).json({ error: "Problem not found" });

//     // ---------- Helper to Run One Test ----------
//     const runTest = async (testInput) => {
//       try {
//         const response = await axios.post("http://localhost:4000/run", {
//           code,
//           language,
//           input: testInput,
//         });
//         return { output: response.data.output?.trim(), error: null };
//       } catch (err) {
//         const errMsg = err.response?.data?.error|| err.message;
//         console.log(errMsg);
//         if (typeof errMsg === "string" && (errMsg.includes("Compilation") || errMsg.toLowerCase().includes("error") ||
//           errMsg.toLowerCase().includes("expected"))) {
//           return { output: null, error: "Compilation Error" };
//         } else if (err.code === "ECONNABORTED") {
//           return { output: null, error: "TLE" };
//         } else {
//           return { output: null, error: "Runtime Error" };
//         }
//       }
//     };

//     let verdict = "Accepted"; // default accepted
//     console.log(problem.sampleTestCases.length);
//     // -------- Step 1: Run Sample Test Cases --------
//     for (let i = 0; i < problem.sampleTestCases.length; i++) {
//       const tc = problem.sampleTestCases[i];
//       const { output, error } = await runTest(tc.input);

//       if (error) {
//         verdict = error;
//         break;
//       }

//       if (output !== tc.output.trim()) {
//         verdict = "Wrong Answer";
//         break;
//       }
//     }

//     // -------- Step 2: Run Judge Test Cases --------
//     if (verdict === "Accepted") {
//       for (let i = 0; i < problem.judgeTestCases.length; i++) {
//         const tc = problem.judgeTestCases[i];
//         const { output, error } = await runTest(tc.input);

//         if (error) {
//           verdict = error;
//           break;
//         }

//         if (output !== tc.output.trim()) {
//           verdict = "Wrong Answer";
//           break;
//         }
//       }
//     }

//     // ✅ Save submission to DB
//     const submission = new Submission({
//       userId,
//       problemId: problem._id,
//       code,
//       language,
//       verdict,
//       // you can also store executionTime / memory if compiler server returns it
//     });
//     await submission.save();

//     // ✅ Respond to client
//     res.json({
//       status: verdict === "Accepted" ? "success" : "failed",
//       verdict,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error while submitting code" });
//   }
// };
// const getSubmissions = async (req, res) => {
//   try {
//     const userId = req.user.id; // auth middleware gives userId
//     const submissions = await Submission.find({ userId })
//       .populate("problemId", "title")
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.json(submissions);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching submissions" });
//   }
// };

// module.exports = { submitCode, getSubmissions };

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const axios = require("axios"); // compiler server
const updateUserStats = require("../utils/updateUserStats");

const submitCode = async (req, res) => {
  try {
    const { id } = req.params; // problem id
    const { code, language } = req.body;
    const userId = req.user.id; // 👈 from auth middleware

    // Find problem
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // ---------- Helper to Run One Test ----------
    const runTest = async (testInput) => {
      try {
        const response = await axios.post("http://localhost:4000/run", {
          code,
          language,
          input: testInput,
        });
        return { output: response.data.output?.trim(), error: null };
      } catch (err) {
        const errMsg = err.response?.data?.error || err.message;
        console.log(errMsg);
        if (
          typeof errMsg === "string" &&
          (errMsg.includes("Compilation") ||
            errMsg.toLowerCase().includes("error") ||
            errMsg.toLowerCase().includes("expected"))
        ) {
          return { output: null, error: "Compilation Error" };
        } else if (err.code === "ECONNABORTED") {
          return { output: null, error: "TLE" };
        } else {
          return { output: null, error: "Runtime Error" };
        }
      }
    };

    let verdict = "Accepted"; // default accepted
    let responsePayload = {
      status: "success",
      verdict,
      message: "All test cases passed 🎉.\n code submitted successfully...",
    };

    // -------- Step 1: Run Sample Test Cases --------
    for (let i = 0; i < problem.sampleTestCases.length; i++) {
      const tc = problem.sampleTestCases[i];
      const { output, error } = await runTest(tc.input);

      if (error) {
        verdict = error;
        responsePayload = {
          status: "failed",
          verdict,
          stage: "sample",
          testcase: i + 1,
          message: `Error occurred on Sample Test Case ${i + 1}`,
        };
        break;
      }

      if (output !== tc.output.trim()) {
        verdict = "Wrong Answer";
        responsePayload = {
          status: "failed",
          verdict,
          stage: "sample",
          testcase: i + 1,
          expected: tc.output.trim(),
          got: output,
          message: `Wrong Answer on Sample Test Case ${i + 1}`,
        };
        break;
      }
    }

    // -------- Step 2: Run Judge Test Cases --------
    if (verdict === "Accepted") {
      for (let i = 0; i < problem.judgeTestCases.length; i++) {
        const tc = problem.judgeTestCases[i];
        const { output, error } = await runTest(tc.input);

        if (error) {
          verdict = error;
          responsePayload = {
            status: "failed",
            verdict,
            stage: "judge",
            message: `Error occurred on Judge Test Case`,
          };
          break;
        }

        if (output !== tc.output.trim()) {
          verdict = "Wrong Answer";
          responsePayload = {
            status: "failed",
            verdict,
            stage: "judge",
            testcase: i + 1,
            message: `Wrong Answer on Judge Test Case`,
          };
          break;
        }
      }
    }

    // ✅ Save submission to DB
    const submission = new Submission({
      userId,
      problemId: problem._id,
      code,
      language,
      verdict,
    });
    await submission.save();

    // ✅ Update user stats after submission
    if (verdict === "Accepted") {
      await updateUserStats(userId, problem._id, problem.difficulty, true);
    } else {
      await updateUserStats(userId, problem._id, problem.difficulty, false);
    }

    // ✅ Respond to client
    res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error while submitting code" });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware gives userId
    const submissions = await Submission.find({ userId })
      .populate("problemId", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching submissions" });
  }
};

module.exports = { submitCode, getSubmissions };
