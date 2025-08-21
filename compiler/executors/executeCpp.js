const {exec} = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname,'outputs')

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, { recursive : true });
}

const executeCpp = (filepath,inputFilePath) => {
    const jobID= path.basename(filepath).split('.')[0];
    const outPath= path.join(outputPath,`${jobID}.exe`);
    return new Promise((resolve , reject)=>{
        exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobID}.exe <"${inputFilePath}"`, (error,stdout,stderr)=>{
            if(error){
                reject({ error, stderr});
            }
            if(stderr){
                reject(stderr);
            }
            resolve(stdout);
        });
        // if (input) {
        //     child.stdin.write(input);
        //     child.stdin.end();
        // }
    });
};

module.exports = { executeCpp };