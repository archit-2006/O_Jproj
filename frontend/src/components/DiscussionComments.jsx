import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function DiscussionComments({ discussionId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [sortBy, setSortBy] = useState("top"); // top | newest | oldest

  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/comments/${discussionId}`
      );
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const handleAddComment = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);
      await axios.post(
        `${BACKEND_URL}/comments/${discussionId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      setIsOpen(true);
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setPosting(false);
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/comments/upvote/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== commentId) return c;

          const hasUpvoted = c.upvotedBy?.includes(userId);

          return {
            ...c,
            upvotes: res.data.upvotes,
            upvotedBy: hasUpvoted
              ? c.upvotedBy.filter((id) => id !== userId)
              : [...(c.upvotedBy || []), userId],
          };
        })
      );
    } catch (err) {
      console.error("Comment upvote failed", err);
    }
  };

  /* 🔥 SORTED COMMENTS */
  const sortedComments = useMemo(() => {
    const copy = [...comments];

    if (sortBy === "top") {
      return copy.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    if (sortBy === "newest") {
      return copy.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return copy.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [comments, sortBy]);

  return (
    <div className="mt-3">
      {/* TOGGLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-indigo-600 hover:underline mb-2"
      >
        {isOpen
          ? "Hide comments"
          : `Show comments (${comments.length})`}
      </button>

      {!isOpen ? null : (
        <div className="border-t pt-3">
          {/* SORT + ADD */}
          <div className="flex justify-between items-center mb-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="top">Top</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* ADD COMMENT */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border rounded px-3 py-1.5 text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              disabled={posting}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Post
            </button>
          </div>

          {/* COMMENTS */}
          {loading ? (
            <p className="text-xs text-gray-500">Loading comments...</p>
          ) : sortedComments.length === 0 ? (
            <p className="text-xs text-gray-500">No comments yet</p>
          ) : (
            <div className="space-y-2">
              {sortedComments.map((c) => {
                const hasUpvoted = c.upvotedBy?.includes(userId);

                return (
                  <div
                    key={c._id}
                    className="text-sm bg-gray-50 border rounded p-2"
                  >
                    <p className="text-gray-700">{c.content}</p>

                    <button
                      onClick={() => handleUpvote(c._id)}
                      className={`mt-1 text-xs flex items-center gap-1 transition
                        ${
                          hasUpvoted
                            ? "text-indigo-600 font-bold bg-blue-100 rounded px-1"
                            : "text-gray-500 hover:text-indigo-600"
                        }`}
                    >
                      👍 {c.upvotes || 0}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}