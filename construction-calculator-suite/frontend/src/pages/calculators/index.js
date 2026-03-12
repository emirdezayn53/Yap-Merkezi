/**
 * Hesap Araçları Dizin Sayfası
 * Tüm hesap araçlarının kart görünümünde listesi
 */

import Link from 'next/link';
import Layout from '../../components/Layout';
import { CALCULATOR_LIST } from '../../lib/calculators';
import {
  Box,
  Cylinder,
  Mountain,
  BrickWall,
  DollarSign,
  Calculator,
  ArrowRight,
} from 'lucide-react';

const iconMap = { Box, Cylinder, Mountain, BrickWall, DollarSign };

export default function CalculatorsPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hesap Araçları</h1>
        <p className="text-gray-500 mt-1">
          Bir hesap aracı seçin. Sonuçları herhangi bir projeye kaydedebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CALCULATOR_LIST.map((calc) => {
          const Icon = iconMap[calc.icon] || Calculator;
          return (
            <Link
              key={calc.id}
              href={`/calculators/${calc.id}`}
              className="card-hover group"
            >
              <div className={`inline-flex p-4 rounded-xl text-white ${calc.color} mb-4`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                {calc.name}
                <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {calc.fields.map((f) => (
                  <span
                    key={f.key}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                  >
                    {f.label}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
