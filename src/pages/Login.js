// src/pages/Login_v2.js - Glassmorphic Authentication with Web3

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sofieCore from "../core/SofieCore";
import { GlassCard } from "../theme/GlassmorphismTheme";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [community, setCommunity] = useState("Harmonic Valley");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const authService = sofieCore.getService("auth");
    const result = await authService.login(email, password);

    if (result.success) {
      navigate("/wellness-intake");
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const authService = sofieCore.getService("auth");
    const result = await authService.register(email, password, name, community);

    if (result.success) {
      navigate("/wellness-intake");
    } else {
      setError(result.error || "Registration failed");
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const authService = sofieCore.getService("auth");
    const result = await authService.login("demo@harmonichabitats.org", "demo123");
    if (result.success) {
      navigate("/wellness-intake");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">🌱</h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-emerald-700 dark:from-green-100 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
            Sofie Systems
          </h2>
          <p className="text-slate-600 dark:text-slate-400">Operating System for Harmonic Habitats</p>
        </div>

        {/* Auth Card */}
        <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
          {/* Tabs */}
          <div className="flex mb-6 border-b border-white/20 dark:border-slate-700/50">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 pb-3 font-semibold transition ${
                mode === "login"
                  ? "text-green-600 dark:text-green-400 border-b-2 border-green-500"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 pb-3 font-semibold transition ${
                mode === "register"
                  ? "text-green-600 dark:text-green-400 border-b-2 border-green-500"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-400/20 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Community</label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="Harmonic Valley"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mt-4 py-2 rounded-lg font-bold border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all"
          >
            Try Demo Login
          </button>

          {/* Web3 Info */}
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/50">
            <p className="text-xs text-center text-slate-600 dark:text-slate-400 font-semibold">
              🔗 Web3-enabled • Blockchain verified
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
