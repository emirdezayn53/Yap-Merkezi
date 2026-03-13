import Link from 'next/link';
import Layout from '../components/Layout';
import { CATEGORIES, getCalculatorsByCategory } from '../lib/calculators';
import {
  Box,
  Construction,
  Mountain,
  BrickWall,
  Square,
  Home,
  DollarSign,
  ArrowRight,
  Calculator,
} from 'lucide-react';

const iconMap = { Box, Construction, Mountain, BrickWall, Square, Home, DollarSign };

export default function DashboardPage() {
  const grouped = getCalculatorsByCategory();

  return (
    <Layout>
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          İnşaat Hesaplama Araçları
        </h1>
        <p className="text-gray-500 mt-1">
          30 farklı hesaplama aracı ile inşaat projelerinizi kolayca planlayın
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-primary-600">30</p>
          <p className="text-xs text-gray-500 mt-1">Hesap Aracı</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">7</p>
          <p className="text-xs text-gray-500 mt-1">Kategori</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">%100</p>
          <p className="text-xs text-gray-500 mt-1">Türkçe</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">Anlık</p>
          <p className="text-xs text-gray-500 mt-1">Hesaplama</p>
        </div>
      </div>

      {/* Kategoriler ve Hesap Araçları */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([catId, cat]) => {
          const Icon = iconMap[cat.icon] || Calculator;
          return (
            <section key={catId}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl text-white ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{cat.name}</h2>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                <span className="ml-auto text-sm font-medium text-gray-400">
                  {cat.calculators.length} araç
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.calculators.map((calc) => (
                  <Link
                    key={calc.id}
                    href={`/calculators/${calc.id}`}
                    className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {calc.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 flex-shrink-0 mt-0.5 ml-2 transition-colors" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {calc.fields.slice(0, 3).map((f) => (
                        <span
                          key={f.key}
                          className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                        >
                          {f.label}
                        </span>
                      ))}
                      {calc.fields.length > 3 && (
                        <span className="text-[11px] text-gray-400">
                          +{calc.fields.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}
