import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; // <--- 1. Import your custom instance
import { Truck, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 2. Use 'api' instead of 'axios'
      // 3. Remove the full URL, just use the endpoint path
      const response = await api.post("/Auth/login", {
        email: formData.email,
        password: formData.password
      });

      // 4. Ensure the key matches what your axios interceptor looks for ("token")
      const token = response.data.token || response.data; 
      
      if (token) {
        localStorage.setItem("token", token); // <--- Key must be "token"
        
        // Optional: Save user role if available
        if(response.data.role) {
            localStorage.setItem("userRole", response.data.role);
        }

        navigate("/dashboard");
      } else {
        setError("Login failed: No token received.");
      }

    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        if (err.response.status === 404) {
          setError("This email address does not exist.");
        } else if (err.response.status === 401) {
          setError("Incorrect EmailId or password. Please try again.");
        } else {
          setError(err.response.data?.message || "Login failed.");
        }
      } else if (err.request) {
        setError("Cannot reach the server. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
            <Truck className="text-blue-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your vendor services</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm flex items-start">
              <span className="font-medium mr-1">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold transition shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}