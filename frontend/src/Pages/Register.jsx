import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Register() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    userhandle: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [strength, setStrength] = useState(0);
  const [error, setError] = useState(""); // <-- inline error for email/userhandle
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // clear error when typing
    if (name === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setStrength(score);
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 25) return "Very Weak";
    if (strength <= 50) return "Weak";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strength < 50) {
      toast.error("Please enter a stronger password ⚠️");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ⚠️");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, formData);
      toast.success("User registered successfully! 🎉");
      navigate("/login");
    } catch (err) {
      // Check for backend validation errors
      console.log(err);
      const message =
        err.response?.data ||
        err.response?.data?.error ||
        err.message;

      // Display inline if email or userhandle exists
      if (
        message.toLowerCase().includes("email") ||
        message.toLowerCase().includes("handle")
      ) {
        setError(message);
      } else {
        if(error){

        }
        toast.error(message || "Registration failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="userhandle"
            placeholder="User Handle"
            value={formData.userhandle}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password with strength meter */}
          <div className="space-y-1">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && (
              <div className="mt-1">
                <Progress value={strength} className="h-2" />
                <p
                  className={`text-sm mt-1 font-medium ${
                    strength <= 25
                      ? "text-red-500"
                      : strength <= 50
                      ? "text-orange-500"
                      : strength <= 75
                      ? "text-blue-500"
                      : "text-green-600"
                  }`}
                >
                  {getStrengthLabel()}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Inline error for existing email/userhandle */}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
