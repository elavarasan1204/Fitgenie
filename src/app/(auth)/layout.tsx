import { Dumbbell, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-mesh">
      {/* Deep background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050816 0%, #080d20 50%, #050816 100%)' }} />

      {/* Floating gradient orbs */}
      <div
        className="floating-orb floating-orb-blue animate-orb"
        style={{ width: '600px', height: '600px', top: '-150px', left: '-150px', opacity: 0.35 }}
      />
      <div
        className="floating-orb floating-orb-purple animate-orb-reverse"
        style={{ width: '500px', height: '500px', bottom: '-100px', right: '-100px', opacity: 0.3 }}
      />
      <div
        className="floating-orb floating-orb-cyan animate-orb"
        style={{ width: '300px', height: '300px', top: '60%', left: '60%', opacity: 0.15, animationDelay: '3s' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative w-full max-w-md mx-auto px-5 py-12 z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
              boxShadow: '0 8px 24px rgba(91,140,255,0.35)',
            }}
          >
            <Dumbbell size={22} className="text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
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

        {/* Auth Card */}
        <div
          className="relative animate-scale-in"
          style={{
            background: 'rgba(14, 20, 40, 0.75)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(91, 140, 255, 0.15)',
            borderRadius: '28px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
            padding: '40px',
          }}
        >
          {/* Top gradient line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(91,140,255,0.5), rgba(123,97,255,0.5), transparent)',
              borderRadius: '1px',
            }}
          />

          {/* AI badge */}
          <div className="flex justify-center mb-6">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '50px',
                background: 'rgba(91, 140, 255, 0.08)',
                border: '1px solid rgba(91, 140, 255, 0.18)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(123, 167, 255, 0.9)',
              }}
            >
              <Zap size={10} style={{ color: '#22D3EE' }} />
              AI-Powered Platform
            </div>
          </div>

          {children}
        </div>

        {/* Bottom tagline */}
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(124, 132, 154, 0.6)' }}>
          Secure · Private · Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
