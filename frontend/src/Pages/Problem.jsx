import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CustomInputBox from "../components/CustomInputBox";

export default function Problem() {
  const { id } = useParams(); // <-- problemId from URL
  const [problem, setProblem] = useState(null);
    const navigate = useNavigate(); // ✅ now you can use it
  const [code, setCode] = useState(`// Write your code here...
  #include <iostream>
  using namespace std;

  int main() {
      cout << "Hello World!" << endl;
      return 0;
  }`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`http://localhost:5000/api/problems/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch (err) {
        console.error(err);
      
      }
    }
    fetchProblem();
  }, [id]);
  // Function to run code
  const handleRun = async () => {
    try {
      const res = await fetch("http://localhost:4000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "cpp", code, input }),
      });

      const data = await res.json();
      if (data.error) {
        setOutput("⚠️ Error: " + (data.stderr || data.error));
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      console.error(err);
      setOutput("⚠️ Error connecting to server: " + err.message);
    }
  };

  // Placeholder for submit (later can check against test cases)
  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "cpp" }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error while submitting code");
    }
  };
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem Description */}
      <div className="bg-white shadow rounded-lg p-4 overflow-auto max-h-[85vh]">
        {/* 🔙 Back button */}
        <button
          onClick={() => navigate('/problem')} // useNavigate imported from react-router-dom
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>

        <ProblemDescription />
      </div>

      {/* Right: Code Editor + Input/Output */}
      <div className="flex flex-col gap-4">
        <CodeEditor code={code} setCode={setCode} />
        <CustomInputBox value={input} onChange={setInput} />

        <div className="flex gap-4">
          <button
            onClick={handleRun}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            ▶ Run
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🚀 Submit
          </button>
        </div>

        {/* Output Box */}
        <div className="bg-black text-green-400 p-3 rounded h-48 overflow-auto font-mono">
          {output || "⏳ Output will appear here..."}
        </div>
      </div>
    </div>
  );
}