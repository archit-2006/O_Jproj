import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CustomInputBox from "../components/customInputBox";
import DiscussionsTab from "../components/DiscussionsTab";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";

export default function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  /* ---------- Starter Codes ---------- */
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
  const [code, setCode] = useState(starterCodes.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- AI Review ---------- */
  const [showAIReview, setShowAIReview] = useState(false);
  const [aiReviewOutput, setAiReviewOutput] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isFullScreenReview, setIsFullScreenReview] = useState(false);

  /* ---------- Fetch Problem ---------- */
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

  /* ---------- Language Change ---------- */
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterCodes[lang]);
  };

  /* ---------- Run ---------- */
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
        setOutput(
          useCustomInput
            ? data.got || ""
            : `✅ Verdict: ${data.verdict} - ${data.message}`
        );
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

  /* ---------- Submit ---------- */
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

  /* ---------- AI Review ---------- */
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
      {/* LEFT PANEL */}
      <div className="bg-white shadow rounded-xl overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-semibold text-lg truncate">
            {problem?.title || "Loading..."}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white sticky top-[56px] z-10">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "description"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("discussions")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "discussions"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Discussions
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {activeTab === "description" && <ProblemDescription />}
          {activeTab === "discussions" && problem && (
            <DiscussionsTab problemId={problem._id} />
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col gap-4">
        {/* Language */}
        <div className="flex items-center justify-between bg-white shadow rounded-lg p-3">
          <label className="font-medium">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>

        <CodeEditor code={code} setCode={setCode} />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCustomInput}
            onChange={(e) => setUseCustomInput(e.target.checked)}
          />
          Use Custom Input
        </label>

        {useCustomInput && (
          <CustomInputBox value={input} onChange={setInput} />
        )}

        <div className="flex gap-3">
          <button onClick={handleRun} className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            ▶ Run
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            🚀 Submit
          </button>
          {showAIReview && (
            <button onClick={handleAIReview} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              🤖 AI Review
            </button>
          )}
        </div>

        <div className="bg-black text-green-400 p-4 rounded-lg h-48 overflow-auto font-mono">
          {loading ? "⏳ Running..." : <pre>{output || "⏳ Output will appear here..."}</pre>}
        </div>

        {showAIReview && (
          <div className="bg-gray-900 p-4 rounded-lg text-purple-300">
            {reviewLoading ? "🤖 Thinking..." : (
              <ReactMarkdown>{aiReviewOutput}</ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}