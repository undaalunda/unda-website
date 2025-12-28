//AdminPasswordModal.tsx

'use client';

import { useState, KeyboardEvent } from 'react';

type AdminPasswordModalProps = {
  onSubmit: (password: string) => void;
  error?: string | null;
};

export default function AdminPasswordModal({ onSubmit, error }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) return;
    onSubmit(password.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a0000] p-6 rounded-xl text-[#f8fcdc] w-full max-w-sm shadow-xl">
        <h2 className="text-xl mb-4 font-semibold">Enter Admin Password</h2>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded bg-black/20 border border-[#f8fcdc]/30 text-[#f8fcdc] placeholder-[#f8fcdc]/40 focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#f8fcdc]/60 hover:text-[#f8fcdc] text-sm cursor-pointer"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#dc9e63] hover:bg-[#f8cfa3] text-black font-semibold text-sm cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}