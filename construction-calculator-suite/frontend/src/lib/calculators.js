/**
 * İstemci Taraflı Hesap Makinesi Tanımları
 * Tüm hesaplamalar tarayıcıda çalışır — sunucu gerektirmez
 */

export const CALCULATOR_TYPES = {
  concrete_volume: {
    id: 'concrete_volume',
    name: 'Beton Hesaplama',
    description: 'Kolon ve yapısal elemanlar için toplam beton hacmini hesaplayın',
    icon: 'Box',
    color: 'bg-blue-500',
    fields: [
      { key: 'width', label: 'Kolon Genişliği', unit: 'cm', type: 'number', placeholder: 'örn. 40' },
      { key: 'length', label: 'Kolon Uzunluğu', unit: 'cm', type: 'number', placeholder: 'örn. 60' },
      { key: 'height', label: 'Kolon Yüksekliği', unit: 'm', type: 'number', placeholder: 'örn. 3' },
      { key: 'quantity', label: 'Kolon Adedi', unit: 'adet', type: 'number', placeholder: 'örn. 12' },
    ],
    calculate(input) {
      const widthM = input.width / 100;
      const lengthM = input.length / 100;
      const vol = widthM * lengthM * input.height * input.quantity;
      return {
        volume_per_unit_m3: +(widthM * lengthM * input.height).toFixed(4),
        total_volume_m3: +vol.toFixed(4),
        quantity: input.quantity,
        unit: 'm³',
      };
    },
    formatResult(r) {
      return [
        { label: 'Birim Hacim', value: `${r.volume_per_unit_m3} m³` },
        { label: 'Toplam Hacim', value: `${r.total_volume_m3} m³`, highlight: true },
        { label: 'Adet', value: r.quantity },
      ];
    },
  },

  rebar_weight: {
    id: 'rebar_weight',
    name: 'Demir Metraj Hesaplama',
    description: 'İnşaat demiri (nervürlü çelik) toplam ağırlığını hesaplayın',
    icon: 'Cylinder',
    color: 'bg-orange-500',
    fields: [
      { key: 'diameter', label: 'Demir Çapı', unit: 'mm', type: 'number', placeholder: 'örn. 12' },
      { key: 'length', label: 'Boy Uzunluğu', unit: 'm', type: 'number', placeholder: 'örn. 12' },
      { key: 'quantity', label: 'Adet', unit: 'adet', type: 'number', placeholder: 'örn. 100' },
    ],
    calculate(input) {
      const wpm = (input.diameter * input.diameter) / 162;
      const wpb = wpm * input.length;
      const totalKg = wpb * input.quantity;
      return {
        weight_per_meter_kg: +wpm.toFixed(4),
        weight_per_bar_kg: +wpb.toFixed(4),
        total_weight_kg: +totalKg.toFixed(4),
        total_weight_tons: +(totalKg / 1000).toFixed(6),
        quantity: input.quantity,
      };
    },
    formatResult(r) {
      return [
        { label: 'Metre Ağırlığı', value: `${r.weight_per_meter_kg} kg/m` },
        { label: 'Boy Ağırlığı', value: `${r.weight_per_bar_kg} kg` },
        { label: 'Toplam Ağırlık', value: `${r.total_weight_kg} kg`, highlight: true },
        { label: 'Toplam Ağırlık', value: `${r.total_weight_tons} ton` },
      ];
    },
  },

  excavation_volume: {
    id: 'excavation_volume',
    name: 'Hafriyat Hesaplama',
    description: 'Kazı hacmi ve kabartma faktörü ile hafriyat hesabı',
    icon: 'Mountain',
    color: 'bg-amber-600',
    fields: [
      { key: 'length', label: 'Uzunluk', unit: 'm', type: 'number', placeholder: 'örn. 20' },
      { key: 'width', label: 'Genişlik', unit: 'm', type: 'number', placeholder: 'örn. 15' },
      { key: 'depth', label: 'Derinlik', unit: 'm', type: 'number', placeholder: 'örn. 3' },
    ],
    calculate(input) {
      const vol = input.length * input.width * input.depth;
      return {
        net_volume_m3: +vol.toFixed(4),
        swelled_volume_m3: +(vol * 1.25).toFixed(4),
        swell_factor: 1.25,
        unit: 'm³',
      };
    },
    formatResult(r) {
      return [
        { label: 'Net Hacim', value: `${r.net_volume_m3} m³`, highlight: true },
        { label: 'Kabartmalı Hacim (%25)', value: `${r.swelled_volume_m3} m³` },
      ];
    },
  },

  wall_materials: {
    id: 'wall_materials',
    name: 'Duvar Malzeme Hesaplama',
    description: 'Duvar için tuğla adedi ve harç miktarı hesaplayın',
    icon: 'BrickWall',
    color: 'bg-red-500',
    fields: [
      { key: 'wallLength', label: 'Duvar Uzunluğu', unit: 'm', type: 'number', placeholder: 'örn. 10' },
      { key: 'wallHeight', label: 'Duvar Yüksekliği', unit: 'm', type: 'number', placeholder: 'örn. 3' },
      { key: 'brickSize', label: 'Tuğla Boyutu', unit: '', type: 'select', options: [
        { value: 'standard', label: 'Standart (24×11.5×7.1 cm)' },
        { value: 'large', label: 'Büyük (29×19×13.5 cm)' },
      ]},
    ],
    calculate(input) {
      const area = input.wallLength * input.wallHeight;
      const data = {
        standard: { bricksPerM2: 50, mortarPerM2: 0.03 },
        large: { bricksPerM2: 17, mortarPerM2: 0.04 },
      };
      const b = data[input.brickSize] || data.standard;
      const total = Math.ceil(area * b.bricksPerM2);
      return {
        wall_area_m2: +area.toFixed(4),
        brick_size: input.brickSize || 'standard',
        total_bricks: total,
        total_bricks_with_waste: Math.ceil(total * 1.05),
        mortar_volume_m3: +(area * b.mortarPerM2).toFixed(4),
        waste_factor: '%5',
      };
    },
    formatResult(r) {
      return [
        { label: 'Duvar Alanı', value: `${r.wall_area_m2} m²` },
        { label: 'Toplam Tuğla', value: r.total_bricks, highlight: true },
        { label: 'Fireli Tuğla (%5)', value: r.total_bricks_with_waste },
        { label: 'Harç Hacmi', value: `${r.mortar_volume_m3} m³` },
      ];
    },
  },

  construction_cost: {
    id: 'construction_cost',
    name: 'Maliyet Hesaplama',
    description: 'Malzeme ve işçilik bazında toplam inşaat maliyetini hesaplayın',
    icon: 'DollarSign',
    color: 'bg-green-600',
    fields: [
      { key: 'concreteVolume', label: 'Beton Hacmi', unit: 'm³', type: 'number', placeholder: 'örn. 50' },
      { key: 'concretePricePerM3', label: 'Beton Birim Fiyatı', unit: '₺/m³', type: 'number', placeholder: 'örn. 2500' },
      { key: 'steelWeightKg', label: 'Çelik Ağırlığı', unit: 'kg', type: 'number', placeholder: 'örn. 5000' },
      { key: 'steelPricePerKg', label: 'Çelik Birim Fiyatı', unit: '₺/kg', type: 'number', placeholder: 'örn. 35' },
      { key: 'laborCost', label: 'İşçilik Maliyeti', unit: '₺', type: 'number', placeholder: 'örn. 100000' },
      { key: 'totalArea', label: 'Toplam Alan', unit: 'm²', type: 'number', placeholder: 'örn. 200' },
    ],
    calculate(input) {
      const cc = input.concreteVolume * input.concretePricePerM3;
      const sc = input.steelWeightKg * input.steelPricePerKg;
      const total = cc + sc + input.laborCost;
      const perM2 = input.totalArea > 0 ? total / input.totalArea : 0;
      return {
        concrete_cost: +cc.toFixed(2),
        steel_cost: +sc.toFixed(2),
        material_cost: +(cc + sc).toFixed(2),
        labor_cost: +input.laborCost.toFixed(2),
        total_cost: +total.toFixed(2),
        cost_per_m2: +perM2.toFixed(2),
        currency: 'TRY',
      };
    },
    formatResult(r) {
      const fmt = (v) => v.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
      return [
        { label: 'Beton Maliyeti', value: `₺${fmt(r.concrete_cost)}` },
        { label: 'Çelik Maliyeti', value: `₺${fmt(r.steel_cost)}` },
        { label: 'Malzeme Toplamı', value: `₺${fmt(r.material_cost)}` },
        { label: 'İşçilik Maliyeti', value: `₺${fmt(r.labor_cost)}` },
        { label: 'Toplam Maliyet', value: `₺${fmt(r.total_cost)}`, highlight: true },
        { label: 'Birim m² Maliyeti', value: `₺${fmt(r.cost_per_m2)}` },
      ];
    },
  },
};

export const CALCULATOR_LIST = Object.values(CALCULATOR_TYPES);
