import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getProductEmoji, getCategoryColor } from "../utils/productUtils";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement...</div>
    </div>
  );

  if (!order) return null;

  const items = order.items || order.order_items || [];

  return (
    <div className="page container">
      <div style={{ marginBottom: 24 }}>
        <Link className="btn btn--ghost btn--sm" to="/orders">← Mes commandes</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

        {/* Articles */}
        <div>
          <div className="page-header">
            <h1 className="page-title">Commande <span style={{ color: "var(--gold2)" }}>#{order.id}</span></h1>
            <p className="page-subtitle">
              {order.created_at ? new Date(order.created_at).toLocaleDateString("fr-CH", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
              }) : "—"}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="alert alert--info">Aucun article dans cette commande.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item, i) => {
                const product = item.product || {};
                return (
                  <div key={i} className="cart-item">
                    <div
                      className="cart-item-img"
                      style={{ background: getCategoryColor(product.category?.name) }}
                    >
                      {getProductEmoji(product.category?.name, product.name)}
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{product.name || item.product_name || "Produit"}</div>
                      <div className="cart-item-price">
                        {Number(item.price || product.price).toFixed(2)} CHF × {item.quantity}
                      </div>
                    </div>
                    <span className="cart-item-total">
                      {(Number(item.price || product.price) * item.quantity).toFixed(2)} CHF
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Résumé */}
        <div className="cart-summary">
          <div className="summary-title">Récapitulatif</div>

          <div className="summary-row">
            <span>Statut</span>
            <span className={`status-badge ${
              order.status === "paid" ? "status-paid" :
              order.status === "cancelled" ? "status-cancelled" : "status-pending"
            }`}>
              {order.status === "paid" ? "✅ Payé" :
               order.status === "cancelled" ? "❌ Annulé" : "⏳ En attente"}
            </span>
          </div>

          <div className="summary-row">
            <span>Articles</span>
            <span>{items.length}</span>
          </div>

          <div className="summary-row">
            <span>Livraison</span>
            <span style={{ color: "var(--green)" }}>Gratuite</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>{Number(order.total).toFixed(2)} CHF</span>
          </div>

          <Link
            className="btn btn--primary btn--full"
            to="/products"
            style={{ marginTop: 20, textAlign: "center" }}
          >
            🛍️ Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}