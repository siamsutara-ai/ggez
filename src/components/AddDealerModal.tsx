import React, { useState } from 'react';
import { X, Plus, MapPin, DollarSign, Store, Phone } from 'lucide-react';
import { RubberDealer } from '../types';
import { THA_SALA_SUBDISTRICTS } from '../data/dealers';

interface AddDealerModalProps {
  onAddDealer: (dealer: RubberDealer) => void;
  onClose: () => void;
}

export const AddDealerModal: React.FC<AddDealerModalProps> = ({
  onAddDealer,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [subdistrict, setSubdistrict] = useState('ต.ท่าศาลา');
  const [pricePerKg, setPricePerKg] = useState('71.50');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('08x-xxx-xxxx');
  const [moisturePolicy, setMoisturePolicy] = useState('หักความชื้น 3% ตามมาตรฐาน');

  const subdistrictOptions = THA_SALA_SUBDISTRICTS.filter(
    (s) => s !== 'ทุกตำบลใน อ.ท่าศาลา'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Approximate offset coordinates for new dealer around Tha Sala
    const randomOffsetLat = (Math.random() - 0.5) * 0.05;
    const randomOffsetLng = (Math.random() - 0.5) * 0.05;

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#0ea5e9', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newDealer: RubberDealer = {
      id: `dealer-custom-${Date.now()}`,
      name: name.trim(),
      address: address.trim() || `อ.ท่าศาลา จ.นครศรีธรรมราช`,
      subdistrict: subdistrict.replace('ต.', ''),
      district: 'ท่าศาลา',
      province: 'นครศรีธรรมราช',
      lat: 8.6631 + randomOffsetLat,
      lng: 99.9248 + randomOffsetLng,
      pricePerKg: parseFloat(pricePerKg) || 71.0,
      pinColor: randomColor,
      phone: phone.trim() || '075-xxx-xxx',
      openHours: '06:30 - 17:00 น.',
      moisturePolicy: moisturePolicy.trim() || 'หักตามมาตรฐาน กยท.',
      baseMoistureDeductionPercent: 3,
      note: 'จุดรับซื้อที่ผู้ใช้เพิ่มเข้ามาเอง',
    };

    onAddDealer(newDealer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">เพิ่มจุดรับซื้อขี้ยางพาราใหม่</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              ชื่อจุดรับซื้อ / ชื่อล้ง *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ล้งเกษตรทวีทรัพย์ ยางพารา"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                ราคารับซื้อ (บาท/กก.) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="72.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                ตำบล (ในท่าศาลา)
              </label>
              <select
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {subdistrictOptions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              เบอร์โทรศัพท์ติดต่อ
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="เช่น 081-234-5678"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              ที่ตั้ง / จุดสังเกต
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="เช่น ริมถนนสาย 401 ใกล้วัดเทวดาราม ต.ท่าขึ้น"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              เกณฑ์การหักความชื้น
            </label>
            <input
              type="text"
              value={moisturePolicy}
              onChange={(e) => setMoisturePolicy(e.target.value)}
              placeholder="เช่น หัก 2-3% ตามสภาพยางก้อน"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              บันทึกจุดรับซื้อ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
