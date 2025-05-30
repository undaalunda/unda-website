// app/thank-you/ThankYouClient.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 🧠 EMAIL LINK FUNCTION
function getEmailLink(email: string) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return `mailto:${email}`;

  if (domain.includes('gmail') || domain.includes('googlemail')) return 'https://mail.google.com/';
  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live') || domain.includes('msn')) return 'https://outlook.live.com/mail/';
  if (domain.includes('yahoo') || domain.includes('ymail') || domain.includes('rocketmail')) return 'https://mail.yahoo.com/';
  if (domain.includes('icloud') || domain.includes('me.com') || domain.includes('mac.com')) return 'https://www.icloud.com/mail/';
  if (domain.includes('aol')) return 'https://mail.aol.com/';
  if (domain.includes('zoho')) return 'https://mail.zoho.com/';
  if (domain.includes('proton')) return 'https://mail.proton.me/u/0/inbox';
  if (domain.includes('gmx')) return 'https://www.gmx.com/';
  if (domain.includes('mail.com')) return 'https://www.mail.com/';
  if (domain.includes('yandex')) return 'https://mail.yandex.com/';
  if (domain.includes('tutanota')) return 'https://mail.tutanota.com/';
  if (domain.includes('fastmail')) return 'https://www.fastmail.com/mail/';
  if (domain.includes('hushmail')) return 'https://secure.hushmail.com/';

  return `mailto:${email}`;
}

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

  // Check if order has digital products
  const hasDigitalProducts = data.items?.some((item: any) => item.type === 'digital' || item.category === 'Backing Track');
  const hasPhysicalProducts = data.items?.some((item: any) => item.type === 'physical');
  const isDigitalOnly = hasDigitalProducts && !hasPhysicalProducts;

  return (
    <main className="pt-44 px-6 max-w-2xl mx-auto text-[#f8fcdc] font-[Cinzel]">
      <h1 className="text-3xl font-bold mb-6 text-[#dc9e63]">Thank you for your order!</h1>
      <div className="bg-[#1a0000]/60 border border-[#f8fcdc]/20 p-6 rounded-md space-y-3">
        <p><strong>Email:</strong> <span className="text-[#f8fcdc]/50">{data.email}</span></p>
        <p><strong>Order ID:</strong> <span className="text-[#f8fcdc]/50">{orderId}</span></p>
        <p><strong>Date:</strong> 
          <span className="text-[#f8fcdc]/50">
            {new Date(data.created_at).toLocaleString('th-TH', {
              timeZone: 'Asia/Bangkok',
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </p>
        
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
            {data.payment_status === 'succeeded' ? 'PAID' : 
             data.payment_status === 'pending' ? '⏳ PROCESSING' : 
             data.payment_status?.toUpperCase()}
          </span>
        </p>

        <p><strong>Amount:</strong> ${(data.amount / 100).toFixed(2)}</p>
        
        {/* ✅ แสดง Shipping Method ตาม product type */}
        {!isDigitalOnly && (
          <>
            <p><strong>Shipping Method:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_method || 'Standard Delivery'}</span></p>
            <p><strong>Shipping Zone:</strong> <span className="text-[#f8fcdc]/50">{data.shipping_zone || 'Processing'}</span></p>
          </>
        )}
        
        {/* ✅ แสดง Order Type สำหรับ Digital Only */}
        {isDigitalOnly && (
          <p><strong>Order Type:</strong> <span className="text-[#f8fcdc]/50">Digital Download</span></p>
        )}

        <div>
          <strong>Items:</strong>
          <ul className="list-disc ml-5 mt-2 text-sm text-[#f8fcdc]/50">
            {data.items.map((item: any, i: number) => (
              <li key={i}>
                {item.title} x {item.quantity}
                {item.type === 'digital' && <span className="text-[#dc9e63] ml-1">(Digital)</span>}
              </li>
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-green-200">
                  <strong>Payment Confirmed</strong><br/>
                  {isDigitalOnly 
                    ? <>Check your email <a href={getEmailLink(data.email)} target="_blank" rel="noopener noreferrer" className="underline text-[#f8cfa3] hover:text-[#dc9e63]">{data.email}</a> for download links.</>
                    : hasDigitalProducts && hasPhysicalProducts
                    ? <>Check your email <a href={getEmailLink(data.email)} target="_blank" rel="noopener noreferrer" className="underline text-[#f8cfa3] hover:text-[#dc9e63]">{data.email}</a> for download links and shipping details.</>
                    : <>Check your email <a href={getEmailLink(data.email)} target="_blank" rel="noopener noreferrer" className="underline text-[#f8cfa3] hover:text-[#dc9e63]">{data.email}</a> for order confirmation and shipping details.</>
                  }
                </p>
                {/* ✅ Digital download note - เล็กและจางลง */}
                {hasDigitalProducts && (
                  <p className="text-xs text-[#f8fcdc]/40 mt-1">
                    Download links expire in 1 hour
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Tracking info สำหรับ physical products */}
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