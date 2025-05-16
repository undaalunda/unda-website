// /app/thank-you/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  email: string;
  amount: number;
  created_at: string;
  items: any[];
  payment_status: string;
  tracking_number?: string;
  courier?: string;
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !id) {
      setError('Missing order information.');
      setLoading(false);
      return;
    }

    fetch(`/api/order-status?email=${email}&id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Order not found.');
        return res.json();
      })
      .then(data => {
        setOrder(data.order);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email, id]);

  return (
    <main className="min-h-screen pt-32 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel] text-center">
      <h1 className="text-3xl font-bold mb-6 text-[#dc9e63]">Thank you for your order!</h1>

      {loading && <p className="opacity-70">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {order && (
        <div className="text-left space-y-4 bg-[#1a0000]/50 p-6 rounded-xl border border-[#f8fcdc]/20 shadow-lg">
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Order ID:</strong> {id}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.payment_status.toUpperCase()}</p>
          <p><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>

          <div>
            <strong>Items:</strong>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {order.items.map((item, i) => (
                <li key={i}>{item.title} x {item.quantity}</li>
              ))}
            </ul>
          </div>

          {order.tracking_number && (
            <div className="mt-4">
              <strong>Tracking:</strong>{' '}
              <a
                href={getTrackingUrl(order.courier || 'dhl', order.tracking_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#dc9e63] underline underline-offset-2 hover:text-[#f8cfa3]"
              >
                View tracking on {order.courier?.toUpperCase() || 'DHL'}
              </a>
            </div>
          )}
        </div>
      )}

      <a
        href="/"
        className="mt-8 inline-block px-6 py-3 border border-[#dc9e63] text-[#dc9e63] rounded-xl hover:bg-[#dc9e63] hover:text-black transition"
      >
        Back to home
      </a>
    </main>
  );
}

function getTrackingUrl(courier: string, trackingNumber: string): string {
  const map: Record<string, string> = {
    dhl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${trackingNumber}`,
    kerry: `https://th.kerryexpress.com/en/track/?track=${trackingNumber}`,
    ems: `https://track.thailandpost.co.th/?track-number=${trackingNumber}`,
  };
  return map[courier.toLowerCase()] || '#';
}