// src/components/CodeEditor.jsx
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  

  return (
    <div className="w-full">
      <Editor
        height="70vh"
        theme="vs-dark"               // VS Code dark theme
        defaultLanguage="cpp"         // Highlighting for C++
        value={code}                  // Controlled value
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: true }, // Mini map like VS Code
          automaticLayout: true,      // Responsive resizing
          padding : {top:10},
        }}
      />
    </div>
  );
}
