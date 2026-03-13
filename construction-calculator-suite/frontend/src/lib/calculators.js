/**
 * İnşaat Hesap Araçları - 30 Modül
 * Kategoriler, giriş alanları, formüller ve sonuç biçimleri
 */

export const CATEGORIES = {
  beton: {
    id: 'beton',
    name: 'Beton Hesaplama',
    description: 'Beton hacim, mikser ve yapısal hesaplamalar',
    icon: 'Box',
    color: 'bg-blue-600',
  },
  demir: {
    id: 'demir',
    name: 'Demir Metraj',
    description: 'Demir ağırlık ve tonaj hesaplamaları',
    icon: 'Construction',
    color: 'bg-red-600',
  },
  hafriyat: {
    id: 'hafriyat',
    name: 'Hafriyat Hesaplama',
    description: 'Kazı ve dolgu hacim hesaplamaları',
    icon: 'Mountain',
    color: 'bg-amber-600',
  },
  duvar: {
    id: 'duvar',
    name: 'Duvar Hesaplama',
    description: 'Tuğla, gazbeton, harç, sıva ve boya',
    icon: 'BrickWall',
    color: 'bg-orange-600',
  },
  kaplama: {
    id: 'kaplama',
    name: 'Kaplama Hesaplama',
    description: 'Seramik, parke ve alçıpan hesaplamaları',
    icon: 'Square',
    color: 'bg-teal-600',
  },
  cati: {
    id: 'cati',
    name: 'Çatı Hesaplama',
    description: 'Çatı alanı ve kiremit hesaplamaları',
    icon: 'Home',
    color: 'bg-green-600',
  },
  maliyet: {
    id: 'maliyet',
    name: 'Maliyet Hesaplama',
    description: 'Maliyet, işçilik ve şantiye yönetimi',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
  },
};

export const CALCULATOR_TYPES = {

  // ===================== BETON HESAPLAMALARI =====================

  beton_hacmi: {
    name: 'Beton Hacmi Hesabı',
    description: 'Döküm için gerekli beton hacmini hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'genislik', label: 'Genişlik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'uzunluk', label: 'Uzunluk', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'yukseklik', label: 'Yükseklik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'adet', label: 'Adet', unit: 'adet', type: 'number', defaultValue: 1 },
    ],
    calculate: (v) => {
      const hacim = v.genislik * v.uzunluk * v.yukseklik * v.adet;
      return { hacim };
    },
    formatResult: (r) => [
      { label: 'Toplam Beton Hacmi', value: `${r.hacim.toFixed(2)} m³`, highlight: true },
    ],
  },

  beton_mikser: {
    name: 'Beton Mikser Hesabı',
    description: 'Gerekli transmikser (kamyon) sayısını hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'toplam_m3', label: 'Toplam Beton', unit: 'm³', type: 'number', defaultValue: '' },
      { key: 'mikser_kapasitesi', label: 'Mikser Kapasitesi', unit: 'm³', type: 'number', defaultValue: 7 },
    ],
    calculate: (v) => {
      const mikser = Math.ceil(v.toplam_m3 / v.mikser_kapasitesi);
      return { mikser, toplam_m3: v.toplam_m3 };
    },
    formatResult: (r) => [
      { label: 'Gereken Mikser Sayısı', value: `${r.mikser} adet`, highlight: true },
      { label: 'Toplam Beton', value: `${r.toplam_m3} m³` },
    ],
  },

  kolon_donati: {
    name: 'Kolon Donatı Hesabı',
    description: 'Kolon boyuna ve etriye donatı ağırlığını hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'kolon_sayisi', label: 'Kolon Sayısı', unit: 'adet', type: 'number', defaultValue: '' },
      { key: 'kolon_yuksekligi', label: 'Kolon Yüksekliği', unit: 'm', type: 'number', defaultValue: 3 },
      { key: 'boy_capi', label: 'Boyuna Donatı Çapı', unit: 'mm', type: 'number', defaultValue: 16 },
      { key: 'boy_adedi', label: 'Boyuna Donatı Adedi', unit: 'adet', type: 'number', defaultValue: 8 },
      { key: 'etriye_capi', label: 'Etriye Çapı', unit: 'mm', type: 'number', defaultValue: 8 },
      { key: 'etriye_araligi', label: 'Etriye Aralığı', unit: 'cm', type: 'number', defaultValue: 15 },
      { key: 'etriye_cevresi', label: 'Etriye Çevresi', unit: 'cm', type: 'number', defaultValue: 120 },
    ],
    calculate: (v) => {
      const boy_kg_birim = (v.boy_capi * v.boy_capi / 162) * v.kolon_yuksekligi;
      const boy_toplam = boy_kg_birim * v.boy_adedi * v.kolon_sayisi;
      const etriye_adet = Math.ceil((v.kolon_yuksekligi * 100) / v.etriye_araligi) + 1;
      const etriye_kg_birim = (v.etriye_capi * v.etriye_capi / 162) * (v.etriye_cevresi / 100);
      const etriye_toplam = etriye_kg_birim * etriye_adet * v.kolon_sayisi;
      return { boy_toplam, etriye_toplam, toplam: boy_toplam + etriye_toplam };
    },
    formatResult: (r) => [
      { label: 'Toplam Donatı Ağırlığı', value: `${r.toplam.toFixed(1)} kg`, highlight: true },
      { label: 'Boyuna Donatı', value: `${r.boy_toplam.toFixed(1)} kg` },
      { label: 'Etriye Donatı', value: `${r.etriye_toplam.toFixed(1)} kg` },
    ],
  },

  kiris_donati: {
    name: 'Kiriş Donatı Hesabı',
    description: 'Kiriş donatı ağırlığını hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'kiris_sayisi', label: 'Kiriş Sayısı', unit: 'adet', type: 'number', defaultValue: '' },
      { key: 'kiris_uzunlugu', label: 'Kiriş Uzunluğu', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'alt_capi', label: 'Alt Donatı Çapı', unit: 'mm', type: 'number', defaultValue: 14 },
      { key: 'alt_adedi', label: 'Alt Donatı Adedi', unit: 'adet', type: 'number', defaultValue: 4 },
      { key: 'ust_capi', label: 'Üst Donatı Çapı', unit: 'mm', type: 'number', defaultValue: 12 },
      { key: 'ust_adedi', label: 'Üst Donatı Adedi', unit: 'adet', type: 'number', defaultValue: 2 },
      { key: 'etriye_capi', label: 'Etriye Çapı', unit: 'mm', type: 'number', defaultValue: 8 },
      { key: 'etriye_araligi', label: 'Etriye Aralığı', unit: 'cm', type: 'number', defaultValue: 15 },
      { key: 'etriye_cevresi', label: 'Etriye Çevresi', unit: 'cm', type: 'number', defaultValue: 100 },
    ],
    calculate: (v) => {
      const alt_kg = (v.alt_capi * v.alt_capi / 162) * v.kiris_uzunlugu * v.alt_adedi * v.kiris_sayisi;
      const ust_kg = (v.ust_capi * v.ust_capi / 162) * v.kiris_uzunlugu * v.ust_adedi * v.kiris_sayisi;
      const etriye_adet = Math.ceil((v.kiris_uzunlugu * 100) / v.etriye_araligi) + 1;
      const etriye_kg = (v.etriye_capi * v.etriye_capi / 162) * (v.etriye_cevresi / 100) * etriye_adet * v.kiris_sayisi;
      return { alt_kg, ust_kg, etriye_kg, toplam: alt_kg + ust_kg + etriye_kg };
    },
    formatResult: (r) => [
      { label: 'Toplam Donatı Ağırlığı', value: `${r.toplam.toFixed(1)} kg`, highlight: true },
      { label: 'Alt Donatı', value: `${r.alt_kg.toFixed(1)} kg` },
      { label: 'Üst Donatı', value: `${r.ust_kg.toFixed(1)} kg` },
      { label: 'Etriye', value: `${r.etriye_kg.toFixed(1)} kg` },
    ],
  },

  doseme_beton: {
    name: 'Döşeme Beton Hesabı',
    description: 'Döşeme için gerekli beton miktarını hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'uzunluk', label: 'Uzunluk', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'genislik', label: 'Genişlik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'kalinlik', label: 'Kalınlık', unit: 'cm', type: 'number', defaultValue: 15 },
    ],
    calculate: (v) => {
      const alan = v.uzunluk * v.genislik;
      const hacim = alan * (v.kalinlik / 100);
      return { alan, hacim };
    },
    formatResult: (r) => [
      { label: 'Beton Hacmi', value: `${r.hacim.toFixed(2)} m³`, highlight: true },
      { label: 'Döşeme Alanı', value: `${r.alan.toFixed(2)} m²` },
    ],
  },

  temel_beton: {
    name: 'Temel Beton Hesabı',
    description: 'Temel için gerekli beton miktarını hesaplar',
    category: 'beton',
    icon: 'Box',
    color: 'bg-blue-600',
    fields: [
      { key: 'uzunluk', label: 'Uzunluk', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'genislik', label: 'Genişlik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'yukseklik', label: 'Yükseklik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'adet', label: 'Adet', unit: 'adet', type: 'number', defaultValue: 1 },
    ],
    calculate: (v) => {
      const birim_hacim = v.uzunluk * v.genislik * v.yukseklik;
      const toplam = birim_hacim * v.adet;
      return { birim_hacim, toplam };
    },
    formatResult: (r) => [
      { label: 'Toplam Beton Hacmi', value: `${r.toplam.toFixed(2)} m³`, highlight: true },
      { label: 'Birim Hacim', value: `${r.birim_hacim.toFixed(2)} m³` },
    ],
  },

  // ===================== DEMİR HESAPLAMALARI =====================

  demir_metraj: {
    name: 'Demir Metraj Hesabı',
    description: 'Demir çapı, uzunluk ve adetten toplam ağırlığı hesaplar',
    category: 'demir',
    icon: 'Construction',
    color: 'bg-red-600',
    fields: [
      { key: 'demir_capi', label: 'Demir Çapı', unit: 'mm', type: 'number', defaultValue: '' },
      { key: 'uzunluk', label: 'Uzunluk', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'adet', label: 'Adet', unit: 'adet', type: 'number', defaultValue: 1 },
    ],
    calculate: (v) => {
      const kg = (v.demir_capi * v.demir_capi / 162) * v.uzunluk * v.adet;
      return { kg };
    },
    formatResult: (r) => [
      { label: 'Toplam Ağırlık', value: `${r.kg.toFixed(2)} kg`, highlight: true },
      { label: 'Tonaj', value: `${(r.kg / 1000).toFixed(3)} ton` },
    ],
  },

  demir_tonaj: {
    name: 'Demir Tonaj Hesabı',
    description: 'Kilogramdan tonaja çevirir',
    category: 'demir',
    icon: 'Construction',
    color: 'bg-red-600',
    fields: [
      { key: 'toplam_kg', label: 'Toplam Demir Ağırlığı', unit: 'kg', type: 'number', defaultValue: '' },
    ],
    calculate: (v) => {
      const ton = v.toplam_kg / 1000;
      return { ton, kg: v.toplam_kg };
    },
    formatResult: (r) => [
      { label: 'Tonaj', value: `${r.ton.toFixed(3)} ton`, highlight: true },
      { label: 'Kilogram', value: `${r.kg} kg` },
    ],
  },

  // ===================== HAFRİYAT HESAPLAMALARI =====================

  hafriyat: {
    name: 'Hafriyat Hesabı',
    description: 'Kazı hacmini hesaplar',
    category: 'hafriyat',
    icon: 'Mountain',
    color: 'bg-amber-600',
    fields: [
      { key: 'uzunluk', label: 'Uzunluk', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'genislik', label: 'Genişlik', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'derinlik', label: 'Derinlik', unit: 'm', type: 'number', defaultValue: '' },
    ],
    calculate: (v) => {
      const hacim = v.uzunluk * v.genislik * v.derinlik;
      const kamyon = Math.ceil(hacim / 10);
      return { hacim, kamyon };
    },
    formatResult: (r) => [
      { label: 'Kazı Hacmi', value: `${r.hacim.toFixed(2)} m³`, highlight: true },
      { label: 'Tahmini Kamyon (10m³)', value: `${r.kamyon} sefer` },
    ],
  },

  dolgu: {
    name: 'Dolgu Hesabı',
    description: 'Dolgu hacmini hesaplar',
    category: 'hafriyat',
    icon: 'Mountain',
    color: 'bg-amber-600',
    fields: [
      { key: 'alan', label: 'Alan', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'yukseklik', label: 'Yükseklik', unit: 'm', type: 'number', defaultValue: '' },
    ],
    calculate: (v) => {
      const hacim = v.alan * v.yukseklik;
      return { hacim };
    },
    formatResult: (r) => [
      { label: 'Dolgu Hacmi', value: `${r.hacim.toFixed(2)} m³`, highlight: true },
    ],
  },

  // ===================== DUVAR HESAPLAMALARI =====================

  tugla: {
    name: 'Tuğla Hesabı',
    description: 'Duvar için gerekli tuğla adedini hesaplar',
    category: 'duvar',
    icon: 'BrickWall',
    color: 'bg-orange-600',
    fields: [
      { key: 'duvar_uzunlugu', label: 'Duvar Uzunluğu', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'duvar_yuksekligi', label: 'Duvar Yüksekliği', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'tugla_m2', label: 'Tuğla Adedi (m² başına)', unit: 'adet/m²', type: 'number', defaultValue: 55 },
    ],
    calculate: (v) => {
      const alan = v.duvar_uzunlugu * v.duvar_yuksekligi;
      const adet = Math.ceil(alan * v.tugla_m2);
      return { alan, adet };
    },
    formatResult: (r) => [
      { label: 'Gereken Tuğla', value: `${r.adet} adet`, highlight: true },
      { label: 'Duvar Alanı', value: `${r.alan.toFixed(2)} m²` },
    ],
  },

  gazbeton: {
    name: 'Gazbeton Hesabı',
    description: 'Duvar için gerekli gazbeton blok sayısını hesaplar',
    category: 'duvar',
    icon: 'BrickWall',
    color: 'bg-orange-600',
    fields: [
      { key: 'duvar_uzunlugu', label: 'Duvar Uzunluğu', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'duvar_yuksekligi', label: 'Duvar Yüksekliği', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'blok_uzunlugu', label: 'Blok Uzunluğu', unit: 'cm', type: 'number', defaultValue: 60 },
      { key: 'blok_yuksekligi', label: 'Blok Yüksekliği', unit: 'cm', type: 'number', defaultValue: 25 },
    ],
    calculate: (v) => {
      const alan = v.duvar_uzunlugu * v.duvar_yuksekligi;
      const blok_alani = (v.blok_uzunlugu / 100) * (v.blok_yuksekligi / 100);
      const adet = Math.ceil(alan / blok_alani);
      return { alan, adet };
    },
    formatResult: (r) => [
      { label: 'Gereken Gazbeton', value: `${r.adet} adet`, highlight: true },
      { label: 'Duvar Alanı', value: `${r.alan.toFixed(2)} m²` },
    ],
  },

  harc: {
    name: 'Harç Hesabı',
    description: 'Harç miktarını ve malzeme gereksinimini hesaplar',
    category: 'duvar',
    icon: 'BrickWall',
    color: 'bg-orange-600',
    fields: [
      { key: 'alan', label: 'Uygulama Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'kalinlik', label: 'Harç Kalınlığı', unit: 'cm', type: 'number', defaultValue: 2 },
    ],
    calculate: (v) => {
      const hacim = v.alan * (v.kalinlik / 100);
      const cimento = hacim * 300;
      const kum = hacim * 1.1;
      return { hacim, cimento, kum };
    },
    formatResult: (r) => [
      { label: 'Harç Hacmi', value: `${r.hacim.toFixed(3)} m³`, highlight: true },
      { label: 'Çimento', value: `${r.cimento.toFixed(0)} kg` },
      { label: 'Kum', value: `${r.kum.toFixed(2)} m³` },
    ],
  },

  siva: {
    name: 'Sıva Hesabı',
    description: 'Sıva malzeme miktarını hesaplar',
    category: 'duvar',
    icon: 'BrickWall',
    color: 'bg-orange-600',
    fields: [
      { key: 'alan', label: 'Sıva Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'kalinlik', label: 'Sıva Kalınlığı', unit: 'cm', type: 'number', defaultValue: 2 },
    ],
    calculate: (v) => {
      const hacim = v.alan * (v.kalinlik / 100);
      const cimento = hacim * 350;
      const kum = hacim * 1.2;
      return { hacim, cimento, kum, alan: v.alan };
    },
    formatResult: (r) => [
      { label: 'Sıva Hacmi', value: `${r.hacim.toFixed(3)} m³`, highlight: true },
      { label: 'Çimento', value: `${r.cimento.toFixed(0)} kg` },
      { label: 'Kum', value: `${r.kum.toFixed(2)} m³` },
      { label: 'Sıva Alanı', value: `${r.alan} m²` },
    ],
  },

  boya: {
    name: 'Boya Hesabı',
    description: 'Gereken boya miktarını hesaplar',
    category: 'duvar',
    icon: 'BrickWall',
    color: 'bg-orange-600',
    fields: [
      { key: 'alan', label: 'Boyama Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'kat', label: 'Kat Sayısı', unit: 'kat', type: 'number', defaultValue: 2 },
      { key: 'verim', label: 'Boya Verimi', unit: 'm²/L', type: 'number', defaultValue: 10 },
    ],
    calculate: (v) => {
      const toplam_alan = v.alan * v.kat;
      const litre = toplam_alan / v.verim;
      const teneke = Math.ceil(litre / 2.5);
      return { litre, teneke, toplam_alan };
    },
    formatResult: (r) => [
      { label: 'Gereken Boya', value: `${r.litre.toFixed(1)} litre`, highlight: true },
      { label: 'Teneke (2.5L)', value: `${r.teneke} adet` },
      { label: 'Toplam Boyama Alanı', value: `${r.toplam_alan.toFixed(1)} m²` },
    ],
  },

  // ===================== KAPLAMA HESAPLAMALARI =====================

  seramik: {
    name: 'Seramik Hesabı',
    description: 'Gereken seramik miktarını hesaplar',
    category: 'kaplama',
    icon: 'Square',
    color: 'bg-teal-600',
    fields: [
      { key: 'alan', label: 'Döşeme Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'fire', label: 'Fire Oranı', unit: '%', type: 'number', defaultValue: 10 },
      { key: 'seramik_en', label: 'Seramik Eni', unit: 'cm', type: 'number', defaultValue: 33 },
      { key: 'seramik_boy', label: 'Seramik Boyu', unit: 'cm', type: 'number', defaultValue: 33 },
    ],
    calculate: (v) => {
      const fireli_alan = v.alan * (1 + v.fire / 100);
      const seramik_alani = (v.seramik_en / 100) * (v.seramik_boy / 100);
      const adet = Math.ceil(fireli_alan / seramik_alani);
      return { fireli_alan, adet };
    },
    formatResult: (r) => [
      { label: 'Gereken Seramik', value: `${r.adet} adet`, highlight: true },
      { label: 'Fire Dahil Alan', value: `${r.fireli_alan.toFixed(2)} m²` },
    ],
  },

  parke: {
    name: 'Parke Hesabı',
    description: 'Gereken parke miktarını hesaplar',
    category: 'kaplama',
    icon: 'Square',
    color: 'bg-teal-600',
    fields: [
      { key: 'alan', label: 'Döşeme Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'fire', label: 'Fire Oranı', unit: '%', type: 'number', defaultValue: 10 },
      { key: 'paket_alan', label: 'Paket Alanı', unit: 'm²', type: 'number', defaultValue: 2.22 },
    ],
    calculate: (v) => {
      const fireli_alan = v.alan * (1 + v.fire / 100);
      const paket = Math.ceil(fireli_alan / v.paket_alan);
      return { fireli_alan, paket };
    },
    formatResult: (r) => [
      { label: 'Gereken Paket', value: `${r.paket} paket`, highlight: true },
      { label: 'Fire Dahil Alan', value: `${r.fireli_alan.toFixed(2)} m²` },
    ],
  },

  alcipan: {
    name: 'Alçıpan Hesabı',
    description: 'Gereken alçıpan levha sayısını hesaplar',
    category: 'kaplama',
    icon: 'Square',
    color: 'bg-teal-600',
    fields: [
      { key: 'alan', label: 'Uygulama Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'levha_en', label: 'Levha Eni', unit: 'm', type: 'number', defaultValue: 1.2 },
      { key: 'levha_boy', label: 'Levha Boyu', unit: 'm', type: 'number', defaultValue: 2.4 },
    ],
    calculate: (v) => {
      const levha_alani = v.levha_en * v.levha_boy;
      const adet = Math.ceil(v.alan / levha_alani);
      return { adet, levha_alani, alan: v.alan };
    },
    formatResult: (r) => [
      { label: 'Gereken Levha', value: `${r.adet} adet`, highlight: true },
      { label: 'Levha Alanı', value: `${r.levha_alani.toFixed(2)} m²/adet` },
      { label: 'Toplam Alan', value: `${r.alan} m²` },
    ],
  },

  // ===================== ÇATI HESAPLAMALARI =====================

  cati_alani: {
    name: 'Çatı Alanı Hesabı',
    description: 'Eğimli çatı alanını hesaplar',
    category: 'cati',
    icon: 'Home',
    color: 'bg-green-600',
    fields: [
      { key: 'bina_uzunlugu', label: 'Bina Uzunluğu', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'bina_genisligi', label: 'Bina Genişliği', unit: 'm', type: 'number', defaultValue: '' },
      { key: 'egim', label: 'Çatı Eğimi', unit: 'derece', type: 'number', defaultValue: 30 },
    ],
    calculate: (v) => {
      const radyan = (v.egim * Math.PI) / 180;
      const egimli_uzunluk = (v.bina_genisligi / 2) / Math.cos(radyan);
      const cati_alani = v.bina_uzunlugu * egimli_uzunluk * 2;
      return { cati_alani, egimli_uzunluk };
    },
    formatResult: (r) => [
      { label: 'Çatı Alanı', value: `${r.cati_alani.toFixed(2)} m²`, highlight: true },
      { label: 'Eğimli Uzunluk', value: `${r.egimli_uzunluk.toFixed(2)} m` },
    ],
  },

  kiremit: {
    name: 'Kiremit Hesabı',
    description: 'Gerekli kiremit adedini hesaplar',
    category: 'cati',
    icon: 'Home',
    color: 'bg-green-600',
    fields: [
      { key: 'cati_alani', label: 'Çatı Alanı', unit: 'm²', type: 'number', defaultValue: '' },
      { key: 'kiremit_m2', label: 'Kiremit Adedi (m² başına)', unit: 'adet/m²', type: 'number', defaultValue: 15 },
      { key: 'fire', label: 'Fire Oranı', unit: '%', type: 'number', defaultValue: 5 },
    ],
    calculate: (v) => {
      const fireli_alan = v.cati_alani * (1 + v.fire / 100);
      const adet = Math.ceil(fireli_alan * v.kiremit_m2);
      return { adet, fireli_alan };
    },
    formatResult: (r) => [
      { label: 'Gereken Kiremit', value: `${r.adet} adet`, highlight: true },
      { label: 'Fire Dahil Alan', value: `${r.fireli_alan.toFixed(2)} m²` },
    ],
  },

  // ===================== MALİYET HESAPLAMALARI =====================

  beton_maliyet: {
    name: 'Beton Maliyet Hesabı',
    description: 'Beton maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'beton_m3', label: 'Beton Miktarı', unit: 'm³', type: 'number', defaultValue: '' },
      { key: 'birim_fiyat', label: 'Birim Fiyat', unit: 'TL/m³', type: 'number', defaultValue: 2500 },
      { key: 'pompa', label: 'Pompa Ücreti', unit: 'TL', type: 'number', defaultValue: 5000 },
    ],
    calculate: (v) => {
      const beton_toplam = v.beton_m3 * v.birim_fiyat;
      const genel_toplam = beton_toplam + v.pompa;
      return { beton_toplam, genel_toplam, pompa: v.pompa };
    },
    formatResult: (r) => [
      { label: 'Genel Toplam', value: `${r.genel_toplam.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Beton Bedeli', value: `${r.beton_toplam.toLocaleString('tr-TR')} TL` },
      { label: 'Pompa Ücreti', value: `${r.pompa.toLocaleString('tr-TR')} TL` },
    ],
  },

  demir_maliyet: {
    name: 'Demir Maliyet Hesabı',
    description: 'Demir maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'demir_ton', label: 'Demir Miktarı', unit: 'ton', type: 'number', defaultValue: '' },
      { key: 'birim_fiyat', label: 'Birim Fiyat', unit: 'TL/ton', type: 'number', defaultValue: 25000 },
      { key: 'iscilik_oran', label: 'İşçilik Oranı', unit: '%', type: 'number', defaultValue: 30 },
    ],
    calculate: (v) => {
      const malzeme = v.demir_ton * v.birim_fiyat;
      const iscilik = malzeme * (v.iscilik_oran / 100);
      return { malzeme, iscilik, toplam: malzeme + iscilik };
    },
    formatResult: (r) => [
      { label: 'Toplam Maliyet', value: `${r.toplam.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Malzeme', value: `${r.malzeme.toLocaleString('tr-TR')} TL` },
      { label: 'İşçilik', value: `${r.iscilik.toLocaleString('tr-TR')} TL` },
    ],
  },

  iscilik: {
    name: 'İşçilik Hesabı',
    description: 'İşçilik maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'isci_sayisi', label: 'İşçi Sayısı', unit: 'kişi', type: 'number', defaultValue: '' },
      { key: 'gun_sayisi', label: 'Gün Sayısı', unit: 'gün', type: 'number', defaultValue: '' },
      { key: 'gunluk_ucret', label: 'Günlük Ücret', unit: 'TL', type: 'number', defaultValue: 1500 },
    ],
    calculate: (v) => {
      const toplam = v.isci_sayisi * v.gun_sayisi * v.gunluk_ucret;
      return { toplam, adam_gun: v.isci_sayisi * v.gun_sayisi };
    },
    formatResult: (r) => [
      { label: 'Toplam İşçilik', value: `${r.toplam.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Adam×Gün', value: `${r.adam_gun}` },
    ],
  },

  toplam_maliyet: {
    name: 'Toplam İnşaat Maliyeti',
    description: 'Tüm kalemleri toplayarak toplam maliyeti hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'beton', label: 'Beton Maliyeti', unit: 'TL', type: 'number', defaultValue: 0 },
      { key: 'demir', label: 'Demir Maliyeti', unit: 'TL', type: 'number', defaultValue: 0 },
      { key: 'iscilik', label: 'İşçilik Maliyeti', unit: 'TL', type: 'number', defaultValue: 0 },
      { key: 'malzeme', label: 'Malzeme Maliyeti', unit: 'TL', type: 'number', defaultValue: 0 },
      { key: 'diger', label: 'Diğer Giderler', unit: 'TL', type: 'number', defaultValue: 0 },
    ],
    calculate: (v) => {
      const toplam = v.beton + v.demir + v.iscilik + v.malzeme + v.diger;
      const kdv = toplam * 0.20;
      return { toplam, kdv, genel: toplam + kdv };
    },
    formatResult: (r) => [
      { label: 'KDV Dahil Genel Toplam', value: `${r.genel.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Ara Toplam', value: `${r.toplam.toLocaleString('tr-TR')} TL` },
      { label: 'KDV (%20)', value: `${r.kdv.toLocaleString('tr-TR')} TL` },
    ],
  },

  metrekare_maliyet: {
    name: 'm² İnşaat Maliyeti',
    description: 'Metrekare başına inşaat maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'toplam_maliyet', label: 'Toplam Maliyet', unit: 'TL', type: 'number', defaultValue: '' },
      { key: 'toplam_alan', label: 'Toplam İnşaat Alanı', unit: 'm²', type: 'number', defaultValue: '' },
    ],
    calculate: (v) => {
      const m2_maliyet = v.toplam_maliyet / v.toplam_alan;
      return { m2_maliyet, toplam: v.toplam_maliyet, alan: v.toplam_alan };
    },
    formatResult: (r) => [
      { label: 'm² Maliyeti', value: `${r.m2_maliyet.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL/m²`, highlight: true },
      { label: 'Toplam Maliyet', value: `${r.toplam.toLocaleString('tr-TR')} TL` },
      { label: 'Toplam Alan', value: `${r.alan} m²` },
    ],
  },

  gunluk_iscilik: {
    name: 'Günlük İşçilik Raporu',
    description: 'Günlük işçilik maliyetini pozisyona göre hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'usta_sayisi', label: 'Usta Sayısı', unit: 'kişi', type: 'number', defaultValue: 0 },
      { key: 'usta_ucret', label: 'Usta Günlük Ücret', unit: 'TL', type: 'number', defaultValue: 2500 },
      { key: 'kalfa_sayisi', label: 'Kalfa Sayısı', unit: 'kişi', type: 'number', defaultValue: 0 },
      { key: 'kalfa_ucret', label: 'Kalfa Günlük Ücret', unit: 'TL', type: 'number', defaultValue: 1800 },
      { key: 'isci_sayisi', label: 'İşçi Sayısı', unit: 'kişi', type: 'number', defaultValue: 0 },
      { key: 'isci_ucret', label: 'İşçi Günlük Ücret', unit: 'TL', type: 'number', defaultValue: 1200 },
    ],
    calculate: (v) => {
      const usta = v.usta_sayisi * v.usta_ucret;
      const kalfa = v.kalfa_sayisi * v.kalfa_ucret;
      const isci = v.isci_sayisi * v.isci_ucret;
      const toplam_kisi = v.usta_sayisi + v.kalfa_sayisi + v.isci_sayisi;
      return { usta, kalfa, isci, toplam: usta + kalfa + isci, toplam_kisi };
    },
    formatResult: (r) => [
      { label: 'Günlük Toplam', value: `${r.toplam.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Usta Maliyeti', value: `${r.usta.toLocaleString('tr-TR')} TL` },
      { label: 'Kalfa Maliyeti', value: `${r.kalfa.toLocaleString('tr-TR')} TL` },
      { label: 'İşçi Maliyeti', value: `${r.isci.toLocaleString('tr-TR')} TL` },
      { label: 'Toplam Personel', value: `${r.toplam_kisi} kişi` },
    ],
  },

  is_programi: {
    name: 'İş Programı Süre Hesabı',
    description: 'İş kaleminin tamamlanma süresini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'toplam_is', label: 'Toplam İş Miktarı', unit: 'birim', type: 'number', defaultValue: '' },
      { key: 'gunluk_verim', label: 'Günlük Verim', unit: 'birim/gün', type: 'number', defaultValue: '' },
      { key: 'ekip_sayisi', label: 'Ekip Sayısı', unit: 'ekip', type: 'number', defaultValue: 1 },
    ],
    calculate: (v) => {
      const toplam_verim = v.gunluk_verim * v.ekip_sayisi;
      const gun = Math.ceil(v.toplam_is / toplam_verim);
      const hafta = (gun / 6).toFixed(1);
      return { gun, hafta, toplam_verim };
    },
    formatResult: (r) => [
      { label: 'Tamamlanma Süresi', value: `${r.gun} iş günü`, highlight: true },
      { label: 'Hafta', value: `≈ ${r.hafta} hafta` },
      { label: 'Günlük Toplam Verim', value: `${r.toplam_verim} birim/gün` },
    ],
  },

  yakit_tuketimi: {
    name: 'Yakıt Tüketimi Hesabı',
    description: 'İş makinesi yakıt tüketimini ve maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'calisma_saati', label: 'Çalışma Saati', unit: 'saat', type: 'number', defaultValue: '' },
      { key: 'saatlik_tuketim', label: 'Saatlik Tüketim', unit: 'L/saat', type: 'number', defaultValue: 15 },
      { key: 'yakit_fiyati', label: 'Yakıt Fiyatı', unit: 'TL/L', type: 'number', defaultValue: 45 },
    ],
    calculate: (v) => {
      const litre = v.calisma_saati * v.saatlik_tuketim;
      const maliyet = litre * v.yakit_fiyati;
      return { litre, maliyet };
    },
    formatResult: (r) => [
      { label: 'Toplam Yakıt', value: `${r.litre.toFixed(1)} litre`, highlight: true },
      { label: 'Yakıt Maliyeti', value: `${r.maliyet.toLocaleString('tr-TR')} TL` },
    ],
  },

  kamyon_tasima: {
    name: 'Kamyon Taşıma Hesabı',
    description: 'Nakliye sefer sayısı ve maliyetini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'toplam_hacim', label: 'Toplam Hacim', unit: 'm³', type: 'number', defaultValue: '' },
      { key: 'kamyon_kapasitesi', label: 'Kamyon Kapasitesi', unit: 'm³', type: 'number', defaultValue: 10 },
      { key: 'sefer_ucreti', label: 'Sefer Ücreti', unit: 'TL', type: 'number', defaultValue: 3000 },
    ],
    calculate: (v) => {
      const sefer = Math.ceil(v.toplam_hacim / v.kamyon_kapasitesi);
      const maliyet = sefer * v.sefer_ucreti;
      return { sefer, maliyet };
    },
    formatResult: (r) => [
      { label: 'Sefer Sayısı', value: `${r.sefer} sefer`, highlight: true },
      { label: 'Nakliye Maliyeti', value: `${r.maliyet.toLocaleString('tr-TR')} TL` },
    ],
  },

  proje_karlilik: {
    name: 'Proje Karlılık Hesabı',
    description: 'Proje kâr/zarar analizini hesaplar',
    category: 'maliyet',
    icon: 'DollarSign',
    color: 'bg-emerald-600',
    fields: [
      { key: 'toplam_gelir', label: 'Toplam Gelir', unit: 'TL', type: 'number', defaultValue: '' },
      { key: 'toplam_gider', label: 'Toplam Gider', unit: 'TL', type: 'number', defaultValue: '' },
    ],
    calculate: (v) => {
      const kar = v.toplam_gelir - v.toplam_gider;
      const oran = v.toplam_gider > 0 ? (kar / v.toplam_gider) * 100 : 0;
      return { kar, oran, gelir: v.toplam_gelir, gider: v.toplam_gider };
    },
    formatResult: (r) => [
      { label: r.kar >= 0 ? 'Kâr' : 'Zarar', value: `${r.kar.toLocaleString('tr-TR')} TL`, highlight: true },
      { label: 'Kârlılık Oranı', value: `%${r.oran.toFixed(1)}` },
      { label: 'Toplam Gelir', value: `${r.gelir.toLocaleString('tr-TR')} TL` },
      { label: 'Toplam Gider', value: `${r.gider.toLocaleString('tr-TR')} TL` },
    ],
  },
};

// Kategori bazında hesap araçları listesi
export function getCalculatorsByCategory() {
  const grouped = {};
  Object.keys(CATEGORIES).forEach((catId) => {
    grouped[catId] = {
      ...CATEGORIES[catId],
      calculators: [],
    };
  });

  Object.entries(CALCULATOR_TYPES).forEach(([id, calc]) => {
    if (grouped[calc.category]) {
      grouped[calc.category].calculators.push({ id, ...calc });
    }
  });

  return grouped;
}

// Düz liste
export const CALCULATOR_LIST = Object.entries(CALCULATOR_TYPES).map(([id, calc]) => ({
  id,
  ...calc,
}));
