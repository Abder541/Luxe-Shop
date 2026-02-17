import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { getProductEmoji, getCategoryColor } from "../utils/productUtils";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data)).catch(() => {});
    api.get("/products")
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "all" || String(p.category_id) === String(activeCategory);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const setCategory = useCallback((id) => {
    if (id === "all") setSearchParams({});
    else setSearchParams({ category: id });
  }, [setSearchParams]);

  if (loading) return (
    <div className="container page">
      <div className="loading"><div className="spinner"></div>Chargement des produits...</div>
    </div>
  );

  return (
    <div className="page container">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title">Notre <span style={{ color: "var(--gold2)" }}>Boutique</span></h1>
        <p className="page-subtitle">{products.length} produits disponibles</p>
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="input"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Filtres catégories */}
      <div className="filters" style={{ marginBottom: 28 }}>
        <button
          className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setCategory("all")}
        >
          ✦ Tout voir
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`filter-btn ${String(activeCategory) === String(c.id) ? "active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {getProductEmoji(c.name)} {c.name}
          </button>
        ))}
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="empty">
          <span className="empty-icon">🔍</span>
          <div className="empty-text">Aucun produit trouvé</div>
          <div className="empty-sub">Essayez une autre recherche ou catégorie</div>
          <button className="btn btn--ghost" onClick={() => { setSearch(""); setCategory("all"); }}>
            Réinitialiser
          </button>
        </div>
      ) : (
        <>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </div>
          <div className="products-grid">
            {filtered.map(p => (
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
                  <div className="product-category">
                    {p.category?.name || "Produit"}
                  </div>
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
        </>
      )}
    </div>
  );
}