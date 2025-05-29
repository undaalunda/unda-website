// app/thank-you/ThankYouClient.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ThankYouClient() {
  const params = useSearchParams();
  const email = params?.get('email') || '';
  const orderId = params?.get('orderId') || '';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!email || !orderId) {
      setError('Missing email or order ID.');
      setLoading(false);
      return;
    }

    const maxAttempts = 15; // ✅ เพิ่มจาก 12 → 15
    const delay = 2000; // ✅ เพิ่มจาก 1500 → 2000ms

    const poll = async () => {
      try {
        console.log(`🔁 Polling Attempt ${attempts + 1} for order:`, { email, orderId });

        const timestamp = Date.now(); // ✅ Cache buster
        const res = await fetch(`/api/order-status?email=${email}&id=${orderId}&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        const json = await res.json();
        const status = json.order?.payment_status;

        if (!status) throw new Error('No payment_status in response');

        console.log(`📊 Order status: ${status}, attempt: ${attempts + 1}/${maxAttempts}`);

        if (status === 'succeeded') {
          console.log('✅ Payment succeeded! Order is complete.');
          setData(json.order);
          setLoading(false);
        } else if (status === 'pending') {
          console.log(`⏳ Still pending (${status}), retrying...`);

          if (attempts < maxAttempts - 1) {
            setTimeout(() => {
              setAttempts((a) => a + 1);
            }, delay);
          } else {
            console.warn('⚠️ Max retry attempts reached. Showing current data.');
            // ✅ แสดงข้อมูลปัจจุบัน แม้จะยัง pending
            setData(json.order);
            setLoading(false);
          }
        } else {
          // สถานะอื่นๆ (failed, canceled, etc.)
          console.log(`🔴 Payment status: ${status}`);
          setData(json.order);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('💥 Fetch error:', err);
        
        if (attempts < maxAttempts - 1) {
          // ถ้ายัง retry ได้ ให้ลองใหม่
          setTimeout(() => {
            setAttempts((a) => a + 1);
          }, delay);
        } else {
          setError('Unable to load order details. Please check your email for confirmation.');
          setLoading(false);
        }
      }
    };

    // ✅ เริ่มต้นด้วย delay ที่นานขึ้น เพื่อให้ webhook มีเวลา
    const initialDelay = attempts === 0 ? 3000 : delay; // 3 วินาทีครั้งแรก
    const timeout = setTimeout(poll, initialDelay);

    return () => clearTimeout(timeout);
  }, [attempts, email, orderId]);

  if (loading) {
    return (
      <div className="pt-44 text-center text-[#f8fcdc] font-[Cinzel]">
        <div className="animate-pulse">
          <h2 className="text-xl mb-2">Processing your order...</h2>
          <p className="text-sm text-[#f8fcdc]/60">
            Please wait while we confirm your payment
            {attempts > 0 && ` (${attempts + 1}/15)`}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-44 text-center text-red-400 font-[Cinzel]">
        <h2 className="text-xl mb-2">Order Status Unavailable</h2>
        <p className="text-sm">{error}</p>
        <p className="text-xs text-[#f8fcdc]/60 mt-2">
          Please check your email for order confirmation.
        </p>
      </div>
    );
  }

  return (
    <main className="pt-44 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      <h1 className="text-3xl font-bold mb-6 text-[#dc9e63]">Thank you for your order!</h1>
      <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-md space-y-3">
        <p><strong>Email:</strong> <span className="text-[#f8fcdc]/50">{data.email}</span></p>
        <p><strong>Order ID:</strong> <span className="text-[#f8fcdc]/50">{orderId}</span></p>
        <p><strong>Date:</strong> <span className="text-[#f8fcdc]/50">{new Date(data.created_at).toLocaleString()}</span></p>
        
        {/* ✅ สถานะแสดงผลให้ชัดเจนขึ้น */}
        <p>
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            data.payment_status === 'succeeded' 
              ? 'bg-green-600 text-white' 
              : data.payment_status === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-600 text-white'
          }`}>
            {data.payment_status === 'succeeded' ? '✅ PAID' : 
             data.payment_status === 'pending' ? '⏳ PROCESSING' : 
             data.payment_status?.toUpperCase()}
          </span>
        </p>

        <p><strong>Amount:</strong> ${(data.amount / 100).toFixed(2)}</p>
        <p><strong>Shipping Method:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_method || 'Digital Delivery'}</span></p>
        <p><strong>Shipping Zone:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_zone || 'N/A'}</span></p>

        <div>
          <strong>Items:</strong>
          <ul className="list-disc ml-5 mt-2 text-sm text-[#f8fcdc]/50">
            {data.items.map((item: any, i: number) => (
              <li key={i}>{item.title} x {item.quantity}</li>
            ))}
          </ul>
        </div>

        {/* ✅ ข้อความสำหรับ pending */}
        {data.payment_status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded">
            <p className="text-sm text-yellow-200">
              <strong>⏳ Payment Processing</strong><br/>
              Your payment is being confirmed. You'll receive an email once complete.
            </p>
          </div>
        )}

        {/* ✅ ข้อความสำหรับ succeeded */}
        {data.payment_status === 'succeeded' && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded">
            <p className="text-sm text-green-200">
              <strong>✅ Payment Confirmed</strong><br/>
              Check your email for download links and order details.
            </p>
          </div>
        )}

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