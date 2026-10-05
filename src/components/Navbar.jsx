import React, { useState, useEffect } from 'react';
import { Menu, X, UserCheck, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Hide navbar on login and dashboard pages
  const shouldHideNavbar = location.pathname === '/login' || location.pathname === '/dashboard';
  // Show buttons only on landing page
  const showButtons = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (id === 'about' || id === 'how-it-works' || id === 'technology') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    window.location.href = '/login';
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-black/50 backdrop-blur-md border-white/5 py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="flex items-center gap-3 group cursor-pointer">
          <img 
            src="\dist\images\circle-logo.png" 
            alt="ARCHIS Logo" 
            className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-emerald-500/50 transition-colors duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
          />
          <span className="font-semibold text-xl tracking-wider text-white group-hover:text-emerald-400 transition-colors duration-300">
            ARCHIS
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Home', id: 'home' },
            { label: 'About', id: 'about' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Technology', id: 'technology' },
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              className="text-sm font-normal text-zinc-400 hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-emerald-500 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Citizen Portal & Official Login Buttons (Desktop) */}
        {showButtons && (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection('about')}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-normal transition-all duration-300 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Citizen Portal
            </button>
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-normal transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Login
            </button>
          </div>
        )}

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white focus:outline-none transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen py-6 opacity-100 border-t border-white/5' : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 gap-4">
          {[
            { label: 'Home', id: 'home' },
            { label: 'About', id: 'about' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Technology', id: 'technology' },
          ].map((item) => (
            <a
              key={item.label}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              className="text-base font-normal text-zinc-400 hover:text-white py-1 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          {showButtons && (
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('about')}
                className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-sm font-normal text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Citizen Portal
              </button>
              <button
                onClick={handleLoginClick}
                className="w-full py-2.5 rounded-full bg-emerald-500 text-black font-medium text-center text-sm hover:bg-emerald-400 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Official Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}