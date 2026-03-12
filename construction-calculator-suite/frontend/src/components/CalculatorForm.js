/**
 * Yeniden Kullanılabilir Hesap Makinesi Formu
 * Hesap makinesi tanımına göre dinamik giriş alanları oluşturur
 * Anlık istemci tarafı önizleme ve localStorage'a kayıt sağlar
 */

import { useState, useEffect } from 'react';
import { CALCULATOR_TYPES } from '../lib/calculators';
import { saveCalculation } from '../lib/storage';

export default function CalculatorForm({ calculatorType, projectId, onSaved }) {
  const calc = CALCULATOR_TYPES[calculatorType];
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [formatted, setFormatted] = useState([]);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');

  // Varsayılan değerleri başlat
  useEffect(() => {
    const defaults = {};
    calc.fields.forEach((f) => {
      if (f.type === 'select' && f.options?.length) {
        defaults[f.key] = f.options[0].value;
      } else {
        defaults[f.key] = '';
      }
    });
    setInputs(defaults);
    setResult(null);
    setFormatted([]);
    setSaved(false);
  }, [calculatorType]);

  // Girdi değişikliklerini işle
  function handleChange(key, value) {
    const updated = { ...inputs, [key]: value };
    setInputs(updated);
    setSaved(false);

    // Tüm sayısal alanlar dolduysa otomatik hesapla
    const allFilled = calc.fields.every((f) => {
      if (f.type === 'select') return true;
      return updated[f.key] !== '' && updated[f.key] !== undefined;
    });

    if (allFilled) {
      try {
        const parsed = {};
        calc.fields.forEach((f) => {
          if (f.type === 'number') {
            parsed[f.key] = parseFloat(updated[f.key]);
          } else {
            parsed[f.key] = updated[f.key];
          }
        });
        const res = calc.calculate(parsed);
        setResult(res);
        setFormatted(calc.formatResult(res));
      } catch {
        setResult(null);
        setFormatted([]);
      }
    } else {
      setResult(null);
      setFormatted([]);
    }
  }

  // Hesaplamayı localStorage'a kaydet
  function handleSave() {
    if (!result) return;
    const parsed = {};
    calc.fields.forEach((f) => {
      if (f.type === 'number') {
        parsed[f.key] = parseFloat(inputs[f.key]);
      } else {
        parsed[f.key] = inputs[f.key];
      }
    });

    saveCalculation({
      calculatorType,
      inputData: parsed,
      resultData: result,
      projectId: projectId || null,
      notes: notes || null,
    });
    setSaved(true);
    if (onSaved) onSaved();
  }

  // Formu sıfırla
  function handleReset() {
    const defaults = {};
    calc.fields.forEach((f) => {
      if (f.type === 'select' && f.options?.length) {
        defaults[f.key] = f.options[0].value;
      } else {
        defaults[f.key] = '';
      }
    });
    setInputs(defaults);
    setResult(null);
    setFormatted([]);
    setSaved(false);
    setNotes('');
  }

  return (
    <div className="space-y-6">
      {/* Giriş Alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {calc.fields.map((field) => (
          <div key={field.key}>
            <label className="label">
              {field.label}
              {field.unit && (
                <span className="text-gray-400 font-normal ml-1">({field.unit})</span>
              )}
            </label>
            {field.type === 'select' ? (
              <select
                value={inputs[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="input-field"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                step="any"
                min="0"
                value={inputs[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="input-field"
              />
            )}
          </div>
        ))}
      </div>

      {/* Sonuç Paneli */}
      {formatted.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
          <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">
            Sonuçlar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formatted.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 ${
                  item.highlight
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-primary-100'
                }`}
              >
                <div className={`text-xs font-medium mb-1 ${
                  item.highlight ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {item.label}
                </div>
                <div className={`text-lg font-bold ${
                  item.highlight ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notlar */}
      {result && (
        <div>
          <label className="label">Notlar (isteğe bağlı)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bu hesaplama hakkında not ekleyin..."
            rows={2}
            className="input-field resize-none"
          />
        </div>
      )}

      {/* İşlemler */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={!result || saved}
          className="btn-primary"
        >
          {saved ? '✓ Kaydedildi' : 'Hesaplamayı Kaydet'}
        </button>
        <button onClick={handleReset} className="btn-secondary">
          Sıfırla
        </button>
      </div>
    </div>
  );
}
