import React, { useState } from 'react';
import { ChevronDown, Bell, Sprout, MapPin, Sparkles, X, Info } from 'lucide-react';
import { THA_SALA_SUBDISTRICTS } from '../data/dealers';

interface HeaderProps {
  selectedSubdistrict: string;
  onSelectSubdistrict: (subdistrict: string) => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSubdistrict,
  onSelectSubdistrict,
  onOpenInfo,
}) => {
  const [showSubdistrictMenu, setShowSubdistrictMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Title & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
                เช็คราคารับซื้อขี้ยางพารา
              </h1>
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 inline" />
                อ.ท่าศาลา จ.นครศรีธรรมราช
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowNotification(!showNotification)}
              aria-label="แจ้งเตือนราคา"
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </button>

            <button
              onClick={onOpenInfo}
              aria-label="ข้อมูลวิธีใช้งาน"
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="ข้อมูลราคาและเกณฑ์การหักน้ำหนัก"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subdistrict Filter / Dropdown Bar */}
        <div className="mt-2.5 relative">
          <button
            onClick={() => setShowSubdistrictMenu(!showSubdistrictMenu)}
            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-700 font-medium transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-900">
                {selectedSubdistrict === 'ทุกตำบลใน อ.ท่าศาลา'
                  ? 'อ.ท่าศาลา จ.นครศรีธรรมราช (แสดงทุกตำบล)'
                  : `${selectedSubdistrict} อ.ท่าศาลา จ.นครศรีธรรมราช`}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                showSubdistrictMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {showSubdistrictMenu && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-40 max-h-60 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                เลือกตำบลใน อ.ท่าศาลา
              </div>
              {THA_SALA_SUBDISTRICTS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onSelectSubdistrict(item);
                    setShowSubdistrictMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    selectedSubdistrict === item
                      ? 'text-emerald-700 font-semibold bg-emerald-50/70'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{item}</span>
                  {selectedSubdistrict === item && (
                    <span className="text-xs bg-emerald-600 text-white rounded-full px-2 py-0.5">
                      เลือกอยู่
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Update Notice Toast */}
        {showNotification && (
          <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start justify-between gap-2 shadow-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">อัปเดตราคาขี้ยางพาราวันนี้ (กยท. สาขาท่าศาลา)</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  ราคายางก้อนถ้วย/ขี้ยางพารา (DRC 100%) ในพื้นที่ อ.ท่าศาลา เฉลี่ย 69.80 - 72.50 บาท/กก. แนวโน้มราคาทรงตัวถึงปรับขึ้นตามตลาดกลางนครศรีธรรมราช
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
