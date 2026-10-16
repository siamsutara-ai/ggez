import React, { useState } from 'react';
import {
  X,
  MapPin,
  Store,
  DollarSign,
  Phone,
  ShieldCheck,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { RubberDealer, UserPlantationLocation } from '../types';
import { searchThaiLocation } from '../utils/routing';

interface DealerFormModalProps {
  initialDealer?: RubberDealer | null;
  userLocation: UserPlantationLocation;
  onSave: (dealer: RubberDealer) => void;
  onClose: () => void;
}

const PIN_COLORS = [
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#0ea5e9', // Sky blue
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export const DealerFormModal: React.FC<DealerFormModalProps> = ({
  initialDealer,
  userLocation,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialDealer;

  const [name, setName] = useState(initialDealer?.name || '');
  const [pricePerKg, setPricePerKg] = useState(
    initialDealer ? initialDealer.pricePerKg.toString() : '72.00'
  );
  const [lat, setLat] = useState(
    initialDealer ? initialDealer.lat : userLocation.lat + 0.025
  );
  const [lng, setLng] = useState(
    initialDealer ? initialDealer.lng : userLocation.lng + 0.02
  );
  const [address, setAddress] = useState(
    initialDealer?.address || 'อ.ท่าศาลา จ.นครศรีธรรมราช'
  );
  const [phone, setPhone] = useState(initialDealer?.phone || '');
  const [minMoistureDeduction, setMinMoistureDeduction] = useState(
    initialDealer?.minMoistureDeductionPercent?.toString() || '0'
  );
  const [pinColor, setPinColor] = useState(
    initialDealer?.pinColor || PIN_COLORS[0]
  );
  const [note, setNote] = useState(initialDealer?.note || '');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchThaiLocation(searchQuery.trim());
    setIsSearching(false);
    setSearchResults(results);
  };

  const handleSelectSearchResult = (item: any) => {
    setLat(item.lat);
    setLng(item.lng);
    setAddress(item.fullName);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(pricePerKg);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('กรุณาระบุราคารับซื้อต่อ กก. ให้ถูกต้อง');
      return;
    }

    const savedDealer: RubberDealer = {
      id: initialDealer ? initialDealer.id : `dealer-${Date.now()}`,
      name: name.trim(),
      pricePerKg: parsedPrice,
      lat,
      lng,
      address: address.trim(),
      subdistrict: 'ท่าศาลา',
      phone: phone.trim(),
      pinColor,
      minMoistureDeductionPercent: parseFloat(minMoistureDeduction) || 0,
      note: note.trim(),
      isUserAdded: true,
    };

    onSave(savedDealer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scale-up">
        {/* Modal Header */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isEditing ? 'แก้ไขข้อมูลจุดรับซื้อยาง' : 'เพิ่มจุดรับซื้อยางที่คุณอยากเปรียบเทียบ'}
              </h3>
              <p className="text-xs text-emerald-100">
                กรอกราคารับซื้อและปักหมุดที่ตั้งจริงเพื่อหาเส้นทาง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          {/* 1. Name */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              ชื่อจุดรับซื้อ / ชื่อล้ง *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ล้งโกเอก ท่าศาลา หรือ สหกรณ์สวนยางท่าขึ้น"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* 2. Price per kg */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5">
            <label className="font-bold text-emerald-950 block mb-1 text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
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
                placeholder="เช่น 72.50"
                className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-3 text-2xl font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 text-sm">
                บาท/กก.
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1.5">
              💡 กรอกราคาจริงที่ล้งประกาศรับซื้อในวันนั้นเพื่อนำไปเปรียบเทียบ
            </p>
          </div>

          {/* 3. Location Pinning & Coordinates */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-rose-500" />
                จุดที่ตั้งของล้ง (สำหรับคำนวณเส้นทางตามถนนจริง)
              </label>
            </div>

            {/* Location search bar */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchLocation();
                  }
                }}
                placeholder="พิมพ์ชื่อสถานที่เพื่อค้นหาพิกัด เช่น ท่าศาลา หรือ วัดเทวดาราม"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSearchLocation}
                disabled={isSearching}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium flex items-center gap-1 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isSearching ? '...' : 'ค้นหา'}</span>
              </button>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 space-y-1 max-h-40 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 text-xs text-slate-700 flex items-start gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">{res.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{res.fullName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Coordinates display & manual edit */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">ละติจูด (Lat):</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || lat)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">ลองจิจูด (Lng):</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || lng)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 block">ที่อยู่ / จุดสังเกต:</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="เช่น ถ.สุราษฎร์-นครศรีฯ ต.ท่าศาลา"
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs mt-0.5"
              />
            </div>
          </div>

          {/* 4. Moisture Policy */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              เกณฑ์การหักความชื้นขั้นต่ำของล้งนี้ (%):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={minMoistureDeduction}
                onChange={(e) => setMinMoistureDeduction(e.target.value)}
                className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
              />
              <span className="text-slate-500">%</span>
              <span className="text-[11px] text-slate-400">
                (ถ้าไม่มีการหักขั้นต่ำ ให้ใส่ 0% ระบบจะหักตามความชื้นจริงของยางคุณ)
              </span>
            </div>
          </div>

          {/* 5. Pin Color & Phone */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                สีหมุดบนแผนที่
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PIN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPinColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      pinColor === c ? 'scale-125 border-slate-800 ring-2 ring-slate-300' : 'border-white'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                เบอร์โทรติดต่อ (ถ้ามี)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08x-xxx-xxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
              />
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มจุดรับซื้อเพื่อเปรียบเทียบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
