import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // <-- for inline error
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Logged in successfully! 🎉");

        navigate("/"); // redirect to home
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      // Show inline error
      setError("Invalid credentials");
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

          {/* Password */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Inline error message */}
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {/* Links */}
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <a href="#" className="hover:text-blue-600">Forgot password?</a>
          <a href="/register" className="hover:text-blue-600">Sign up</a>
        </div>
      </div>
    </div>
  );
}
