'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Dumbbell, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingTop: scrolled ? '12px' : '20px', transition: 'padding 0.4s ease' }}
    >
      {/* Floating pill navbar */}
      <div
        className="w-full max-w-5xl"
        style={{
          background: scrolled ? 'rgba(5, 8, 22, 0.85)' : 'rgba(14, 20, 40, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(91, 140, 255, 0.12)',
          borderRadius: '20px',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex items-center justify-between h-14 px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                boxShadow: '0 4px 16px rgba(91,140,255,0.3)',
              }}
            >
              <Dumbbell size={16} className="text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 60%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FitGenie AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{ color: '#B8C0D4' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#B8C0D4';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
              style={{ color: '#B8C0D4' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#B8C0D4';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                boxShadow: '0 4px 16px rgba(91,140,255,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(91,140,255,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(91,140,255,0.25)';
              }}
            >
              <Sparkles size={14} />
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#B8C0D4',
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden animate-slide-down"
            style={{ borderTop: '1px solid rgba(91,140,255,0.1)', padding: '12px 16px 16px' }}
          >
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
                  style={{ color: '#B8C0D4' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <Link href="/login" onClick={() => setIsOpen(false)} className="btn-ghost text-sm text-center justify-center">Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center justify-center">
                <Sparkles size={14} /> Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
