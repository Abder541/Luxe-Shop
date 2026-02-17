import api from "../services/api";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProductEmoji, getCategoryColor } from "../utils/productUtils";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);


  const load = async () => {
    setError("");
    try {
      const res = await api.get("/cart");
      setItems(res.data);
    } catch {
      setError("Tu dois être connecté pour voir ton panier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() =>
    items.reduce((sum, i) => sum + Number(i.product.price) * Number(i.quantity), 0),
    [items]
  );

  const remove = async (id) => {
    await api.delete(`/cart/${id}`);
    load();
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const res = await api.post("/checkout");
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Erreur checkout. Vérifie que tu es connecté et que le panier n'est pas vide.");
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement du panier...</div>
    </div>
  );

  return (
    <div className="page container">
      <div className="page-header">
        <h1 className="page-title">Mon <span style={{ color: "var(--gold2)" }}>Panier</span></h1>
        <p className="page-subtitle">
          {items.length > 0 ? `${items.length} article${items.length > 1 ? "s" : ""}` : "Panier vide"}
        </p>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {!error && items.length === 0 && (
        <div className="empty">
          <span className="empty-icon">🛒</span>
          <div className="empty-text">Votre panier est vide</div>
          <div className="empty-sub">Ajoutez des produits pour commencer vos achats</div>
          <Link className="btn btn--primary" to="/products">🛍️ Découvrir la boutique</Link>
        </div>
      )}

      {!error && items.length > 0 && (
        <div className="cart-layout">
          {/* Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map(i => (
              <div key={i.id} className="cart-item">
                {i.product.image ? (
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="cart-item-img"
                    style={{ objectFit: "contain", borderRadius: 12, background: "#1a1a2e" }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="cart-item-img"
                  style={{
                    background: getCategoryColor(i.product.category?.name),
                    display: i.product.image ? 'none' : 'flex',
                  }}
                >
                  <span style={{ fontSize: 28 }}>
                    {getProductEmoji(i.product.category?.name, i.product.name)}
                  </span>
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-name">{i.product.name}</div>
                  <div className="cart-item-cat">{i.product.category?.name || "Produit"}</div>
                  <div className="cart-item-price">
                    {Number(i.product.price).toFixed(2)} CHF × {i.quantity}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="cart-item-total">
                    {(Number(i.product.price) * i.quantity).toFixed(2)} CHF
                  </span>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => remove(i.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 12 }}>
              <Link className="btn btn--ghost btn--sm" to="/products">
                ← Continuer mes achats
              </Link>
            </div>
          </div>

          {/* Résumé */}
          <div className="cart-summary">
            <div className="summary-title">Résumé</div>

            {items.map(i => (
              <div key={i.id} className="summary-row">
                <span>{i.product.name} ×{i.quantity}</span>
                <span>{(Number(i.product.price) * i.quantity).toFixed(2)} CHF</span>
              </div>
            ))}

            <div className="summary-row" style={{ marginTop: 8 }}>
              <span>Livraison</span>
              <span style={{ color: "var(--green)" }}>Gratuite</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{total.toFixed(2)} CHF</span>
            </div>

            <button
              className="btn btn--primary btn--full btn--lg"
              style={{ marginTop: 20 }}
              onClick={checkout}
              disabled={checkingOut}
            >
              {checkingOut ? "Redirection..." : "💳 Payer avec Stripe"}
            </button>

            <div style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 12,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}>
              🔒 Paiement sécurisé par Stripe
            </div>
          </div>
        </div>
      )}
    </div>
  );
}