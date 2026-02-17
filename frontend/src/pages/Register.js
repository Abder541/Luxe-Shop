import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false); return;
    }
    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/products");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(" — "));
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'inscription.");
      }
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
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <h1 className="form-title">Inscription</h1>
            <p className="form-subtitle">Créez votre compte Luxe Shop gratuitement</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={submit} className="form-fields">
            <div className="input-group">
              <label className="input-label">Nom complet</label>
              <input
                className="input"
                type="text"
                placeholder="Jean Dupont"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
                placeholder="Minimum 8 caractères"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirmer le mot de passe</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? "Création..." : "Créer mon compte →"}
            </button>
          </form>

          <div className="form-divider">ou</div>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted2)" }}>
            Déjà un compte ?{" "}
            <Link to="/login" style={{ color: "var(--gold2)", fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}