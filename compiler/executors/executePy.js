

const { exec } = require("child_process");
const path = require("path");

const executePython = (filepath, inputFilePath) => {
  // Detect OS: Windows uses "python", Linux/Mac uses "python3"
  const isWin = process.platform === "win32";
  const pythonCmd = isWin ? "python" : "python3";

  const command = `${pythonCmd} "${filepath}" < "${inputFilePath}"`;

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

module.exports = { executePython };
