const express = require("express");
const  cors  = require("cors");
const { generateFile } = require("./generateCodeFile");
const { generateInputFile } = require("./generateInputFile");
const { executeCpp } = require("./executors/executeCpp");
require("dotenv").config();
const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req,res) => {
    const { language = 'cpp', code, input } = req.body;
      console.log("📩 Received in /run:", { language, code, input }); // 👈 Debug log

    if( code=== undefined ){
        return res.status(404).json({ success: false, error: "Empty code" });
    }
    try{
        const filePath = await generateFile(language, code);
        const inputFilePath = await generateInputFile(input);
        const output = await executeCpp(filePath,inputFilePath);
        return res.json({ filePath,output ,inputFilePath});
    }
    catch(error){
        // console.error("Execution error:", error);
        // res.status(500).json({ error: error });
        return res.json({error: error.message || "Unknown error"});
    }
});

const PORT= process.env.PORT;

app.listen( PORT, (error)=>{
    if(error){
        console.log("Error while running the server! "); 
    }
    else{
        console.log(`Server started on port :${PORT}`);
    }
});