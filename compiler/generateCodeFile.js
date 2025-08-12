const fs= require("fs");
const path = require("path");
import { v4 as uuid } from 'uuid';
const dirCodes = path.join(__dirname,'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{ recursive : true});
}

const generateFile = (format, content)=> {
    const jobID= uuid();
    const filename = `${jobID}.${format}`;
    const filepath = path.join(dirCodes,filename);
    fs.writeFileSync(filepath, content);
    return filepath;

}

module.exports = { generateFile };