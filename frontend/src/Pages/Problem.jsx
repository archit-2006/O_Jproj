// src/Pages/Problem.jsx
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CustomInputBox from "../components/CustomInputBox";

export default function Problem() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem Description */}
      <div className="bg-white shadow rounded-lg p-4 overflow-auto max-h-[85vh]">
        <ProblemDescription />
      </div>

      {/* Right: Code Editor */}
      <div className="flex flex-col gap-4">
        <CodeEditor />
        <CustomInputBox />
        <div className="flex gap-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
            Run
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
