export function getProductEmoji(categoryName, productName) {
  const name = (productName || "").toLowerCase();
  const cat = (categoryName || "").toLowerCase();

  if (cat.includes("informatique") || name.includes("pc") || name.includes("laptop") || name.includes("ssd") || name.includes("ram")) return "💻";
  if (cat.includes("gaming") || name.includes("clavier") || name.includes("souris") || name.includes("casque gaming")) return "🎮";
  if (cat.includes("audio") || name.includes("écouteur") || name.includes("enceinte") || name.includes("micro")) return "🎧";
  if (cat.includes("smartphone") || name.includes("chargeur") || name.includes("coque") || name.includes("câble")) return "📱";
  if (cat.includes("maison") || name.includes("lampe") || name.includes("multiprise")) return "🏠";
  if (cat.includes("cuisine") || name.includes("blender") || name.includes("bouilloire") || name.includes("balance")) return "🍳";
  if (cat.includes("sport") || name.includes("yoga") || name.includes("gourde") || name.includes("corde")) return "⚡";
  if (cat.includes("bureau") || name.includes("chaise") || name.includes("support") || name.includes("carnet")) return "🖥️";
  if (cat.includes("accessoires") || name.includes("sac") || name.includes("powerbank")) return "🎒";
  return "📦";
}

export function getCategoryColor(categoryName) {
  const cat = (categoryName || "").toLowerCase();
  if (cat.includes("informatique")) return "rgba(59,130,246,0.15)";
  if (cat.includes("gaming")) return "rgba(168,85,247,0.15)";
  if (cat.includes("audio")) return "rgba(236,72,153,0.15)";
  if (cat.includes("smartphone")) return "rgba(34,197,94,0.15)";
  if (cat.includes("maison")) return "rgba(251,191,36,0.15)";
  if (cat.includes("cuisine")) return "rgba(249,115,22,0.15)";
  if (cat.includes("sport")) return "rgba(20,184,166,0.15)";
  if (cat.includes("bureau")) return "rgba(99,102,241,0.15)";
  return "rgba(201,168,76,0.15)";
}