// app/order-status/OrderStatusClient.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Order = {
  id: string;
  email: string;
  amount: number;
  payment_status: string;
  created_at: string;
  items: any[];
  tracking_number?: string;
  courier?: string;
  shipping_method?: string;
  shipping_zone?: string;
};

type ViewMode = 'form' | 'single_order' | 'admin_orders';

// Main form component - choose between customer lookup or admin access
const MainForm = ({ onCustomerSubmit, onAdminSubmit }: { 
  onCustomerSubmit: (email: string, orderId: string) => void;
  onAdminSubmit: (password: string) => void;
}) => {
  const [mode, setMode] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCustomerSubmit = () => {
    if (email.trim() && orderId.trim()) {
      onCustomerSubmit(email.trim(), orderId.trim());
    }
  };

  const handleAdminSubmit = () => {
    if (password.trim()) {
      onAdminSubmit(password.trim());
    }
  };

  return (
    <div className="pt-32 md:pt-44 px-6 max-w-md mx-auto">
     <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 md:p-8 rounded-lg shadow-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#dc9e63] text-center font-[Cinzel]">
          Track Your Orders
        </h1>
        
        {/* Mode Toggle */}
         <div className="flex mb-4 md:mb-6 bg-[#1a0000]/80 rounded-lg p-1">
          <button
            onClick={() => setMode('customer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              mode === 'customer' 
                ? 'bg-[#dc9e63] text-[#1a0000]' 
                : 'text-[#f8fcdc]/70 hover:text-[#f8fcdc]'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              mode === 'admin' 
                ? 'bg-[#dc9e63] text-[#1a0000]' 
                : 'text-[#f8fcdc]/70 hover:text-[#f8fcdc]'
            }`}
          >
            Admin
          </button>
        </div>

        {mode === 'customer' ? (
          // Customer Form
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f8fcdc] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a0000]/40 border border-[#f8fcdc]/20 rounded-md text-sm md:text-base text-[#f8fcdc] focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f8fcdc] mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a0000]/40 border border-[#f8fcdc]/20 rounded-md text-sm md:text-base text-[#f8fcdc] focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:border-transparent"
                placeholder="Enter your order ID"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomerSubmit()}
              />
            </div>
            
            <button
              onClick={handleCustomerSubmit}
              disabled={!email.trim() || !orderId.trim()}
              className="w-full bg-[#dc9e63] text-[#1a0000] py-2 md:py-3 px-4 rounded-md font-medium hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm md:text-base"
            >
              Track Order
            </button>
            
            <div className="mt-3 md:mt-4 text-center">
  <p className="text-[#f8fcdc]/60 text-xs md:text-sm">
                Enter the email and order ID from your purchase confirmation
              </p>
            </div>
          </div>
        ) : (
          // Admin Form
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f8fcdc] mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-[#1a0000]/40 border border-[#f8fcdc]/20 rounded-md text-[#f8fcdc] focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:border-transparent"
                  placeholder="••••••••"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#f8fcdc]/60 hover:text-[#f8fcdc] text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAdminSubmit}
              disabled={!password.trim()}
              className="w-full bg-[#dc9e63] text-[#1a0000] py-2 md:py-3 px-4 rounded-md font-medium hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm md:text-base"
            >
              Access Admin Panel
            </button>
            
            <div className="mt-3 md:mt-4 text-center">
  <p className="text-[#f8fcdc]/60 text-xs md:text-sm">
                View and manage all orders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading component
const LoadingState = () => (
  <div className="pt-32 md:pt-44 text-center" role="status" aria-label="Loading">
  <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-[#dc9e63] mb-3 md:mb-4"></div>
  <p className="text-[#f8fcdc]/70 text-sm md:text-base">Loading...</p>
  </div>
);

// Error component
const ErrorState = ({ error, onReset }: { error: string; onReset: () => void }) => (
  <div className="pt-32 md:pt-44 text-center text-red-400" role="alert" aria-live="polite">
  <div className="max-w-md mx-auto p-4 md:p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
    <h2 className="text-lg md:text-xl font-semibold mb-2">Error</h2>
    <p className="mb-3 md:mb-4 text-sm md:text-base">{error}</p>
    <button
      onClick={onReset}
      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-base"
      >
        Back to Home
      </button>
    </div>
  </div>
);

// Single order details display
const OrderDetails = ({ order, onBack }: { order: Order; onBack: () => void }) => {
  const formattedDate = useMemo(() => 
    new Date(order.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    [order.created_at]
  );

  const statusColor = useMemo(() => {
    const status = order.payment_status.toLowerCase();
    switch (status) {
      case 'paid':
      case 'completed':
      case 'succeeded':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-[#f8fcdc]/50';
    }
  }, [order.payment_status]);

  return (
    <main className="pt-32 md:pt-44 px-6 max-w-4xl mx-auto text-[#f8fcdc] font-[Cinzel]">
  <div className="mb-4 md:mb-6">
    <button
      onClick={onBack}
      className="text-[#dc9e63] hover:text-[#f8cfa3] transition-colors cursor-pointer text-sm md:text-base"
    >
      ← Back to Search
    </button>
  </div>

  <div className="text-center mb-6 md:mb-8">
    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#dc9e63]">Order Details</h1>
    <p className="text-[#f8fcdc]/60 text-sm md:text-base">Order #{order.id}</p>
  </div>

  <div className="space-y-4 md:space-y-6">
        {/* Customer Information */}
        <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-lg">
  <h2 className="text-xl font-semibold mb-4 text-[#dc9e63]">Customer Information</h2>
  <div className="flex justify-between">
    <span className="text-[#f8fcdc]/70">Email:</span>
    <span className="text-[#f8fcdc]">{order.email}</span>
  </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#dc9e63]">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#f8fcdc]/70">Total Amount:</span>
              <span className="text-xl font-bold text-[#f8fcdc]">${order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#f8fcdc]/70">Status:</span>
              <span className={`font-semibold uppercase tracking-wide ${statusColor}`}>
                {order.payment_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#f8fcdc]/70">Order Date:</span>
              <span className="text-[#f8fcdc]">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#dc9e63]">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-[#f8fcdc]/10 last:border-b-0">
                  <div>
                    <span className="text-[#f8fcdc]">{item.title || item.name || 'Unnamed Item'}</span>
                    {item.quantity && (
                      <span className="text-[#f8fcdc]/60 ml-2">×{item.quantity}</span>
                    )}
                  </div>
                  <div className="text-[#dc9e63] text-sm md:text-base">
  {item.price ? `$${Number(item.price).toFixed(2)}` : ''}
</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking Information */}
        {(order.tracking_number || order.courier) && (
          <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#dc9e63]">Tracking Information</h2>
            <div className="space-y-3">
              {order.courier && (
                <div className="flex justify-between">
                  <span className="text-[#f8fcdc]/70">Courier:</span>
                  <span className="text-[#f8fcdc] capitalize">{order.courier}</span>
                </div>
              )}
              {order.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-[#f8fcdc]/70">Tracking Number:</span>
                  <span className="text-[#f8fcdc] font-mono">{order.tracking_number}</span>
                </div>
              )}
              {order.shipping_method && (
                <div className="flex justify-between">
                  <span className="text-[#f8fcdc]/70">Shipping Method:</span>
                  <span className="text-[#f8fcdc] capitalize">{order.shipping_method}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// Admin orders list display
const AdminOrdersList = ({ orders, onBack, onOrderClick }: { 
  orders: Order[]; 
  onBack: () => void;
  onOrderClick: (order: Order) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const ordersPerPage = 12;

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.payment_status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      totalRevenue,
      succeeded: statusCounts.succeeded || 0,
      pending: statusCounts.pending || 0,
      failed: (statusCounts.failed || 0) + (statusCounts.cancelled || 0)
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return orders.filter((o) => {
      const matchesSearch = o.email.toLowerCase().includes(lower) ||
        o.payment_status.toLowerCase().includes(lower) ||
        o.id.toLowerCase().includes(lower) ||
        JSON.stringify(o.items).toLowerCase().includes(lower);
      
      const matchesStatus = filterStatus === 'all' || o.payment_status.toLowerCase() === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, orders, filterStatus]);

  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    switch (sortBy) {
      case 'amount':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'status':
        return sorted.sort((a, b) => a.payment_status.localeCompare(b.payment_status));
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [filteredOrders, sortBy]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const exportCSV = () => {
    const headers = ['id', 'email', 'amount', 'payment_status', 'created_at', 'items_count'];
    const rows = sortedOrders.map((o) => [
      o.id,
      o.email, 
      o.amount, 
      o.payment_status, 
      o.created_at,
      o.items?.length || 0
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'text-emerald-400 bg-emerald-400/10';
      case 'pending': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-red-400 bg-red-400/10';
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-[#dc9e63] hover:text-[#f8cfa3] transition-colors mb-4 md:mb-6 cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Login
        </button>

        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-2 text-[#dc9e63] tracking-wide">
            Order Management
          </h1>
          <p className="text-sm md:text-base text-[#f8fcdc]/60">Administrative dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-[#1a0000]/80 to-[#2a0000]/60 border border-[#f8fcdc]/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="text-lg md:text-2xl font-bold text-[#dc9e63]">{stats.total}</div>
          <div className="text-xs md:text-sm text-[#f8fcdc]/60">Total Orders</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a0000]/80 to-[#2a0000]/60 border border-[#f8fcdc]/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="text-lg md:text-2xl font-bold text-emerald-400">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-xs md:text-sm text-[#f8fcdc]/60">Total Revenue</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a0000]/80 to-[#2a0000]/60 border border-[#f8fcdc]/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="text-lg md:text-2xl font-bold text-emerald-400">{stats.succeeded}</div>
          <div className="text-xs md:text-sm text-[#f8fcdc]/60">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a0000]/80 to-[#2a0000]/60 border border-[#f8fcdc]/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="text-lg md:text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-xs md:text-sm text-[#f8fcdc]/60">Pending</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/10 rounded-xl p-4 md:p-6 mb-4 md:mb-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search orders, emails, or items..."
                className="w-full pl-4 pr-10 py-2 md:py-3 bg-[#0a0000]/50 border border-[#f8fcdc]/20 rounded-lg text-sm md:text-base text-[#f8fcdc] placeholder-[#f8fcdc]/40 focus:outline-none focus:ring-2 focus:ring-[#dc9e63]/50 focus:border-[#dc9e63]/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f8fcdc]/40">
                🔍
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 bg-[#0a0000]/50 border border-[#f8fcdc]/20 rounded-lg text-sm md:text-base text-[#f8fcdc] focus:outline-none focus:ring-2 focus:ring-[#dc9e63]/50 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="succeeded">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
              className="px-3 md:px-4 py-2 md:py-3 bg-[#0a0000]/50 border border-[#f8fcdc]/20 rounded-lg text-sm md:text-base text-[#f8fcdc] focus:outline-none focus:ring-2 focus:ring-[#dc9e63]/50 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="group bg-gradient-to-r from-[#dc9e63] to-[#f8cfa3] hover:from-[#f8cfa3] hover:to-[#dc9e63] text-black font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2 text-sm md:text-base">
              📊 Export CSV
            </span>
          </button>
        </div>

        {filteredOrders.length !== orders.length && (
          <div className="mt-3 md:mt-4 text-xs md:text-sm text-[#f8fcdc]/60">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>

      {/* Orders Grid */}
      {sortedOrders.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          <div className="text-4xl md:text-6xl mb-4 opacity-30">📦</div>
          <div className="text-lg md:text-xl text-[#f8fcdc]/60 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No orders found matching your criteria' : 'No orders yet'}
          </div>
          <div className="text-xs md:text-sm text-[#f8fcdc]/40">
            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Orders will appear here once customers make purchases'}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {currentOrders.map((order) => (
              <div 
                key={order.id} 
                className="group bg-gradient-to-br from-[#1a0000]/80 to-[#2a0000]/40 border border-[#f8fcdc]/10 rounded-xl p-4 md:p-5 cursor-pointer hover:border-[#dc9e63]/40 hover:shadow-lg hover:shadow-[#dc9e63]/10 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => onOrderClick(order)}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#f8fcdc] truncate text-xs md:text-sm">
                      {order.email}
                    </div>
                    <div className="text-xs text-[#f8fcdc]/50 font-mono">
                      #{order.id.slice(0, 8)}...
                    </div>
                  </div>
                  <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.payment_status)}`}>
                    {order.payment_status.toUpperCase()}
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-3 md:mb-4">
                  <div className="text-xl md:text-2xl font-bold text-[#dc9e63]">
                    ${order.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#f8fcdc]/50">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t border-[#f8fcdc]/10 pt-3">
                    <div className="text-xs text-[#f8fcdc]/60 mb-1">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs md:text-sm text-[#f8fcdc]/80 line-clamp-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="inline-block">
                          {item.title || 'Unnamed Item'}
                          {item.quantity && ` ×${item.quantity}`}
                          {idx < Math.min(order.items.length - 1, 1) && ', '}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[#dc9e63]"> +{order.items.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tracking Info */}
                {order.tracking_number && (
                  <div className="mt-3 pt-3 border-t border-[#f8fcdc]/10">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#f8fcdc]/60">📦</span>
                      <span className="text-[#dc9e63] font-mono truncate">{order.tracking_number}</span>
                    </div>
                  </div>
                )}

  
                
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 md:mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 md:px-4 py-2 rounded-lg border border-[#f8fcdc]/20 text-[#f8fcdc] hover:bg-[#dc9e63]/20 hover:border-[#dc9e63]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs md:text-sm"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#dc9e63] text-black'
                          : 'border border-[#f8fcdc]/20 text-[#f8fcdc] hover:bg-[#dc9e63]/20 hover:border-[#dc9e63]/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 md:px-4 py-2 rounded-lg border border-[#f8fcdc]/20 text-[#f8fcdc] hover:bg-[#dc9e63]/20 hover:border-[#dc9e63]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs md:text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default function OrderStatusClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = useMemo(() => searchParams?.get('email') || '', [searchParams]);
const orderId = useMemo(() => searchParams?.get('id') || '', [searchParams]);
const isAdmin = useMemo(() => searchParams?.get('admin') === 'true', [searchParams]);
const adminPwd = useMemo(() => searchParams?.get('pwd') || '', [searchParams]);

  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch single order (customer)
  const fetchSingleOrder = useCallback(async (emailParam: string, orderIdParam: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/order-status?email=${encodeURIComponent(emailParam)}&id=${encodeURIComponent(orderIdParam)}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Order not found. Please check your email and order ID.' : 'Failed to fetch order');
      }

      const data = await response.json();
      setCurrentOrder(data.order);
      setViewMode('single_order');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all orders (admin)
  const fetchAllOrders = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);

    try {
      const basicAuth = btoa(`admin:${password}`);
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.status === 403 ? 'Invalid admin password' : 'Failed to fetch orders');
      }

      const data = await response.json();
      setAllOrders(data.orders || []);
      setViewMode('admin_orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCustomerSubmit = useCallback((emailInput: string, orderIdInput: string) => {
    const newUrl = `/order-status?email=${encodeURIComponent(emailInput)}&id=${encodeURIComponent(orderIdInput)}`;
    router.push(newUrl);
    fetchSingleOrder(emailInput, orderIdInput);
  }, [router, fetchSingleOrder]);

  const handleAdminSubmit = useCallback((password: string) => {
  const newUrl = `/order-status?admin=true&pwd=${encodeURIComponent(password)}`;
  router.push(newUrl);
  fetchAllOrders(password);
}, [router, fetchAllOrders]);

  const handleBackToForm = useCallback(() => {
  setViewMode('form');
  setCurrentOrder(null);
  setAllOrders([]);
  setError(null);
  router.push('/order-status');
}, [router]);

  const handleOrderClick = useCallback((order: Order) => {
    setCurrentOrder(order);
    setViewMode('single_order');
  }, []);

  // Auto-fetch if URL has both email and order ID parameters
  useEffect(() => {
  if (email && orderId) {
    fetchSingleOrder(email, orderId);
  } else if (email && !orderId) {
    router.replace('/order-status');
  }
}, [email, orderId, fetchSingleOrder, router]);

useEffect(() => {
  if (isAdmin && adminPwd) {
    fetchAllOrders(adminPwd);
  }
}, [isAdmin, adminPwd, fetchAllOrders]);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onReset={handleBackToForm} />;

  switch (viewMode) {
    case 'single_order':
      return <OrderDetails order={currentOrder!} onBack={handleBackToForm} />;
    case 'admin_orders':
      return <AdminOrdersList orders={allOrders} onBack={handleBackToForm} onOrderClick={handleOrderClick} />;
    default:
      return <MainForm onCustomerSubmit={handleCustomerSubmit} onAdminSubmit={handleAdminSubmit} />;
  }
}