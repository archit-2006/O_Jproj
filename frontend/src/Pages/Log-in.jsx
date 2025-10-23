import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react"; // spinner + eye icons

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle state

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Logged in successfully! 🎉");
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid credentials");
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10" // space for icon
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Inline error message */}
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          {/* Submit button with spinner */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <a href="#" className="hover:text-blue-600">
            Forgot password?
          </a>
          <a href="/register" className="hover:text-blue-600">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
