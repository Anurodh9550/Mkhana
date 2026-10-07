import type { Category, FAQ, Testimonial } from "@/types";
import { products } from "./products";

export const brand = {
  name: "Mithila Makhana",
  tagline: "Farm Fresh Makhana From Mithila, Bihar",
  logo: "/images/logo.jpg",
  phone: "+91 91358 95389",
  whatsapp: "919135895389",
  email: "hello@mithilamakhana.com",
  website: "https://mithilamakhana.com",
  address: "Madhubani, Mithila, Bihar, India",
  instagram: "https://instagram.com/mithilamakhana",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114918.186!2d86.06!3d26.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eccd1c6b0a!2sMadhubani%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000",
};

export const categories: Category[] = [
  {
    slug: "raw",
    name: "Raw Harvest",
    description: "Unflavoured fox nuts, popped the traditional way.",
    image: "/images/product-raw.png",
    count: products.filter((p) => p.category === "raw").length,
  },
  {
    slug: "roasted",
    name: "Slow Roasted",
    description: "Oil-free roast with a deeper, nutty crunch.",
    image: "/images/product-roasted.png",
    count: products.filter((p) => p.category === "roasted").length,
  },
  {
    slug: "flavoured",
    name: "House Flavours",
    description: "Salt, mint, peri peri, and cheddar — lightly dusted.",
    image: "/images/product-periperi.png",
    count: products.filter((p) => p.category === "flavoured").length,
  },
  {
    slug: "gifting",
    name: "Gifting",
    description: "Assorted pouches for festivals and hosts.",
    image: "/images/lifestyle-bowl.png",
    count: 6,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aditi Kapoor",
    location: "Mumbai",
    quote:
      "It does not taste like ‘health food’. It tastes like something a thoughtful kitchen would serve with wine.",
    rating: 5,
    product: "Himalayan Salt Makhana",
  },
  {
    id: "t2",
    name: "Arjun Malhotra",
    location: "Bengaluru",
    quote:
      "We replaced the office namkeen tin with Mithila. Nobody complained. That is the highest compliment.",
    rating: 5,
    product: "Roasted Makhana",
  },
  {
    id: "t3",
    name: "Nandini Mishra",
    location: "Patna",
    quote:
      "Finally a brand that treats Bihar makhana with the respect it deserves. The raw pouch is what I grew up eating, only prettier.",
    rating: 5,
    product: "Premium Raw Makhana",
  },
  {
    id: "t4",
    name: "Rahul Desai",
    location: "Ahmedabad",
    quote:
      "Peri peri without the oily aftertaste. I keep a pouch in the car. Dangerous, in the best way.",
    rating: 5,
    product: "Peri Peri Makhana",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Where is your makhana grown?",
    answer:
      "Every seed is sourced from wetland farms in the Mithila region of Bihar — primarily Madhubani, Darbhanga, and neighbouring ponds that hold a Geographical Indication for makhana.",
  },
  {
    question: "Is it truly oil-free?",
    answer:
      "Yes. We pop and roast without oil. Flavoured variants are dusted with dry spice blends after roasting, so you get aroma without grease.",
  },
  {
    question: "How should I store it?",
    answer:
      "Keep the pouch sealed, away from humidity. Once opened, finish within two to three weeks for peak crunch, or clip it and store in a cool cupboard.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "We ship pan-India. Orders above ₹499 travel free. Most metros arrive in 2–4 days; the rest of India in 4–7.",
  },
  {
    question: "Is makhana suitable for fasting (vrat)?",
    answer:
      "Premium Raw and Roasted are ideal for vrat. Flavoured variants include spices and seasoning — check the ingredients if you follow a strict fast.",
  },
  {
    question: "What is your return policy?",
    answer:
      "If a pouch arrives damaged or stale, write to us within 7 days with a photo. We replace or refund, no theatre required.",
  },
];

export const trustItems = [
  { title: "100% Natural", subtitle: "Nothing you cannot pronounce" },
  { title: "Farm Fresh", subtitle: "Harvested from Mithila ponds" },
  { title: "Direct From Bihar", subtitle: "GI-tagged origin, no middlemen" },
  { title: "Premium Quality", subtitle: "Hand-sorted, small-batch popped" },
];

export const whyChoose = [
  {
    title: "Pond to pouch, traced",
    body: "We work with grower families in Madhubani and Darbhanga. You taste a place, not a factory blend.",
  },
  {
    title: "Small-batch popping",
    body: "Makhana is popped in shallow kettles, not industrial drums, so the bloom stays whole and snow-white.",
  },
  {
    title: "Seasoning with restraint",
    body: "Our flavours are dry-dusted. Salt, mint, chilli, cheddar — present, never shouting, never oily.",
  },
  {
    title: "Designed for daily life",
    body: "Light enough for desks and travel, generous enough for gatherings. A snack that does not ask you to compromise.",
  },
];

export const healthBenefits = [
  {
    title: "Plant protein, almost no fat",
    body: "Close to 10g of protein per 100g, with negligible fat — rare for something this moreish.",
  },
  {
    title: "Gentle on blood sugar",
    body: "A low glycaemic crunch that keeps energy even. Preferred by those watching glucose and weight.",
  },
  {
    title: "Minerals that matter",
    body: "Naturally rich in magnesium, potassium, and calcium — the quiet architecture of heart and bone health.",
  },
  {
    title: "Gluten-free, vegan, fasting-friendly",
    body: "A single-ingredient seed that fits most tables: vrat thalis, school tiffins, and wine hour alike.",
  },
  {
    title: "Light, filling, not fried",
    body: "Airy structure means you feel satisfied without the heaviness of namkeen or chips.",
  },
  {
    title: "Antioxidant lotus seed",
    body: "Euryale ferox has long been used in traditional diets for vitality. We simply refuse to ruin it.",
  },
];

export const instagramPosts = [
  { src: "/images/hero-makhana.png", alt: "Bowl of premium makhana" },
  { src: "/images/product-raw.png", alt: "Raw fox nuts" },
  { src: "/images/story-mithila.png", alt: "Mithila ponds at dusk" },
  { src: "/images/product-periperi.png", alt: "Peri peri makhana" },
  { src: "/images/lifestyle-bowl.png", alt: "Evening snack table" },
  { src: "/images/about-harvest.png", alt: "Harvest in Bihar" },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
  { href: "/track-order", label: "Track Order" },
];

export const trustTicker = [
  "100% Natural",
  "No Preservatives",
  "Farm Fresh",
  "Premium Quality",
  "Free COD Pan India",
  "GI-Tagged Mithila",
];

export const portalStats = [
  { value: "200+", label: "Farming families connected" },
  { value: "12", label: "Quality checks every batch" },
  { value: "100%", label: "Oil-free popping" },
  { value: "10,000+", label: "Families snack Mithila" },
];

export const whyPortal = [
  {
    n: "01",
    title: "Grown in Mithila ponds",
    body: "Fox nuts from Madhubani and Darbhanga wetlands — GI origin, not a mixed commodity lot.",
  },
  {
    n: "02",
    title: "Popped the traditional way",
    body: "Small kettles, not industrial drums, so each bloom stays whole, white, and light.",
  },
  {
    n: "03",
    title: "Oil-free roast",
    body: "No frying. Flavours are dry-dusted after roast — aroma without grease.",
  },
  {
    n: "04",
    title: "Made for everyday snacking",
    body: "Desks, tiffins, vrat thalis, and evening chai — a crunch that does not weigh you down.",
  },
  {
    n: "05",
    title: "High protein, almost no fat",
    body: "Close to 10g protein per 100g with negligible fat — rare for something this moreish.",
  },
  {
    n: "06",
    title: "Rooted in Bihar kitchens",
    body: "What the world calls a superfood was, here, simply the snack of the house.",
  },
];

export const harvestJourney = [
  {
    step: "01",
    title: "Mithila wetland farms",
    body: "Indigenous Euryale ferox grows in standing ponds across the Mithila belt of Bihar.",
    tags: ["GI origin", "Pond grown", "Family farms"],
  },
  {
    step: "02",
    title: "Dawn harvest",
    body: "Seeds are collected by hand when the water is still, then sun-dried in open courtyards.",
    tags: ["Hand gathered", "Sun dried", "No machines in the pond"],
  },
  {
    step: "03",
    title: "Sorting the bloom",
    body: "Broken pieces are set aside. Only whole, ivory fox nuts move to popping.",
    tags: ["Hand sorted", "Whole bloom", "Grade A"],
  },
  {
    step: "04",
    title: "Small-batch popping",
    body: "Shallow iron kettles pop each seed until it flowers white — never oil, never a drum.",
    tags: ["Kettle popped", "Oil-free", "Small batch"],
  },
  {
    step: "05",
    title: "Slow roast or flavour",
    body: "Raw stays clean. Roasted and house flavours are finished with dry spice, not grease.",
    tags: ["Raw", "Roasted", "Dry-dusted"],
  },
  {
    step: "06",
    title: "Quality checks",
    body: "Crunch, moisture, and grade are checked before a pouch is sealed.",
    tags: ["Moisture check", "Grade verified", "Batch noted"],
  },
  {
    step: "07",
    title: "Packed for the table",
    body: "Food-grade pouches lock in the bloom so it stays crisp until you open it.",
    tags: ["Food-grade", "Crunch sealed", "Ready to gift"],
  },
  {
    step: "08",
    title: "Pond to your kitchen",
    body: "Pan-India delivery, cash on delivery, and complimentary shipping above ₹499.",
    tags: ["Pan-India", "Free COD", "Farm to family"],
  },
];

export const pressLogos = ["The Times of India", "YourStory", "Economic Times", "Forbes India", "NDTV"];
