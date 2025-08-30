import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CustomInputBox from "../components/CustomInputBox";
import ReactMarkdown from "react-markdown";

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();
  

  // ✅ Language & starter codes
  const starterCodes = {
    cpp: `// Write your code here...
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
    python: `# Write your code here...
print("Hello World!")`,
    java: `// Write your code here...
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`
  };

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCodes["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW STATE    
  const [showAIReview, setShowAIReview] = useState(false);
  const [aiReviewOutput, setAiReviewOutput] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isFullScreenReview, setIsFullScreenReview] = useState(false);


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

  // // ✅ When language changes, set starter code
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterCodes[lang]);
  };
  // Run function
  const handleRun = async () => {
    setLoading(true); // ✅ START LOADING

    try {
      const res = await fetch(`http://localhost:5000/api/run/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          id,
          useCustomInput,
          input,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setOutput("⚠️ Server did not return valid JSON.");
        return;
      }

      if (data.status === "success") {
        if(useCustomInput){
          setOutput((data.got ? `Got: ${data.got}\n` : ""));
        }
        else{
        setOutput(`✅ Verdict: ${data.verdict} - ${data.message}`);

        }
      } else if (data.status === "failed") {
        setOutput(
          `❌ Verdict: ${data.verdict}\n` +
            (data.stage ? `Stage: ${data.stage}\n` : "") +
            (data.testcase ? `Testcase: ${data.testcase}\n` : "") +
            (data.expected ? `Expected: ${data.expected}\n` : "") +
            (data.got ? `Got: ${data.got}\n` : "") +
            (data.message ? `Message: ${data.message}` : "")
        );
      } else {
        setOutput("⚠️ Unknown response from server.");
      }
    } catch (err) {
      setOutput("⚠️ Error connecting to server: " + err.message);
    } finally{
      setLoading(false);
    }
  };

  // Submit function
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

     if (!token) {
    setOutput("⚠️ Please login to submit the problem.");
    return; // stop here if not logged in
  }
    setLoading(true); // ✅ START LOADING

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/submit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setOutput("⚠️ Server did not return valid JSON.");
        return;
      }

      if (data.status === "success") {
        setOutput(`✅ Verdict: ${data.verdict} - ${data.message}`);
        setShowAIReview(true);
      } else if (data.status === "failed") {
        setOutput(
          `❌ Verdict: ${data.verdict}\n` +
            (data.stage ? `Stage: ${data.stage}\n` : "") +
            (data.testcase ? `Testcase Failed: #${data.testcase}\n` : "") + // ✅ Show testcase number
            (data.expected ? `Expected: ${data.expected}\n` : "") + // ✅ Show expected output
            (data.got ? `Got: ${data.got}\n` : "") + // ✅ Show actual output
            (data.message ? `Message: ${data.message}` : "")
        );
        setShowAIReview(true);
      } else {
        setOutput("⚠️ Unknown response from server.");
      }
    } catch (err) {
      setOutput("⚠️ Error while submitting code: " + err.message);
    }
    finally{
     setLoading(false);

    }
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    try {
      // console.log(problem);
      const res = await fetch("http://localhost:5000/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // problem: problem?.description || "Unknown Problem",
          problem:problem.description,
          code,
          verdict: output.includes("") ? "Accepted" : "Rejected",
          message: output,
        }),
      });

      const data = await res.json();
      setAiReviewOutput(data.message || "⚠️ No review generated.");
    } catch (err) {
      setAiReviewOutput("⚠️ Error fetching AI review: " + err.message);
    } finally {
      setReviewLoading(false);
    }
  };


  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem Description */}
      <div className="bg-white shadow rounded-lg p-4 overflow-auto max-h-[85vh]">
        <button
          onClick={() => navigate("/problem")}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>

        <ProblemDescription />
      </div>

      {/* Right: Code Editor + Input/Output */}
      <div className="flex flex-col gap-4">
        {/* ✅ Language Selector */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-2 py-1 border rounded"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Code Editor */}

        {/* Code Editor with only top corners rounded */}
        <div className="border rounded-t-lg overflow-hidden">
          <CodeEditor code={code} setCode={setCode} />
        </div>


        {/* ✅ Toggle for custom input */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCustomInput}
            onChange={(e) => setUseCustomInput(e.target.checked)}
          />
          Use Custom Input
        </label>

        {/* ✅ Show input box only when enabled */}
        {useCustomInput && <CustomInputBox value={input} onChange={setInput} />}

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
          {showAIReview && (
            <button
              onClick={handleAIReview}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              🤖 AI Review
            </button>
          )}
        </div>

        {/* Output Box */}
        <div className="bg-black text-green-400 p-3 rounded h-48 overflow-auto font-mono">
          {loading ? <span>⏳ Running...</span> : <pre>{output || "⏳ Output will appear here..."}</pre>}
        </div>
        {/* ✅ AI Review Output */}
        {showAIReview && (
          <div className="relative mt-2">
            <div
              className={`${
                isFullScreenReview
                  ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
                  : ""
              }`}
            >
              <div
                className={`relative ${
                  isFullScreenReview
                    ? "w-3/4 h-3/4 bg-gray-900 p-6 rounded-xl shadow-2xl overflow-auto"
                    : "bg-gray-900 p-4 rounded-lg h-48 overflow-auto shadow-md"
                }`}
              >
                {/* Fullscreen Toggle Button */}
                <button
                  onClick={() => setIsFullScreenReview(!isFullScreenReview)}
                  className="absolute top-2 right-2 px-2 py-1 text-sm rounded-md 
                     bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  {isFullScreenReview ? "❌" : "⛶"}
                </button>

                {reviewLoading ? (
                  <span className="text-purple-300">🤖 Thinking...</span>
                ) : (
                  <div className="whitespace-pre-wrap break-words font-mono text-purple-300 mt-6">
                    <ReactMarkdown>
                      {aiReviewOutput || "🤖 Click 'AI Review' to get feedback."}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
