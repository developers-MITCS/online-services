import React, { useState, useEffect } from "react";
import { ENV } from "../config/env";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import logo1 from "../assets/bcdlogo.png";
import logo2 from "../assets/mitcslogo.png";
export function LoginPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${ENV.API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data?.data?.token) {
        setToken(data.data.token);
      }

      if (data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      localStorage.setItem("rememberMe", String(rememberMe));

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide">SYSTEM APP</h1>
            <p className="text-gray-600">Title of System</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <label className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* Footer */}
      <footer className="py-5 text-center text-sm text-gray-500">
        <div className="flex justify-center items-center gap-5">
          <img
            src={logo1}
            alt="City Logo"
            className="h-14 w-14 object-contain"
          />

          <div className="text-center">
            <h3 className="font-semibold text-gray-700">
              City Government of Bacolod
            </h3>

            <p className="text-xs text-gray-500">
              Management Information Technology and Computer Services
            </p>

            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} City Government of Bacolod. All
              Rights Reserved.
            </p>
          </div>

          <img
            src={logo2}
            alt="MITCS Logo"
            className="h-14 w-14 object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
