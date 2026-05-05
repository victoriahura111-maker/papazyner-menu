// ============================================
// PAPAZYNER'S - CATEGORY NAVIGATION COMPONENT
// ============================================

import React from 'react';
import type { MenuCategory } from '@/utils/types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onSelect,
}: CategoryNavProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav className="category-nav" aria-label="Menu categories">
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            aria-current={activeCategory === cat.id ? 'true' : undefined}
          >
            <span className="category-icon" aria-hidden="true">
              {cat.icon}
            </span>
            <span className="category-label">{cat.name}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .category-nav {
          position: sticky;
          top: 72px;
          z-index: 50;
          background: rgba(13, 13, 13, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: var(--space-sm, 8px) 0;
        }
        .category-scroll {
          display: flex;
          gap: var(--space-sm, 8px);
          overflow-x: auto;
          padding: 0 var(--space-md, 16px);
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        .category-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--color-text-secondary, #E0E0E0);
          padding: 6px 14px;
          border-radius: 20px;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
          flex-shrink: 0;
        }
        .category-chip:hover {
          border-color: var(--color-gold, #D4AF37);
          color: var(--color-gold, #D4AF37);
        }
        .category-chip.active {
          background: var(--color-gold, #D4AF37);
          border-color: var(--color-gold, #D4AF37);
          color: var(--color-bg, #0D0D0D);
          font-weight: 700;
        }
        .category-icon {
          font-size: 1rem;
        }
        .category-label {
          font-size: 0.78rem;
        }

        @media (min-width: 768px) {
          .category-scroll {
            justify-content: center;
            gap: var(--space-md, 16px);
          }
          .category-chip {
            font-size: 0.85rem;
            padding: 8px 18px;
          }
        }
      `}</style>
    </nav>
  );
}
