// ============================================
// PAPAZYNER'S - ORDER SUCCESS COMPONENT
// ============================================

import React, { useState, useCallback } from 'react';
import type { Order } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';
import { copyToClipboard } from '@/utils/whatsapp';

interface OrderSuccessProps {
  order: Order;
  onClose: () => void;
}

export default function OrderSuccess({ order, onClose }: OrderSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = useCallback(async () => {
    const result = await copyToClipboard(order.id);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [order.id]);

  return (
    <div className="order-success">
      <div className="order-success__checkmark">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="30" stroke="#25D366" strokeWidth="4" fill="none" />
          <path
            d="M18 32L28 42L46 22"
            stroke="#25D366"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="order-success__heading script">Order Received!</h2>
      <p className="order-success__message">
        Your order has been received. We will contact you shortly.
      </p>

      <div className="order-success__id-section">
        <span className="order-success__id-label">Order ID</span>
        <button
          className="order-success__id-value"
          onClick={handleCopyOrderId}
          title="Click to copy Order ID"
          aria-label="Copy order ID"
        >
          {order.id}
          <span className="order-success__copy-icon">
            {copied ? ' ✓' : ' 📋'}
          </span>
        </button>
        {copied && <span className="order-success__copied-text">Copied!</span>}
      </div>

      <div className="order-summary">
        <h4 className="order-success__summary-title">Order Summary</h4>
        {order.items.map((item) => {
          const itemLabel = item.variationLabel
            ? `${item.name} (${item.variationLabel})`
            : item.name;
          const lineTotal = item.price * item.quantity;
          return (
            <div key={item.id + (item.variationLabel || '')} className="order-summary-item">
              <span className="order-summary-item-info">
                <span className="order-summary-item-qty">{item.quantity}x</span>
                <span className="order-summary-item-name">{itemLabel}</span>
              </span>
              <span className="order-summary-item-price">{formatNaira(lineTotal)}</span>
            </div>
          );
        })}
        <div className="gold-divider" />
        <div className="order-summary-total">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
      </div>

      <div className="order-summary" style={{ marginTop: 'var(--space-md)' }}>
        <h4 className="order-success__summary-title">Customer Details</h4>
        <div className="order-summary-item">
          <span>Name</span>
          <span>{order.customer.name}</span>
        </div>
        <div className="order-summary-item">
          <span>Phone</span>
          <span>{order.customer.phone}</span>
        </div>
        <div className="order-summary-item">
          <span>Location</span>
          <span>{order.customer.location}</span>
        </div>
        {order.customer.notes && (
          <div className="order-summary-item">
            <span>Notes</span>
            <span>{order.customer.notes}</span>
          </div>
        )}
      </div>

      <button className="checkout-btn checkout-btn--primary" onClick={onClose} style={{ marginTop: 'var(--space-lg)' }}>
        Continue Shopping
      </button>

      <style jsx>{`
        .order-success {
          text-align: center;
          padding: var(--space-lg) var(--space-md);
        }
        .order-success__checkmark {
          margin-bottom: var(--space-md);
          animation: scaleIn 0.5s ease;
        }
        .order-success__heading {
          font-size: 1.6rem;
          color: var(--color-gold);
          margin-bottom: var(--space-sm);
        }
        .order-success__message {
          font-family: var(--font-body);
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          margin-bottom: var(--space-xl);
        }
        .order-success__id-section {
          background: var(--color-bg-elevated);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-bottom: var(--space-lg);
        }
        .order-success__id-label {
          display: block;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: var(--space-xs);
        }
        .order-success__id-value {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-gold);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .order-success__id-value:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        .order-success__copy-icon {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        .order-success__copied-text {
          display: block;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: #25D366;
          margin-top: 4px;
        }
        .order-success__summary-title {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-gold);
          margin-bottom: var(--space-sm);
          text-align: left;
        }
        .order-summary-total {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-gold);
        }
        .order-summary-item-info {
          display: flex;
          gap: 6px;
          align-items: baseline;
          flex: 1;
        }
        .order-summary-item-qty {
          font-weight: 700;
          color: var(--color-gold);
          min-width: 24px;
        }
        .order-summary-item-name {
          color: var(--color-text-primary);
        }
        .order-summary-item-price {
          font-weight: 600;
          color: var(--color-text-secondary);
          text-align: right;
          flex-shrink: 0;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
