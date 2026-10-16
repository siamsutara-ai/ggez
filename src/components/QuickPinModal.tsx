import React, { useState } from 'react';
import {
  X,
  MapPin,
  DollarSign,
  Check,
  Store,
  Navigation,
  Sparkles
} from 'lucide-react';
import { RubberDealer } from '../types';

interface QuickPinModalProps {
  lat: number;
  lng: number;
  dealerNumber: number;
  onSave: (dealer: RubberDealer) => void;
  onCancel: () => void;
}

const PIN_PALETTES = [
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber/Orange
  '#8b5cf6', // Purple
  '#0ea5e9', // Blue
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export const QuickPinModal: React.FC<QuickPinModalProps> = ({
  lat,
  lng,
  dealerNumber,
  onSave,
  onCancel,
}) => {
  const defaultColor = PIN_PALETTES[(dealerNumber - 1) % PIN_PALETTES.length];

  const [name, setName] = useState(`จุดรับซื้อที่ ${dealerNumber}`);
  const [pricePerKg, setPricePerKg] = useState('72.00');
  const [minMoistureDeduction, setMinMoistureDeduction] = useState('0');
  const [pinColor, setPinColor] = useState(defaultColor);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(pricePerKg);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('กรุณาระบุราคารับซื้อต่อ กก. ให้ถูกต้อง');
      return;
    }

    const newDealer: RubberDealer = {
      id: `dealer-${Date.now()}`,
      name: name.trim() || `จุดรับซื้อที่ ${dealerNumber}`,
      pricePerKg: parsedPrice,
      lat,
      lng,
      pinColor,
      address: `พิกัด ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      subdistrict: 'ในพื้นที่ปักหมุด',
      minMoistureDeductionPercent: parseFloat(minMoistureDeduction) || 0,
      note: note.trim(),
      isUserAdded: true,
    };

    onSave(newDealer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: pinColor }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">
                ปักหมุดจุดรับซื้อแห่งที่ {dealerNumber}
              </h3>
              <p className="text-[10px] text-white/90">
                พิกัด: {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Dealer Name */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              ชื่อจุดรับซื้อ / ชื่อร้าน
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ล้งโกเอก, ร้านรับซื้อหน้าวัด, จุดรับซื้อท่าศาลา"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* Price Input */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
            <label className="font-bold text-emerald-950 block mb-1 text-xs flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              ราคารับซื้อที่ล้งนี้ให้ (บาท/กก.) *
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                step="0.1"
                min="10"
                max="250"
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="72.00"
                className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-500 text-xs">
                บาท/กก.
              </span>
            </div>
          </div>

          {/* Color selection */}
          <div>
            <label className="font-semibold text-slate-600 block mb-1 text-[11px]">
              สีของหมุดบนแผนที่:
            </label>
            <div className="flex items-center gap-2">
              {PIN_PALETTES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPinColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    pinColor === c
                      ? 'scale-125 border-slate-800 ring-2 ring-slate-300'
                      : 'border-white'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              บันทึกหมุดนี้
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
