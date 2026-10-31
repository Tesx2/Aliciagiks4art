import React, { useState } from 'react';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';

interface CloudflareTurnstileProps {
  onVerify: (verified: boolean) => void;
  verified: boolean;
}

export const CloudflareTurnstile: React.FC<CloudflareTurnstileProps> = ({
  onVerify,
  verified,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (verified || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify(true);
    }, 600);
  };

  return (
    <div
      onClick={handleVerify}
      className={`select-none cursor-pointer rounded-lg border transition-all duration-200 p-3 flex items-center justify-between gap-4 max-w-sm ${
        verified
          ? 'bg-neutral-50/90 border-emerald-300 shadow-2xs'
          : 'bg-white border-neutral-300 hover:border-neutral-400 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
            verified
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-neutral-400'
          }`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />
          ) : verified ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : null}
        </div>

        <span className="text-xs font-medium text-neutral-800">
          {loading
            ? 'Verifying human challenge...'
            : verified
            ? 'Success — Verified Human'
            : 'Verify you are human'}
        </span>
      </div>

      {/* Cloudflare Badge */}
      <div className="flex flex-col items-end shrink-0">
        <div className="flex items-center gap-1">
          {/* Cloudflare cloud SVG icon */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#F38020]" aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
          <span className="text-2xs font-bold text-neutral-800 tracking-tight">Cloudflare</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">Turnstile Privacy</span>
      </div>
    </div>
  );
};
