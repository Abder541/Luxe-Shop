import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="result-page">
      <div style={{ maxWidth: 480 }}>
        <span className="result-icon">😕</span>
        <h1 className="result-title" style={{ color: "var(--muted2)" }}>
          Paiement annulé
        </h1>
        <p className="result-subtitle">
          Votre paiement a été annulé. Vos articles sont toujours dans votre panier.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--primary btn--lg" to="/cart">
            🛒 Retour au panier
          </Link>
          <Link className="btn btn--ghost btn--lg" to="/products">
            🛍️ Boutique
          </Link>
        </div>
      </div>
    </div>
  );
}