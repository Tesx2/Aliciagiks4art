import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';
import { MagneticWrapper } from './MagneticWrapper';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const content = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navItems = [
    { id: 'portfolio', section: 'work', label: content.navigation.work },
    { id: 'services', section: 'services', label: content.navigation.services },
    { id: 'about', section: 'about', label: content.navigation.about },
    { id: 'contact', section: 'contact', label: content.navigation.contact },
  ].filter((item) => !content.page.hiddenSections.includes(item.section as 'work' | 'services' | 'about' | 'contact'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems.map((item) => item.id)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
      else if (window.scrollY < 120) setActiveSection('top');
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [content.page.hiddenSections, content.navigation]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (mobileMenuOpen) menuButtonRef.current?.focus();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    if (onNavigate) {
      onNavigate(targetId);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7FC]/90 backdrop-blur-md border-b border-purple-200/70 shadow-xs shadow-purple-900/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark (Mary Alicia, single element display) */}
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, 'top')}
          className="group flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#420D58] via-[#5F1B68] to-[#8E24AA] text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs shadow-purple-900/20 group-hover:scale-105 transition-transform">
              {content.profile.name.charAt(0) || 'M'}
          </span>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-neutral-900 text-sm sm:text-base group-hover:text-purple-950 transition-colors leading-none">
              {content.profile.name}
            </span>
            <span className="text-[10px] font-mono text-purple-700 font-medium">
              @{content.profile.handle}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (concise, single line) */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-600">
          {navItems.map((item) => <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleLinkClick(e, item.id)}
            aria-current={activeSection === item.id ? 'location' : undefined}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeSection === item.id ? 'text-purple-900' : 'hover:text-purple-900'}`}
          >{item.label}</a>)}
        </nav>

        {/* Zone 3: Primary CTA */}
        {!content.page.hiddenSections.includes('contact') && <div className="hidden lg:flex items-center gap-3 shrink-0">
          <MagneticWrapper strength={0.3}>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#420D58] via-[#5F1B68] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all whitespace-nowrap shadow-xs shadow-purple-900/25 hover:shadow-md hover:shadow-purple-900/30"
            >
              <span>{content.navigation.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </MagneticWrapper>
        </div>}

        {/* Mobile menu hamburger toggle */}
        <div className="flex lg:hidden items-center">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-purple-900 hover:bg-purple-100/70 rounded-md transition-colors focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          id="mobile-navigation"
          role="region"
          aria-label="Mobile navigation"
          exit={{ opacity: 0, y: -8 }}
          className="lg:hidden border-b border-purple-200/80 bg-[#FAF7FC] px-4 pt-2 pb-6 space-y-2 shadow-lg shadow-purple-950/5"
        >
          {navItems.map((item) => <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleLinkClick(e, item.id)}
            aria-current={activeSection === item.id ? 'location' : undefined}
            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === item.id ? 'bg-purple-100 text-purple-950' : 'text-neutral-800 hover:text-purple-950 hover:bg-purple-100/70'}`}
          >{item.label}</a>)}
          {!content.page.hiddenSections.includes('contact') && <div className="pt-2">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#420D58] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-xs shadow-purple-900/25"
            >
              <span>{content.navigation.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>}
        </motion.div>
      )}
    </header>
  );
};
