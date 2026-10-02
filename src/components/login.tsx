import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import GoogleAuthButton from "./GoogleAuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      console.log("Logged in user:", data.user);
      navigate("/notes");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-gray-900 via-gray-800 to-black relative">
      <div className="glass p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-card px-4 py-2 rounded-lg focus:outline-none text-white placeholder-gray-300"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-card px-4 py-2 rounded-lg focus:outline-none text-white placeholder-gray-300"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="glass-card py-2 rounded-lg font-semibold text-white hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <GoogleAuthButton onError={setError} />

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-300 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
