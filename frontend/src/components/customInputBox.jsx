// src/components/CustomInputBox.jsx
export default function CustomInputBox() {
  return (
    <textarea
      className="border rounded p-3 w-full h-24 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="// Custom input..."
    ></textarea>
  );
}
