// import { useState } from "react";
// import Editor from "@monaco-editor/react";

// export default function CodeEditor() {
//   const [code, setCode] = useState(`#include <iostream>
// using namespace std;

// int main() {
//     int n;
//     cin >> n;
//     cout << "You entered: " << n << endl;
//     return 0;
// }`);
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");

//   const handleCompile = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/run", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ language: "cpp", code, input }),
//       });

//       const data = await res.json();
//       if (data.error) {
//         setOutput("⚠️ Error: "+data.stderr || data.error);
//       } else {
//         setOutput(data.output);
//       }
//     } catch (err) {
//       console.error(err);
//       setOutput("⚠️ Error connecting to server : "+err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
//       {/* Code Editor */}
//       <div className="flex-1 border-r border-gray-700 p-4">
//         <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
//         <Editor
//           height="80vh"
//           theme="vs-dark"
//           defaultLanguage="cpp"
//           value={code}
//           onChange={(value) => setCode(value || "")}
//         />
//       </div>

//       {/* Input & Output Panel */}
//       <div className="w-full md:w-1/3 p-4 flex flex-col space-y-4">
//         <h2 className="text-lg font-semibold">Custom Input</h2>
//         <textarea
//           className="w-full h-32 p-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter custom input here..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />

//         <button
//           onClick={handleCompile}
//           className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-medium"
//         >
//           ▶ Run Code
//         </button>

//         <h2 className="text-lg font-semibold">Output</h2>
//         <pre className="w-full flex-1 p-3 rounded bg-black border border-gray-700 overflow-auto">
//           {output || "⏳ Output will appear here..."}
//         </pre>
//       </div>
//     </div>
//   );
// }
