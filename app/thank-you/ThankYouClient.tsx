// app/thank-you/ThankYouClient.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ThankYouClient() {
  const params = useSearchParams();
  const email = params.get('email');
  const id = params.get('id');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !id) {
      setError('Missing email or order ID.');
      setLoading(false);
      return;
    }

    fetch(`/api/order-status?email=${email}&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.order);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch order.');
        setLoading(false);
      });
  }, [email, id]);

  if (loading) return <div className="pt-44 text-center">Loading...</div>;
  if (error || !data) return <div className="pt-44 text-center text-red-400">{error}</div>;

  return (
    <main className="pt-44 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      <h1 className="text-3xl font-bold mb-6 text-[#dc9e63]">Thank you for your order!</h1>
      <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-md space-y-3">
        <p><strong>Email:</strong> <span className="text-[#f8fcdc]/50">{data.email}</span></p>
        <p><strong>Order ID:</strong> <span className="text-[#f8fcdc]/50">{id}</span></p>
        <p><strong>Date:</strong> <span className="text-[#f8fcdc]/50">{new Date(data.created_at).toLocaleString()}</span></p>
        <p><strong>Status:</strong> <span className="text-[#f8fcdc]/50">{data.payment_status}</span></p>
        <p><strong>Amount:</strong> <span className="text-[#f8fcdc]/50">${data.amount.toFixed(2)}</span></p>
        <p><strong>Shipping Method:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_method || 'N/A'}</span></p>
        <p><strong>Shipping Zone:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_zone || 'N/A'}</span></p>

        <div>
          <strong>Items:</strong>
          <ul className="list-disc ml-5 mt-2 text-sm text-[#f8fcdc]/50">
            {data.items.map((item: any, i: number) => (
              <li key={i}>{item.title} x {item.quantity}</li>
            ))}
          </ul>
        </div>

        {data.tracking_number && (
          <div className="pt-2 text-sm">
            <p><strong>Courier:</strong> <span className="text-[#f8fcdc]/50">{data.courier || 'DHL'}</span></p>
            <p><strong>Tracking Number:</strong> <span className="text-[#f8fcdc]/50">{data.tracking_number}</span></p>
            <a
              className="text-[#dc9e63] underline mt-1 inline-block"
              href={`https://www.dhl.com/global-en/home/tracking.html?tracking-id=${data.tracking_number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View tracking on DHL →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}