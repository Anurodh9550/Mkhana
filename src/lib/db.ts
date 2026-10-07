import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { products as seedProducts, reviews as seedReviews } from "@/data/products";
import { brand } from "@/data/content";
import type { Customer, Database, Order, Product } from "@/types";

const FILE = path.join(process.cwd(), "data", "store.json");

let writeChain: Promise<unknown> = Promise.resolve();

function emptyDb(): Database {
  return {
    products: seedProducts,
    reviews: seedReviews,
    orders: [],
    customers: [],
    messages: [],
    subscribers: [],
    settings: {
      storeName: brand.name,
      email: brand.email,
      phone: brand.phone,
      address: brand.address,
      freeShippingMin: 499,
      shippingFee: 79,
    },
  };
}

async function ensureFile() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify(emptyDb(), null, 2), "utf8");
  }
}

export async function getDb(): Promise<Database> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  const parsed = JSON.parse(raw) as Database;
  const base = emptyDb();
  return {
    products: parsed.products?.length ? parsed.products : base.products,
    reviews: parsed.reviews ?? base.reviews,
    orders: parsed.orders ?? [],
    customers: parsed.customers ?? [],
    messages: parsed.messages ?? [],
    subscribers: parsed.subscribers ?? [],
    settings: { ...base.settings, ...parsed.settings },
  };
}

async function persist(db: Database) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

export function mutateDb<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = writeChain.then(async () => {
    const db = await getDb();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function nextOrderId(orders: Order[]) {
  const nums = orders
    .map((o) => Number(String(o.id).replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 10000;
  return `MM-${max + 1}`;
}

export function upsertCustomer(db: Database, order: Order) {
  const email = order.customer.email.toLowerCase();
  const existing = db.customers.find((c) => c.email === email);
  const spentAdd = order.status === "cancelled" ? 0 : order.total;
  if (existing) {
    existing.orders += 1;
    existing.spent += spentAdd;
    existing.phone = order.customer.phone;
    existing.city = order.customer.city;
    existing.name = `${order.customer.firstName} ${order.customer.lastName}`.trim();
    return existing;
  }
  const customer: Customer = {
    id: randomUUID(),
    name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    email,
    phone: order.customer.phone,
    city: order.customer.city,
    orders: 1,
    spent: spentAdd,
    createdAt: new Date().toISOString(),
  };
  db.customers.unshift(customer);
  return customer;
}

export function findProduct(db: Database, id: string) {
  return db.products.find((p) => p.id === id);
}

export function findProductBySlug(db: Database, slug: string) {
  return db.products.find((p) => p.slug === slug);
}

export function shippingFor(subtotal: number, settings: Database["settings"]) {
  if (subtotal === 0 || subtotal >= settings.freeShippingMin) return 0;
  return settings.shippingFee;
}

export function relatedProducts(products: Product[], slug: string, limit = 4) {
  const current = products.find((p) => p.slug === slug);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(products.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}
