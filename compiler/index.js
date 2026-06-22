const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateCodeFile");
const { generateInputFile } = require("./generateInputFile");
const { generateAiReview } = require("./generateAiReview");
// Import executors
const { executeCpp } = require("./executors/executeCpp");
const { executePython } = require("./executors/executePy");
// Later you can add executeJava, executeJs, etc.

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  console.log("📩 Received in /run:", { language, code, input });

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code" });
  }

  try {
    // Generate files
    const filePath = await generateFile(language, code);
    const inputFilePath = await generateInputFile(input);

    let output;
    // Choose executor based on language
    if (language === "cpp") {
      output = await executeCpp(filePath, inputFilePath);
    } else if (language === "py" || language === "python") {
      output = await executePython(filePath, inputFilePath);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    return res.json({ filePath, inputFilePath, output });
  } catch (error) {
    console.error("Execution error:", error);
    return res.status(500).json({ error: error.stderr || error.error || error.message || "Unknown error" });
  }
});

app.post("/ai-review",async (req,res)=>  {
  const {problem,code,verdict,message} = req.body;

  if(code === undefined || code.trim() === ''){
    return res.status(400).json({

      success : false,
      error: "Empty code! Please provide some code to execute."
    });
  }
  try{
    const aiReview= await generateAiReview(problem,code,verdict,message);
    res.status(200).json({
      success: true,
      message: aiReview 

    });
  } catch (err) {
  console.error(err);
  console.error(err.message);
  console.error(err.stack);
  throw err;
}
});

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error while running the server!");
  } else {
    console.log(`🚀 Server started on port: ${PORT}`);
  }
});