const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputFilePath) => {
  const jobID = path.basename(filepath).split(".")[0];
  const isWin = process.platform === "win32";
  const exeName = isWin ? `${jobID}.exe` : `${jobID}.out`;
  const outPath = path.join(outputPath, exeName);

  return new Promise((resolve, reject) => {
    // 1. Compile
    exec(`g++ "${filepath}" -o "${outPath}"`, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({ error: "Compilation Error", stderr: compileStderr });
      }

      // 2. Run (with timeout)
      const runCmd = isWin
        ? `"${outPath}" < "${inputFilePath}"`
        : `"${outPath}" < "${inputFilePath}"`;

      exec(runCmd, { timeout: 2000 }, (runErr, stdout, stderr) => {
        if (runErr) {
          if (runErr.killed || runErr.signal === "SIGTERM") {
            return reject({ error: "Time Limit Exceeded (TLE)", stderr: "" });
          }
          return reject({ error: runErr, stderr });
        }
        if (stderr) {
          return reject({ error: "Runtime Error", stderr });
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = { executeCpp };
