// ============================================
// PAPAZYNER'S - FOOTER COMPONENT
// ============================================

import React from 'react';
import type { RestaurantInfo } from '@/utils/types';

interface FooterProps {
  restaurant: RestaurantInfo;
}

export default function Footer({ restaurant }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <h3 className="footer-name gothic">{restaurant.name}</h3>
          <p className="footer-tagline script">{restaurant.tagline}</p>
        </div>

        <div className="gold-divider" />

        <div className="footer-contact">
          <p className="contact-line">
            📍 {restaurant.address}
          </p>
          <p className="contact-line">
            📞 <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
          </p>
          <p className="contact-line">
            🌐 <a href={restaurant.website} target="_blank" rel="noopener noreferrer">papazyners.com</a>
          </p>
        </div>

        <div className="footer-social">
          <span className="social-label body-font">Follow us:</span>
          <div className="social-links">
            <a
              href={`https://instagram.com/${restaurant.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              Instagram
            </a>
            <a
              href={`https://facebook.com/${restaurant.social.facebook.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-link"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/${restaurant.social.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="social-link"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright body-font">
            &copy; {currentYear} {restaurant.name}. All rights reserved.
          </p>
          <p className="powered-by body-font">
            Made with 🔥 in Lagos
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-bg);
          border-top: 2px solid var(--color-gold);
          padding: var(--space-12) 0 var(--space-6);
          margin-top: auto;
        }
        .footer-inner {
          text-align: center;
        }
        .footer-brand {
          margin-bottom: var(--space-6);
        }
        .footer-name {
          font-size: var(--text-xl);
          color: var(--color-gold);
          margin-bottom: var(--space-1);
          text-shadow: 0 0 16px rgba(212, 175, 55, 0.2);
        }
        .footer-tagline {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }
        .footer-contact {
          margin: var(--space-6) 0;
        }
        .contact-line {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin: var(--space-2) 0;
        }
        .contact-line a {
          color: var(--color-gold);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .contact-line a:hover {
          color: var(--color-gold-light);
          text-decoration: underline;
        }
        .footer-social {
          margin: var(--space-6) 0;
        }
        .social-label {
          display: block;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          color: var(--color-text-muted);
          margin-bottom: var(--space-2);
        }
        .social-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .social-link {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          text-decoration: none;
          border: 1px solid var(--color-border-strong);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }
        .social-link:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .footer-bottom {
          margin-top: var(--space-6);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border-subtle);
        }
        .copyright {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .powered-by {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: var(--space-1);
          opacity: 0.7;
        }

        @media (min-width: 768px) {
          .social-links {
            gap: var(--space-3);
          }
          .social-link {
            font-size: var(--text-sm);
            padding: 8px 20px;
          }
        }
      `}</style>
    </footer>
  );
}
