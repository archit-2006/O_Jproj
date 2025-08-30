
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputFilePath) => {
  const jobID = path.basename(filepath).split(".")[0];

  // Pick extension depending on platform
  const isWin = process.platform === "win32";
  const exeName = isWin ? `${jobID}.exe` : `${jobID}.out`;
  const outPath = path.join(outputPath, exeName);

  // Run command accordingly
  const runCmd = isWin
    ? `${exeName} < "${inputFilePath}"`
    : `./${exeName} < "${inputFilePath}"`;

  const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ${runCmd}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr });
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
