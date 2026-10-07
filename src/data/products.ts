import type { Product, Review } from "@/types";

export const products: Product[] = [
  {
    id: "p-raw",
    slug: "premium-raw-makhana",
    name: "Premium Raw Makhana",
    tagline: "Unflavoured. Uncompromised. The original harvest.",
    description:
      "Hand-picked fox nuts from the ponds of Mithila, popped at low heat to keep their natural sweetness, crunch, and snow-white bloom.",
    longDescription:
      "Our Premium Raw Makhana is the closest you can get to the pond. Grown in the wetland farms of Madhubani and Darbhanga, each seed is harvested by hand, sun-dried, and popped in small batches. No oil. No salt. No flavouring. Just the clean, buttery crunch that made Mithila makhana a royal snack for centuries. Perfect for fasting, everyday grazing, or as a base for your own seasoning.",
    category: "raw",
    images: [
      "/images/product-raw.png",
      "/images/hero-makhana.png",
      "/images/lifestyle-bowl.png",
      "/images/story-mithila.png",
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 312,
    variants: [
      { id: "raw-100", weight: "100g", price: 199, compareAtPrice: 249, sku: "MM-RAW-100", inStock: true },
      { id: "raw-250", weight: "250g", price: 449, compareAtPrice: 549, sku: "MM-RAW-250", inStock: true },
      { id: "raw-500", weight: "500g", price: 799, compareAtPrice: 999, sku: "MM-RAW-500", inStock: true },
    ],
    nutrition: [
      { label: "Energy", value: "347 kcal" },
      { label: "Protein", value: "9.7 g" },
      { label: "Carbohydrates", value: "76.9 g" },
      { label: "Fat", value: "0.1 g" },
      { label: "Fibre", value: "4.5 g" },
      { label: "Calcium", value: "60 mg" },
    ],
    benefits: [
      "Naturally gluten-free and vegan",
      "High in plant protein, almost zero fat",
      "Low glycaemic index — gentle on energy",
      "Ideal for vrat, kids, and everyday snacking",
    ],
    ingredients: ["100% Mithila fox nuts (Euryale ferox)"],
    tags: ["vegan", "gluten-free", "no-oil", "fasting"],
    bestseller: true,
  },
  {
    id: "p-roasted",
    slug: "roasted-makhana",
    name: "Roasted Makhana",
    tagline: "Slow-roasted until the crunch sings.",
    description:
      "Gently roasted in small kettles until each lotus seed turns golden at the edges — warm, nutty, and impossibly light.",
    longDescription:
      "Roasting is an art in Mithila kitchens. We take our raw harvest and finish it over a controlled flame, coaxing out a deeper aroma without a drop of oil. The result is a snack that feels indulgent and still reads clean on the label. Carry it to the office, pack it for travel, or serve it with evening chai.",
    category: "roasted",
    images: [
      "/images/product-roasted.png",
      "/images/lifestyle-bowl.png",
      "/images/hero-makhana.png",
      "/images/product-raw.png",
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 268,
    variants: [
      { id: "rst-100", weight: "100g", price: 219, compareAtPrice: 269, sku: "MM-RST-100", inStock: true },
      { id: "rst-250", weight: "250g", price: 489, compareAtPrice: 599, sku: "MM-RST-250", inStock: true },
      { id: "rst-500", weight: "500g", price: 849, compareAtPrice: 1049, sku: "MM-RST-500", inStock: true },
    ],
    nutrition: [
      { label: "Energy", value: "356 kcal" },
      { label: "Protein", value: "9.9 g" },
      { label: "Carbohydrates", value: "77.2 g" },
      { label: "Fat", value: "0.2 g" },
      { label: "Fibre", value: "4.6 g" },
      { label: "Iron", value: "1.4 mg" },
    ],
    benefits: [
      "Oil-free slow roast",
      "Deeper nutty flavour, same lightness",
      "Travel-friendly, stays crisp",
      "A cleaner swap for fried namkeen",
    ],
    ingredients: ["Roasted Mithila fox nuts"],
    tags: ["roasted", "no-oil", "office-snack"],
    bestseller: true,
  },
  {
    id: "p-himalayan",
    slug: "himalayan-salt-makhana",
    name: "Himalayan Salt Makhana",
    tagline: "A whisper of pink salt. Nothing more.",
    description:
      "Our roasted harvest finished with hand-crushed Himalayan pink salt — mineral, elegant, and quietly addictive.",
    longDescription:
      "We dust each batch with stone-ground Himalayan pink salt so the mineral notes sit on the surface rather than soaking through. You taste the lotus seed first, then a clean saline finish. It is the flavour we reach for most evenings — grown-up, restrained, and still very moreish.",
    category: "flavoured",
    images: [
      "/images/product-himalayan.png",
      "/images/product-roasted.png",
      "/images/lifestyle-bowl.png",
      "/images/hero-makhana.png",
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 401,
    variants: [
      { id: "him-100", weight: "100g", price: 249, compareAtPrice: 299, sku: "MM-HIM-100", inStock: true },
      { id: "him-250", weight: "250g", price: 529, compareAtPrice: 649, sku: "MM-HIM-250", inStock: true },
      { id: "him-500", weight: "500g", price: 929, compareAtPrice: 1149, sku: "MM-HIM-500", inStock: true },
    ],
    nutrition: [
      { label: "Energy", value: "352 kcal" },
      { label: "Protein", value: "9.7 g" },
      { label: "Carbohydrates", value: "76.1 g" },
      { label: "Fat", value: "0.2 g" },
      { label: "Sodium", value: "280 mg" },
      { label: "Magnesium", value: "32 mg" },
    ],
    benefits: [
      "Mineral-rich Himalayan pink salt",
      "Light seasoning, never greasy",
      "Pairs beautifully with tea or wine",
      "A refined everyday savoury snack",
    ],
    ingredients: ["Roasted Mithila fox nuts", "Himalayan pink salt"],
    tags: ["salted", "bestseller", "evening"],
    isNew: false,
    bestseller: true,
  },
  {
    id: "p-peri",
    slug: "peri-peri-makhana",
    name: "Peri Peri Makhana",
    tagline: "Warm spice. Bright heat. Still feather-light.",
    description:
      "A house blend of Kashmiri chilli, garlic, and smoked paprika on roasted fox nuts — fiery without the oil.",
    longDescription:
      "Peri peri on makhana should never taste like a packet of chips. Ours is built from whole spices, toasted and milled in small lots, then tumbled onto warm roasted seeds so the heat clings without oil. Expect a slow, aromatic warmth rather than a cheap burn — and a snack that still feels clean an hour later.",
    category: "flavoured",
    images: [
      "/images/product-periperi.png",
      "/images/product-roasted.png",
      "/images/lifestyle-bowl.png",
      "/images/hero-makhana.png",
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 189,
    variants: [
      { id: "peri-100", weight: "100g", price: 269, compareAtPrice: 329, sku: "MM-PERI-100", inStock: true },
      { id: "peri-250", weight: "250g", price: 559, compareAtPrice: 699, sku: "MM-PERI-250", inStock: true },
      { id: "peri-500", weight: "500g", price: 979, compareAtPrice: 1199, sku: "MM-PERI-500", inStock: false },
    ],
    nutrition: [
      { label: "Energy", value: "361 kcal" },
      { label: "Protein", value: "10.1 g" },
      { label: "Carbohydrates", value: "75.4 g" },
      { label: "Fat", value: "0.8 g" },
      { label: "Sodium", value: "310 mg" },
      { label: "Capsaicin", value: "Trace" },
    ],
    benefits: [
      "Spice without deep-frying",
      "House-blended peri peri masala",
      "Satisfies the evening craving",
      "Still light enough for late nights",
    ],
    ingredients: [
      "Roasted Mithila fox nuts",
      "Kashmiri chilli",
      "Garlic",
      "Smoked paprika",
      "Himalayan salt",
    ],
    tags: ["spicy", "party", "flavoured"],
    isNew: true,
  },
  {
    id: "p-pudina",
    slug: "pudina-makhana",
    name: "Pudina Makhana",
    tagline: "Garden mint. A cool, green finish.",
    description:
      "Dried spearmint and a hint of black salt on roasted makhana — fresh, cooling, and made for humid afternoons.",
    longDescription:
      "Pudina is how Mithila summers taste. We fold dried spearmint, a little amchur, and kala namak onto warm roasted fox nuts so the first bite is herbal and the last is cooling. It is the pouch we pack for long drives and the bowl we put out when guests arrive unannounced.",
    category: "flavoured",
    images: [
      "/images/product-pudina.png",
      "/images/lifestyle-bowl.png",
      "/images/product-raw.png",
      "/images/hero-makhana.png",
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 154,
    variants: [
      { id: "pud-100", weight: "100g", price: 259, compareAtPrice: 319, sku: "MM-PUD-100", inStock: true },
      { id: "pud-250", weight: "250g", price: 549, compareAtPrice: 679, sku: "MM-PUD-250", inStock: true },
      { id: "pud-500", weight: "500g", price: 959, compareAtPrice: 1179, sku: "MM-PUD-500", inStock: true },
    ],
    nutrition: [
      { label: "Energy", value: "349 kcal" },
      { label: "Protein", value: "9.8 g" },
      { label: "Carbohydrates", value: "75.8 g" },
      { label: "Fat", value: "0.3 g" },
      { label: "Sodium", value: "240 mg" },
      { label: "Iron", value: "1.5 mg" },
    ],
    benefits: [
      "Cooling mint for warm weather",
      "Digestive black salt and amchur",
      "A lighter chaat-style snack",
      "Loved with buttermilk and lime",
    ],
    ingredients: [
      "Roasted Mithila fox nuts",
      "Dried spearmint",
      "Amchur",
      "Black salt",
      "Himalayan salt",
    ],
    tags: ["mint", "chaat", "summer"],
    isNew: true,
  },
  {
    id: "p-cheese",
    slug: "cheese-makhana",
    name: "Cheese Makhana",
    tagline: "Aged cheddar notes. No grease, all comfort.",
    description:
      "A savoury cheddar seasoning on roasted fox nuts — nostalgic, golden, and still remarkably light.",
    longDescription:
      "Cheese makhana is comfort without the crash. We use a carefully balanced cheddar seasoning — nutty, slightly sharp — tumbled onto hot roasted seeds so it clings in a fine gold dust. It is the bowl that disappears during movie night, and the one children ask for by name.",
    category: "flavoured",
    images: [
      "/images/product-cheese.png",
      "/images/product-roasted.png",
      "/images/lifestyle-bowl.png",
      "/images/hero-makhana.png",
    ],
    featured: true,
    rating: 4.6,
    reviewCount: 221,
    variants: [
      { id: "chs-100", weight: "100g", price: 279, compareAtPrice: 339, sku: "MM-CHS-100", inStock: true },
      { id: "chs-250", weight: "250g", price: 579, compareAtPrice: 719, sku: "MM-CHS-250", inStock: true },
      { id: "chs-500", weight: "500g", price: 999, compareAtPrice: 1249, sku: "MM-CHS-500", inStock: true },
    ],
    nutrition: [
      { label: "Energy", value: "372 kcal" },
      { label: "Protein", value: "11.2 g" },
      { label: "Carbohydrates", value: "74.1 g" },
      { label: "Fat", value: "1.6 g" },
      { label: "Sodium", value: "340 mg" },
      { label: "Calcium", value: "82 mg" },
    ],
    benefits: [
      "Cheddar flavour without frying",
      "Kid-approved, parent-approved",
      "Movie-night staple",
      "Still a high-protein crunch",
    ],
    ingredients: [
      "Roasted Mithila fox nuts",
      "Cheddar seasoning",
      "Nutritional yeast",
      "Himalayan salt",
    ],
    tags: ["cheese", "kids", "comfort"],
    bestseller: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p-raw",
    name: "Ananya Sharma",
    rating: 5,
    title: "The cleanest makhana I have found",
    body: "Snow white, no broken pieces, and it stays crisp for weeks. I use the 500g pouch for morning smoothies and evening bowls.",
    date: "12 July 2026",
    verified: true,
  },
  {
    id: "r2",
    productId: "p-himalayan",
    name: "Rohit Mehta",
    rating: 5,
    title: "Exactly the right amount of salt",
    body: "Most salted makhana is either bland or a salt bomb. This one is restrained and mineral. Goes beautifully with evening chai.",
    date: "3 August 2026",
    verified: true,
  },
  {
    id: "r3",
    productId: "p-peri",
    name: "Kavya Nair",
    rating: 4,
    title: "Heat with character",
    body: "Not a cheap chilli powder hit. You get garlic and smoke first, then warmth. Wish the 500g came back in stock sooner.",
    date: "21 June 2026",
    verified: true,
  },
  {
    id: "r4",
    productId: "p-cheese",
    name: "Vikram Patel",
    rating: 5,
    title: "Kids finished the pouch in two days",
    body: "Replaced chips at home. The cheese flavour is proper, not artificial orange dust. Will reorder the family size.",
    date: "18 May 2026",
    verified: true,
  },
  {
    id: "r5",
    productId: "p-pudina",
    name: "Meera Jha",
    rating: 5,
    title: "Tastes like home in Mithila",
    body: "The pudina is fresh, not toothpaste-mint. Took me straight back to summer evenings in Darbhanga. Packaging is beautiful too.",
    date: "9 August 2026",
    verified: true,
  },
  {
    id: "r6",
    productId: "p-roasted",
    name: "Siddharth Rao",
    rating: 5,
    title: "Office drawer essential",
    body: "Light, filling, and it does not leave my desk smelling of namkeen. The roast is even — no burnt seeds.",
    date: "2 April 2026",
    verified: true,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(slug: string, limit = 4) {
  const current = getProductBySlug(slug);
  if (!current) return products.slice(0, limit);
  return products.filter((p) => p.slug !== slug && p.category === current.category).concat(
    products.filter((p) => p.slug !== slug && p.category !== current.category),
  ).slice(0, limit);
}

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}
