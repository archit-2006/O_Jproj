import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="w-full">
      <Editor
        height="70vh"
        theme="vs-dark"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },          // Disable minimap for cleaner UI
          automaticLayout: true,
          smoothScrolling: true,                // Smoother scroll feel
          cursorBlinking: "smooth",             // Modern cursor animation
          cursorSmoothCaretAnimation: "on",     
          scrollBeyondLastLine: false,          // Stops empty space at end
          wordWrap: "on",                       // Wrap long lines
          lineNumbers: "on",                    // Keep line numbers visible
          renderLineHighlight: "all",           // Highlights both gutter + line
          padding: { top: 10, bottom: 10 },
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          fontLigatures: true,                  // Enable coding ligatures
          tabSize: 2,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
          },
          folding: true,                        // Allow code folding
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          fixedOverflowWidgets: true,           // Keeps tooltips inside view
        }}
      />
    </div>
  );
}
