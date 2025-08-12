import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProblemDescription() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        setError(null);
        console.log(`id is ${id}`);
        const API_BASE = "http://localhost:5000"; // Change here if your backend URL changes
        const { data } = await axios.get(`${API_BASE}/api/problems/${id}`);

        setProblem(data);
        console.log(`id is ${data}`);
      } catch (err) {
        console.error("Error fetching problem:", err);
        if (err.response) {
          setError(
            err.response.data?.message ||
              `Server responded with status ${err.response.status}`
          );
        } else if (err.request) {
          setError("No response from server. Check if backend is running.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProblem();
    }
  }, [id]);

  if (loading) return <div>Loading problem...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!problem) return <div>No problem found.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Title: {problem.title}</h2>
      <p className="mb-4 whitespace-pre-line">{problem.description}</p>

      <h3 className="font-semibold mb-2">Sample Test Cases</h3>
      {problem.sampleTestCases && problem.sampleTestCases.length > 0 ? (
        problem.sampleTestCases.map((test, idx) => (
          <pre
            key={idx}
            className="bg-gray-100 p-3 rounded mb-2 whitespace-pre-wrap"
          >
            Input: {test.input}
            {"\n"}Output: {test.output}
          </pre>
        ))
      ) : (
        <p>No sample test cases available.</p>
      )}
    </div>
  );
}
