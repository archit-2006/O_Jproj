// src/Pages/ProblemList.jsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import { Link } from "react-router-dom";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

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

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Problem List</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar search={search} setSearch={setSearch} />
        <DifficultyFilter difficulty={difficulty} setDifficulty={setDifficulty} />
      </div>

      <ul className="bg-white shadow rounded-lg divide-y">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <li
              key={problem._id}
              className="p-4 hover:bg-gray-50 flex justify-between"
            >
              <Link
                to={`/problems/${problem._id}`}
                className="text-blue-600 hover:underline"
              >
                {problem.title}
              </Link>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {problem.difficulty}
              </span>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No problems found.</li>
        )}
      </ul>
    </div>
  );
}
