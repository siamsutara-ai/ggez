import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Navigation,
  FileSpreadsheet,
  Droplet,
  Fuel,
  Weight,
  Coins,
  ExternalLink
} from 'lucide-react';
import { DealerCalculationResult, UserPlantationLocation } from '../types';
import { formatCurrency, formatDecimal } from '../utils/calculations';

interface DealerDetailModalProps {
  result: DealerCalculationResult | null;
  userLocation: UserPlantationLocation;
  onClose: () => void;
}

export const DealerDetailModal: React.FC<DealerDetailModalProps> = ({
  result,
  userLocation,
  onClose,
}) => {
  if (!result) return null;

  const { dealer } = result;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scale-up">
        {/* Top Header */}
        <div
          className="p-5 text-white relative"
          style={{
            background: `linear-gradient(135deg, ${dealer.pinColor || '#059669'}, #0f172a)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              อันดับที่ {result.rank} {result.isBest && '• คุ้มที่สุด 🏆'}
            </span>
          </div>

          <h3 className="text-lg font-bold mt-2 pr-6 leading-snug">
            {dealer.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-white/90 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dealer.subdistrict} อ.ท่าศาลา จ.นครศรีธรรมราช</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Net Money Highlight */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              เงินสุทธิที่คุณจะได้รับเข้ากระเป๋า
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {formatCurrency(result.netIncome)}{' '}
              <span className="text-sm font-bold text-slate-700">บาท</span>
            </div>
            <div className="text-xs text-emerald-900 mt-1 font-medium">
              รับซื้อที่ราคา {dealer.pricePerKg.toFixed(2)} บาท/กก.
            </div>
          </div>

          {/* Itemized Calculation Receipt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ใบแจกแจงการคิดเงินอย่างละเอียด</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>น้ำหนักก้อนยางพาราดิบ:</span>
                <span className="font-bold text-slate-800">
                  {result.rawWeightKg.toLocaleString()} กก.
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-sky-500" />
                  หักความชื้น ({result.effectiveMoisturePercent}%):
                </span>
                <span className="font-bold text-rose-600">
                  -{result.weightLossKg} กก.
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
                <span>น้ำหนักยางที่คิดเงินจริง:</span>
                <span className="font-bold text-emerald-700">
                  {result.dryWeightKg} กก.
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>ราคารับซื้อต่อ กก.:</span>
                <span className="font-bold text-slate-800">
                  {dealer.pricePerKg.toFixed(2)} บาท/กก.
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 font-semibold pt-1 border-t border-slate-200">
                <span>เงินค่าก้อนยาง (ก่อนหักน้ำมัน):</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(result.grossIncome)} บาท
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-amber-500" />
                  หักค่าน้ำมันเดินทาง (ไป-กลับ { (result.distanceKm * 2).toFixed(1) } กม.):
                </span>
                <span className="font-bold text-amber-700">
                  {result.fuelCost > 0 ? `-${formatCurrency(result.fuelCost)}` : '0'} บาท
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-sm font-bold text-slate-900">
                <span>เงินสุทธิที่ได้รับ:</span>
                <span className="text-emerald-700 font-black">
                  {formatCurrency(result.netIncome)} บาท
                </span>
              </div>
            </div>
          </div>

          {/* Dealer Information */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{dealer.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{dealer.openHours}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dealer.moisturePolicy}</span>
            </div>

            {dealer.note && (
              <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                <strong>หมายเหตุ:</strong> {dealer.note}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href={`tel:${dealer.phone}`}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              โทร {dealer.phone}
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${dealer.lat},${dealer.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs shadow-md shadow-emerald-600/20"
            >
              <Navigation className="w-4 h-4" />
              นำทาง Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
