// ============================================
// PAPAZYNER'S - HEADER COMPONENT
// Always navigates to /cart page on cart tap
// ============================================

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  restaurantName: string;
  tagline: string;
  cartCount: number;
}

export default function Header({
  restaurantName,
  tagline,
  cartCount,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner container">
        {/* Brand — tap to go home */}
        <Link href="/" className="brand-link" aria-label="Go to menu">
          <h1 className="brand-name gothic">{restaurantName}</h1>
          <p className="brand-tagline script">{tagline}</p>
        </Link>

        {/* Cart — always navigates to /cart page */}
        <Link
          href="/cart"
          className="cart-btn"
          aria-label={`View cart, ${cartCount} items`}
        >
          <CartIcon />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </Link>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky, 100);
          background: rgba(13, 13, 13, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 2px solid var(--color-gold);
          padding: var(--space-3, 12px) 0;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
        }

        /* Brand */
        .brand-link {
          text-decoration: none;
          color: inherit;
          min-width: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .brand-name {
          font-size: var(--text-xl, 1.35rem);
          color: var(--color-gold);
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
          line-height: var(--leading-tight, 1.2);
          margin: 0;
        }
        .brand-tagline {
          font-size: var(--text-sm, 0.8rem);
          color: var(--color-text-secondary);
          margin-top: 1px;
        }

        /* Cart Link — styled like a button, works as a Link */
        .cart-btn {
          position: relative;
          background: none;
          border: 2px solid var(--color-gold);
          color: var(--color-gold);
          border-radius: var(--radius-md);
          padding: 10px 16px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          transition: all var(--transition-fast);
          flex-shrink: 0;
          text-decoration: none;
          min-height: 44px;
          min-width: 44px;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .cart-btn:hover,
        .cart-btn:focus-visible {
          background: var(--color-gold);
          color: var(--color-text-inverse);
          outline: none;
        }
        .cart-btn:active {
          transform: scale(0.94);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--color-red);
          color: #fff;
          font-size: 0.6rem;
          font-weight: var(--weight-bold);
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          animation: fadeIn 0.2s ease;
          line-height: 1;
          box-shadow: 0 0 0 2px var(--color-bg);
        }

        @media (max-width: 380px) {
          .brand-name {
            font-size: var(--text-lg);
          }
          .brand-tagline {
            font-size: var(--text-xs);
          }
          .cart-btn {
            padding: 10px 14px;
          }
        }
      `}</style>
    </header>
  );
}

// Shared cart icon SVG
function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
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
  );
}
