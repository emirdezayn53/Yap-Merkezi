/**
 * Karşılama Sayfası
 * Özellikler ve hızlı erişim butonları ile tanıtım sayfası
 */

import Link from 'next/link';
import {
  HardHat,
  Calculator,
  Box,
  Cylinder,
  Mountain,
  BrickWall,
  DollarSign,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Beton Hesaplama',
    desc: 'Kolon ve kiriş beton hacimlerini anında hesaplayın',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: Cylinder,
    title: 'Demir Metraj Hesaplama',
    desc: 'İnşaat demiri ağırlık hesabını hassas şekilde yapın',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: Mountain,
    title: 'Hafriyat Hesaplama',
    desc: 'Kazı hacimleri ve kabartma faktörü hesabı',
    color: 'text-amber-700 bg-amber-100',
  },
  {
    icon: BrickWall,
    title: 'Duvar Malzeme Hesaplama',
    desc: 'Tuğla adedi ve harç miktarı tahmini',
    color: 'text-red-600 bg-red-100',
  },
  {
    icon: DollarSign,
    title: 'Maliyet Hesaplama',
    desc: 'Toplam proje maliyeti ve m² birim maliyet tahmini',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Smartphone,
    title: 'Mobil Uyumlu',
    desc: 'Şantiyede telefonunuzdan veya ofiste masaüstünüzden kullanın',
    color: 'text-purple-600 bg-purple-100',
  },
];

const benefits = [
  'Her hafta saatler süren manuel hesaplamalardan kurtulun',
  'Tüm proje verilerinizi tek bir yerde düzenli tutun',
  'Masaüstü, tablet veya telefondan erişim sağlayın',
  'Hesaplama geçmişinizi tüm projeleriniz için takip edin',
  'Anında sonuç — internet bağlantısı gerekmez',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ==================== NAVBAR ==================== */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Yapı Hesap</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm !px-5 !py-2.5">
            Hesaplamaya Başla
          </Link>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-orange-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Calculator className="h-4 w-4" />
              İnşaat Mühendisleri İçin Tasarlandı
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              İnşaat Hesaplamaları,{' '}
              <span className="text-primary-600">Kolaylaştırıldı</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Beton, demir, hafriyat ve maliyet hesaplamalarınız için hepsi bir arada araç.
              Zamandan tasarruf edin, hataları azaltın, projelerinizi güvenle yönetin.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="btn-primary text-base !px-8 !py-4 w-full sm:w-auto">
                Ana Panele Git
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link href="/calculators" className="btn-secondary text-base !px-8 !py-4 w-full sm:w-auto">
                Hesap Araçları
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ÖZELLİKLER ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              5 Temel Hesap Aracı
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              İnşaat mühendisinin günlük şantiye hesaplamaları için ihtiyacı olan her şey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card-hover">
                  <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== AVANTAJLAR ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Neden Yapı Hesap?
              </h2>
              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-8 w-8" />
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Hızlı ve Mobil Uyumlu</h3>
              <p className="text-primary-100 leading-relaxed">
                Tüm hesaplamalar tarayıcınızda anında çalışır.
                Şantiyede telefonunuzdan veya ofiste masaüstünden &mdash;
                sunucu ya da internet bağlantısı gerektirmez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hesaplamalarınızı Basitleştirmeye Hazır mısınız?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Yapı Hesap ile hemen hesaplamaya başlayın — kayıt gerektirmez.
          </p>
          <Link href="/dashboard" className="btn-primary text-base !px-10 !py-4 !bg-white !text-gray-900 hover:!bg-gray-100">
            Hemen Başla
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* ==================== ALT BİLGİ ==================== */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Yapı Hesap &mdash; İnşaat Mühendisleri İçin Hesaplama Aracı
        </div>
      </footer>
    </div>
  );
}
