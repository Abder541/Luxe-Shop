import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "calc(100vh - 68px)", padding: "40px 24px"
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div className="form-card">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✦</div>
            <h1 className="form-title">Connexion</h1>
            <p className="form-subtitle">Content de vous revoir sur Luxe Shop</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={submit} className="form-fields">
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Mot de passe</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </form>

          <div className="form-divider">ou</div>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted2)" }}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={{ color: "var(--gold2)", fontWeight: 600 }}>
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}