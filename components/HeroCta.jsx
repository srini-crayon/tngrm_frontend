/**
 * HeroCta Component
 * 
 * A reusable hero/CTA banner component with gradient background, heading, subtitle, and action buttons.
 * 
 * Usage:
 * ```jsx
 * import HeroCta from './HeroCta';
 * 
 * function App() {
 *   return <HeroCta />;
 * }
 * ```
 * 
 * Recommended fonts: Inter or Poppins from Google Fonts
 * Add to your layout.tsx or _app.js:
 * ```jsx
 * import { Inter } from 'next/font/google';
 * const inter = Inter({ subsets: ['latin'] });
 * ```
 */

import styles from './HeroCta.module.css';
import Link from 'next/link';

export default function HeroCta() {
  return (
    <section className={styles.hero}>
      <div className={styles.patternBackground} />
      <div className={styles.outerContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          {/* Top Pill Badge */}
          <div className={styles.pillContainer}>
            <div className={styles.pill}>
              Enquire Now
            </div>
          </div>

          {/* Main Heading */}
          <h1 className={styles.title}>
            Turn GenAI From Cost Center to Value Engine
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Whether you're a CDO, CIO, or a Product Owner — if you're done with endless pilots and need real outcomes. Let's make it happen.
          </p>
        </div>

        {/* Button Group */}
        <div className={styles.btnGroup}>
          <div className={styles.btnPrimaryWrapper}>
            <Link
              href="/contact"
              className={styles.btnPrimary}
              aria-label="Talk to us"
            >
              Talk to us
            </Link>
          </div>
          <Link
            href="/agents"
            className={styles.btnSecondary}
            aria-label="Start with a pilot"
          >
            Start with a pilot
          </Link>
        </div>
      </div>
    </section>
  );
}

