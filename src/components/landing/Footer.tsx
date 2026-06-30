'use client';

import Link from 'next/link';
import { Dumbbell, Globe, MessageCircle, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8">
      {/* Top gradient border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(91,140,255,0.4), rgba(123,97,255,0.4), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(91,140,255,0.3)',
                }}
              >
                <Dumbbell size={18} className="text-white" />
              </div>
              <span
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                FitGenie AI
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#7C849A' }}>
              Your AI-powered fitness companion. Personalized plans, smart coaching, real results.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    color: '#7C849A',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,140,255,0.25)';
                    (e.currentTarget as HTMLElement).style.color = '#7BA7FF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#7C849A';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-xs mb-5 uppercase tracking-widest" style={{ color: '#7C849A' }}>Product</h4>
            <ul className="space-y-3">
              {[
                { href: '#features', label: 'Features' },
                { href: '#benefits', label: 'Benefits' },
                { href: '#faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: '#7C849A' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7C849A')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-xs mb-5 uppercase tracking-widest" style={{ color: '#7C849A' }}>Account</h4>
            <ul className="space-y-3">
              {[
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: '#7C849A' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7C849A')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-semibold text-xs mb-5 uppercase tracking-widest" style={{ color: '#7C849A' }}>Get Started</h4>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#7C849A' }}>
              Join thousands already transforming their fitness with AI.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                boxShadow: '0 6px 20px rgba(91,140,255,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(91,140,255,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(91,140,255,0.25)';
              }}
            >
              <Sparkles size={14} />
              Start Free
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs" style={{ color: '#7C849A' }}>
            © {new Date().getFullYear()} FitGenie AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs transition-colors"
                style={{ color: '#7C849A' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7C849A')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
