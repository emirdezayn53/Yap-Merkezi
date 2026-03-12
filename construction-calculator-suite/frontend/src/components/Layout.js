/**
 * Ana Uygulama Düzeni
 * Navigasyon başlığı ve alt bilgi içerir
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Menu,
  X,
  LayoutDashboard,
  Calculator,
  FolderOpen,
  HardHat,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Ana Panel', icon: LayoutDashboard },
  { href: '/calculators', label: 'Hesap Araçları', icon: Calculator },
  { href: '/projects', label: 'Projeler', icon: FolderOpen },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ==================== ÜST NAVİGASYON ==================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <HardHat className="h-8 w-8 text-primary-600" />
              <span className="text-lg font-bold text-gray-900 hidden sm:block">
                Yapı Hesap
              </span>
            </Link>

            {/* Masaüstü Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Demo etiketi */}
            <div className="hidden md:flex items-center">
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
                Demo Sürümü
              </span>
            </div>

            {/* Mobil menü butonu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobil Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      ${active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ==================== ANA İÇERİK ==================== */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* ==================== ALT BİLGİ ==================== */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Yapı Hesap &mdash; İnşaat Mühendisleri İçin Hesaplama Aracı
        </div>
      </footer>
    </div>
  );
}
