import React from 'react';
import { X, Sprout, Info, Droplet, Fuel, Calculator, CheckCircle2 } from 'lucide-react';

interface InfoGuideModalProps {
  onClose: () => void;
}

export const InfoGuideModal: React.FC<InfoGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scale-up">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                คู่มือการคำนวณขายขี้ยางพารา
              </h3>
              <p className="text-xs text-emerald-200">
                อ.ท่าศาลา จ.นครศรีธรรมราช
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Droplet className="w-4 h-4 text-sky-500" />
              <span>1. ทำไมต้องหักเปอร์เซ็นต์ความชื้น?</span>
            </div>
            <p>
              ขี้ยางพาราหรือยางก้อนถ้วยที่เพิ่งตัดจะมีน้ำและกรดขังอยู่ในก้อนยาง ล้งรับซื้อจะตรวจสอบเปอร์เซ็นต์เนื้อยางแห้ง (DRC) หากยางมีความชื้นสูง จะถูกหักน้ำหนักน้ำออก เช่น น้ำหนัก 500 กก. หักความชื้น 10% จะเหลือน้ำหนักเนื้อยางจริงที่คิดเงิน 450 กก.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Fuel className="w-4 h-4 text-amber-500" />
              <span>2. ค่าน้ำมันกับความคุ้มค่าในการเดินทาง</span>
            </div>
            <p>
              บางล้งให้ราคาต่อกิโลกรัมสูงกว่า 1-2 บาท แต่อยู่ไกลกว่า 15-20 กิโลเมตร หากบรรทุกยางปริมาณน้อย (เช่น 200 กก.) ค่าน้ำมันไป-กลับอาจไม่คุ้มกับเงินส่วนต่างที่ได้เพิ่ม แต่หากบรรทุกจำนวนมาก (เช่น 1,000 - 2,000 กก.) การวิ่งไปล้งที่ให้ราคาสูงกว่าจะได้เงินสุทธิมากกว่าอย่างเห็นได้ชัด
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>3. สูตรคำนวณเงินสุทธิในแอป</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1 text-slate-800">
              <div>น้ำหนักสุทธิ = น้ำหนักดิบ x (100 - %ความชื้น) / 100</div>
              <div>รายรับ = น้ำหนักสุทธิ x ราคาต่อ กก.</div>
              <div>ค่าน้ำมัน = (ระยะทางไป-กลับ / 11 กม./ลิตร) x 33 บาท</div>
              <div className="font-bold text-emerald-700">
                เงินสุทธิ = รายรับ - ค่าน้ำมัน
              </div>
            </div>
          </div>

          {/* Contact note */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
            <p className="font-semibold mb-1">
              การยางแห่งประเทศไทย (กยท.) สาขาท่าศาลา
            </p>
            <p className="text-[11px]">
              ติดต่อสอบถามราคามาตรฐานและโครงการช่วยเหลือเกษตรกรชาวสวนยาง โทร. 075-521-224 (เวลาทำการ 08:30 - 16:30 น.)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
