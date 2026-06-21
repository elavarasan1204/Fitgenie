import Link from 'next/link';
import { Dumbbell, Globe, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Dumbbell size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FitGenie AI</span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Your AI-powered fitness companion. Personalized plans, smart coaching, real results.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#faq" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/dashboard" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[var(--color-text-secondary)]">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-[var(--color-surface-lighter)] transition-colors">
                <Globe size={18} className="text-[var(--color-text-muted)]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-[var(--color-surface-lighter)] transition-colors">
                <MessageCircle size={18} className="text-[var(--color-text-muted)]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-[var(--color-surface-lighter)] transition-colors">
                <Heart size={18} className="text-[var(--color-text-muted)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} FitGenie AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
