import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import CalculatorForm from '../../components/CalculatorForm';
import { CALCULATOR_TYPES, CATEGORIES } from '../../lib/calculators';
import {
  Box,
  Construction,
  Mountain,
  BrickWall,
  Square,
  Home,
  DollarSign,
  Calculator,
  ChevronLeft,
} from 'lucide-react';

const iconMap = { Box, Construction, Mountain, BrickWall, Square, Home, DollarSign };

export default function CalculatorPage() {
  const router = useRouter();
  const { type } = router.query;

  const calc = type ? CALCULATOR_TYPES[type] : null;

  if (!calc) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hesap Aracı Bulunamadı</h2>
          <p className="text-gray-500 mb-6">
            &quot;{type}&quot; adında bir hesap aracı mevcut değil.
          </p>
          <Link href="/" className="btn-primary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </Layout>
    );
  }

  const category = CATEGORIES[calc.category];
  const Icon = iconMap[calc.icon] || Calculator;

  return (
    <Layout>
      {/* Üst gezinme */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Ana Sayfa
      </Link>

      {/* Başlık */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`p-4 rounded-xl text-white ${calc.color} flex-shrink-0`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full text-white ${category?.color || 'bg-gray-500'}`}>
              {category?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{calc.name}</h1>
          <p className="text-gray-500 mt-1">{calc.description}</p>
        </div>
      </div>

      {/* Hesap Formu */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CalculatorForm calculatorType={type} />
      </div>
    </Layout>
  );
}
