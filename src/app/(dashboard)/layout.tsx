import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      {/* Dynamic Animated Orbs for Glassmorphism contrast */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: '#5B8CFF', animation: 'float 10s infinite alternate' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ background: '#7B61FF', animation: 'float 15s infinite alternate-reverse' }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: '#22D3EE', animation: 'float 12s infinite alternate' }} />

      <Sidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden relative z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
