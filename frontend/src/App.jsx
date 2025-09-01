import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    </BrowserRouter>
  );
}

export default App;
