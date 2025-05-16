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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const password = prompt('🔒 Enter admin password:');
    if (!password) {
      setError('No password provided');
      setLoading(false);
      return;
    }

    const basicAuth = btoa(`admin:${password.trim()}`);

    fetch('/api/admin/orders', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`❌ ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch orders:', err);
        setError(err.message || 'Unknown error');
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
    <main className="min-h-screen pt-28 pb-24 px-6 max-w-3xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      <div className="flex justify-between items-center border-b border-[#f8fcdc]/20 pb-4 mb-10">
        <h1 className="text-2xl font-bold tracking-wider text-[#dc9e63]">📦 Admin Orders</h1>
        <button
          onClick={exportCSV}
          className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black font-bold px-4 py-2 rounded-xl shadow transition-colors duration-200 cursor-pointer"
        >
          📤 Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-lg mt-20 text-[#f8fcdc]/80">Loading orders...</div>
      ) : error ? (
        <div className="text-red-400 text-center">⚠️ {error}</div>
      ) : orders.length === 0 ? (
        <div className="text-[#f8fcdc]/60 text-center">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="border border-[#f8fcdc]/10 rounded-xl p-4 bg-[#1a0000]/50 shadow-sm">
              <div className="text-base font-semibold text-[#f8fcdc]">{order.email}</div>
              <div className="text-sm">
                💰 <span className="text-[#dc9e63]">${order.amount.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                📦 Status: <span className="uppercase">{order.payment_status}</span>
              </div>
              <div className="text-xs text-[#f8fcdc]/50">
                🕒 {new Date(order.created_at).toLocaleString()}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-[#f8cfa3] underline underline-offset-4">📄 View Items</summary>
                <pre className="mt-2 bg-[#2a0000] text-[#f8fcdc] p-3 rounded-xl overflow-x-auto text-sm">
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