// src/components/CustomInputBox.jsx
export default function CustomInputBox({ value, onChange }) {
  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-lg font-semibold">Custom Input</h2>
      <textarea
        className="border rounded p-3 w-full h-24 font-mono bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="// Enter custom input here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
