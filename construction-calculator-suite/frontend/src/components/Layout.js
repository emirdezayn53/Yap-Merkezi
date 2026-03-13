import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CATEGORIES, CALCULATOR_TYPES } from '../lib/calculators';
import {
  Box,
  Construction,
  Mountain,
  BrickWall,
  Square,
  Home,
  DollarSign,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  HardHat,
} from 'lucide-react';

const iconMap = { Box, Construction, Mountain, BrickWall, Square, Home, DollarSign };

// Kategori bazında hesap araçlarını grupla
const categoryCalcs = {};
Object.keys(CATEGORIES).forEach((catId) => {
  categoryCalcs[catId] = [];
});
Object.entries(CALCULATOR_TYPES).forEach(([id, calc]) => {
  if (categoryCalcs[calc.category]) {
    categoryCalcs[calc.category].push({ id, name: calc.name });
  }
});

export default function Layout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});

  const toggleCat = (catId) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const isActive = (path) => router.asPath === path;
  const isInCategory = (catId) => {
    return categoryCalcs[catId]?.some((c) => router.asPath.includes(c.id));
  };

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="p-2 bg-primary-600 rounded-xl">
            <HardHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">Yapı Hesap</h1>
            <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
              Demo v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Ana Sayfa */}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Ana Sayfa
        </Link>

        <div className="pt-2 pb-1 px-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Hesap Araçları
          </span>
        </div>

        {/* Kategoriler */}
        {Object.entries(CATEGORIES).map(([catId, cat]) => {
          const Icon = iconMap[cat.icon] || Box;
          const calcs = categoryCalcs[catId] || [];
          const expanded = expandedCats[catId] || isInCategory(catId);

          return (
            <div key={catId}>
              <button
                onClick={() => toggleCat(catId)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isInCategory(catId)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{cat.name}</span>
                <span className="text-[11px] text-gray-400 mr-1">{calcs.length}</span>
                {expanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {expanded && (
                <div className="ml-5 pl-3 border-l-2 border-gray-100 space-y-0.5 mt-1 mb-2">
                  {calcs.map((calc) => (
                    <Link
                      key={calc.id}
                      href={`/calculators/${calc.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-[13px] transition-colors ${
                        isActive(`/calculators/${calc.id}`)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {calc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-[11px] text-gray-400 text-center">
          İnşaat Hesaplama Araçları · 30 Modül
        </p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary-600" />
          <span className="font-bold text-gray-900">Yapı Hesap</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-20">
        <NavContent />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="pt-20 lg:pt-8 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
