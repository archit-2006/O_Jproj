import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import DifficultyFilter from "../components/DifficultyFilter"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default function ProblemList() {
  const [problems, setProblems] = useState([])
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [tagSearch, setTagSearch] = useState("")
  const [role, setRole] = useState("")
  const [allTags, setAllTags] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const BACKEND_URL = import.meta.env.VITE_API_URL

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setRole(decoded.role)
      } catch (err) {
        console.error("Invalid token", err)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch(`${BACKEND_URL}/problems`)
        if (!response.ok) throw new Error("Failed to fetch problems")
        const data = await response.json()
        setProblems(data)

        const tags = [...new Set(data.flatMap((p) => p.tags || []))]
        setAllTags(tags)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProblems()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/problems/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete problem")
      setProblems((prev) => prev.filter((p) => p._id !== id))
    } catch (error) {
      console.error(error)
      alert("Error deleting problem")
    }
  }

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true
    const matchesTag = tagSearch
      ? p.tags?.some((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
      : true
    return matchesSearch && matchesDifficulty && matchesTag
  })

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  )

  // Map difficulty -> color styles
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Problem List</h1>
        {role === "admin" && (
          <Button onClick={() => navigate("/problems/create")}>
            + Create New Problem
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
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
                setTagSearch(e.target.value)
                setShowSuggestions(true)
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="border rounded-md px-3 py-2 w-full"
            />
            {showSuggestions && tagSearch && (
              <ul className="absolute z-10 bg-white border rounded-md shadow mt-1 w-full max-h-40 overflow-y-auto">
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setTagSearch(tag)
                        setShowSuggestions(false)
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
        </CardContent>
      </Card>

      {/* Problem Cards */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card
              key={problem._id}
              onClick={() => navigate(`/problems/${problem._id}`)}
              className="cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-indigo-600">
                  {problem.title}
                </CardTitle>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {problem.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500 flex flex-col items-center">
          <AlertCircle className="w-8 h-8 mb-3 text-gray-400" />
          <p className="text-lg font-medium">No problems found.</p>
        </Card>
      )}
    </div>
  )
}
