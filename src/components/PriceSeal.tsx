// ============================================
// PAPAZYNER'S - PRICE SEAL COMPONENT
// ============================================

import React from 'react';
import { formatNaira } from '@/utils/menuParser';

interface PriceSealProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceSeal({ price, size = 'md' }: PriceSealProps) {
  const sizeMap = {
    sm: { width: 56, height: 56, fontSize: 13 },
    md: { width: 68, height: 68, fontSize: 15 },
    lg: { width: 80, height: 80, fontSize: 17 },
  };

  const dims = sizeMap[size];

  return (
    <div className="price-seal" style={{ width: dims.width, height: dims.height }}>
      <svg
        viewBox="0 0 100 100"
        width={dims.width}
        height={dims.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
        aria-hidden="true"
      >
        {/* Starburst / sawtooth circle */}
        <path
          d="M50 5 L55 25 L75 15 L70 35 L90 30 L80 48 L98 55 L80 62 L90 80 L70 75 L55 95 L50 82 L45 95 L30 75 L10 80 L20 62 L2 55 L20 48 L10 30 L30 35 L25 15 L45 25 Z"
          fill="var(--color-gold, #D4AF37)"
          stroke="var(--color-bg, #0D0D0D)"
          strokeWidth="2"
        />
        {/* Inner circle for cleaner text placement */}
        <circle cx="50" cy="52" r="30" fill="none" />
      </svg>
      <span
        className="price-seal-text"
        style={{ fontSize: dims.fontSize }}
      >
        {formatNaira(price)}
      </span>

      <style jsx>{`
        .price-seal {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .price-seal-text {
          position: relative;
          z-index: 1;
          color: var(--color-bg, #0D0D0D);
          font-family: var(--font-body);
          font-weight: 800;
          text-align: center;
          line-height: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
