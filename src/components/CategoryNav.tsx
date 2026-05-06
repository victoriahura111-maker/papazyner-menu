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
          top: 64px;
          z-index: var(--z-dropdown);
          background: rgba(13, 13, 13, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-2) 0;
        }
        .category-scroll {
          display: flex;
          gap: var(--space-2);
          overflow-x: auto;
          padding: 0 var(--space-4);
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        .category-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          background: transparent;
          border: 1px solid var(--color-border-strong);
          color: var(--color-text-secondary);
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
          min-height: 36px;
        }
        .category-chip:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .category-chip.active {
          background: var(--color-gold);
          border-color: var(--color-gold);
          color: var(--color-text-inverse);
          font-weight: var(--weight-bold);
        }
        .category-icon {
          font-size: var(--text-md);
        }
        .category-label {
          font-size: var(--text-xs);
        }

        @media (min-width: 768px) {
          .category-scroll {
            justify-content: center;
            gap: var(--space-3);
          }
          .category-chip {
            font-size: var(--text-sm);
            padding: 8px 18px;
            min-height: 40px;
          }
          .category-label {
            font-size: var(--text-sm);
          }
        }
      `}</style>
    </nav>
  );
}
