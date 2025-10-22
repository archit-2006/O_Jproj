import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";


import Home from "./Pages/Home";
import Login from "./Pages/Log-in";
import Register from "./Pages/Register";
import ProblemList from "./Pages/ProblemList";
import ProblemPage from "./Pages/Problem";
import Navbar from "./components/Navbar";
import CreateProblem from "./Pages/CreateProblem";
import EditProblem from "./Pages/EditProblem";
import SubmissionsPage from "./Pages/SubmissionPage";
import ProfilePage from "./Pages/Profile"

function App() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setUser(null);
  //       return;
  //     }

  //     try {
  //       const res = await axios.get("/api/auth/verify", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       // ✅ Token valid
  //       setUser(res.data.user);
  //     } catch (err) {
  //       console.error("Token invalid or expired:", err.response?.data || err.message);
  //       localStorage.removeItem("token");
  //       setUser(null);
  //     }
  //   };

  //   verifyToken();
  // }, []);

  return (
    <BrowserRouter>

      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problem" element={<ProblemList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/submission/:userId" element={<SubmissionsPage />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="/problems/create" element={<CreateProblem />} />
          <Route path="/problems/edit/:id" element={<EditProblem />} />
        </Routes>
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
