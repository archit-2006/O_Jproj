import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CustomInputBox from "../components/CustomInputBox";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // ✅ Starter Codes
  const starterCodes = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
    python: `print("Hello World!")`,
    
  };

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCodes["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [aiReviewOutput, setAiReviewOutput] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isFullScreenReview, setIsFullScreenReview] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`${BACKEND_URL}/problems/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProblem();
  }, [id]);

  // Language change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterCodes[lang]);
  };

  // Run function
  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/run/${id}`, {
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
        if (useCustomInput) {
          setOutput(data.got ? `Got: ${data.got}\n` : "");
        } else {
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
    } finally {
      setLoading(false);
    }
  };

  // Submit function
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOutput("⚠️ Please login to submit the problem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/submit/${id}`, {
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
            (data.testcase ? `Testcase Failed: #${data.testcase}\n` : "") +
            (data.expected ? `Expected: ${data.expected}\n` : "") +
            (data.got ? `Got: ${data.got}\n` : "") +
            (data.message ? `Message: ${data.message}` : "")
        );
        setShowAIReview(true);
      } else {
        setOutput("⚠️ Unknown response from server.");
      }
    } catch (err) {
      setOutput("⚠️ Error while submitting code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/ai/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: problem?.description,
          code,
          verdict: output.includes("✅") ? "Accepted" : "Rejected",
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
      <div className="bg-white shadow rounded-xl overflow-hidden flex flex-col">
        {/* Sticky Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-semibold text-lg text-gray-800 truncate">
            {problem?.title || "Loading..."}
          </h2>
        </div>

        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <ProblemDescription />
        </div>
      </div>

      {/* Right: Code Editor + IO */}
      <div className="flex flex-col gap-4">
        {/* Language Selector */}
        <div className="flex items-center justify-between bg-white shadow rounded-lg p-3">
          <label className="font-medium text-gray-700">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="border rounded-lg overflow-hidden shadow">
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* Custom Input Toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useCustomInput}
            onChange={(e) => setUseCustomInput(e.target.checked)}
          />
          Use Custom Input
        </label>

        {useCustomInput && <CustomInputBox value={input} onChange={setInput} />}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRun}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            ▶ Run
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🚀 Submit
          </button>
          {showAIReview && (
            <button
              onClick={handleAIReview}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              🤖 AI Review
            </button>
          )}
        </div>

        {/* Output */}
        <div className="bg-black text-green-400 p-4 rounded-lg h-48 overflow-auto font-mono text-sm shadow-inner">
          {loading ? (
            <span>⏳ Running...</span>
          ) : (
            <pre>{output || "⏳ Output will appear here..."}</pre>
          )}
        </div>

        {/* AI Review */}
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
                {/* Fullscreen Toggle */}
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
