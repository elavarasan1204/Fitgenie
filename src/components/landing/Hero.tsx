import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full animate-spin-slow opacity-20"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full animate-spin-slow opacity-15"
        style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)', animationDirection: 'reverse' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles size={14} className="text-[var(--color-primary-light)]" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              AI-Powered Fitness Revolution
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Your Personal
            <br />
            <span className="gradient-text">AI Fitness Coach</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Transform your fitness journey with intelligent workout plans, personalized nutrition,
            real-time coaching, and smart progress tracking — all powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/register" className="btn-primary text-base !py-4 !px-8 group">
              Start Free Today
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-secondary text-base !py-4 !px-8">
              Explore Features
            </a>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">10K+</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">50K+</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Plans Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">98%</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Floating decorations */}
        <div className="hidden lg:block absolute top-32 left-12 animate-float">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/20 flex items-center justify-center">
              <Zap size={20} className="text-[var(--color-success)]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Quick Results</div>
              <div className="text-xs text-[var(--color-text-muted)]">See progress in 2 weeks</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-32 right-12 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center">
              <Brain size={20} className="text-[var(--color-primary-light)]" />
            </div>
            <div>
              <div className="text-sm font-semibold">AI Powered</div>
              <div className="text-xs text-[var(--color-text-muted)]">Gemini 2.5 Flash</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
