// ============================================
// PAPAZYNER'S - MENU CARD COMPONENT
// Refined, design-aligned
// ============================================

import React, { useState } from 'react';
import type { MenuItem } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';
import PriceSeal from './PriceSeal';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, variationLabel?: string) => void;
  isInCart: boolean;
}

export default function MenuCard({ item, onAddToCart, isInCart }: MenuCardProps) {
  const [showVariations, setShowVariations] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasVariations = item.variations && item.variations.length > 0;
  const hasIncludes = item.includes && item.includes.length > 0;
  const hasDescription = !!item.description;

  const handleAdd = () => {
    if (hasVariations) {
      setShowVariations(true);
    } else {
      onAddToCart(item);
    }
  };

  const handleVariationSelect = (label: string, price: number) => {
    const variationItem: MenuItem = { ...item, price, id: item.id };
    onAddToCart(variationItem, label);
    setShowVariations(false);
  };

  return (
    <div className={`menu-card ${isInCart ? 'in-cart' : ''} animate-fade-in`}>
      {/* Image Section */}
      <div className="card-image">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span className="placeholder-icon script">{item.name.charAt(0)}</span>
          </div>
        )}

        {/* Price Seal */}
        <div className="price-seal-wrapper">
          <PriceSeal price={item.price} size="md" />
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content">
        <h3 className="item-name script">{item.name}</h3>

        {hasDescription && (
          <p className="item-description">{item.description}</p>
        )}

        {hasIncludes && (
          <div className="item-includes">
            <span className="includes-label">Includes:</span>
            <ul className="includes-list">
              {item.includes!.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className={`add-btn ${isInCart ? 'added' : ''}`}
          onClick={handleAdd}
          aria-label={`Add ${item.name} to cart`}
        >
          {isInCart ? '✓ Added' : '+ Add to Order'}
        </button>
      </div>

      {/* Variation Selector Modal */}
      {showVariations && (
        <div className="variation-overlay" onClick={() => setShowVariations(false)}>
          <div className="variation-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="variation-title script">{item.name}</h4>
            <p className="variation-subtitle">Select size / option:</p>
            {item.variations!.map((v) => (
              <button
                key={v.label}
                className="variation-option"
                onClick={() => handleVariationSelect(v.label, v.price)}
              >
                <span>{v.label}</span>
                <span className="var-price">{formatNaira(v.price)}</span>
              </button>
            ))}
            <button
              className="variation-cancel"
              onClick={() => setShowVariations(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--transition-base);
          position: relative;
        }
        .menu-card:hover {
          border-color: var(--color-gold);
          box-shadow: var(--shadow-gold);
        }
        .menu-card.in-cart {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.3);
        }

        /* Image */
        .card-image {
          position: relative;
          width: 100%;
          height: 170px;
          overflow: hidden;
          background: var(--color-bg-elevated);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s var(--transition-slow);
        }
        .menu-card:hover .card-image img {
          transform: scale(1.05);
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
        }
        .placeholder-icon {
          font-size: 3rem;
          color: var(--color-gold);
          opacity: 0.35;
        }

        /* Price Seal positioning */
        .price-seal-wrapper {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          z-index: 2;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }

        /* Content */
        .card-content {
          padding: var(--space-4);
        }
        .item-name {
          font-size: var(--text-lg);
          color: var(--color-text-primary);
          margin-bottom: var(--space-1);
          line-height: var(--leading-tight);
        }
        .item-description {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-2);
          line-height: var(--leading-normal);
        }
        .item-includes {
          margin: var(--space-2) 0;
        }
        .includes-label {
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          text-transform: uppercase;
          color: var(--color-gold);
          letter-spacing: var(--tracking-wider);
        }
        .includes-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        .includes-list li {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          background: var(--color-border-subtle);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        /* Add Button */
        .add-btn {
          width: 100%;
          margin-top: var(--space-2);
          padding: 11px;
          background: var(--color-gold);
          color: var(--color-text-inverse);
          border: none;
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .add-btn:hover,
        .add-btn:focus-visible {
          background: var(--color-gold-light);
          outline: none;
          box-shadow: var(--shadow-gold);
        }
        .add-btn:active {
          transform: scale(0.98);
        }
        .add-btn.added {
          background: transparent;
          border: 2px solid var(--color-gold);
          color: var(--color-gold);
        }

        /* Variation Overlay */
        .variation-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: var(--z-modal);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .variation-modal {
          background: var(--color-bg-surface);
          border: var(--border-gold-thick);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          padding: var(--space-6);
          width: 100%;
          max-width: 480px;
          animation: slideUp 0.3s var(--transition-base);
        }
        .variation-title {
          font-size: var(--text-xl);
          color: var(--color-gold);
          margin-bottom: var(--space-1);
        }
        .variation-subtitle {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-4);
        }
        .variation-option {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 14px 16px;
          margin-bottom: var(--space-2);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--text-base);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .variation-option:hover {
          background: rgba(212, 175, 55, 0.08);
          border-color: var(--color-gold);
        }
        .var-price {
          font-weight: var(--weight-bold);
          color: var(--color-gold);
        }
        .variation-cancel {
          width: 100%;
          padding: 12px;
          margin-top: var(--space-2);
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .variation-cancel:hover {
          border-color: var(--color-text-secondary);
          color: var(--color-text-primary);
        }

        @media (min-width: 768px) {
          .card-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}

