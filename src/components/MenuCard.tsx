// ============================================
// PAPAZYNER'S - MENU CARD COMPONENT
// ============================================

import React, { useState } from 'react';
import type { MenuItem } from '@/utils/types';
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
                <span className="var-price">₦{v.price.toLocaleString('en-NG')}</span>
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
          background: var(--color-bg-card, rgba(13, 13, 13, 0.85));
          border: var(--border-gold, 1px solid #D4AF37);
          border-radius: var(--radius-md, 8px);
          overflow: hidden;
          transition: all var(--transition-normal, 300ms ease);
          position: relative;
        }
        .menu-card:hover {
          border-color: var(--color-gold-light, #E8C84A);
          box-shadow: var(--shadow-gold, 0 0 15px rgba(212, 175, 55, 0.3));
        }
        .menu-card.in-cart {
          border-color: var(--color-gold, #D4AF37);
          box-shadow: inset 0 0 0 1px var(--color-gold, #D4AF37);
        }

        /* Image */
        .card-image {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--color-bg-elevated, #1A1A1A);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
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
          background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
        }
        .placeholder-icon {
          font-size: 3rem;
          color: var(--color-gold, #D4AF37);
          opacity: 0.4;
        }

        /* Price Seal positioning */
        .price-seal-wrapper {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        /* Content */
        .card-content {
          padding: var(--space-md, 16px);
        }
        .item-name {
          font-size: 1.25rem;
          color: var(--color-text-primary, #FFFFFF);
          margin-bottom: var(--space-xs, 4px);
          line-height: 1.3;
        }
        .item-description {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--color-text-muted, #999999);
          margin-bottom: var(--space-sm, 8px);
        }
        .item-includes {
          margin: var(--space-sm, 8px) 0;
        }
        .includes-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-gold, #D4AF37);
          letter-spacing: 0.05em;
        }
        .includes-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        .includes-list li {
          font-size: 0.7rem;
          color: var(--color-text-muted, #999999);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 10px;
        }

        /* Add Button */
        .add-btn {
          width: 100%;
          margin-top: var(--space-sm, 8px);
          padding: 10px;
          background: var(--color-gold, #D4AF37);
          color: var(--color-bg, #0D0D0D);
          border: none;
          border-radius: var(--radius-sm, 4px);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
        }
        .add-btn:hover,
        .add-btn:focus-visible {
          background: var(--color-gold-light, #E8C84A);
          outline: none;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
        }
        .add-btn:active {
          transform: scale(0.98);
        }
        .add-btn.added {
          background: transparent;
          border: 2px solid var(--color-gold, #D4AF37);
          color: var(--color-gold, #D4AF37);
        }

        /* Variation Overlay */
        .variation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .variation-modal {
          background: var(--color-bg-elevated, #1A1A1A);
          border: var(--border-gold-thick, 2px solid #D4AF37);
          border-radius: var(--radius-lg, 16px) var(--radius-lg, 16px) 0 0;
          padding: var(--space-lg, 24px);
          width: 100%;
          max-width: 480px;
          animation: slideUp 0.3s ease;
        }
        .variation-title {
          font-size: 1.3rem;
          color: var(--color-gold, #D4AF37);
          margin-bottom: 4px;
        }
        .variation-subtitle {
          font-size: 0.8rem;
          color: var(--color-text-muted, #999999);
          margin-bottom: var(--space-md, 16px);
        }
        .variation-option {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: var(--radius-md, 8px);
          color: var(--color-text-primary, #FFFFFF);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
        }
        .variation-option:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: var(--color-gold, #D4AF37);
        }
        .var-price {
          font-weight: 700;
          color: var(--color-gold, #D4AF37);
        }
        .variation-cancel {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md, 8px);
          color: var(--color-text-muted, #999999);
          font-family: var(--font-body);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
        }
        .variation-cancel:hover {
          border-color: var(--color-text-secondary, #E0E0E0);
          color: var(--color-text-primary, #FFFFFF);
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
