// utils/generateCodeFile.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "codes");

// Ensure codes folder exists
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

/**
 * Generate code file safely for multiple users
 * @param {string} language - cpp | py | java
 * @param {string} code - user code
 * @returns {Promise<{ filePath: string, className?: string }>}
 */
export const generateJavaCodeFile = async (language, code) => {
  return new Promise((resolve, reject) => {
    try {
      let fileName, className;

      if (language === "cpp") {
        fileName = `main_${Date.now()}_${Math.random().toString(36).slice(2)}.cpp`;
      } else if (language === "py" || language === "python") {
        fileName = `main_${Date.now()}_${Math.random().toString(36).slice(2)}.py`;
      } else if (language === "java") {
        // Create a unique classname for Java
        className = `Solution_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        fileName = `${className}.java`;

        // Replace "class Solution" with "class Solution_<timestamp>"
        code = code.replace(/class\s+Solution/, `class ${className}`);
      } else {
        return reject(new Error("Unsupported language"));
      }

      const filePath = path.join(dirCodes, fileName);
      fs.writeFileSync(filePath, code);

      resolve({ filePath, className });
    } catch (err) {
      reject(err);
    }
  });
};
