import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


const API = import.meta.env.VITE_API_URL;


export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [isValidToken, setIsValidToken] = useState(true);


  // VIEW MODAL STATE
  const [selectedSubmission, setSelectedSubmission] = useState(null);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let userId = null;


  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
      setIsValidToken(false);
    }
  }


  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setLoading(false);
      return;
    }


    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${API}/submissions/${userId}?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        setSubmissions(res.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setIsValidToken(false);
      } finally {
        setLoading(false);
      }
    };


    fetchSubmissions();
  }, [userId, token]);


  const handleCopy = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);


      setCopiedId(id);


      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  if (loading)
    return (
      <p className="text-center text-gray-500 p-6 animate-pulse">
        ⏳ Loading submissions...
      </p>
    );


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        📜 My Submissions
      </h1>


      {!isValidToken ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-md">
          <p className="text-red-500 font-medium mb-4">
            ⚠️ Please login to see submissions.
          </p>


          <Button onClick={() => navigate("/login")}>
            🔑 Login
          </Button>
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500 text-center">
          No submissions yet.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>#</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>


            <TableBody>
              {submissions.map((sub, idx) => (
                <TableRow
                  key={sub._id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{idx + 1}</TableCell>


                  <TableCell>
                    {sub.problemId?.title || "Unknown"}
                  </TableCell>


                  <TableCell>
                    <Badge variant="secondary">
                      {sub.language}
                    </Badge>
                  </TableCell>


                  <TableCell>
                    <Badge
                      variant={
                        sub.verdict === "Accepted"
                          ? "success"
                          : sub.verdict === "Wrong Answer"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {sub.verdict}
                    </Badge>
                  </TableCell>


                  <TableCell>
                    {new Date(sub.createdAt).toLocaleString()}
                  </TableCell>


                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setSelectedSubmission(sub)
                      }
                    >
                      👁 View
                    </Button>


                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(sub.code, sub._id)
                      }
                    >
                      {copiedId === sub._id
                        ? "✅ Copied!"
                        : "📋 Copy"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}


      {/* VIEW CODE MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full mx-4 relative shadow-xl">


            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              ✖
            </button>


            <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-[70vh] overflow-y-auto">
              <code>{selectedSubmission?.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

