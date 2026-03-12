/**
 * Ana Panel Sayfası
 * İstatistikler, son hesaplamalar ve hızlı erişim bağlantıları
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getProjects, getCalculations } from '../lib/storage';
import { CALCULATOR_LIST, CALCULATOR_TYPES } from '../lib/calculators';
import {
  Box,
  Cylinder,
  Mountain,
  BrickWall,
  DollarSign,
  FolderOpen,
  Calculator,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';

const iconMap = { Box, Cylinder, Mountain, BrickWall, DollarSign };

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, calculations: 0 });
  const [recentCalcs, setRecentCalcs] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const projectsData = getProjects();
    const calcsData = getCalculations({ limit: 5 });
    setStats({
      projects: projectsData.total || 0,
      calculations: calcsData.total || 0,
    });
    setRecentCalcs(calcsData.calculations || []);
  }, []);

  return (
    <Layout>
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Ana Panel
        </h1>
        <p className="text-gray-500 mt-1">İnşaat hesaplama araçlarınıza genel bakış</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-xl">
            <FolderOpen className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {mounted ? stats.projects : '—'}
            </p>
            <p className="text-sm text-gray-500">Proje</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Calculator className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {mounted ? stats.calculations : '—'}
            </p>
            <p className="text-sm text-gray-500">Hesaplama</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {mounted && recentCalcs.length > 0
                ? new Date(recentCalcs[0].created_at).toLocaleDateString('tr-TR')
                : '—'}
            </p>
            <p className="text-sm text-gray-500">Son İşlem</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hızlı Erişim Hesap Araçları */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Hesap Araçları</h2>
            <Link
              href="/calculators"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Tümünü gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CALCULATOR_LIST.map((calc) => {
              const Icon = iconMap[calc.icon] || Calculator;
              return (
                <Link
                  key={calc.id}
                  href={`/calculators/${calc.id}`}
                  className="card-hover flex items-center gap-4"
                >
                  <div className={`p-3 rounded-xl text-white ${calc.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{calc.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{calc.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Son Hesaplamalar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Son Hesaplamalar</h2>
          </div>
          <div className="card space-y-3">
            {!mounted || recentCalcs.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Henüz hesaplama yapılmadı</p>
                <Link href="/calculators" className="text-sm text-primary-600 font-medium mt-2 inline-block">
                  İlk hesaplamanızı yapın
                </Link>
              </div>
            ) : (
              recentCalcs.map((calc) => (
                <div
                  key={calc.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {CALCULATOR_TYPES[calc.calculator_type]?.name || calc.calculator_type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(calc.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <Link
                    href={`/calculators/${calc.calculator_type}`}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Aç
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Hızlı Proje Oluştur */}
          <Link
            href="/projects?new=true"
            className="mt-4 card-hover flex items-center gap-3 !p-4"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <Plus className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Yeni Proje Oluştur</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
