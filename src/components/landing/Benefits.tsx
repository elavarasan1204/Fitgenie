import { Check, Target, Clock, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Personalized to Your Goals',
    description: 'Whether it\'s weight loss, muscle gain, or endurance training — your plan adapts to exactly what you need.',
    points: ['Custom workout routines', 'Goal-specific nutrition plans', 'Adaptive difficulty scaling'],
  },
  {
    icon: Clock,
    title: 'Save Hours of Planning',
    description: 'No more endless research. Get a complete fitness and nutrition plan in seconds with AI.',
    points: ['Instant plan generation', 'Quick plan modifications', 'Automated calorie calculations'],
  },
  {
    icon: Heart,
    title: 'Health-First Approach',
    description: 'Plans consider your medical conditions, dietary restrictions, and activity level for safe training.',
    points: ['Medical condition awareness', 'Diet-sensitive meal plans', 'Recovery-focused suggestions'],
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge badge-success text-xs uppercase tracking-wider mb-4 inline-block">Benefits</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose
            <span className="gradient-text"> FitGenie AI?</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Built for real results, backed by AI intelligence, designed for your lifestyle.
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Icon Card */}
              <div className="flex-shrink-0">
                <div className="glass-card p-10 w-48 h-48 flex items-center justify-center">
                  <benefit.icon size={72} className="text-[var(--color-primary-light)] animate-float" style={{ animationDelay: `${index * 0.5}s` }} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-[var(--color-text-secondary)] mb-5 max-w-lg">
                  {benefit.description}
                </p>
                <ul className="space-y-3">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-[var(--color-success)]" />
                      </div>
                      <span className="text-sm text-[var(--color-text-secondary)]">{point}</span>
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
