'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Brain, Activity, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #050816 0%, #080d20 40%, #050816 100%)' }}
      />

      {/* Animated gradient orbs */}
      <div
        className="floating-orb floating-orb-blue animate-orb"
        style={{ width: '700px', height: '700px', top: '-200px', left: '-200px', opacity: 0.3 }}
      />
      <div
        className="floating-orb floating-orb-purple animate-orb-reverse"
        style={{ width: '600px', height: '600px', bottom: '-150px', right: '-150px', opacity: 0.25 }}
      />
      <div
        className="floating-orb floating-orb-cyan animate-orb"
        style={{ width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, animationDelay: '4s' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44 z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* AI Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 animate-fade-in-up"
            style={{
              padding: '8px 18px',
              borderRadius: '50px',
              background: 'rgba(91, 140, 255, 0.08)',
              border: '1px solid rgba(91, 140, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              animationDelay: '0ms',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22D3EE',
                boxShadow: '0 0 8px rgba(34,211,238,0.8)',
              }}
            />
            <Sparkles size={13} style={{ color: '#7BA7FF' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#B8C0D4' }}>
              AI-Powered Fitness Revolution
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="font-bold leading-[1.05] tracking-tight mb-6 animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animationDelay: '100ms' }}
          >
            Your Personal{' '}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 50%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI Fitness Coach
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ color: '#B8C0D4', animationDelay: '200ms' }}
          >
            Transform your fitness journey with intelligent workout plans, personalized nutrition,
            real-time AI coaching, and smart progress tracking — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                boxShadow: '0 8px 32px rgba(91,140,255,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(91,140,255,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(91,140,255,0.3)';
              }}
            >
              <Sparkles size={18} />
              Start Free Today
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#B8C0D4',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,140,255,0.25)';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#B8C0D4';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              Explore Features
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Plans Generated' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-4 px-3 rounded-2xl"
                style={{
                  background: 'rgba(14, 20, 40, 0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-medium" style={{ color: '#7C849A' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decoration cards */}
        <div className="hidden lg:block absolute top-36 left-8 animate-float" style={{ animationDelay: '0s' }}>
          <div
            style={{
              background: 'rgba(14, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} style={{ color: '#22C55E' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>Quick Results</div>
              <div style={{ fontSize: '0.7rem', color: '#7C849A' }}>See progress in 2 weeks</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute top-36 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
          <div
            style={{
              background: 'rgba(14, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(123, 97, 255, 0.2)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(123,97,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} style={{ color: '#9B85FF' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>AI Powered</div>
              <div style={{ fontSize: '0.7rem', color: '#7C849A' }}>Gemini 2.5 Flash</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-28 left-16 animate-float" style={{ animationDelay: '2.5s' }}>
          <div
            style={{
              background: 'rgba(14, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,211,238,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} style={{ color: '#22D3EE' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>Live Tracking</div>
              <div style={{ fontSize: '0.7rem', color: '#7C849A' }}>BMI & progress charts</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-28 right-16 animate-float" style={{ animationDelay: '3.5s' }}>
          <div
            style={{
              background: 'rgba(14, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(91, 140, 255, 0.2)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(91,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} style={{ color: '#7BA7FF' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>Secure & Private</div>
              <div style={{ fontSize: '0.7rem', color: '#7C849A' }}>Supabase RLS protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, #050816)' }}
      />
    </section>
  );
}
