export type ProductCategory = "raw" | "roasted" | "flavoured" | "gifting";

export type ProductVariant = {
  id: string;
  weight: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
};

export type NutritionFact = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: ProductCategory;
  images: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  nutrition: NutritionFact[];
  benefits: string[];
  ingredients: string[];
  tags: string[];
  bestseller?: boolean;
  isNew?: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  product: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Category = {
  slug: ProductCategory;
  name: string;
  description: string;
  image: string;
  count: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderTimelineEvent = {
  status: OrderStatus;
  title: string;
  detail: string;
  location: string;
  at: string;
};
export type PaymentMethod = "cod" | "card" | "razorpay";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  state: string;
};

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  note?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  timeline?: OrderTimelineEvent[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  freeShippingMin: number;
  shippingFee: number;
};

export type Database = {
  products: Product[];
  reviews: Review[];
  orders: Order[];
  customers: Customer[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  settings: StoreSettings;
};
