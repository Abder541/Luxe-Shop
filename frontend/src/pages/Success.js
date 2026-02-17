import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [, setConfirmed] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      api.post("/payment/confirm", { session_id: sessionId })
        .then(() => setConfirmed(true))
        .catch(() => setConfirmed(true));
    } else {
      setConfirmed(true);
    }
  }, [sessionId]);

  return (
    <div className="result-page">
      <div style={{ maxWidth: 480 }}>
        <span className="result-icon">🎉</span>
        <h1 className="result-title" style={{ color: "var(--green)" }}>
          Paiement réussi !
        </h1>
        <p className="result-subtitle">
          Votre commande a bien été enregistrée. Merci pour votre achat sur Luxe Shop !
        </p>

        <div style={{
          background: "var(--green-glow)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          fontSize: 14,
          color: "var(--muted2)",
          lineHeight: 1.8,
        }}>
          ✅ Paiement confirmé<br />
          📦 Commande enregistrée<br />
          ⚡ Livraison sous 24h ouvrées
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--primary btn--lg" to="/orders">
            📦 Voir mes commandes
          </Link>
          <Link className="btn btn--ghost btn--lg" to="/products">
            🛍️ Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}