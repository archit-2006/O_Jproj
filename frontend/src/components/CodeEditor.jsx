// src/components/CodeEditor.jsx
export default function CodeEditor() {
  return (
    <textarea
      className="border rounded p-3 w-full h-64 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="// Write your code here..."
    ></textarea>
  );
}
