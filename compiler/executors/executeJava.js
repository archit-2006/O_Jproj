// utils/executeJava.js
import { exec } from "child_process";
import path from "path";

/**
 * Compile & run Java code
 * @param {string} filePath - full path to java file
 * @param {string} inputFilePath - full path to input file
 * @param {string} className - dynamically generated classname
 * @returns {Promise<string>} output
 */
export const executeJava = async (filePath, inputFilePath, className) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);

    // Step 1: Compile
    exec(`javac ${filePath}`, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({ error: "Compilation failed", stderr: compileStderr || compileErr.message });
      }

      // Step 2: Run
      exec(
        `java -cp ${dir} ${className} < ${inputFilePath}`,
        (runErr, stdout, stderr) => {
          if (runErr) {
            return reject({ error: "Execution failed", stderr: stderr || runErr.message });
          }
          resolve(stdout);
        }
      );
    });
  });
};
