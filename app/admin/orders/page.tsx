// app/admin/orders/page.tsx

'use client';

import { useEffect, useState } from 'react';
import AdminPasswordModal from '@/components/AdminPasswordModal';

type Order = {
  email: string;
  amount: number;
  payment_status: string;
  created_at: string;
  items?: any;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const ordersPerPage = 10;

  const handlePasswordSubmit = (password: string) => {
    const basicAuth = btoa(`admin:${password.trim()}`);
    setLoading(true);
    fetch('/api/admin/orders', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
        setShowPasswordModal(false);
        setAuthError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setAuthError('Invalid password');
        setLoading(false);
      });
  };

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = orders.filter((o) =>
      o.email.toLowerCase().includes(lower) ||
      o.payment_status.toLowerCase().includes(lower) ||
      JSON.stringify(o.items).toLowerCase().includes(lower)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const exportCSV = () => {
    const headers = ['email', 'amount', 'payment_status', 'created_at'];
    const rows = filteredOrders.map((o) => [o.email, o.amount, o.payment_status, o.created_at]);
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
  };

  if (showPasswordModal) {
    return <AdminPasswordModal onSubmit={handlePasswordSubmit} error={authError} />;
  }

return (
  <main className={`min-h-screen pt-64 pb-24 px-6 max-w-3xl mx-auto text-[#f8fcdc] font-[Cinzel] ${showPasswordModal ? 'opacity-0 pointer-events-none select-none' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-[#f8fcdc]/20 pb-4 mb-6 gap-4">
        <h1 className="text-2xl font-bold tracking-wider text-[#dc9e63]">ADMIN ORDERS</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by email, status, or item"
            className="w-[230px] px-3 py-2 rounded bg-[#1a0000]/50 border border-[#f8fcdc]/20 text-[#f8fcdc] placeholder-[#f8fcdc]/20 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={exportCSV}
            className="bg-[#dc9e63] hover:bg-[#f8cfa3] text-black font-bold px-4 py-2 rounded-xl shadow transition-colors duration-200 cursor-pointer"
          >
            EXPORT CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg mt-20 text-[#f8fcdc]/50">Loading orders...</div>
      ) : error ? (
        <div className="text-red-400 text-center">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-[#f8fcdc]/60 text-center">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order, index) => (
            <div key={index} className="border border-[#f8fcdc]/10 rounded-xl p-4 bg-[#1a0000]/50 shadow-sm">
              <div className="text-base font-semibold text-[#f8fcdc]">{order.email}</div>
              <div className="text-sm text-[#dc9e63]">${order.amount.toFixed(2)}</div>
              <div className="text-sm">Status: <span className="uppercase">{order.payment_status}</span></div>
              <div className="text-xs text-[#f8fcdc]/50">
                {new Date(order.created_at).toLocaleString()}
              </div>
              {order.items && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[#f8cfa3] underline underline-offset-4 hover:opacity-80">View Items</summary>
                  <pre className="mt-2 bg-[#2a0000] text-[#f8fcdc] p-3 rounded-xl overflow-x-auto text-sm">
                    {JSON.stringify(order.items, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}

          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#dc9e63] text-black border-[#dc9e63]'
                    : 'border-[#f8fcdc]/20 text-[#f8fcdc] hover:bg-[#dc9e63]/20 hover:border-[#dc9e63]/30'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}