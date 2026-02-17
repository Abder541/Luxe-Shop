import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function statusClass(status) {
  if (status === "paid") return "status-paid";
  if (status === "cancelled") return "status-cancelled";
  return "status-pending";
}

function statusLabel(status) {
  if (status === "paid") return "✅ Payé";
  if (status === "cancelled") return "❌ Annulé";
  return "⏳ En attente";
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement...</div>
    </div>
  );

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="page-title">Mes <span style={{ color: "var(--gold2)" }}>Commandes</span></h1>
        <p className="page-subtitle">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty">
          <span className="empty-icon">📦</span>
          <div className="empty-text">Aucune commande pour l'instant</div>
          <div className="empty-sub">Passez votre première commande dès maintenant !</div>
          <Link className="btn btn--primary" to="/products">🛍️ Découvrir la boutique</Link>
        </div>
      ) : (
        <div>
          {orders.map(o => (
            <Link key={o.id} to={`/orders/${o.id}`} className="order-card">
              <div className="order-icon">📦</div>
              <div>
                <div className="order-id">Commande #{o.id}</div>
                <div className="order-meta">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString("fr-CH", {
                    day: "2-digit", month: "long", year: "numeric"
                  }) : "—"}
                </div>
              </div>
              <span className={`status-badge ${statusClass(o.status)}`}>
                {statusLabel(o.status)}
              </span>
              <div className="order-total">
                {Number(o.total).toFixed(2)} CHF
              </div>
              <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}