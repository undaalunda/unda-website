// app/admin/orders/page.tsx

'use client';

import { useEffect, useState } from 'react';

type Order = {
  email: string;
  amount: number;
  payment_status: string;
  created_at: string;
  items: any;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basicAuth = btoa(prompt('🔒 Enter admin password:') || '');
    fetch('/api/admin/orders', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    const headers = ['email', 'amount', 'payment_status', 'created_at'];
    const rows = orders.map((o) => [o.email, o.amount, o.payment_status, o.created_at]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-screen-md mx-auto">
      <div className="flex justify-between items-center border-b border-white/20 pb-5 mb-8">
        <h1 className="text-2xl font-bold tracking-wide">📦 All Orders</h1>
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          📤 Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-lg mt-20">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 text-center">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 bg-[#1a1a1a]">
              <div className="text-lg font-semibold">{order.email}</div>
              <div>💰 Amount: ${order.amount.toFixed(2)}</div>
              <div>📦 Status: {order.payment_status}</div>
              <div className="text-sm text-gray-400">
                🕒 Created: {new Date(order.created_at).toLocaleString()}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-400">📄 View Items</summary>
                <pre className="mt-2 bg-black text-green-400 p-3 rounded overflow-x-auto text-sm">
                  {JSON.stringify(order.items, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}