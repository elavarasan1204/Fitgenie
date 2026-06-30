'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does FitGenie AI create personalized plans?',
    answer: 'FitGenie uses Google\'s Gemini 2.5 Flash AI to analyze your profile — including age, body metrics, fitness goals, activity level, diet preferences, and medical conditions — to generate a comprehensive fitness and nutrition plan tailored specifically to you.',
  },
  {
    question: 'Can I modify my AI-generated plan?',
    answer: 'Absolutely! FitGenie features a safe editing workflow. When you request changes through the AI Coach, it generates proposed modifications and shows you a side-by-side comparison of current vs. new values. You approve or reject changes before they take effect.',
  },
  {
    question: 'Is my health data secure?',
    answer: 'Yes. All data is stored securely in Supabase with Row Level Security (RLS) enabled. This means every user can only access their own data — it\'s enforced at the database level, not just the application level.',
  },
  {
    question: 'What diet preferences are supported?',
    answer: 'FitGenie supports Vegetarian, Non-Vegetarian, Vegan, and Custom diet preferences. The AI generates meal plans that respect your dietary choices while ensuring nutritional balance.',
  },
  {
    question: 'How does progress tracking work?',
    answer: 'You can log your daily weight, water intake, and workout completion. FitGenie displays beautiful charts showing your weight trend, BMI trend, water intake consistency, and workout completion rate over time.',
  },
  {
    question: 'What can I ask the AI Coach?',
    answer: 'The AI Coach can answer questions about exercises, form tips, nutrition concepts, calorie calculations, BMI analysis, workout improvements, diet suggestions, injury prevention, and provide motivation — it\'s like having a personal trainer available 24/7.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div
        className="floating-orb floating-orb-cyan"
        style={{ width: '400px', height: '400px', top: '10%', left: '-100px', opacity: 0.06, filter: 'blur(80px)' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="section-badge inline-flex mb-6">
            <HelpCircle size={12} />
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
            Frequently Asked
            <span
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}Questions
            </span>
          </h2>
          <p className="text-lg" style={{ color: '#B8C0D4' }}>
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(14, 20, 40, 0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${openIndex === index ? 'rgba(91, 140, 255, 0.25)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: openIndex === index ? '0 8px 32px rgba(91,140,255,0.08)' : 'none',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span className="font-semibold pr-4 text-sm md:text-base" style={{ color: '#FFFFFF' }}>
                  {faq.question}
                </span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: openIndex === index ? 'rgba(91,140,255,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${openIndex === index ? 'rgba(91,140,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}
                >
                  <ChevronDown
                    size={15}
                    style={{
                      color: openIndex === index ? '#7BA7FF' : '#7C849A',
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease, color 0.3s ease',
                    }}
                  />
                </div>
              </button>

              <div
                style={{
                  maxHeight: openIndex === index ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: openIndex === index ? 1 : 0,
                  transitionProperty: 'max-height, opacity',
                }}
              >
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="px-5 py-4 text-sm leading-relaxed" style={{ color: '#B8C0D4' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
