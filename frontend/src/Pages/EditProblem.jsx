import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProblem() {
  const { id } = useParams(); // problem ID from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [judgeTestCases, setJudgeTestCases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch problem data by ID
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/problems/${id}`);
        if (!res.ok) throw new Error("Failed to fetch problem");
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setSampleTestCases(data.sampleTestCases || []);
        setJudgeTestCases(data.judgeTestCases || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("❌ Error loading problem.");
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSampleChange = (index, field, value) => {
    const updated = [...sampleTestCases];
    updated[index][field] = value;
    setSampleTestCases(updated);
  };

  const handleJudgeChange = (index, field, value) => {
    const updated = [...judgeTestCases];
    updated[index][field] = value;
    setJudgeTestCases(updated);
  };

  const addSample = () =>
    setSampleTestCases([...sampleTestCases, { input: "", output: "" }]);
  const addJudge = () =>
    setJudgeTestCases([...judgeTestCases, { input: "", output: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/problems/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          sampleTestCases,
          judgeTestCases,
        }),
      });

      if (!res.ok) throw new Error("Failed to update problem");

      setMessage("✅ Problem updated successfully!");
      setTimeout(() => {
        navigate("/problem");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating problem. Please try again.");
    }
  };

  if (loading) return <p className="p-6">Loading problem...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Problem</h1>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="5"
          required
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Sample Test Cases */}
        <div>
          <h2 className="font-semibold mb-2">Sample Test Cases</h2>
          {sampleTestCases.map((tc, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Input"
                value={tc.input}
                onChange={(e) =>
                  handleSampleChange(i, "input", e.target.value)
                }
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Output"
                value={tc.output}
                onChange={(e) =>
                  handleSampleChange(i, "output", e.target.value)
                }
                className="w-1/2 border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSample}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            + Add Sample
          </button>
        </div>

        {/* Judge Test Cases */}
        <div>
          <h2 className="font-semibold mb-2">Judge Test Cases</h2>
          {judgeTestCases.map((tc, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Input"
                value={tc.input}
                onChange={(e) =>
                  handleJudgeChange(i, "input", e.target.value)
                }
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Output"
                value={tc.output}
                onChange={(e) =>
                  handleJudgeChange(i, "output", e.target.value)
                }
                className="w-1/2 border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addJudge}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            + Add Judge
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Problem
        </button>
      </form>
    </div>
  );
}
