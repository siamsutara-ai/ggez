import React, { useState } from 'react';
import {
  Store,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  Truck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Scale,
  Droplet,
  Fuel,
  Info,
  Check,
  Award
} from 'lucide-react';
import { CalculationInput, DealerCalculationResult, RubberDealer } from '../types';
import { formatCurrency } from '../utils/calculations';

interface DealerListScreenProps {
  dealers: RubberDealer[];
  input: CalculationInput;
  results: DealerCalculationResult[];
  onAddDealer: () => void;
  onUpdateDealer: (dealerId: string, updates: Partial<RubberDealer>) => void;
  onDeleteDealer: (dealerId: string) => void;
  onNavigateToInput: () => void;
  onNavigateToResults: () => void;
}

export const DealerListScreen: React.FC<DealerListScreenProps> = ({
  dealers,
  input,
  results,
  onAddDealer,
  onUpdateDealer,
  onDeleteDealer,
  onNavigateToInput,
  onNavigateToResults,
}) => {
  const [editingNameId, setEditingNameId] = useState<string | null>(null);

  const bestResult = results[0];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Top Banner: Rubber Specs Quick Bar */}
      <div className="bg-emerald-700 text-white px-4 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-200 font-medium">
                ข้อมูลยางรอบนี้:
              </div>
              <div className="text-sm font-bold flex items-center gap-2 text-white">
                <span>{input.weightKg.toLocaleString()} กก.</span>
                <span className="text-emerald-300">•</span>
                <span className="flex items-center gap-0.5 text-xs text-emerald-100">
                  <Droplet className="w-3 h-3 text-sky-300 inline" />
                  ชื้น {input.moisturePercent}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToInput}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            แก้ไขข้อมูลยาง
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 pt-4 space-y-4">
        {/* Intro Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            กรอกข้อมูลร้านรับซื้อที่ต้องการเปรียบเทียบ
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            ระบุชื่อร้าน ระยะทางจากบ้านคุณ (กิโลเมตร) และราคาที่แต่ละร้านให้ เพื่อวิเคราะห์ว่าไปขายที่ไหนได้เงินสุทธิมากที่สุด
          </p>
        </div>

        {/* Dealers Cards List */}
        <div className="space-y-3.5">
          {dealers.map((dealer, index) => {
            const res = results.find((r) => r.dealer.id === dealer.id);
            const isWinner = res?.isBest && dealers.length >= 2;

            return (
              <div
                key={dealer.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isWinner
                    ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/15'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Channel Number & Editable Store Name */}
                <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="shrink-0 bg-slate-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      ช่องที่ {index + 1}
                    </span>

                    {/* Editable Store Name Input */}
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={dealer.name}
                        onChange={(e) =>
                          onUpdateDealer(dealer.id, { name: e.target.value })
                        }
                        placeholder={`ชื่อร้าน/ล้งที่ ${index + 1}`}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>

                  {/* Winner badge or delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isWinner && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                        <Award className="w-3 h-3" />
                        คุ้มสุด
                      </span>
                    )}
                    {dealers.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบช่อง "${dealer.name}" หรือไม่?`)) {
                            onDeleteDealer(dealer.id);
                          }
                        }}
                        title="ลบร้านนี้"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Inputs for Distance and Price */}
                <div className="p-4 space-y-3">
                  {/* Distance Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        ระยะทางจากบ้านถึงร้าน:
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        (วัดเป็นกิโลเมตร)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="500"
                        step="0.1"
                        value={dealer.distanceKm ?? ''}
                        onChange={(e) =>
                          onUpdateDealer(dealer.id, {
                            distanceKm: Math.max(0, parseFloat(e.target.value) || 0),
                          })
                        }
                        placeholder="เช่น 5.7"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-14 text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                        กิโลเมตร (กม.)
                      </span>
                    </div>
                  </div>

                  {/* Price Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        ราคารับซื้อที่ร้านนี้ให้:
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        (บาทต่อ กก.)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        max="250"
                        step="0.1"
                        value={dealer.pricePerKg ?? ''}
                        onChange={(e) =>
                          onUpdateDealer(dealer.id, {
                            pricePerKg: Math.max(0, parseFloat(e.target.value) || 0),
                          })
                        }
                        placeholder="เช่น 72.50"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-16 text-base font-black text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                        บาท/กก.
                      </span>
                    </div>
                  </div>

                  {/* Instant Calculation Preview Pill */}
                  {res && (
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-600">
                        <span className="text-[11px] text-slate-400 block">
                          ประมาณการเงินสุทธิ:
                        </span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {formatCurrency(res.netIncome)} บาท
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <div>ค่าน้ำมัน: {formatCurrency(res.fuelCost)} บ.</div>
                        <div className="text-[10px] text-slate-400">
                          (ไป-กลับ { (res.distanceKm * 2).toFixed(1) } กม.)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Dealer Button */}
        <button
          onClick={onAddDealer}
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>+ เพิ่มช่องร้านรับซื้อเพื่อเปรียบเทียบ (ช่องที่ {dealers.length + 1})</span>
        </button>

        {/* Big Compare Button */}
        <div className="pt-2">
          <button
            onClick={onNavigateToResults}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>วิเคราะห์และเปรียบเทียบหาที่คุ้มที่สุด</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
          <div className="font-semibold text-slate-700 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            คำแนะนำ:
          </div>
          <p>
            ระบบจะคำนวณค่าน้ำมันเดินทางไป-กลับจากระยะทาง (กม.) ที่คุณกรอก รวมกับหักเปอร์เซ็นต์ความชื้นของก้อนยาง เพื่อบอกว่าร้านไหนให้เงินเข้ากระเป๋าคุณเยอะที่สุด
          </p>
        </div>
      </div>
    </div>
  );
};
