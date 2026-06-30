'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  Dumbbell,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/fitness-plan', label: 'Fitness Plan', icon: Dumbbell },
  { href: '/ai-coach', label: 'AI Coach', icon: MessageSquare },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(91,140,255,0.3)',
          }}
        >
          <Dumbbell size={17} className="text-white" />
        </div>
        {!collapsed && (
          <span
            className="text-base font-bold tracking-tight whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 60%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FitGenie AI
          </span>
        )}
      </div>

      {/* AI Badge */}
      {!collapsed && (
        <div className="px-4 pt-4">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(91, 140, 255, 0.06)',
              border: '1px solid rgba(91, 140, 255, 0.12)',
            }}
          >
            <Sparkles size={11} style={{ color: '#22D3EE' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7C849A' }}>
              Powered by Gemini AI
            </span>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px' : '10px 12px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                textDecoration: 'none',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                overflow: 'hidden',
                background: active ? 'rgba(91, 140, 255, 0.1)' : 'transparent',
                border: active ? '1px solid rgba(91, 140, 255, 0.15)' : '1px solid transparent',
                color: active ? '#7BA7FF' : '#7C849A',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = '#B8C0D4';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#7C849A';
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    bottom: '25%',
                    width: '3px',
                    background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              )}
              <item.icon
                size={18}
                style={{
                  flexShrink: 0,
                  color: active ? '#7BA7FF' : 'inherit',
                  transition: 'transform 0.2s',
                }}
              />
              {!collapsed && <span style={{ color: 'inherit' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: collapsed ? '10px' : '10px 12px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#7C849A',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.08)';
            (e.currentTarget as HTMLElement).style.color = '#EF4444';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239, 68, 68, 0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#7C849A';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  const sidebarStyle = {
    background: 'rgba(5, 8, 22, 0.9)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 btn-icon"
        style={{
          background: 'rgba(14,20,40,0.9)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(5, 8, 22, 0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={sidebarStyle}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
        style={sidebarStyle}
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '72px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(14, 20, 40, 0.95)',
            border: '1px solid rgba(91,140,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#7C849A',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.15)';
            (e.currentTarget as HTMLElement).style.color = '#7BA7FF';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(14, 20, 40, 0.95)';
            (e.currentTarget as HTMLElement).style.color = '#7C849A';
          }}
        >
          <ChevronLeft size={12} style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>
      </aside>
    </>
  );
}
