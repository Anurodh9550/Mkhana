import type { Order, OrderStatus, OrderTimelineEvent } from "@/types";

export const TRACK_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Ordered" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const STEP_RANK: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 0,
  packed: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

export const STATUS_COPY: Record<OrderStatus, { title: string; detail: string; headline: string }> = {
  pending: {
    title: "Order placed",
    detail: "Your order has been received and is being confirmed.",
    headline: "Order placed - confirmation in progress",
  },
  confirmed: {
    title: "Order confirmed",
    detail: "Seller has confirmed your order. Packing will begin shortly.",
    headline: "Order confirmed. Packing starts soon",
  },
  packed: {
    title: "Packed",
    detail: "Your pouch has been packed at the Mithila warehouse.",
    headline: "Packed and ready for dispatch",
  },
  shipped: {
    title: "Shipped",
    detail: "Shipment handed to logistics. In transit towards your city.",
    headline: "Shipped - in transit",
  },
  out_for_delivery: {
    title: "Out for delivery",
    detail: "Your pouch is with the delivery partner for today.",
    headline: "Out for delivery today",
  },
  delivered: {
    title: "Delivered",
    detail: "Package delivered successfully. Enjoy the harvest.",
    headline: "Delivered",
  },
  cancelled: {
    title: "Cancelled",
    detail: "This order was cancelled and will not be shipped.",
    headline: "Order cancelled",
  },
};

export function trackingId(orderId: string) {
  return `MM${orderId.replace(/\D/g, "").padStart(8, "0")}IN`;
}

export function formatTrackDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTrackDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function expectedDeliveryIso(createdAt: string, status: OrderStatus) {
  const start = new Date(createdAt);
  const days = status === "out_for_delivery" ? 0 : status === "shipped" ? 2 : 5;
  start.setDate(start.getDate() + days);
  return start.toISOString();
}

export function stepState(status: OrderStatus, stepKey: OrderStatus): "done" | "current" | "upcoming" | "idle" {
  if (status === "cancelled") return "idle";
  const now = STEP_RANK[status];
  const step = STEP_RANK[stepKey];
  if (now > step) return "done";
  if (now === step) return "current";
  return "upcoming";
}

export function locationFor(status: OrderStatus, city: string) {
  if (status === "shipped") return "Patna logistics hub, Bihar";
  if (status === "out_for_delivery" || status === "delivered") return city;
  return "Mithila warehouse, Madhubani";
}

export function eventForStatus(status: OrderStatus, city: string, at = new Date().toISOString()): OrderTimelineEvent {
  const copy = STATUS_COPY[status];
  return {
    status,
    title: copy.title,
    detail: copy.detail,
    location: locationFor(status, city),
    at,
  };
}

export function appendTimeline(order: Order, status: OrderStatus) {
  const events = order.timeline ?? [];
  if (events.at(-1)?.status === status) {
    order.timeline = events;
    return;
  }
  events.push(eventForStatus(status, order.customer.city));
  order.timeline = events;
}

const FLOW: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

export function buildTimeline(order: Order): OrderTimelineEvent[] {
  if (order.timeline?.length) return order.timeline;
  if (order.status === "cancelled") {
    return [
      eventForStatus("pending", order.customer.city, order.createdAt),
      eventForStatus("cancelled", order.customer.city, order.createdAt),
    ];
  }
  const rank = Math.max(0, FLOW.indexOf(order.status === "confirmed" ? "confirmed" : order.status));
  const start = new Date(order.createdAt).getTime();
  const hours = [0, 3, 22, 36, 70, 90];
  return FLOW.slice(0, rank + 1).map((status, i) =>
    eventForStatus(status, order.customer.city, new Date(start + hours[i] * 60 * 60 * 1000).toISOString()),
  );
}
