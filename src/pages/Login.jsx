import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";
import "../Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminApi.login({ email, password });

      console.log("LOGIN RESPONSE:", res);

      // ✅ handle ANY backend response shape
      const token =
        res?.token ||
        res?.data?.token ||
        res?.accessToken ||
        res?.data?.accessToken;

      if (!token) {
        throw new Error("No token returned from server");
      }

      // token already saved in adminApi
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
