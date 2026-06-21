'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid var(--glass-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FitGenie AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Benefits</a>
            <a href="#faq" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm !py-2.5 !px-5">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-light)] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass animate-fade-in-up" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className="px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Features</a>
            <a href="#benefits" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Benefits</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">FAQ</a>
            <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <Link href="/login" className="btn-ghost text-sm text-center">Login</Link>
              <Link href="/register" className="btn-primary text-sm text-center justify-center">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
