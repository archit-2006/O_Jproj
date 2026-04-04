import { useEffect, useState } from "react";
import axios from "axios";
import DiscussionComments from "./DiscussionComments";

export default function DiscussionsTab({ problemId }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  // sorting
  const [sortBy, setSortBy] = useState("new"); // new | top

  // new discussion form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/discussions/${problemId}?sort=${sortBy}`
      );

      setDiscussions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [problemId, sortBy]);

  const handlePostDiscussion = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setPosting(true);
      await axios.post(
        `${BACKEND_URL}/discussions/${problemId}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setContent("");
      fetchDiscussions();
    } catch (err) {
      console.error("Failed to post discussion", err);
    } finally {
      setPosting(false);
    }
  };

  const handleUpvoteDiscussion = async (discussionId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/discussions/upvote/${discussionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDiscussions((prev) =>
      prev.map((d) =>
        d._id === discussionId
          ? {
              ...d,
              upvotes: res.data.upvotes,
              upvotedBy: res.data.upvotedBy,
            }
          : d
      )
    );
  } catch (err) {
    console.error("Discussion upvote failed", err);
  }
};

  return (
    <div className="space-y-6">
      {/* CREATE DISCUSSION */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Start a Discussion</h3>

        <input
          type="text"
          placeholder="Title"
          className="w-full border rounded px-3 py-2 mb-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe your doubt..."
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handlePostDiscussion}
          disabled={posting}
          className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* SORT BAR */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <button
          onClick={() => setSortBy("new")}
          className={`px-2 py-1 rounded ${
            sortBy === "new"
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-500 hover:text-indigo-600"
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => setSortBy("top")}
          className={`px-2 py-1 rounded ${
            sortBy === "top"
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-500 hover:text-indigo-600"
          }`}
        >
          Top
        </button>
      </div>

      {/* DISCUSSION LIST */}
      {loading ? (
        <p className="text-gray-500">Loading discussions...</p>
      ) : discussions.length === 0 ? (
        <p className="text-gray-500">
          No discussions yet. Be the first to ask 🚀
        </p>
      ) : (
        <div className="space-y-4">
          {discussions.map((d) => {
            const hasUpvoted = d.upvotedBy?.includes(userId);

            return (
              <div
                key={d._id}
                className="border rounded-md p-4 bg-white"
              >
                <h4 className="font-medium">{d.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {d.content}
                </p>

                <div className="flex gap-4 text-xs mt-2 items-center">
                  <button
                    onClick={() => handleUpvoteDiscussion(d._id)}
                    className={`flex items-center gap-1 transition
                      ${
                        hasUpvoted
                          ? "text-indigo-600 font-bold bg-blue-100 rounded px-1"
                          : "text-gray-500 hover:text-indigo-600"
                      }`}
                  >
                    👍 {d.upvotes || 0}
                  </button>

                  <span className="text-gray-500">
                    💬 {d.commentsCount || 0}
                  </span>
                </div>

                {/* COMMENTS */}
                <DiscussionComments discussionId={d._id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}