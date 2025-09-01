// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token"); // assuming you store JWT in localStorage
//         const res = await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error(err.response?.data || err.message);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!user) {
//     return <p className="text-center mt-10">Loading profile...</p>;
//   }

//   // ✅ Calculate success rate (avoid divide by 0)
//   const successRate =
//     user.stats.totalSubmissions > 0
//       ? ((user.stats.successfulSubmissions / user.stats.totalSubmissions) * 100).toFixed(2)
//       : 0;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
//         {/* Avatar + Basic Info */}
//         <div className="flex items-center space-x-6 mb-6">
//           <img
//             src={user.avatar || "https://via.placeholder.com/100"}
//             alt="avatar"
//             className="w-24 h-24 rounded-full border"
//           />
//           <div>
//             <h2 className="text-2xl font-bold">{user.userhandle}</h2>
//             <p className="text-gray-600">{user.firstname} {user.lastname}</p>
//             <p className="text-gray-500">{user.email}</p>
//             <p className="mt-2 text-sm italic">{user.bio || "No bio yet..."}</p>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-2 gap-4 text-center">
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Easy Solved</h3>
//             <p className="text-xl">{user.stats.easySolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Medium Solved</h3>
//             <p className="text-xl">{user.stats.mediumSolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Hard Solved</h3>
//             <p className="text-xl">{user.stats.hardSolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Total Submissions</h3>
//             <p className="text-xl">{user.stats.totalSubmissions}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Successful Submissions</h3>
//             <p className="text-xl">{user.stats.successfulSubmissions}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Success Rate</h3>
//             <p className="text-xl">{successRate}%</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Current Streak</h3>
//             <p className="text-xl">{user.stats.currentStreak} days</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Longest Streak</h3>
//             <p className="text-xl">{user.stats.longestStreak} days</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error(err.response?.data || err.message);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("Please select a file");

//     const formData = new FormData();
//     formData.append("avatar", selectedFile);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUser(res.data.user);
//       setSelectedFile(null);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
//         {/* Avatar + Upload */}
//         <div className="flex flex-col items-center space-y-4">
//           <img
//             src={user.avatar || "https://via.placeholder.com/100"}
//             alt="avatar"
//             className="w-24 h-24 rounded-full border"
//           />
//           <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
//           <button
//             onClick={handleUpload}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Upload Avatar
//           </button>
//         </div>

//         {/* Profile Info */}
//         <div className="mt-6 text-center">
//           <h2 className="text-2xl font-bold">{user.userhandle}</h2>
//           <p className="text-gray-600">{user.firstname} {user.lastname}</p>
//           <p className="text-gray-500">{user.email}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [avatarFile, setAvatarFile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error(err.response?.data || err.message);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ✅ Avatar Upload Handler
//   const handleAvatarUpload = async (e) => {
//     e.preventDefault();
//     if (!avatarFile) return alert("Please select an image");

//     const formData = new FormData();
//     formData.append("avatar", avatarFile);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put("http://localhost:5000/api/profile/avatar", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setUser(res.data); // update state with new avatar
//       setAvatarFile(null);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };

//   if (!user) {
//     return <p className="text-center mt-10">Loading profile...</p>;
//   }

//   const successRate =
//     user.stats.totalSubmissions > 0
//       ? ((user.stats.successfulSubmissions / user.stats.totalSubmissions) * 100).toFixed(2)
//       : 0;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
//         {/* Avatar + Basic Info */}
//         <div className="flex items-center space-x-6 mb-6">
//           <img
//             src={user.avatar || "https://via.placeholder.com/100"}
//             alt="avatar"
//             className="w-24 h-24 rounded-full border"
//           />
//           <div>
//             <h2 className="text-2xl font-bold">{user.userhandle}</h2>
//             <p className="text-gray-600">{user.firstname} {user.lastname}</p>
//             <p className="text-gray-500">{user.email}</p>
//             <p className="mt-2 text-sm italic">{user.bio || "No bio yet..."}</p>
//           </div>
//         </div>

//         {/* ✅ Avatar Upload Form */}
//         <form onSubmit={handleAvatarUpload} className="mb-6">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setAvatarFile(e.target.files[0])}
//             className="mb-2"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Upload Avatar
//           </button>
//         </form>

//         {/* Stats Section */}
//         <div className="grid grid-cols-2 gap-4 text-center">
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Easy Solved</h3>
//             <p className="text-xl">{user.stats.easySolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Medium Solved</h3>
//             <p className="text-xl">{user.stats.mediumSolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Hard Solved</h3>
//             <p className="text-xl">{user.stats.hardSolved.length}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Total Submissions</h3>
//             <p className="text-xl">{user.stats.totalSubmissions}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Successful Submissions</h3>
//             <p className="text-xl">{user.stats.successfulSubmissions}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Success Rate</h3>
//             <p className="text-xl">{successRate}%</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Current Streak</h3>
//             <p className="text-xl">{user.stats.currentStreak} days</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h3 className="font-semibold">Longest Streak</h3>
//             <p className="text-xl">{user.stats.longestStreak} days</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
// import defaultAvatar from "../assets/avatar.png";
import { Pencil } from "lucide-react"; // install lucide-react if not already


export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        console.log(res.data)
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
      const res = await axios.put("http://localhost:5000/api/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data); // backend sends updated user (with avatar url)
      console.log(user.avatar);
      setAvatarFile(null);
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
        <div className="flex items-center space-x-8 mb-10">
          <div className="relative w-32 h-32">
            <img
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : "http://localhost:5000/assets/avatar/default.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatarFile(e.target.files[0])} // ✅ only store file
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition"
            >
              <Pencil size={16} />
            </label>
          </div>

          {/* ✅ Show file name if selected */}
          {avatarFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{avatarFile.name}</span>
            </p>
          )}

          {/* ✅ Upload button */}
          {avatarFile && (
            <button
              onClick={handleAvatarUpload}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Upload Avatar
            </button>
          )}


          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">{user.userhandle}</h2>
            <p className="text-lg text-gray-600">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-gray-500">{user.email}</p>
            <p className="mt-3 text-sm italic text-gray-600">
              {user.bio || "No bio yet..."}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 User Statistics</h3>
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