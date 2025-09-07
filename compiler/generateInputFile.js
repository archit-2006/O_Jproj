import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirInputs = path.join(__dirname, "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

export function generateInputFile(input) {
    try{
    const jobID= uuid();
    const inputFilename = `${jobID}.txt`;
    const inputFilepath = path.join(dirInputs,inputFilename);
    fs.writeFileSync(inputFilepath, input);
    console.log("Input received:", input);
// console.log("Generated input file path:", inputFilepath);
// fs.writeFileSync(inputFilepath, input || "");
// console.log("Input file exists?", fs.existsSync(inputFilepath));

    
    return inputFilepath;

    }catch(error){
        console.log(error);
    }

}