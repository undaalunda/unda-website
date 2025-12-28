/* CartErrorPopup.tsx */

'use client';

import { useEffect, useState } from 'react';

interface CartErrorPopupProps {
  message: string;
}

export default function CartErrorPopup({ message }: CartErrorPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // หายไปใน 3 วิ
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="cart-error-popup">
      {message}
    </div>
  );
}