// src/components/SearchBar.jsx
export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search problems..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
