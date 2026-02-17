<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage (optionnel mais pratique)
        Product::query()->delete();
        Category::query()->delete();

        // Catégories
        $cats = [
            'Informatique',
            'Gaming',
            'Audio',
            'Smartphone',
            'Maison',
            'Cuisine',
            'Sport',
            'Bureau',
            'Accessoires',
        ];

        $categoryIds = [];
        foreach ($cats as $name) {
            $c = Category::create(['name' => $name]);
            $categoryIds[$name] = $c->id;
        }

        // Produits (beaucoup + réalistes)
        $products = [
            // Informatique
            ['PC Portable 15"', 'Laptop polyvalent (bureautique + dev).', 699.90, 'Informatique', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop'],
            ['SSD 1To NVMe', 'Stockage ultra-rapide pour PC.', 89.90, 'Informatique', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop'],
            ['RAM 16Go DDR4', 'Mémoire idéale pour multitâche.', 49.90, 'Informatique', 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&h=800&fit=crop'],
            ['Hub USB-C 7-en-1', 'HDMI + USB + SD + charge.', 39.90, 'Informatique', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=800&fit=crop'],

            // Gaming
            ['Clavier mécanique', 'Switches tactiles, RGB.', 79.90, 'Gaming', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop'],
            ['Souris gaming', 'DPI réglable, ultra précise.', 49.90, 'Gaming', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop'],
            ['Casque gaming', 'Son surround + micro.', 59.90, 'Gaming', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
            ['Tapis XXL', 'Surface large anti-dérapante.', 19.90, 'Gaming', 'https://home-gaming.com/cdn/shop/files/tapis-de-souris-xxl-gaming-formes-3d.png?v=1723083776'],

            // Audio
            ['Écouteurs sans fil', 'Autonomie 6h + boîtier.', 39.90, 'Audio', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop'],
            ['Enceinte Bluetooth', 'Basses puissantes, portable.', 44.90, 'Audio', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
            ['Micro USB', 'Parfait pour streaming/visio.', 69.90, 'Audio', 'https://www.gsmoplader.nl/images/products/micro-usb-kabel-zwart-0-25-meter-2-2-2.jpg?max=550'],

            // Smartphone
            ['Chargeur rapide 30W', 'USB-C Power Delivery.', 19.90, 'Smartphone', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&h=800&fit=crop'],
            ['Coque renforcée', 'Protection anti-choc.', 14.90, 'Smartphone', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop'],
            ['Câble USB-C 2m', 'Résistant et durable.', 9.90, 'Smartphone', 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&h=800&fit=crop'],

            // Maison
            ['Lampe de bureau', 'LED économique, réglable.', 19.90, 'Maison', 'https://www.lampe.fr/media/product/158490/1000x1000/havsta-lampe-de-bureau-lampe-a-poser-laiton-1-lumiere-h3861226-0.jpg?type=webp'],
            ['Multiprise parafoudre', 'Protection surtension.', 24.90, 'Maison', 'https://www.touslescables.com/im/pr/214G.jpg'],
            ['Station météo', 'Température + humidité.', 29.90, 'Maison', 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=800&fit=crop'],

            // Cuisine
            ['Blender', 'Smoothies & soupes.', 49.90, 'Cuisine', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop'],
            ['Bouilloire inox', 'Chauffe rapide.', 24.90, 'Cuisine', 'https://www.francisbatt.com/ressources/references/miniatures/zoom1_bouilloire-inox-1-2-litre-avec-reglage-de-temperature-745028.png'],
            ['Balance de cuisine', 'Précision 1g.', 14.90, 'Cuisine', 'https://www.bacchus-equipements.com/media/cache/app_product_gallery_medium/0d/82/balance-de-cuisine-digitale-A300117.jpg.webp'],

            // Sport
            ['Tapis de yoga', 'Antidérapant confortable.', 24.90, 'Sport', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop'],
            ['Gourde 1L', 'Sans BPA, sportive.', 12.90, 'Sport', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop'],
            ['Corde à sauter', 'Entraînement cardio.', 9.90, 'Sport', 'https://www.crossliftor.com/5115-large_default/corde-a-sauter-kids.jpg'],

            // Bureau
            ['Chaise ergonomique', 'Support lombaire.', 129.90, 'Bureau', 'https://img.aosomcdn.com/thumbnail/100/n0/product/2022/10/11/KMJ98a183c46a8904.jpg.webp'],
            ['Support écran', 'Hauteur + posture.', 29.90, 'Bureau', 'https://www.concept-bureau.fr/10170-large_default/support-ecran-sola.jpg'],
            ['Carnet premium', 'Papier épais.', 7.90, 'Bureau', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop'],

            // Accessoires
            ['Sac à dos tech', 'Compartiment laptop.', 39.90, 'Accessoires', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
            ['Powerbank 20 000mAh', 'Charge rapide.', 34.90, 'Accessoires', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop'],
            ['Support téléphone', 'Support bureau stable.', 9.90, 'Accessoires', 'https://www.versionecologique.com/37566-large_default/support-telephone-publicitaire-en-bambou-whippy.jpg'],
        ];

        foreach ($products as [$name, $desc, $price, $catName, $image]) {
            Product::create([
                'name' => $name,
                'description' => $desc,
                'price' => $price,
                'category_id' => $categoryIds[$catName],
                'image' => $image,
            ]);
        }
    }
}
