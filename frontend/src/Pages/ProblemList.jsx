import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tagSearch, setTagSearch] = useState(""); 
  const [role, setRole] = useState("");
  const [allTags, setAllTags] = useState([]);   // NEW
  const [showSuggestions, setShowSuggestions] = useState(false); // NEW

  const navigate = useNavigate();

  // Decode role from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
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

        // Extract unique tags
        const tags = [...new Set(data.flatMap((p) => p.tags || []))];
        setAllTags(tags);
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
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete problem");
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting problem");
    }
  };

  // Filtering logic
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true;
    const matchesTag = tagSearch
      ? p.tags?.some((tag) =>
          tag.toLowerCase().includes(tagSearch.toLowerCase())
        )
      : true;

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  // Filtered tag suggestions
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problem List</h1>

        {role === "admin" && (
          <button
            onClick={() => navigate("/problems/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create New Problem
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
  <div className="flex-1">
    <SearchBar search={search} setSearch={setSearch} />
  </div>

  <div className="w-48">
    <DifficultyFilter difficulty={difficulty} setDifficulty={setDifficulty} />
  </div>

  <div className="flex-1 relative">
    <input
      type="text"
      placeholder="Search by tag..."
      value={tagSearch}
      onChange={(e) => {
        setTagSearch(e.target.value);
        setShowSuggestions(true);
      }}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      className="border rounded px-3 py-2 w-full"
    />
    {showSuggestions && tagSearch && (
      <ul className="absolute z-10 bg-white border rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setTagSearch(tag);
                setShowSuggestions(false);
              }}
            >
              {tag}
            </li>
          ))
        ) : (
          <li className="px-3 py-2 text-gray-500">No matches</li>
        )}
      </ul>
    )}
  </div>
</div>

      {/* Problem Cards */}
      <ul className="grid gap-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <li
              key={problem._id}
              className="p-4 bg-white shadow rounded-lg hover:shadow-md cursor-pointer transition border"
              onClick={() => navigate(`/problems/${problem._id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600">
                    {problem.title}
                  </h2>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {problem.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {role === "admin" && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
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
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No problems found.</li>
        )}
      </ul>
    </div>
  );
}
