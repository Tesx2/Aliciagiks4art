/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MotionConfig } from 'motion/react';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MagneticCursor } from './components/MagneticCursor';
import { AdminPage } from './components/AdminPage';

function PublicPortfolio() {
  const content = useSiteContent();
  const sections = {
    marquee: <MarqueeTicker />,
    work: <PortfolioGrid />,
    services: <ServicesSection />,
    about: <AboutSection />,
    contact: <ContactSection />,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col selection:bg-purple-200 selection:text-purple-950">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <MagneticCursor />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Hero />
          {content.page.sectionOrder.map((section) => content.page.hiddenSections.includes(section)
            ? null
            : <React.Fragment key={section}>{sections[section]}</React.Fragment>)}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') return <AdminPage />;
  return <SiteContentProvider><PublicPortfolio /></SiteContentProvider>;
}
