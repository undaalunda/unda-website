'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { memo } from 'react';

type Order = {
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

// Memoized courier tracking URL generator
const getCourierTrackingUrl = (courier: string, number: string): string => {
  const map: Record<string, string> = {
    dhl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${number}`,
    kerry: `https://th.kerryexpress.com/en/track/?track=${number}`,
    ems: `https://track.thailandpost.co.th/?trackNumber=${number}`,
  };
  return map[courier.toLowerCase()] || '#';
};

// Memoized Loading Component
const LoadingState = memo(() => (
  <div 
    className="pt-44 text-center" 
    role="status" 
    aria-label="Loading order information"
  >
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc9e63] mb-4"></div>
    <p className="text-[#f8fcdc]/70">Loading order...</p>
  </div>
));
LoadingState.displayName = 'LoadingState';

// Memoized Error Component
const ErrorState = memo(({ error }: { error: string }) => (
  <div 
    className="pt-44 text-center text-red-400" 
    role="alert" 
    aria-live="polite"
  >
    <div className="max-w-md mx-auto p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Error</h2>
      <p>{error}</p>
    </div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Memoized Order Item Component
const OrderItem = memo(({ item, index }: { item: any; index: number }) => (
  <li key={index} className="flex justify-between items-center py-1">
    <span>{item.title}</span>
    <span className="text-[#dc9e63] font-medium">×{item.quantity}</span>
  </li>
));
OrderItem.displayName = 'OrderItem';

// Memoized Tracking Link Component
const TrackingLink = memo(({ courier, trackingNumber }: { courier: string; trackingNumber: string }) => {
  const trackingUrl = useMemo(() => 
    getCourierTrackingUrl(courier, trackingNumber), 
    [courier, trackingNumber]
  );

  return (
    <a
      href={trackingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#f8cfa3] underline hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
      aria-label={`Track package ${trackingNumber} with ${courier}`}
    >
      {trackingNumber}
    </a>
  );
});
TrackingLink.displayName = 'TrackingLink';

export default function OrderStatusClient() {
  const searchParams = useSearchParams();

  // Memoized search params extraction
  const { email, id } = useMemo(() => ({
    email: searchParams?.get('email') || '',
    id: searchParams?.get('id') || ''
  }), [searchParams]);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function with useCallback
  const fetchOrder = useCallback(async () => {
    if (!email || !id) {
      setError('Missing email or order ID in URL parameters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/order-status?email=${encodeURIComponent(email)}&id=${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Order not found' : 'Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data.order);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [email, id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Memoized formatted date
  const formattedDate = useMemo(() => 
    order ? new Date(order.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '',
    [order?.created_at]
  );

  // Memoized status badge color
  const statusColor = useMemo(() => {
    if (!order) return '';
    const status = order.payment_status.toLowerCase();
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-[#f8fcdc]/50';
    }
  }, [order?.payment_status]);

  // Memoized order items list
  const orderItemsList = useMemo(() => 
    order?.items.map((item, index) => (
      <OrderItem key={`${item.title}-${index}`} item={item} index={index} />
    )) || [],
    [order?.items]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!order) return null;

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Order",
            "orderNumber": id,
            "orderStatus": "https://schema.org/OrderStatus",
            "orderDate": order.created_at,
            "customer": {
              "@type": "Person",
              "email": order.email
            },
            "totalPrice": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": order.amount
            },
            "orderedItem": order.items.map(item => ({
              "@type": "OrderItem",
              "orderQuantity": item.quantity,
              "orderedItem": {
                "@type": "Product",
                "name": item.title
              }
            }))
          })
        }}
      />

      <main className="pt-44 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#dc9e63]">Order Details</h1>
          <p className="text-[#f8fcdc]/60">Order #{id}</p>
        </header>

        <article className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-8 rounded-lg shadow-lg space-y-6">
          {/* Customer Information */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-[#dc9e63] border-b border-[#f8fcdc]/10 pb-2">
              Customer Information
            </h2>
            <dl className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="font-medium">Email:</dt>
                <dd className="text-[#f8fcdc]/70 break-all">{order.email}</dd>
              </div>
            </dl>
          </section>

          {/* Order Summary */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-[#dc9e63] border-b border-[#f8fcdc]/10 pb-2">
              Order Summary
            </h2>
            <dl className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="font-medium">Total Amount:</dt>
                <dd className="text-[#f8fcdc]/70 text-xl font-bold">
                  ${order.amount.toFixed(2)}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="font-medium">Status:</dt>
                <dd className={`font-semibold uppercase tracking-wide ${statusColor}`}>
                  {order.payment_status}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="font-medium">Order Date:</dt>
                <dd className="text-[#f8fcdc]/70">{formattedDate}</dd>
              </div>
            </dl>
          </section>

          {/* Shipping Information */}
          {(order.shipping_method || order.shipping_zone) && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-[#dc9e63] border-b border-[#f8fcdc]/10 pb-2">
                Shipping Information
              </h2>
              <dl className="space-y-2">
                {order.shipping_method && (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium">Shipping Method:</dt>
                    <dd className="text-[#f8fcdc]/70">{order.shipping_method}</dd>
                  </div>
                )}
                {order.shipping_zone && (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium">Shipping Zone:</dt>
                    <dd className="text-[#f8fcdc]/70">{order.shipping_zone}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* Order Items */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-[#dc9e63] border-b border-[#f8fcdc]/10 pb-2">
              Order Items
            </h2>
            <ul className="space-y-2 bg-[#1a0000]/40 p-4 rounded-md border border-[#f8fcdc]/10">
              {orderItemsList}
            </ul>
          </section>

          {/* Tracking Information */}
          {order.tracking_number && order.courier && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-[#dc9e63] border-b border-[#f8fcdc]/10 pb-2">
                Tracking Information
              </h2>
              <div className="bg-[#1a0000]/40 p-4 rounded-md border border-[#f8fcdc]/10">
                <p className="mb-2">
                  <span className="font-medium">Courier:</span>{' '}
                  <span className="text-[#f8fcdc]/70 capitalize">{order.courier}</span>
                </p>
                <p>
                  <span className="font-medium">Tracking Number:</span>{' '}
                  <TrackingLink courier={order.courier} trackingNumber={order.tracking_number} />
                </p>
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  );
}