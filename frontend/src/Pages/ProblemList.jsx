// src/Pages/ProblemList.jsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Decode role from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // assuming backend includes { role } in JWT
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Fetch problems
  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch("http://localhost:5000/api/problems");
        if (!response.ok) throw new Error("Failed to fetch problems");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProblems();
  }, []);

  // Delete problem
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/problems/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete problem");
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting problem");
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problem List</h1>
        
        {/* Show "Create Problem" if admin */}
        {role === "admin" && (
          <button
            onClick={() => navigate("/problems/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create New Problem
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <DifficultyFilter difficulty={difficulty} setDifficulty={setDifficulty} />
      </div>

      <ul className="bg-white shadow rounded-lg divide-y">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <li
              key={problem._id}
              className="p-4 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/problems/${problem._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {problem.title }
                </Link>
                <span
                  className={`ml-3 px-2 py-1 rounded text-sm ${
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              {/* Admin options */}
              {role === "admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/problems/edit/${problem._id}`)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No problems found.</li>
        )}
      </ul>
    </div>
  );
}
