import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentList from "../components/CommentList";
import AddComment from "../components/AddComment";

export default function DiscussionPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);

  useEffect(() => {
    axios.get(`/api/discussions/single/${id}`).then((res) => {
      setDiscussion(res.data);
    });
  }, [id]);

  if (!discussion) return null;

  return (
    <div>
      <h1>{discussion.title}</h1>
      <p>{discussion.content}</p>

      <div className="text-sm text-gray-600 mt-2">
        @{discussion.author.userhandle} • ⭐ {discussion.author.reputation}
      </div>

      <CommentList discussionId={id} />
      <AddComment discussionId={id} />
    </div>
  );
}
