import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/user"),
      api.get("/orders"),
    ]).then(([userRes, ordersRes]) => {
      setUser(userRes.data);
      setOrders(ordersRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement...</div>
    </div>
  );

  const totalSpent = orders.filter(o => o.status === "paid")
    .reduce((s, o) => s + Number(o.total), 0);

  const paidOrders = orders.filter(o => o.status === "paid").length;
  const pendingOrders = orders.filter(o => o.status !== "paid" && o.status !== "cancelled").length;

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="page-title">
          Bonjour, <span style={{ color: "var(--gold2)" }}>{user?.name || "vous"}</span> ✦
        </h1>
        <p className="page-subtitle">Bienvenue sur votre tableau de bord Luxe Shop</p>
      </div>

      {/* Stats */}
      <div className="dash-grid">
        <div className="stat-card">
          <span className="stat-card-icon">📦</span>
          <div className="stat-card-value">{orders.length}</div>
          <div className="stat-card-label">Commandes totales</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">✅</span>
          <div className="stat-card-value">{paidOrders}</div>
          <div className="stat-card-label">Commandes payées</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">⏳</span>
          <div className="stat-card-value">{pendingOrders}</div>
          <div className="stat-card-label">En attente</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">💰</span>
          <div className="stat-card-value">{totalSpent.toFixed(0)}</div>
          <div className="stat-card-label">CHF dépensés</div>
        </div>
      </div>

      {/* Dernières commandes */}
      <div style={{ marginBottom: 32 }}>
        <div className="products-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>
            Dernières commandes
          </h2>
          <Link className="btn btn--ghost btn--sm" to="/orders">Voir tout →</Link>
        </div>

        {orders.length === 0 ? (
          <div className="empty" style={{ padding: "32px 0" }}>
            <span className="empty-icon">📦</span>
            <div className="empty-text">Aucune commande</div>
            <Link className="btn btn--primary" to="/products" style={{ marginTop: 16 }}>
              Commencer mes achats
            </Link>
          </div>
        ) : (
          orders.slice(0, 5).map(o => (
            <Link key={o.id} to={`/orders/${o.id}`} className="order-card">
              <div className="order-icon">📦</div>
              <div>
                <div className="order-id">Commande #{o.id}</div>
                <div className="order-meta">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString("fr-CH") : "—"}
                </div>
              </div>
              <span className={`status-badge ${
                o.status === "paid" ? "status-paid" :
                o.status === "cancelled" ? "status-cancelled" : "status-pending"
              }`}>
                {o.status === "paid" ? "✅ Payé" :
                 o.status === "cancelled" ? "❌ Annulé" : "⏳ En attente"}
              </span>
              <div className="order-total">{Number(o.total).toFixed(2)} CHF</div>
              <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
            </Link>
          ))
        )}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
          Actions rapides
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn--primary" to="/products">🛍️ Boutique</Link>
          <Link className="btn btn--ghost" to="/cart">🛒 Mon panier</Link>
          <Link className="btn btn--ghost" to="/orders">📦 Mes commandes</Link>
        </div>
      </div>
    </div>
  );
}