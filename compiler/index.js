const express = require("express");
const { generateFile } = require("./generateCodeFile");
const { executeFile } = require("./executeCpp");
require("dotenv").config();
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req,res) => {
    const { language = 'cpp', code } = req.body;
    if( code=== undefined ){
        return res.status(404).json({ success: false, error: "Empty code" });
    }
    try{
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath);
        return req.json({ output });
    }
    catch(error){
        res.status(500).json({ error: error });
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