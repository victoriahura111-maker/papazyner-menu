// ============================================
// PAPAZYNER'S - HEADER COMPONENT
// ============================================

import React, { useState } from 'react';

interface HeaderProps {
  restaurantName: string;
  tagline: string;
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({
  restaurantName,
  tagline,
  cartCount,
  onCartClick,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner container">
        <div className="brand">
          <h1 className="brand-name gothic">{restaurantName}</h1>
          <p className="brand-tagline script">{tagline}</p>
        </div>
        <button
          className="cart-btn"
          onClick={onCartClick}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </button>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 13, 13, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 2px solid var(--color-gold, #D4AF37);
          padding: var(--space-md, 16px) 0;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-name {
          font-size: 1.5rem;
          color: var(--color-gold, #D4AF37);
          letter-spacing: 0.02em;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          line-height: 1.2;
        }
        .brand-tagline {
          font-size: 0.9rem;
          color: var(--color-text-secondary, #E0E0E0);
          margin-top: 2px;
        }
        .cart-btn {
          position: relative;
          background: none;
          border: 2px solid var(--color-gold, #D4AF37);
          color: var(--color-gold, #D4AF37);
          border-radius: var(--radius-md, 8px);
          padding: var(--space-sm, 8px) var(--space-md, 16px);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-xs, 4px);
          transition: all var(--transition-fast, 150ms ease);
          flex-shrink: 0;
        }
        .cart-btn:hover,
        .cart-btn:focus-visible {
          background: var(--color-gold, #D4AF37);
          color: var(--color-bg, #0D0D0D);
          outline: none;
        }
        .cart-btn:active {
          transform: scale(0.96);
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-red, #E31E24);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          animation: fadeIn 0.2s ease;
        }

        @media (max-width: 380px) {
          .brand-name {
            font-size: 1.2rem;
          }
          .brand-tagline {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}
