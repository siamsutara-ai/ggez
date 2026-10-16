import { RouteGeometry } from '../utils/routing';

export interface RubberDealer {
  id: string;
  name: string;
  address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  lat: number;
  lng: number;
  pricePerKg: number; // บาท/กก. ที่จุดรับซื้อให้
  pinColor: string; // สีหมุดบนแผนที่
  phone?: string;
  openHours?: string;
  moisturePolicy?: string; // คำอธิบายเกณฑ์หักความชื้น
  minMoistureDeductionPercent?: number; // หักขั้นต่ำกี่ % (ถ้ามี)
  baseMoistureDeductionPercent?: number; // ตัวเลือกรองรับ
  note?: string;
  isUserAdded?: boolean;
}

export interface UserPlantationLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface CalculationInput {
  weightKg: number; // น้ำหนักก้อนยางพารา (กก.)
  moisturePercent: number; // เปอร์เซ็นต์ความเปียกชื้นของก้อนยางพารา (ประมาณเอาหรือประมาณค่า) (%)
  includeFuelCost: boolean; // รวมค่าน้ำมันในการคำนวณ (โดยประมาณ)
  fuelPricePerLiter: number; // ราคาน้ำมันดีเซล เช่น 33.00
  fuelEconomyKmPerLiter: number; // อัตราสิ้นเปลือง เช่น 11 กม./ลิตร
  roundTrip: boolean; // คำนวณไป-กลับ (x2)
  manualDistanceKm?: number | null; // ถ้าระบุระยะทางเอง
}

export interface DealerCalculationResult {
  dealer: RubberDealer;
  distanceKm: number; // ระยะทางตามถนนจริง (กม.)
  drivingMinutes: number; // เวลาเดินทาง (นาที)
  routeGeometry?: RouteGeometry;
  rawWeightKg: number;
  effectiveMoisturePercent: number;
  weightLossKg: number;
  dryWeightKg: number;
  grossIncome: number; // รายรับก่อนหักน้ำมัน
  fuelCost: number; // ค่าน้ำมัน
  netIncome: number; // เงินสุทธิที่ได้จริง
  rank: number;
  isBest: boolean;
  profitDifferenceFromBest: number;
  analysisReason: string; // คำวิเคราะห์เหตุผลทำไมคุ้มกว่าหรือไม่คุ้ม
}
