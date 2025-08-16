import fs from "fs";
import path from "path";
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirCodes = path.join(__dirname,'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{ recursive : true});
}

export function generateFile(format, content) {
    const jobID= uuid();
    const filename = `${jobID}.${format}`;
    const filepath = path.join(dirCodes,filename);
    fs.writeFileSync(filepath, content);
//     console.log("Generated file path:", filepath);
// console.log("File exists?", fs.existsSync(filepath));

    return filepath;

}
