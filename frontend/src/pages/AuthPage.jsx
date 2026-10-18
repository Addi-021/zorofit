import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api";

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      setToken(data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p>
          {isRegister
            ? "Start tracking your fitness with ZoroFit."
            : "Log in to continue to ZoroFit."}
        </p>

        {isRegister && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <div className="auth-error">{error}</div>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Sign up" : "Log in"}
        </button>

        <div className="auth-switch">
          {isRegister ? (
            <span>
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          ) : (
            <span>
              New here? <Link to="/register">Create an account</Link>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default AuthPage;
