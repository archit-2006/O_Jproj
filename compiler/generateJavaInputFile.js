// utils/generateInputFile.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirInputs = path.join(__dirname, "inputs");

// Ensure inputs folder exists
if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

/**
 * Generate input file (unique per user)
 * @param {string} input
 * @returns {Promise<string>} filePath
 */
export const generateJavaInputFile = async (input = "") => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `input_${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
      const filePath = path.join(dirInputs, fileName);

      fs.writeFileSync(filePath, input);

      resolve(filePath);
    } catch (err) {
      reject(err);
    }
  });
};
