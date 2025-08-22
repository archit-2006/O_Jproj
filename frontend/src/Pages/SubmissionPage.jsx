import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = import.meta.env.VITE_API_URL; // your backend API base URL

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // saved at login
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   setIsLoggedIn(!!token);
  // }, []);
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id; // depends on what you encoded in token
  }
  
  useEffect(() => {
    const fetchSubmissions = async () => {

      try {
        const res = await axios.get(`${API}/submissions/${userId}?limit=10`, { headers: { Authorization: `Bearer ${token}` } });

        setSubmissions(res.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [userId]);

  if (loading) return <p className="text-center p-4">Loading submissions...</p>;

  return (
    
    <div className="p-6 max-w-4xl mx-auto">
    
      <h1 className="text-2xl font-bold mb-4">My Submissions</h1>

      {submissions.length === 0 ?  (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">#</th>
                <th className="border p-2">Problem</th>
                <th className="border p-2">Language</th>
                <th className="border p-2">Verdict</th>
                <th className="border p-2">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{sub.problemId?.title || "Unknown"}</td>
                  <td className="border p-2">{sub.language}</td>
                  <td
                    className={`border p-2 font-semibold ${sub.verdict === "AC"
                        ? "text-green-600"
                        : sub.verdict === "WA"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                  >
                    {sub.verdict}
                  </td>
                  <td className="border p-2">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
