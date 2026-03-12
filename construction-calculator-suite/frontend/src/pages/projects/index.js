/**
 * Projeler Listesi Sayfası
 * Proje oluştur, ara ve yönet
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import * as storage from '../../lib/storage';
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Calculator,
  X,
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  // Yeni proje modal durumu
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // URL'de ?new=true varsa modalı aç
  useEffect(() => {
    if (router.query.new === 'true') setShowNewModal(true);
  }, [router.query]);

  const fetchProjects = useCallback(() => {
    const data = storage.getProjects(search);
    setProjects(data.projects || []);
    setTotal(data.total || 0);
    setMounted(true);
  }, [search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function handleCreateProject(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    storage.createProject(newName.trim(), newDesc.trim());
    setNewName('');
    setNewDesc('');
    setShowNewModal(false);
    fetchProjects();
  }

  function handleDelete(id, name) {
    if (!confirm(`"${name}" projesini silmek istediğinize emin misiniz? Tüm hesaplamaları da silinecektir.`)) return;
    storage.deleteProject(id);
    fetchProjects();
  }

  return (
    <Layout>
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projeler</h1>
          <p className="text-gray-500 mt-1">Toplam {mounted ? total : '—'} proje</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Proje
        </button>
      </div>

      {/* Arama */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Proje ara..."
          className="input-field !pl-11"
        />
      </div>

      {/* Proje Listesi */}
      {!mounted ? null : projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {search ? 'Proje bulunamadı' : 'Henüz proje yok'}
          </h2>
          <p className="text-gray-500 mb-6">
            {search
              ? 'Farklı bir arama terimi deneyin'
              : 'Hesaplamalarınızı düzenlemek için ilk projenizi oluşturun'}
          </p>
          {!search && (
            <button onClick={() => setShowNewModal(true)} className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Proje Oluştur
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="card-hover group relative">
              <Link href={`/projects/${project.id}`} className="block">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {project.project_name}
                    </h3>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {project.status === 'active' ? 'Aktif' : project.status}
                    </span>
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calculator className="h-3.5 w-3.5" />
                    {project.calculation_count || 0} hesaplama
                  </span>
                  <span>{new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </Link>

              {/* Sil butonu */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.project_name); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni Proje Modalı */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Yeni Proje</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="label">Proje Adı</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="örn. Merkez Ofis Binası"
                  required
                  className="input-field"
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Açıklama (isteğe bağlı)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Proje hakkında kısa açıklama"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Proje Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn-secondary"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
