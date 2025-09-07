import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProblemDescription() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PORT=import.meta.env.VITE_API_PORT
  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        setError(null);
        console.log(`id is ${id}`);
        const API_BASE = `http://localhost:${PORT}`; // Change here if your backend URL changes
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
    <Card className="max-w-4xl mx-auto my-6 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-700">
          {problem.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Problem Description */}
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {problem.description}
        </p>

        {/* Sample Test Cases */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-indigo-600">
            Sample Test Cases
          </h3>
          {problem.sampleTestCases && problem.sampleTestCases.length > 0 ? (
            <div className="space-y-3">
              {problem.sampleTestCases.map((test, idx) => (
                <pre
                  key={idx}
                  className="bg-gray-100 p-4 rounded-lg border text-sm text-left overflow-x-auto"
                >
                  <span className="font-semibold">Input:</span> {test.input}
                  {"\n"}
                  <span className="font-semibold">Output:</span> {test.output}
                </pre>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No sample test cases available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
