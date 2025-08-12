// src/components/DifficultyFilter.jsx
export default function DifficultyFilter({ difficulty, setDifficulty }) {
  return (
    <select
      value={difficulty}
      onChange={(e) => setDifficulty(e.target.value)}
      className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Difficulties</option>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>
  );
}
