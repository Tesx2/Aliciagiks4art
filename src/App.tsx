/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

export default function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') return <AdminPage />;

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-200 selection:text-purple-950">
      <MagneticCursor />
      <Header />
      <main className="flex-1">
        <Hero />
        <MarqueeTicker />
        <PortfolioGrid />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
