import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';

interface HeaderProps {
  onBookNowClick: () => void;
}

export default function Header({ onBookNowClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Very simple scroll-spy for active navigation links
      const sections = ['home', 'services', 'gallery', 'blog', 'reviews', 'booking'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { label: 'Home', target: 'home' },
    { label: 'Services', target: 'services' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Blog', target: 'blog' },
    { label: 'Reviews', target: 'reviews' },
    { label: 'Contact', target: 'booking' }
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-void-black/90 backdrop-blur-md border-b border-carbon-gray py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <a 
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="flex items-center gap-2.5 group"
        >
          {/* Official Dreamville Auto logo — scales responsively, never cropped */}
          <img
            src="/assets/brand/dreamville-logo-header.webp"
            alt="Dreamville Auto"
            className="h-11 md:h-14 w-auto object-contain select-none"
            draggable={false}
          />
        </a>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.target);
              }}
              className={`relative font-rajdhani text-sm font-semibold tracking-wider uppercase transition-colors py-1 ${
                activeSection === item.target
                  ? 'text-blood-red'
                  : 'text-chrome-silver hover:text-steel-white'
              }`}
            >
              {item.label}
              {activeSection === item.target && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blood-red neon-glow-red rounded" />
              )}
            </a>
          ))}
        </nav>

        {/* CTA BUTTONS */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:604-442-8265"
            className="flex items-center gap-1.5 font-mono text-[11px] text-chrome-silver hover:text-steel-white transition-colors border border-neutral-900 px-3 py-1.5 rounded bg-carbon-gray/20"
          >
            <Phone size={11} className="text-blood-red" />
            <span>604-442-8265</span>
          </a>
          
          <button
            onClick={onBookNowClick}
            className="bg-blood-red hover:bg-red-700 text-steel-white px-5 py-2 text-xs font-rajdhani font-bold tracking-widest uppercase rounded cursor-pointer animate-pulse transition-colors hover:scale-[1.03] active:scale-95 duration-200 shadow-[0_0_15px_rgba(196,30,30,0.4)]"
          >
            BOOK NOW
          </button>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onBookNowClick}
            className="bg-blood-red text-steel-white px-3 py-1.5 text-[10px] font-rajdhani font-bold tracking-wider uppercase rounded"
          >
            BOOK
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-carbon-gray rounded bg-carbon-gray/50 text-steel-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* MOBILE SLIDE-IN PANEL */}
      <div
        className={`fixed inset-x-0 top-[60px] bottom-0 z-50 bg-void-black/98 border-t border-carbon-gray backdrop-blur-lg flex flex-col p-6 transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-5 mt-6">
          {menuItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.target);
              }}
              className={`font-rajdhani text-xl font-bold uppercase tracking-widest border-b border-neutral-900 pb-2 transition-colors ${
                activeSection === item.target ? 'text-blood-red' : 'text-chrome-silver'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Info Box */}
        <div className="mt-auto bg-carbon-gray/30 border border-neutral-900 rounded p-4 flex flex-col gap-3">
          <div>
            <span className="font-mono text-[9px] text-chrome-silver uppercase block">Location</span>
            <p className="font-rajdhani text-sm text-steel-white font-semibold">📍 6432 Beresford St, Burnaby BC</p>
          </div>
          <div>
            <span className="font-mono text-[9px] text-chrome-silver uppercase block">Call Now</span>
            <a href="tel:604-442-8265" className="font-mono text-sm text-blood-red font-bold">📞 604-442-8265</a>
          </div>
          <div>
            <span className="font-mono text-[9px] text-chrome-silver uppercase block">Operating Hours</span>
            <p className="font-sans text-xs text-chrome-silver">Mon-Sat: 11 AM - 9 PM · Sun: 12 PM - 7 PM</p>
          </div>
        </div>
      </div>
    </header>
  );
}
