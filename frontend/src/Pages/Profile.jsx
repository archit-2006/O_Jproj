import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Save, X } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const PORT = import.meta.env.VITE_API_PORT;
  const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setBio(res.data.bio || "");
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${BACKEND_URL}/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setAvatarFile(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleBioUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BACKEND_URL}/bio`,
        { bio },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 👇 correctly update only user object
      setUser(res.data.user);
      setBio(res.data.user.bio);
      setEditingBio(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };


  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const stats = user.stats || {
    easySolved: [],
    mediumSolved: [],
    hardSolved: [],
    totalSubmissions: 0,
    successfulSubmissions: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  const successRate =
    stats.totalSubmissions > 0
      ? ((stats.successfulSubmissions / stats.totalSubmissions) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 mb-10">
          <div className="relative w-32 h-32">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
              alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition"
            >
              <Pencil size={16} />
            </label>
          </div>

          <div className="mt-6 sm:mt-0">
            <h2 className="text-3xl font-extrabold text-gray-800">
              {user.userhandle}
            </h2>
            <p className="text-lg text-gray-600">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-gray-500">{user.email}</p>

            {/* Bio Section */}
            <div className="mt-4 flex items-start space-x-2">
              {!editingBio ? (
                <>
                  <p className="text-sm italic text-pink-600 max-w-md">
                    {user.bio || "No bio yet..."}
                  </p>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBioUpdate}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center space-x-1 hover:bg-green-700"
                    >
                      <Save size={14} /> <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingBio(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg flex items-center space-x-1 hover:bg-gray-400"
                    >
                      <X size={14} /> <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload button under avatar */}
        {avatarFile && (
          <div className="mb-6 flex items-center space-x-3">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{avatarFile.name}</span>
            </p>
            <button
              onClick={handleAvatarUpload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Upload Avatar
            </button>
          </div>
        )}

        {/* Stats Section */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          📊 User Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
          {[
            { label: "Easy Solved", value: stats.easySolved.length },
            { label: "Medium Solved", value: stats.mediumSolved.length },
            { label: "Hard Solved", value: stats.hardSolved.length },
            { label: "Total Submissions", value: stats.totalSubmissions },
            { label: "Successful Submissions", value: stats.successfulSubmissions },
            { label: "Success Rate", value: `${successRate}%` },
            { label: "Current Streak", value: `${stats.currentStreak} days` },
            { label: "Longest Streak", value: `${stats.longestStreak} days` },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-blue-50 p-5 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <h4 className="font-semibold text-gray-700">{stat.label}</h4>
              <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
