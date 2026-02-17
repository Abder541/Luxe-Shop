import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const logout = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-dot"></span>
          Luxe Shop
        </Link>

        <nav className="nav-links">
          <Link to="/products" className={isActive("/products") ? "active" : ""}>
            Produits
          </Link>
          {token && (
            <>
              <Link to="/cart" className={isActive("/cart") ? "active" : ""}>
                🛒 Panier
              </Link>
              <Link to="/orders" className={isActive("/orders") ? "active" : ""}>
                Commandes
              </Link>
              <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
                Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {!token ? (
            <>
              <Link className="btn btn--ghost btn--sm" to="/login">Connexion</Link>
              <Link className="btn btn--primary btn--sm" to="/register">S'inscrire</Link>
            </>
          ) : (
            <button className="btn btn--danger btn--sm" onClick={logout}>
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
}