/**
 * Hesap Makinesi Sayfası (Dinamik)
 * URL parametresine göre ilgili hesap formunu gösterir
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import CalculatorForm from '../../components/CalculatorForm';
import { getProjects } from '../../lib/storage';
import { CALCULATOR_TYPES } from '../../lib/calculators';
import {
  Box,
  Cylinder,
  Mountain,
  BrickWall,
  DollarSign,
  Calculator,
  ChevronLeft,
  FolderOpen,
} from 'lucide-react';

const iconMap = { Box, Cylinder, Mountain, BrickWall, DollarSign };

export default function CalculatorPage() {
  const router = useRouter();
  const { type, projectId } = router.query;

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || '');

  const calc = type ? CALCULATOR_TYPES[type] : null;

  // Proje listesini localStorage'dan yükle
  useEffect(() => {
    const data = getProjects();
    setProjects(data.projects || []);
  }, []);

  // URL query'den gelen projectId'yi seç
  useEffect(() => {
    if (projectId) setSelectedProject(projectId);
  }, [projectId]);

  if (!calc) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hesap Aracı Bulunamadı</h2>
          <p className="text-gray-500 mb-6">
            &quot;{type}&quot; adında bir hesap aracı mevcut değil.
          </p>
          <Link href="/calculators" className="btn-primary">
            Hesap Araçlarına Dön
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = iconMap[calc.icon] || Calculator;

  return (
    <Layout>
      {/* Üst gezinme */}
      <Link
        href="/calculators"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Hesap Araçlarına Dön
      </Link>

      {/* Başlık */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`p-4 rounded-xl text-white ${calc.color} flex-shrink-0`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{calc.name}</h1>
          <p className="text-gray-500 mt-1">{calc.description}</p>
        </div>
      </div>

      {/* Projeye Kaydet Seçimi */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-3">
          <FolderOpen className="h-5 w-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">
            Projeye Kaydet (isteğe bağlı)
          </label>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="input-field max-w-md"
        >
          <option value="">Proje seçilmedi — sadece geçmişe kaydet</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.project_name}
            </option>
          ))}
        </select>
      </div>

      {/* Hesap Formu */}
      <div className="card">
        <CalculatorForm
          calculatorType={type}
          projectId={selectedProject || null}
          onSaved={() => {}}
        />
      </div>
    </Layout>
  );
}
