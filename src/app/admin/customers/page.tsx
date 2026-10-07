"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";
import type { Customer } from "@/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d: { customers?: Customer[] }) => setCustomers(d.customers || []));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Created automatically when an order is placed.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e4dfd3] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#e4dfd3] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-[#e4dfd3] last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    {c.email}
                    <span className="block text-xs text-muted-foreground">{c.phone}</span>
                  </td>
                  <td className="px-4 py-3">{c.city}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3">{formatINR(c.spent)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
