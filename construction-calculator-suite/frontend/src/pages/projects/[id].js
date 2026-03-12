/**
 * Proje Detay Sayfası
 * Proje bilgileri ve ilişkili hesaplamaları gösterir
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import * as storage from '../../lib/storage';
import { CALCULATOR_TYPES } from '../../lib/calculators';
import {
  ChevronLeft,
  Calculator,
  Trash2,
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetchProject = useCallback(() => {
    if (!id) return;
    const data = storage.getProject(id);
    setProject(data);
    if (data) {
      setEditName(data.project_name);
      setEditDesc(data.description || '');
    }
    setMounted(true);
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  function handleSaveEdit() {
    storage.updateProject(id, {
      projectName: editName,
      description: editDesc,
    });
    setEditing(false);
    fetchProject();
  }

  function handleDeleteCalc(calcId) {
    if (!confirm('Bu hesaplamayı silmek istediğinize emin misiniz?')) return;
    storage.deleteCalculation(calcId);
    fetchProject();
  }

  if (!mounted) return null;

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proje Bulunamadı</h2>
          <Link href="/projects" className="btn-primary mt-4">
            Projelere Dön
          </Link>
        </div>
      </Layout>
    );
  }

  const calculations = project.calculations || [];

  return (
    <Layout>
      {/* Üst gezinme */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Projelere Dön
      </Link>

      {/* Proje Başlığı */}
      <div className="card mb-6">
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input-field text-xl font-bold"
              autoFocus
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Proje açıklaması"
              rows={2}
              className="input-field resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="btn-primary !py-2 !px-4">
                <Check className="h-4 w-4 mr-1" /> Kaydet
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary !py-2 !px-4">
                <X className="h-4 w-4 mr-1" /> İptal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.project_name}</h1>
              {project.description && (
                <p className="text-gray-500 mt-1">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>Durum: <span className="text-gray-700 font-medium">{project.status === 'active' ? 'Aktif' : project.status}</span></span>
                <span>Oluşturulma: {new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                <span>{calculations.length} hesaplama</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(true)} className="btn-secondary !py-2 !px-3">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hesaplama Ekle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Hesaplamalar</h2>
        <div className="flex gap-2">
          {Object.keys(CALCULATOR_TYPES).map((type) => (
            <Link
              key={type}
              href={`/calculators/${type}?projectId=${id}`}
              className="text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors hidden sm:inline-block"
            >
              + {CALCULATOR_TYPES[type].name}
            </Link>
          ))}
          <Link
            href={`/calculators/concrete_volume?projectId=${id}`}
            className="sm:hidden btn-primary !py-2 !px-4 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Ekle
          </Link>
        </div>
      </div>

      {/* Hesaplama Listesi */}
      {calculations.length === 0 ? (
        <div className="card text-center py-12">
          <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Bu projede henüz hesaplama yok</p>
          <Link
            href={`/calculators/concrete_volume?projectId=${id}`}
            className="btn-primary"
          >
            İlk Hesaplamayı Yap
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => {
            const formatted = CALCULATOR_TYPES[calc.calculator_type]?.formatResult?.(calc.result_data) || [];
            const highlight = formatted.find((f) => f.highlight);

            return (
              <div key={calc.id} className="card group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${
                        CALCULATOR_TYPES[calc.calculator_type]?.color || 'bg-gray-500'
                      }`}>
                        {CALCULATOR_TYPES[calc.calculator_type]?.name || calc.calculator_type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(calc.created_at).toLocaleString('tr-TR')}
                      </span>
                    </div>

                    {/* Ana Sonuç */}
                    {highlight && (
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {highlight.label}: {highlight.value}
                      </p>
                    )}

                    {/* Girdi özeti */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(calc.input_data).map(([key, val]) => (
                        <span key={key} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                          {key.replace(/_/g, ' ')}: {val}
                        </span>
                      ))}
                    </div>

                    {calc.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{calc.notes}</p>
                    )}
                  </div>

                  {/* Sil */}
                  <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteCalc(calc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
