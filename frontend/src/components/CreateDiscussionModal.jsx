import { useState } from "react";
import axios from "axios";

export default function CreateDiscussionModal({ problemId, onCreate }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    await axios.post(`/api/discussions/${problemId}`, {
      title,
      content,
    });
    setOpen(false);
    setTitle("");
    setContent("");
    onCreate();
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>+ New Discussion</button>

      {open && (
        <div className="modal">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Explain your doubt..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={submit}>Post</button>
        </div>
      )}
    </>
  );
}
