import { useEffect, useState } from "react";
import axios from "axios";

export default function CommentList({ discussionId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/comments/${discussionId}`).then((res) => {
      setComments(res.data);
    });
  }, [discussionId]);

  return (
    <div>
      {comments.map((c) => (
        <div key={c._id} className="border-t py-2">
          <p>{c.content}</p>
          <small>
            @{c.author.userhandle} • ⭐ {c.author.reputation}
          </small>
        </div>
      ))}
    </div>
  );
}
