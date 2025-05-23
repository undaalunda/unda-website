//OrderStatusClient.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

export default function OrderStatusClient() {
  const params = useSearchParams();
  const email = params.get('email');
  const id = params.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !id) {
      setError('Missing email or order ID.');
      setLoading(false);
      return;
    }

    fetch(`/api/order-status?email=${email}&id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, [email, id]);

  if (loading) return <div className="pt-44 text-center">Loading order...</div>;
  if (error) return <div className="pt-44 text-center text-red-400">{error}</div>;
  if (!order) return null;

  return (
    <main className="pt-44 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      <h1 className="text-2xl font-bold mb-6 text-[#dc9e63]">Order Details</h1>

      <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-md space-y-3">
        <p><strong>Email:</strong> <span className="text-[#f8fcdc]/50">{order.email}</span></p>
        <p><strong>Amount:</strong> <span className="text-[#f8fcdc]/50">${order.amount.toFixed(2)}</span></p>
        <p><strong>Status:</strong> <span className="text-[#f8fcdc]/50">{order.payment_status.toUpperCase()}</span></p>
        <p><strong>Created:</strong> <span className="text-[#f8fcdc]/50">{new Date(order.created_at).toLocaleString()}</span></p>

        {order.shipping_method && (
          <p><strong>Shipping Method:</strong> <span className="text-[#f8fcdc]/50">{order.shipping_method}</span></p>
        )}
        {order.shipping_zone && (
          <p><strong>Shipping Zone:</strong> <span className="text-[#f8fcdc]/50">{order.shipping_zone}</span></p>
        )}

        <div>
          <strong>Items:</strong>
          <ul className="list-disc list-inside mt-1 text-[#f8fcdc]/50">
            {order.items.map((item, i) => (
              <li key={i}>{item.title} x {item.quantity}</li>
            ))}
          </ul>
        </div>

        {order.tracking_number && order.courier && (
          <div>
            <strong>Tracking:</strong>{' '}
            <a
              href={getCourierTrackingUrl(order.courier, order.tracking_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f8cfa3] underline hover:opacity-80"
            >
              {order.tracking_number}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function getCourierTrackingUrl(courier: string, number: string): string {
  const map: Record<string, string> = {
    dhl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${number}`,
    kerry: `https://th.kerryexpress.com/en/track/?track=${number}`,
    ems: `https://track.thailandpost.co.th/?trackNumber=${number}`,
  };
  return map[courier.toLowerCase()] || '#';
}