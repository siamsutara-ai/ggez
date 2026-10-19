import React, { useState } from 'react';
import {
  ChevronLeft,
  Trophy,
  Crown,
  Droplet,
  Truck,
  Fuel,
  Info,
  Navigation,
  FileSpreadsheet,
  Share2,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CalculationInput, DealerCalculationResult, RubberDealer, UserPlantationLocation } from '../types';
import { formatCurrency, formatDecimal } from '../utils/calculations';

interface ResultScreenProps {
  results: DealerCalculationResult[];
  input: CalculationInput;
  userLocation: UserPlantationLocation;
  onBack: () => void;
  onSelectDealer: (dealer: RubberDealer) => void;
  onViewOnMap: () => void;
  onUpdateWeight: (newWeight: number) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  results,
  input,
  userLocation,
  onBack,
  onSelectDealer,
  onViewOnMap,
  onUpdateWeight,
}) => {
  const [copied, setCopied] = useState(false);

  const bestResult = results[0];
  const worstResult = results[results.length - 1];
  const maxSavings =
    bestResult && worstResult
      ? bestResult.netIncome - worstResult.netIncome
      : 0;

  const handleShareSummary = () => {
    if (!bestResult) return;
    const text = `📊 ผลวิเคราะห์ความคุ้มค่าขายขี้ยางพารา (อ.ท่าศาลา จ.นครศรีธรรมราช):
น้ำหนักยาง: ${input.weightKg.toLocaleString()} กก. | ความชื้น: ${input.moisturePercent}%
🏆 แนะนำไปขายที่: ${bestResult.dealer.name}
💰 ราคา: ${bestResult.dealer.pricePerKg.toFixed(2)} บาท/กก.
💵 เงินสุทธิที่จะได้รับ: ${formatCurrency(bestResult.netIncome)} บาท
⛽ ค่าน้ำมันเดินทาง: ${formatCurrency(bestResult.fuelCost)} บาท (ระยะทางถนนจริง ${bestResult.distanceKm.toFixed(1)} กม.)
💡 เหตุผล: ${bestResult.analysisReason}
${maxSavings > 0 ? `👉 ได้เงินมากกว่าที่อื่นสูงสุดถึง ${formatCurrency(maxSavings)} บาท!` : ''}`;

    if (navigator.share) {
      navigator.share({ title: 'สรุปจุดขายยางพาราที่คุ้มที่สุด', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col min-h-full bg-slate-50 p-6 items-center justify-center text-center">
        <MapPin className="w-12 h-12 text-emerald-600 mb-3 animate-bounce" />
        <h3 className="text-base font-bold text-slate-800">ยังไม่ได้ปักหมุดจุดรับซื้อ</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs">
          กรุณาไปที่หน้าแผนที่ แล้วแตะปักหมุดจุดรับซื้อยางอย่างน้อย 2 จุดเพื่อเปรียบเทียบว่าที่ไหนคุ้มที่สุด
        </p>
        <button
          onClick={onViewOnMap}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
        >
          <MapPin className="w-4 h-4" />
          ไปปักหมุดบนแผนที่
        </button>
      </div>
    );
  }

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
        <h2 className="text-base font-bold text-slate-800">ผลการวิเคราะห์เปรียบเทียบ</h2>
        <button
          onClick={handleShareSummary}
          title="แชร์สรุปผล"
          className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'คัดลอกแล้ว' : ''}
        </button>
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-4">
        {/* Banner with Trophy */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              ผลการวิเคราะห์ความคุ้มค่า
            </h3>
            <p className="text-xs text-slate-500">
              คำนวณจากน้ำหนัก {input.weightKg.toLocaleString()} กก., ความชื้น {input.moisturePercent}% (คิดตามถนนจริง)
            </p>
          </div>
        </div>

        {/* Winner Highlight Card */}
        {bestResult && (
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  จุดรับซื้อที่คุ้มค่าที่สุด
                </span>
                <span className="text-emerald-200 text-xs font-medium">
                  อันดับ 1
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black leading-tight text-white">
                  {bestResult.dealer.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-emerald-100 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ห่างจากสวนของคุณ {bestResult.distanceKm.toFixed(1)} กม. (~{bestResult.drivingMinutes} นาที)</span>
                </div>
              </div>

              {/* Net Income Showcase */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                <div className="text-xs text-emerald-100 font-medium">เงินสุทธิที่จะได้รับ:</div>
                <div className="text-3xl font-black text-amber-300 mt-0.5">
                  {formatCurrency(bestResult.netIncome)}{' '}
                  <span className="text-sm font-bold text-white">บาท</span>
                </div>
                <div className="text-[11px] text-emerald-100 mt-1 flex items-center justify-between border-t border-white/10 pt-1.5">
                  <span>ราคารับซื้อ: {bestResult.dealer.pricePerKg.toFixed(2)} บ./กก.</span>
                  <span>ค่าน้ำมัน: {formatCurrency(bestResult.fuelCost)} บ.</span>
                </div>
              </div>

              {/* Analytical Justification */}
              <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-400/30 text-xs text-emerald-50 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>เหตุผลที่แนะนำที่นี่:</span>
                </div>
                <p>{bestResult.analysisReason}</p>
              </div>

              {/* Direct Google Maps Navigation Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${bestResult.dealer.lat},${bestResult.dealer.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-slate-100 text-emerald-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                เปิดนำทางด้วย Google Maps ไปล้งนี้
              </a>
            </div>

            <Crown className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 pointer-events-none" />
          </div>
        )}

        {/* Quick What-If Weight Adjuster */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              ลองปรับน้ำหนักยางดูผลลัพธ์แบบสดๆ:
            </span>
            <span className="font-bold text-emerald-700 text-sm">
              {input.weightKg.toLocaleString()} กก.
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={input.weightKg}
            onChange={(e) => onUpdateWeight(parseInt(e.target.value) || 500)}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>100 กก.</span>
            <span>1,000 กก.</span>
            <span>2,000 กก.</span>
            <span>3,000 กก.</span>
          </div>
        </div>

        {/* All Candidates Ranked List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            เปรียบเทียบเรียงตามความคุ้มค่า (ทั้งหมด {results.length} จุด)
          </h4>

          {results.map((item) => {
            const isWinner = item.rank === 1;

            return (
              <div
                key={item.dealer.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs relative ${
                  isWinner
                    ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.dealer.pinColor }}
                    />
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {item.rank}. {item.dealer.name}
                    </h4>
                  </div>
                  {isWinner ? (
                    <span className="shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      คุ้มที่สุด 🏆
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-rose-600 shrink-0">
                      น้อยกว่าอันดับ 1 -{formatCurrency(item.profitDifferenceFromBest)} บ.
                    </span>
                  )}
                </div>

                {/* Pricing & Net Income */}
                <div className="mt-2.5 flex items-baseline justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 leading-none">
                      {item.dealer.pricePerKg.toFixed(2)}{' '}
                      <span className="text-xs font-semibold text-slate-500">
                        บาท/กก.
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 block">
                      เงินสุทธิ
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-700 leading-none">
                      {formatCurrency(item.netIncome)}{' '}
                      <span className="text-xs font-semibold text-slate-600">
                        บาท
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="mt-2.5 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 truncate">
                    <Droplet className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">
                      หักชื้น {item.effectiveMoisturePercent}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 justify-center truncate">
                    <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">
                      ถนน {item.distanceKm.toFixed(1)} กม.
                    </span>
                  </div>

                  <div className="flex items-center gap-1 justify-end truncate">
                    <Fuel className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">
                      น้ำมัน {formatCurrency(item.fuelCost)} บ.
                    </span>
                  </div>
                </div>

                {/* Analytical Reason */}
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  💡 {item.analysisReason}
                </div>

                {/* Action Buttons */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDealer(item.dealer)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    ดูใบแจกแจงยอดเงิน
                  </button>

                  <a
                    href={
                      item.dealer.lat && item.dealer.lng
                        ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${item.dealer.lat},${item.dealer.lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.dealer.name + ' รับซื้อยางพารา ท่าศาลา')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    Google Maps
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Dealer List Button */}
        <button
          onClick={onViewOnMap}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs text-xs"
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          กลับไปดูรายการร้านรับซื้อ / ปรับระยะทางและราคา
        </button>
      </div>
    </div>
  );
};
