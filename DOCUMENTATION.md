# 🛍️ Luxe Shop — Documentation technique complète

> **E-commerce fullstack** : Laravel 12 (API) + React 19 (SPA) + Stripe Checkout
> Projet réalisé en février 2026

---

## 📑 Table des matières2

1. [Présentation du projet](#-présentation-du-projet)
2. [Stack technique](#-stack-technique)
3. [Architecture du projet](#-architecture-du-projet)
4. [Prérequis](#-prérequis)
5. [Installation Backend (Laravel)](#-installation-backend-laravel)
6. [Installation Frontend (React)](#-installation-frontend-react)
7. [Configuration de la base de données](#-configuration-de-la-base-de-données)
8. [Migrations — Structure des tables](#-migrations--structure-des-tables)
9. [Modèles Eloquent et relations](#-modèles-eloquent-et-relations)
10. [Seeder — Données de démonstration](#-seeder--données-de-démonstration)
11. [Authentification avec Sanctum](#-authentification-avec-sanctum)
12. [Routes API](#-routes-api)
13. [Controllers Backend](#-controllers-backend)
14. [Intégration Stripe Checkout](#-intégration-stripe-checkout)
15. [Frontend React — Structure](#-frontend-react--structure)
16. [Service API (Axios)](#-service-api-axios)
17. [Routage React](#-routage-react)
18. [Pages Frontend](#-pages-frontend)
19. [Composants réutilisables](#-composants-réutilisables)
20. [Gestion des images produits](#-gestion-des-images-produits)
21. [Styles et thème](#-styles-et-thème)
22. [Lancer le projet](#-lancer-le-projet)
23. [Résumé des fonctionnalités](#-résumé-des-fonctionnalités)

---

## 🎯 Présentation du projet

**Luxe Shop** est une boutique en ligne complète avec :
- Catalogue de **30 produits** répartis en **9 catégories**
- Système d'**inscription / connexion** sécurisé par token
- **Panier** persistant (côté serveur)
- **Paiement en ligne** via Stripe Checkout
- **Historique des commandes** avec statut de paiement
- **Dashboard** utilisateur
- Interface **responsive** avec thème sombre luxueux

---

## 🧰 Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| **Backend** | Laravel (PHP) | 12.x |
| **Authentification** | Laravel Sanctum | 4.3 |
| **Base de données** | MySQL (via XAMPP) | 8.x |
| **Paiement** | Stripe PHP SDK | 19.3 |
| **Frontend** | React | 19.x |
| **Routing SPA** | React Router DOM | 7.x |
| **HTTP Client** | Axios | 1.x |
| **Serveur local** | XAMPP (Apache + MySQL) | — |

---

## 🏗️ Architecture du projet

```
Laravel 3/
├── backend/          ← API Laravel (port 8000)
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── CartController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── OrderController.php
│   │   │   └── ProductController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Category.php
│   │   │   ├── CartItem.php
│   │   │   ├── Order.php
│   │   │   └── OrderItem.php
│   │   └── Providers/
│   ├── config/
│   │   └── sanctum.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── ShopSeeder.php
│   └── routes/
│       └── api.php
│
└── frontend/         ← SPA React (port 3000)
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   └── PrivateRoute.js
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js / Register.js
        │   ├── Products.js / ProductDetail.js
        │   ├── Cart.js
        │   ├── Orders.js / OrderDetail.js
        │   ├── Dashboard.js
        │   ├── Success.js / Cancel.js
        │   └── ...
        ├── services/
        │   └── api.js
        ├── utils/
        │   └── productUtils.js
        └── index.css
```

---

## ✅ Prérequis

- **XAMPP** installé (Apache + MySQL démarrés)
- **PHP** 8.2+
- **Composer** installé globalement
- **Node.js** 18+ et **npm**
- **Compte Stripe** (clé secrète pour le paiement)

---

## ⚙️ Installation Backend (Laravel)

### 1. Créer le projet Laravel

```bash
cd C:\xampp\htdocs
composer create-project laravel/laravel backend
cd backend
```

### 2. Installer les dépendances supplémentaires

```bash
composer require laravel/sanctum
composer require stripe/stripe-php
```

### 3. Configurer le fichier `.env`

```env
APP_NAME="Luxe Shop"
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

STRIPE_SECRET=sk_test_VOTRE_CLE_STRIPE_SECRETE
FRONTEND_URL=http://localhost:3000
```

### 4. Configurer CORS

Dans `config/cors.php` (ou middleware), s'assurer que `localhost:3000` est autorisé :

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

---

## ⚙️ Installation Frontend (React)

### 1. Créer l'application React

```bash
cd C:\xampp\htdocs\Laravel 3
npx create-react-app frontend
cd frontend
```

### 2. Installer les dépendances

```bash
npm install axios react-router-dom
```

---

## 🗄️ Configuration de la base de données

### 1. Créer la base dans phpMyAdmin

1. Ouvrir [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Créer une nouvelle base de données : `ecommerce_db`
3. Encodage : `utf8mb4_unicode_ci`

### 2. Configurer `.env` (déjà fait ci-dessus)

### 3. Lancer les migrations

```bash
cd backend
php artisan migrate
```

---

## 📐 Migrations — Structure des tables

### `categories`
```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});
```

### `products`
```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description');
    $table->decimal('price', 8, 2);
    $table->string('image')->nullable();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

### `cart_items`
```php
Schema::create('cart_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->integer('quantity')->default(1);
    $table->timestamps();
});
```

### `orders`
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->decimal('total', 10, 2);
    $table->string('status')->default('pending');
    $table->timestamps();
});
```

### `order_items`
```php
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->integer('quantity');
    $table->decimal('price', 8, 2);
    $table->timestamps();
});
```

### Migration ajout Stripe (sur `orders`)
```php
Schema::table('orders', function (Blueprint $table) {
    $table->string('stripe_session_id')->nullable()->after('status');
    $table->timestamp('paid_at')->nullable()->after('stripe_session_id');
});
```

### Diagramme des relations

```
┌──────────┐     ┌────────────┐     ┌──────────┐
│  users   │────<│ cart_items  │>────│ products │
│          │     └────────────┘     │          │
│          │                        │          │>───┐
│          │     ┌────────────┐     └──────────┘    │
│          │────<│  orders    │                      │
│          │     │            │     ┌─────────────┐  │
└──────────┘     │            │────<│ order_items  │>┘
                 └────────────┘     └─────────────┘
                                    
                 ┌────────────┐
                 │ categories │>────── products
                 └────────────┘
```

---

## 🧱 Modèles Eloquent et relations

### `User.php`

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
```

> ⚠️ **Important** : Le trait `HasApiTokens` est indispensable pour que Sanctum fonctionne.

### `Product.php`
```php
protected $fillable = ['name', 'description', 'price', 'image', 'category_id'];

public function category()
{
    return $this->belongsTo(Category::class);
}
```

### `Category.php`
```php
protected $fillable = ['name'];

public function products()
{
    return $this->hasMany(Product::class);
}
```

### `CartItem.php`
```php
protected $fillable = ['user_id', 'product_id', 'quantity'];

public function product()
{
    return $this->belongsTo(Product::class);
}
```

### `Order.php`
```php
protected $fillable = ['user_id', 'total', 'status'];

public function items()
{
    return $this->hasMany(OrderItem::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}
```

### `OrderItem.php`
```php
protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

public function product()
{
    return $this->belongsTo(Product::class);
}

public function order()
{
    return $this->belongsTo(Order::class);
}
```

---

## 🌱 Seeder — Données de démonstration

Le fichier `ShopSeeder.php` injecte **9 catégories** et **30 produits** avec images.

```bash
php artisan db:seed --class=ShopSeeder
```

**Catégories :**
| # | Catégorie |
|---|-----------|
| 1 | Informatique |
| 2 | Gaming |
| 3 | Audio |
| 4 | Smartphone |
| 5 | Maison |
| 6 | Cuisine |
| 7 | Sport |
| 8 | Bureau |
| 9 | Accessoires |

**Extrait produits (30 au total) :**
| Produit | Prix | Catégorie |
|---------|------|-----------|
| PC Portable 15" | 699.90 CHF | Informatique |
| Clavier mécanique | 79.90 CHF | Gaming |
| Écouteurs sans fil | 39.90 CHF | Audio |
| Chargeur rapide 30W | 19.90 CHF | Smartphone |
| Lampe de bureau | 19.90 CHF | Maison |
| Blender | 49.90 CHF | Cuisine |
| Tapis de yoga | 24.90 CHF | Sport |
| Chaise ergonomique | 129.90 CHF | Bureau |
| Sac à dos tech | 39.90 CHF | Accessoires |

Chaque produit possède une URL d'image externe (Unsplash ou liens directs).

---

## 🔐 Authentification avec Sanctum

### Principe

Laravel Sanctum gère l'authentification par **tokens API (Bearer Token)** :

1. L'utilisateur s'inscrit ou se connecte → reçoit un **token**
2. Le token est stocké dans `localStorage` côté React
3. Chaque requête API protégée envoie le header `Authorization: Bearer <token>`
4. Le middleware `auth:sanctum` vérifie le token côté Laravel

### Configuration `config/sanctum.php`

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

### Flux d'authentification

```
┌─────────┐   POST /api/register    ┌─────────┐
│  React  │ ──────────────────────> │ Laravel │
│ (front) │ <────────────────────── │  (API)  │
│         │   { token, user }       │         │
│         │                         │         │
│         │   GET /api/cart          │         │
│         │   Authorization: Bearer │         │
│         │ ──────────────────────> │         │
│         │ <────────────────────── │         │
└─────────┘   [cart items]          └─────────┘
```

---

## 🛣️ Routes API

### Routes publiques

| Méthode | URI | Description |
|---------|-----|-------------|
| `POST` | `/api/register` | Inscription |
| `POST` | `/api/login` | Connexion |
| `GET` | `/api/categories` | Liste des catégories |
| `GET` | `/api/products` | Liste des produits |
| `GET` | `/api/products/{id}` | Détail d'un produit |

### Routes protégées (`auth:sanctum`)

| Méthode | URI | Description |
|---------|-----|-------------|
| `GET` | `/api/user` | Infos utilisateur connecté |
| `POST` | `/api/logout` | Déconnexion |
| `GET` | `/api/cart` | Afficher le panier |
| `POST` | `/api/cart/add` | Ajouter au panier |
| `DELETE` | `/api/cart/{id}` | Retirer du panier |
| `POST` | `/api/checkout` | Créer commande + Stripe |
| `GET` | `/api/orders` | Historique commandes |
| `GET` | `/api/orders/{id}` | Détail d'une commande |
| `POST` | `/api/payment/confirm` | Confirmer paiement Stripe |

---

## 🎮 Controllers Backend

### `AuthController`

| Action | Description |
|--------|-------------|
| `register()` | Valide les données, crée le user, retourne un token Sanctum |
| `login()` | Vérifie email/password avec `Hash::check`, retourne un token |
| `logout()` | Supprime le token courant |

```php
// Inscription
$user = User::create([...]);
$token = $user->createToken('auth_token')->plainTextToken;
return response()->json(['token' => $token, 'user' => $user], 201);
```

### `ProductController`

```php
// Liste tous les produits avec leur catégorie
public function index()
{
    return Product::with('category')->get();
}

// Détail d'un produit
public function show($id)
{
    return Product::with('category')->findOrFail($id);
}
```

### `CategoryController`

```php
public function index()
{
    return Category::all();
}
```

### `CartController`

| Action | Description |
|--------|-------------|
| `index()` | Récupère les articles du panier de l'utilisateur connecté |
| `add()` | Ajoute un produit au panier (ou incrémente la quantité) |
| `remove()` | Supprime un article du panier |

```php
// Ajout intelligent : firstOrCreate + increment
$item = CartItem::firstOrCreate(
    ['user_id' => $user->id, 'product_id' => $request->product_id],
    ['quantity' => 0]
);
$item->increment('quantity');
```

### `OrderController`

| Action | Description |
|--------|-------------|
| `checkout()` | Crée la commande + session Stripe Checkout |
| `index()` | Liste les commandes de l'utilisateur |
| `show()` | Détail d'une commande |
| `confirmPayment()` | Vérifie le paiement via l'API Stripe |

---

## 💳 Intégration Stripe Checkout

### Principe

1. L'utilisateur clique **"Payer avec Stripe"** dans le panier
2. Le backend crée une **session Stripe Checkout** avec les articles
3. L'utilisateur est **redirigé vers la page Stripe** pour payer
4. Après paiement, redirection vers `/success?session_id=...`
5. Le frontend appelle `/api/payment/confirm` pour valider

### Code serveur (dans `OrderController@checkout`)

```php
\Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

$session = \Stripe\Checkout\Session::create([
    'mode' => 'payment',
    'line_items' => $lineItems,  // produits du panier
    'success_url' => $frontend . '/success?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url'  => $frontend . '/cancel',
    'client_reference_id' => (string) $order->id,
    'metadata' => [
        'user_id'  => (string) $user->id,
        'order_id' => (string) $order->id,
    ],
]);
```

### Confirmation de paiement

```php
// POST /api/payment/confirm
$session = \Stripe\Checkout\Session::retrieve($request->session_id);

if ($session->payment_status === 'paid') {
    $order->status = 'paid';
    $order->paid_at = now();
    $order->save();
}
```

### Flux complet

```
Panier → POST /checkout → Stripe Checkout → /success → POST /payment/confirm
                                    ↓
                               Paiement annulé → /cancel
```

---

## ⚛️ Frontend React — Structure

### `src/services/api.js` — Client HTTP

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Intercepteur : injecte le token Bearer automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

> Le token est stocké dans `localStorage` et envoyé automatiquement sur chaque requête.

---

## 🗺️ Routage React

Fichier : `App.js`

```javascript
<BrowserRouter>
  <Navbar />
  <Routes>
    {/* Publiques */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:id" element={<ProductDetail />} />

    {/* Stripe */}
    <Route path="/success" element={<PrivateRoute><Success /></PrivateRoute>} />
    <Route path="/cancel" element={<Cancel />} />

    {/* Protégées */}
    <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
    <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
    <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

---

## 📄 Pages Frontend

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Page d'accueil avec hero et présentation |
| **Login** | `/login` | Formulaire de connexion |
| **Register** | `/register` | Formulaire d'inscription |
| **Products** | `/products` | Catalogue avec filtres par catégorie + recherche |
| **ProductDetail** | `/products/:id` | Fiche produit avec image, bouton panier |
| **Cart** | `/cart` | Panier avec résumé + bouton Stripe |
| **Orders** | `/orders` | Historique des commandes |
| **OrderDetail** | `/orders/:id` | Détail d'une commande |
| **Dashboard** | `/dashboard` | Tableau de bord utilisateur |
| **Success** | `/success` | Confirmation de paiement réussi |
| **Cancel** | `/cancel` | Paiement annulé |

---

## 🧩 Composants réutilisables

### `Navbar.js`

- Logo **Luxe Shop**
- Navigation : Produits, Panier, Commandes, Dashboard
- Bouton **Connexion** / **Déconnexion** selon l'état

### `PrivateRoute.js`

```javascript
// Redirige vers /login si pas de token
const token = localStorage.getItem("token");
if (!token) return <Navigate to="/login" />;
return children;
```

### `productUtils.js`

Deux fonctions utilitaires :
- `getProductEmoji(category, name)` → retourne un emoji selon la catégorie
- `getCategoryColor(category)` → retourne une couleur de fond RGBA

---

## 🖼️ Gestion des images produits

### Côté backend (Seeder)

Chaque produit a un champ `image` contenant une **URL directe** vers une image :

```php
['PC Portable 15"', 'Laptop polyvalent.', 699.90, 'Informatique',
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop'],
```

Sources d'images utilisées :
- **Unsplash** (images gratuites haute qualité)
- **Liens directs** de sites marchands (pour certains produits spécifiques)

### Côté frontend

Les images sont affichées avec un **fallback emoji** si l'image ne charge pas :

```jsx
{product.image ? (
  <img
    src={product.image}
    alt={product.name}
    style={{ objectFit: "contain", background: "#1a1a2e" }}
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
) : null}

{/* Fallback emoji */}
<div className="product-img-placeholder"
     style={{ display: product.image ? 'none' : 'flex' }}>
  <span>{getProductEmoji(category, name)}</span>
</div>
```

**Pages concernées :**
- `Products.js` — carte produit (grille)
- `ProductDetail.js` — page détail
- `Cart.js` — miniature dans le panier

---

## 🎨 Styles et thème

Le thème est défini dans `index.css` avec des **variables CSS** :

```css
:root {
  --bg: #0a0a0f;
  --surface: #12121a;
  --surface2: #1a1a2e;
  --border: #2a2a3e;
  --text: #f5f5f5;
  --muted: #888;
  --gold: #c9a84c;
  --gold2: #e8c547;
  --green: #22c55e;
  /* ... */
}
```

### Caractéristiques du design
- **Thème sombre** (dark mode exclusif)
- Accents **dorés** pour le côté luxe
- Typographie : **Playfair Display** (titres) + **Inter** (corps)
- Border-radius arrondis (16px / 24px)
- Grille responsive 4 colonnes → 2 → 1

---

## 🚀 Lancer le projet

### Terminal 1 — Backend Laravel

```bash
cd C:\xampp\htdocs\Laravel 3\backend
php artisan serve
```
> API disponible sur `http://127.0.0.1:8000`

### Terminal 2 — Frontend React

```bash
cd C:\xampp\htdocs\Laravel 3\frontend
npm start
```
> App disponible sur `http://localhost:3000`

### Seeder (première fois ou reset)

```bash
cd backend
php artisan migrate:fresh
php artisan db:seed --class=ShopSeeder
```

---

## ✨ Résumé des fonctionnalités

| Fonctionnalité | Status |
|----------------|--------|
| Inscription / Connexion (Sanctum) | ✅ |
| Catalogue produits avec images | ✅ |
| Filtres par catégorie | ✅ |
| Recherche de produits | ✅ |
| Fiche produit détaillée | ✅ |
| Panier (ajout / suppression) | ✅ |
| Paiement Stripe Checkout | ✅ |
| Confirmation de paiement | ✅ |
| Historique des commandes | ✅ |
| Dashboard utilisateur | ✅ |
| Responsive design | ✅ |
| Thème sombre luxueux | ✅ |
| Fallback images (emoji) | ✅ |
| 30 produits / 9 catégories | ✅ |

---

> **Luxe Shop** — Projet fullstack Laravel + React avec paiement Stripe
> Réalisé en février 2026
