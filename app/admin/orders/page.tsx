// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';

interface Order {
  id: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
  billing_info: {
    firstName?: string;
    lastName?: string;
  };
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // 🔐 Login
  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'Alunda1999.') {
      setAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('❌ Wrong password!');
    }
  };

  // 📦 โหลด orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .eq('status', 'pending_shipment')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading orders:', error);
        alert('Failed to load orders');
      } else {
        setOrders(data || []);
        console.log('✅ Loaded orders:', data?.length);
      }
    } catch (err) {
      console.error('🔥 Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🚚 อัพเดท tracking
  const updateTracking = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber || trackingNumber.trim() === '') {
      alert('⚠️ Please enter a tracking number');
      return;
    }

    const confirmed = confirm(
      `Update tracking for order ${orderId.substring(0, 8)}... with:\n${trackingNumber}?`
    );

    if (!confirmed) return;

    setUpdatingOrderId(orderId);

    try {
      // 1️⃣ อัพเดท Supabase
      console.log('📝 Updating order:', orderId);
      const { error: updateError } = await supabase
        .from('Orders')
        .update({
          tracking_number: trackingNumber,
          tracking_url: `https://track.dhl.com/${trackingNumber}`,
          status: 'shipped',
          shipped_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      console.log('✅ Order updated in Supabase');

      // 2️⃣ ส่ง email
      console.log('📧 Sending email notification...');
      const emailResponse = await fetch('/api/send-shipping-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      console.log('✅ Email sent successfully');

      alert('✅ Tracking updated and email sent!');

      // 3️⃣ Reload orders
      loadOrders();

    } catch (error) {
      console.error('🔥 Error updating tracking:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 🔄 Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // 📥 Load orders when authenticated
  useEffect(() => {
    if (authenticated) {
      loadOrders();
    }
  }, [authenticated]);

  // 🚪 Logout
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setPassword('');
  };

  // 🔒 Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#f8fcdc] font-[Cinzel] p-4">
        <div className="w-full max-w-md bg-[#160000] border border-[#dc9e63]/30 rounded-xl p-8">
          <h1 className="text-2xl mb-6 text-center text-[#dc9e63]">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            className="w-full border border-[#dc9e63]/50 bg-black text-[#f8fcdc] p-3 rounded-lg mb-4 focus:outline-none focus:border-[#dc9e63]"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#dc9e63] text-black font-bold py-3 rounded-lg hover:bg-[#f8cfa3] transition cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // 📦 Orders screen
  return (
    <div className="min-h-screen bg-black text-[#f8fcdc] font-[Cinzel] p-4 md:p-8">
      <div className="max-w-6xl mx-auto pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#dc9e63]">Pending Shipments</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-[#f8fcdc]/70 hover:text-[#dc9e63] underline cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={loadOrders}
          disabled={loading}
          className="mb-6 px-4 py-2 bg-[#dc9e63]/20 border border-[#dc9e63]/50 text-[#dc9e63] rounded-lg hover:bg-[#dc9e63]/30 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>

        {/* Orders count */}
        <p className="mb-6 text-sm text-[#f8fcdc]/70">
          {orders.length} order{orders.length !== 1 ? 's' : ''} pending shipment
        </p>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="text-center py-12 text-[#f8fcdc]/50">
            <p className="text-lg">✅ No pending shipments</p>
            <p className="text-sm mt-2">All orders have been processed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#160000] border border-[#dc9e63]/30 rounded-lg p-6 hover:border-[#dc9e63]/50 transition"
              >
                {/* Order info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[#f8fcdc]/50 mb-1">Order ID</p>
                    <p className="text-sm font-mono">{order.id.substring(0, 13)}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#f8fcdc]/50 mb-1">Customer</p>
                    <p className="text-sm">
                      {order.billing_info?.firstName} {order.billing_info?.lastName}
                    </p>
                    <p className="text-xs text-[#f8fcdc]/70">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#f8fcdc]/50 mb-1">Amount</p>
                    <p className="text-lg font-bold text-[#dc9e63]">
                      ${(order.amount / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#f8fcdc]/50 mb-1">Created</p>
                    <p className="text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs text-[#f8fcdc]/50 mb-2">Items</p>
                  <div className="text-sm text-[#f8fcdc]/90">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-1">
                        <span>{item.title} - {item.subtitle}</span>
                        <span>x{item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking input */}
                <div className="border-t border-[#dc9e63]/20 pt-4">
                  <label className="block text-xs text-[#f8fcdc]/50 mb-2">
                    DHL Tracking Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="DHL123456789"
                      className="flex-1 border border-[#dc9e63]/50 bg-black text-[#f8fcdc] px-4 py-2 rounded-lg focus:outline-none focus:border-[#dc9e63]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          updateTracking(order.id, input.value);
                          input.value = '';
                        }
                      }}
                      disabled={updatingOrderId === order.id}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        updateTracking(order.id, input.value);
                        input.value = '';
                      }}
                      disabled={updatingOrderId === order.id}
                      className="px-6 py-2 bg-[#dc9e63] text-black font-bold rounded-lg hover:bg-[#f8cfa3] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {updatingOrderId === order.id ? '⏳' : '📦 Ship'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}