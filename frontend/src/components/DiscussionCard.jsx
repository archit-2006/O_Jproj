import { Link } from "react-router-dom";

export default function DiscussionCard({ discussion }) {
  return (
    <Link to={`/discussions/${discussion._id}`}>
      <div className="border p-4 rounded mb-3 hover:bg-gray-50">
        <h3 className="font-semibold">{discussion.title}</h3>

        <div className="text-sm text-gray-600 flex gap-3 mt-1">
          <span>⬆ {discussion.upvotes}</span>
          <span>💬 {discussion.commentsCount}</span>
          <span>@{discussion.author.userhandle}</span>
          <span>⭐ {discussion.author.reputation}</span>
        </div>
      </div>
    </Link>
  );
}
