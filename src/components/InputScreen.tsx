import React, { useState } from 'react';
import {
  ChevronLeft,
  Weight,
  Truck,
  Droplet,
  Fuel,
  Search,
  SlidersHorizontal,
  Store,
  Plus,
  MapPin,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  Navigation,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculationInput, RubberDealer, UserPlantationLocation } from '../types';

interface InputScreenProps {
  input: CalculationInput;
  dealers: RubberDealer[];
  userLocation: UserPlantationLocation;
  onUpdateInput: (newInput: CalculationInput) => void;
  onUpdateDealerPrice: (dealerId: string, newPrice: number) => void;
  onOpenAddDealer: () => void;
  onEditDealer: (dealer: RubberDealer) => void;
  onDeleteDealer: (dealerId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  input,
  dealers,
  userLocation,
  onUpdateInput,
  onUpdateDealerPrice,
  onOpenAddDealer,
  onEditDealer,
  onDeleteDealer,
  onBack,
  onSubmit,
}) => {
  const [showAdvancedFuel, setShowAdvancedFuel] = useState(false);

  const weightPresets = [200, 500, 800, 1000, 2000];
  const moisturePresets = [
    { label: 'แห้งสนิท (ผึ่งหลายวัน)', value: 4 },
    { label: 'แห้งปานกลาง (มาตรฐาน)', value: 10 },
    { label: 'ยางสด/ชุ่มน้ำฝน', value: 18 },
  ];

  const handleCompareClick = () => {
    if (dealers.length === 0) {
      alert('กรุณาเพิ่มจุดรับซื้อยางอย่างน้อย 1 จุดเพื่อทำการเปรียบเทียบ');
      return;
    }
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
    onSubmit();
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-slate-800">กรอกข้อมูลเพื่อวิเคราะห์</h2>
        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-4">
        {/* Intro */}
        <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              กรอกข้อมูลก้อนยางและจุดรับซื้อของคุณ
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              ระบบจะดึงเส้นทางตามถนนจริง คำนวณหักความชื้น ค่าน้ำมัน และวิเคราะห์หาจุดที่ได้เงินสุทธิสูงที่สุด
            </p>
          </div>
        </div>

        {/* 1. น้ำหนักก้อนยางพารา */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Weight className="w-4 h-4" />
            </div>
            <label className="text-sm font-bold text-slate-800">
              น้ำหนักก้อนยางพาราของคุณ
            </label>
          </div>

          <div className="relative mt-2">
            <input
              type="number"
              min="1"
              max="50000"
              step="10"
              value={input.weightKg || ''}
              onChange={(e) =>
                onUpdateInput({
                  ...input,
                  weightKg: Math.max(0, parseFloat(e.target.value) || 0),
                })
              }
              placeholder="เช่น 500"
              className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-14 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 text-sm">
              กก.
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
            <span className="text-[11px] text-slate-400 shrink-0">ด่วน:</span>
            {weightPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onUpdateInput({ ...input, weightKg: preset })}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors shrink-0 ${
                  input.weightKg === preset
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.toLocaleString()} กก.
              </button>
            ))}
          </div>
        </div>

        {/* 2. ความชื้นของก้อนยางพารา */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-800">
                ความชื้นของก้อนยางพารา
              </label>
              <span className="text-xs text-slate-500 ml-1">
                (ประมาณเอาหรือประมาณค่า)
              </span>
            </div>
          </div>

          <div className="relative mt-2">
            <input
              type="number"
              min="0"
              max="45"
              step="1"
              value={input.moisturePercent || 0}
              onChange={(e) =>
                onUpdateInput({
                  ...input,
                  moisturePercent: Math.max(
                    0,
                    Math.min(45, parseFloat(e.target.value) || 0)
                  ),
                })
              }
              placeholder="เช่น 10"
              className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-14 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-hidden"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-600 text-lg">
              %
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5">
            {moisturePresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() =>
                  onUpdateInput({ ...input, moisturePercent: preset.value })
                }
                className={`p-2 rounded-xl border text-center transition-all ${
                  input.moisturePercent === preset.value
                    ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold text-slate-800">
                  {preset.value}%
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {preset.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. รายการจุดรับซื้อที่คุณระบุและราคาที่แต่ละที่ให้ */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800">
                  จุดรับซื้อที่นำมาเปรียบเทียบ
                </label>
                <span className="text-xs text-slate-500 block">
                  ({dealers.length} จุดรับซื้อ)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAddDealer}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              เพิ่มจุดรับซื้อ
            </button>
          </div>

          {dealers.length === 0 ? (
            <div className="text-center py-5 px-3 bg-slate-50 rounded-2xl border border-dashed border-emerald-300">
              <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-1.5 animate-bounce" />
              <p className="text-xs font-bold text-slate-800">
                ยังไม่มีจุดรับซื้อที่ปักหมุด
              </p>
              <p className="text-[11px] text-slate-500 mt-1 mb-3">
                แตะปุ่มด้านล่างเพื่อไปปักหมุดตำแหน่งล้งบนแผนที่ตามถนนจริง
              </p>
              <button
                type="button"
                onClick={onBack}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                ไปปักหมุดบนแผนที่
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {dealers.map((dealer) => (
                <div
                  key={dealer.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: dealer.pinColor }}
                      />
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {dealer.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditDealer(dealer)}
                        className="p-1 text-slate-500 hover:text-emerald-700 rounded"
                        title="แก้ไขข้อมูลหรือพิกัด"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`ลบ "${dealer.name}" ออกจากการคำนวณหรือไม่?`)) {
                            onDeleteDealer(dealer.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="ลบออก"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline price modifier */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500">
                      ราคาที่ล้งให้วันนี้:
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={dealer.pricePerKg}
                        onChange={(e) =>
                          onUpdateDealerPrice(
                            dealer.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-right font-bold text-emerald-700 text-xs"
                      />
                      <span className="text-xs text-slate-500 font-semibold">
                        บาท/กก.
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. ค่าน้ำมันและการเดินทาง */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  รวมค่าน้ำมันในการคำนวณ
                </h4>
                <p className="text-xs text-slate-500">(โดยประมาณ)</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={input.includeFuelCost}
                onChange={(e) =>
                  onUpdateInput({
                    ...input,
                    includeFuelCost: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {input.includeFuelCost && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdvancedFuel(!showAdvancedFuel)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showAdvancedFuel ? 'ซ่อนการตั้งค่า' : 'ปรับราคาน้ำมันและอัตรากินน้ำมัน'}
              </button>

              {showAdvancedFuel && (
                <div className="mt-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">ราคาน้ำมันดีเซล:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        value={input.fuelPricePerLiter}
                        onChange={(e) =>
                          onUpdateInput({
                            ...input,
                            fuelPricePerLiter: parseFloat(e.target.value) || 33,
                          })
                        }
                        className="w-18 bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold text-slate-800"
                      />
                      <span className="text-slate-500">บาท/ลิตร</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">อัตราสิ้นเปลือง (รถกระบะบรรทุกยาง):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        value={input.fuelEconomyKmPerLiter}
                        onChange={(e) =>
                          onUpdateInput({
                            ...input,
                            fuelEconomyKmPerLiter:
                              parseFloat(e.target.value) || 11,
                          })
                        }
                        className="w-18 bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold text-slate-800"
                      />
                      <span className="text-slate-500">กม./ลิตร</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-600">คำนวณแบบไป-กลับ (x2):</span>
                    <input
                      type="checkbox"
                      checked={input.roundTrip}
                      onChange={(e) =>
                        onUpdateInput({
                          ...input,
                          roundTrip: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-emerald-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Big Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCompareClick}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all text-base cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            วิเคราะห์เปรียบเทียบหาที่คุ้มที่สุด
          </button>
        </div>
      </div>
    </div>
  );
};
