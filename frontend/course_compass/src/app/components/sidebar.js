'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Courses', href: '/courses', icon: '📋' },
  { label: 'Professors', href: '/professors', icon: '💬' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--purple)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🧭</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>CourseCompass</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', margin: '2px 8px', borderRadius: 8,
              color: 'white', textDecoration: 'none', fontSize: 15,
              background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: active ? 600 : 400,
              transition: 'background 0.2s',
            }}>
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle (UI only for now) */}
      <div style={{
        padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 14 }}>
          <span>☀️</span>
          <span>Dark Mode</span>
        </div>
        <div style={{
          width: 36, height: 20, background: 'rgba(255,255,255,0.3)',
          borderRadius: 10, cursor: 'pointer',
        }} />
      </div>
    </aside>
  );
}