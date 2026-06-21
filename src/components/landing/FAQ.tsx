'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="relative py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge badge-warning text-xs uppercase tracking-wider mb-4 inline-block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden"
              style={{ transform: 'none' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface-light)]/30 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === index ? '300px' : '0',
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <p className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
