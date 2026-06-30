import { Check, Target, Clock, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Personalized to Your Goals',
    description: 'Whether it\'s weight loss, muscle gain, or endurance training — your plan adapts to exactly what you need.',
    points: ['Custom workout routines', 'Goal-specific nutrition plans', 'Adaptive difficulty scaling'],
    gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
    glow: 'rgba(91, 140, 255, 0.25)',
  },
  {
    icon: Clock,
    title: 'Save Hours of Planning',
    description: 'No more endless research. Get a complete fitness and nutrition plan in seconds with AI.',
    points: ['Instant plan generation', 'Quick plan modifications', 'Automated calorie calculations'],
    gradient: 'linear-gradient(135deg, #7B61FF 0%, #22D3EE 100%)',
    glow: 'rgba(123, 97, 255, 0.25)',
  },
  {
    icon: Heart,
    title: 'Health-First Approach',
    description: 'Plans consider your medical conditions, dietary restrictions, and activity level for safe training.',
    points: ['Medical condition awareness', 'Diet-sensitive meal plans', 'Recovery-focused suggestions'],
    gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
    glow: 'rgba(34, 197, 94, 0.25)',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div
        className="floating-orb floating-orb-blue"
        style={{ width: '600px', height: '600px', bottom: 0, right: '-200px', opacity: 0.06, filter: 'blur(100px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="section-badge inline-flex mb-6">
            <Check size={12} />
            Benefits
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
            Why Choose
            <span
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}FitGenie AI?
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#B8C0D4' }}>
            Built for real results, backed by AI intelligence, designed for your lifestyle.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-16">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`flex flex-col md:flex-row gap-10 items-center ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              } animate-fade-in-up`}
              style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${index * 150}ms` }}
            >
              {/* Icon Panel */}
              <div className="flex-shrink-0">
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '32px',
                    background: 'rgba(14, 20, 40, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${benefit.glow}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: benefit.gradient,
                      opacity: 0.05,
                    }}
                  />
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '20px',
                      background: benefit.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 12px 32px ${benefit.glow}`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                    className="animate-float"
                  >
                    <benefit.icon size={36} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: '#FFFFFF' }}>
                  {benefit.title}
                </h3>
                <p className="text-base mb-6 leading-relaxed max-w-lg" style={{ color: '#B8C0D4' }}>
                  {benefit.description}
                </p>
                <ul className="space-y-3">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 justify-center md:justify-start">
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '8px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={12} style={{ color: '#22C55E' }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#B8C0D4' }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
