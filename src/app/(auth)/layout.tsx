import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-grid">
      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Dumbbell size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">FitGenie AI</span>
        </Link>

        {/* Auth Card */}
        <div className="glass-card p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
