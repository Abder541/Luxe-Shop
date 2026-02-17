import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getProductEmoji, getCategoryColor } from "../utils/productUtils";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products").then(r => setProducts(r.data.slice(0, 6))).catch(() => {});
    api.get("/categories").then(r => setCategories(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="page">

      {/* ─── HERO ─── */}
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow fade-up fade-up-1">
              ✦ Nouvelle collection 2026
            </div>
            <h1 className="hero-title fade-up fade-up-1">
              Découvrez le<br />
              <span>Shopping Premium</span>
            </h1>
            <p className="hero-subtitle fade-up fade-up-2">
              Des produits soigneusement sélectionnés pour vous.
              Qualité garantie, livraison rapide, satisfaction totale.
            </p>
            <div className="hero-actions fade-up fade-up-3">
              <Link className="btn btn--primary btn--lg" to="/products">
                🛍️ Explorer la boutique
              </Link>
              <Link className="btn btn--ghost btn--lg" to="/register">
                Créer un compte
              </Link>
            </div>
            <div className="hero-stats fade-up fade-up-4">
              <div className="stat-item">
                <span className="stat-num">29+</span>
                <span className="stat-label">Produits</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">9</span>
                <span className="stat-label">Catégories</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Sécurisé</span>
              </div>
            </div>
          </div>

          {/* ─── HERO VISUAL ─── */}
          {products.length >= 4 && (
            <div className="hero-visual fade-up fade-up-2">
              <div className="hero-grid">
                <div className="hero-card hero-card--large">
                  <img src={products[0]?.image} alt={products[0]?.name} />
                  <div className="hero-card-label">{products[0]?.name}</div>
                </div>
                <div className="hero-card hero-card--small hero-card--float-1">
                  <img src={products[1]?.image} alt={products[1]?.name} />
                </div>
                <div className="hero-card hero-card--small hero-card--float-2">
                  <img src={products[2]?.image} alt={products[2]?.name} />
                </div>
                <div className="hero-card hero-card--medium hero-card--float-3">
                  <img src={products[3]?.image} alt={products[3]?.name} />
                  <div className="hero-card-label">{products[3]?.name}</div>
                </div>
              </div>
              <div className="hero-glow"></div>
            </div>
          )}
        </div>
      </div>

      {/* ─── CATÉGORIES ─── */}
      {categories.length > 0 && (
        <div className="container" style={{ paddingTop: 0 }}>
          <div className="products-header">
            <h2 className="section-title">Nos <span>Catégories</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 48 }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                style={{
                  background: getCategoryColor(cat.name),
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "20px 16px",
                  textAlign: "center",
                  transition: "all 0.2s",
                  display: "block",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {getProductEmoji(cat.name)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── PRODUITS VEDETTES ─── */}
      {products.length > 0 && (
        <div className="container" style={{ paddingTop: 0 }}>
          <div className="products-header">
            <h2 className="section-title">Produits <span>Vedettes</span></h2>
            <Link className="btn btn--ghost btn--sm" to="/products">Voir tout →</Link>
          </div>

          <div className="products-grid">
            {products.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="product-card">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "contain",
                      borderRadius: 16,
                      background: "#1a1a2e",
                    }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="product-img-placeholder"
                  style={{
                    background: getCategoryColor(p.category?.name),
                    display: p.image ? 'none' : 'flex',
                  }}
                >
                  <span className="product-emoji">
                    {getProductEmoji(p.category?.name, p.name)}
                  </span>
                </div>
                <div className="product-body">
                  <div className="product-category">{p.category?.name || "Produit"}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-footer">
                    <div className="product-price">
                      {Number(p.price).toFixed(2)} <span>CHF</span>
                    </div>
                    <span className="btn btn--primary btn--sm">Voir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link className="btn btn--primary btn--lg" to="/products">
              Voir tous les produits ✦
            </Link>
          </div>
        </div>
      )}

      {/* ─── FEATURES ─── */}
      <div className="container" style={{ paddingTop: 0 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}>
          {[
            { icon: "🔒", title: "Paiement sécurisé", desc: "Powered by Stripe. Vos données sont protégées." },
            { icon: "⚡", title: "Livraison rapide", desc: "Expédition sous 24h ouvrées." },
            { icon: "✅", title: "Qualité garantie", desc: "Tous nos produits sont soigneusement vérifiés." },
            { icon: "🔄", title: "Retours faciles", desc: "30 jours pour changer d'avis." },
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-inner">

          {/* Brand */}
          <div className="footer-col">
            <div className="footer-brand">✦ Luxe Shop</div>
            <p className="footer-desc">
              Votre destination premium pour des produits de qualité.
              Livraison rapide, paiement sécurisé, satisfaction garantie.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">📸</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">🐦</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">👍</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn">💼</a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <div className="footer-heading">Navigation</div>
            <Link to="/" className="footer-link">Accueil</Link>
            <Link to="/products" className="footer-link">Produits</Link>
            <Link to="/cart" className="footer-link">Panier</Link>
            <Link to="/orders" className="footer-link">Commandes</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </div>

          {/* Catégories */}
          <div className="footer-col">
            <div className="footer-heading">Catégories</div>
            <Link to="/products?category=1" className="footer-link">Informatique</Link>
            <Link to="/products?category=2" className="footer-link">Gaming</Link>
            <Link to="/products?category=3" className="footer-link">Audio</Link>
            <Link to="/products?category=4" className="footer-link">Smartphone</Link>
            <Link to="/products?category=7" className="footer-link">Sport</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <div className="footer-heading">Contact</div>
            <div className="footer-contact">
              <span>📍</span>
              <span>Quai du Seujet 10, 1201 Genève, Suisse</span>
            </div>
            <div className="footer-contact">
              <span>📞</span>
              <a href="tel:+41798764897">+41 79 876 48 97</a>
            </div>
            <div className="footer-contact">
              <span>✉️</span>
              <a href="mailto:Contactezmoi@ecommerce.com">Contactezmoi@ecommerce.com</a>
            </div>
            <div className="footer-contact">
              <span>🕐</span>
              <span>Lun - Ven : 9h00 - 18h00</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>© 2026 Luxe Shop — Tous droits réservés</div>
          <div className="footer-bottom-links">
            <Link to="/">Mentions légales</Link>
            <span>·</span>
            <Link to="/">Politique de confidentialité</Link>
            <span>·</span>
            <Link to="/">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}