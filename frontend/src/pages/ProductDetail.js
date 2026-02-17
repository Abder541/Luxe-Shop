import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getProductEmoji, getCategoryColor } from "../utils/productUtils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setAdding(true);
    try {
      await api.post("/cart/add", { product_id: product.id, quantity: 1 });
      setMsg("✅ Ajouté au panier !");
      setMsgType("success");
    } catch {
      setMsg("Erreur lors de l'ajout au panier.");
      setMsgType("error");
    } finally {
      setAdding(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement...</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="page container">
      <div style={{ marginBottom: 24 }}>
        <Link className="btn btn--ghost btn--sm" to="/products">← Retour boutique</Link>
      </div>

      <div className="detail-layout">
        {/* Image */}
        <div>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "contain",
                borderRadius: 24,
                background: "#1a1a2e",
                border: "1px solid var(--border)",
              }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div
            className="detail-img"
            style={{
              background: getCategoryColor(product.category?.name),
              display: product.image ? 'none' : 'flex',
            }}
          >
            <span style={{ fontSize: 100 }}>
              {getProductEmoji(product.category?.name, product.name)}
            </span>
          </div>
        </div>

        {/* Infos */}
        <div>
          <div className="product-category" style={{ fontSize: 13, marginBottom: 10 }}>
            {product.category?.name || "Produit"}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            {product.name}
          </h1>

          <p style={{
            fontSize: 16,
            color: "var(--muted2)",
            lineHeight: 1.8,
            marginBottom: 24,
          }}>
            {product.description}
          </p>

          <div className="detail-price">
            {Number(product.price).toFixed(2)} <span style={{ fontSize: 20, color: "var(--muted2)" }}>CHF</span>
          </div>

          {msg && (
            <div className={`alert alert--${msgType}`} style={{ marginBottom: 16 }}>
              {msg}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="btn btn--primary btn--lg"
              onClick={addToCart}
              disabled={adding}
              style={{ flex: 1, minWidth: 180 }}
            >
              {adding ? "Ajout..." : "🛒 Ajouter au panier"}
            </button>

            <Link
              className="btn btn--ghost btn--lg"
              to="/cart"
              style={{ flex: 1, minWidth: 140, textAlign: "center" }}
            >
              Voir le panier →
            </Link>
          </div>

          <div style={{
            marginTop: 32,
            padding: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
          }}>
            {[
              { icon: "🔒", text: "Paiement 100% sécurisé via Stripe" },
              { icon: "⚡", text: "Livraison rapide sous 24h" },
              { icon: "🔄", text: "Retours acceptés sous 30 jours" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                fontSize: 14,
                color: "var(--muted2)",
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}