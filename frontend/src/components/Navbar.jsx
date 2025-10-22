import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [userAvatarUrl, setUserAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return; // no need to fetch if not logged in
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.userhandle || "");
        setUserAvatarUrl(
          res.data.avatar
            ? res.data.avatar
            : `http://localhost:${PORT}/assets/avatar/default.png`
        );
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]); // ✅ refetch when token changes (login/logout)

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    setUserAvatarUrl("");
    navigate("/login");
  };

  return (
    <nav className="sticky z-50 max-w-8xl mx-auto rounded-2xl bg-indigo-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition"
          >
            codingfarm
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Home
            </Link>
            <Link
              to="/problem"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Problems
            </Link>
            <Link
              to="/submission/:userId"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Submissions
            </Link>
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex space-x-3">
            {!token ? (
              <>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full px-5">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Avatar className="w-10 h-10">
                      {!loading ? (
                        <AvatarImage
                          src={userAvatarUrl}
                          alt={username || "User"}
                        />
                      ) : null}
                      <AvatarFallback>
                        {username ? username.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl shadow-md"
                >
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-md"
              >
                <DropdownMenuItem asChild>
                  <Link to="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/problem">Problems</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/submission/:userId">Submissions</Link>
                </DropdownMenuItem>
                {!token ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
