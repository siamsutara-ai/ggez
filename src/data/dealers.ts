import { RubberDealer, UserPlantationLocation } from '../types';

export const INITIAL_USER_LOCATION: UserPlantationLocation = {
  lat: 8.6610,
  lng: 99.9230,
  name: 'สวนยางพาราของฉัน (ต.ท่าศาลา)',
};

export const DEFAULT_DEALERS: RubberDealer[] = [
  {
    id: 'dealer-1',
    name: 'ล้งประจักษ์พัฒนา (สาขาท่าขึ้น)',
    distanceKm: 5.7,
    address: '142 หมู่ 3 ถ.สุราษฎร์-นครศรีฯ (ทล.401) ต.ท่าขึ้น อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'ท่าขึ้น',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.6985,
    lng: 99.9192,
    pricePerKg: 72.50,
    pinColor: '#ef4444', // Red
    phone: '075-521-889',
    openHours: '06:00 - 17:30 น. ทุกวัน',
    moisturePolicy: 'หักตามจริง (ตาชั่งดิจิทัล ได้มาตรฐาน กยท.)',
    baseMoistureDeductionPercent: 2,
    note: 'ให้ราคาสูงสุดวันนี้ จ่ายเงินสดทันที มีลานเทกว้างลงยางสะดวก'
  },
  {
    id: 'dealer-2',
    name: 'ล้งท่าศาลาการยาง',
    distanceKm: 11.4,
    address: '88/4 ใกล้สี่แยกท่าศาลา ต.ท่าศาลา อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'ท่าศาลา',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.6652,
    lng: 99.9275,
    pricePerKg: 71.20,
    pinColor: '#f59e0b', // Amber/Orange
    phone: '081-978-4521',
    openHours: '06:30 - 18:00 น. ทุกวัน',
    moisturePolicy: 'หักความชื้นเฉลี่ย 3% หากยางแห้งดี',
    baseMoistureDeductionPercent: 3,
    note: 'อยู่ใกล้ตัวอำเภอท่าศาลา ทางเข้าออกสะดวก รถกระบะเข้าได้พร้อมกัน 8 คัน'
  },
  {
    id: 'dealer-3',
    name: 'ล้งชัยมงคล รับซื้อยางก้อน',
    distanceKm: 7.2,
    address: '25/1 ถ.สายท่าศาลา-นบพิตำ ต.โมคลาน อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'โมคลาน',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.6391,
    lng: 99.8824,
    pricePerKg: 70.90,
    pinColor: '#10b981', // Emerald
    phone: '086-234-9912',
    openHours: '07:00 - 17:00 น. ปิดวันอาทิตย์',
    moisturePolicy: 'หักความชื้น 4% สภาพยางก้อนถ้วยทั่วไป',
    baseMoistureDeductionPercent: 4,
    note: 'รับไม่อั้น มีบริการคัดแยกเกรดยาง มีของแถมน้ำกรดหยอดยาง'
  },
  {
    id: 'dealer-4',
    name: 'ล้งนครยางพารา (โพธิ์ทอง-หัวตะพาน)',
    distanceKm: 12.3,
    address: '9/2 ต.โพธิ์ทอง อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'โพธิ์ทอง',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.6145,
    lng: 99.9482,
    pricePerKg: 69.80,
    pinColor: '#8b5cf6', // Purple
    phone: '075-522-310',
    openHours: '06:30 - 16:30 น. จันทร์ - เสาร์',
    moisturePolicy: 'หักความชื้น 4% ชั่งน้ำหนักแม่นยำ',
    baseMoistureDeductionPercent: 4,
    note: 'บริการดี ชั่งเร็ว ไม่ต้องรอนาน โอนเงินไวเข้าบัญชีพร้อมเพย์'
  },
  {
    id: 'dealer-5',
    name: 'สหกรณ์กองทุนสวนยางท่าศาลา จำกัด',
    distanceKm: 8.5,
    address: '55 หมู่ 1 ต.สระแก้ว อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'สระแก้ว',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.6812,
    lng: 99.8705,
    pricePerKg: 71.80,
    pinColor: '#0ea5e9', // Sky blue
    phone: '075-521-432',
    openHours: '07:30 - 16:00 น. ทุกวัน',
    moisturePolicy: 'หักตามระเบียบการยางแห่งประเทศไทย (กยท.) มีปันผลสมาชิก',
    baseMoistureDeductionPercent: 2.5,
    note: 'สำหรับสมาชิกได้เงินปันผลสิ้นปีเพิ่ม 0.50 บาท/กก. สหกรณ์มั่นคง'
  },
  {
    id: 'dealer-6',
    name: 'ล้งกลายเจริญยางพารา',
    distanceKm: 14.0,
    address: '112/3 เลียบคลองกลาย ต.กลาย อ.ท่าศาลา จ.นครศรีธรรมราช',
    subdistrict: 'กลาย',
    district: 'ท่าศาลา',
    province: 'นครศรีธรรมราช',
    lat: 8.7410,
    lng: 99.8970,
    pricePerKg: 72.00,
    pinColor: '#ec4899', // Pink
    phone: '089-663-7182',
    openHours: '06:00 - 17:00 น. ทุกวัน',
    moisturePolicy: 'หักความชื้น 2-3% ตามสภาพยางก้อน',
    baseMoistureDeductionPercent: 3,
    note: 'จุดรับซื้อใหญ่ทางตอนเหนือของท่าศาลา ติดต่อสิชลได้รวดเร็ว'
  }
];

export const THA_SALA_SUBDISTRICTS = [
  'ทุกตำบลใน อ.ท่าศาลา',
  'ต.ท่าศาลา',
  'ต.ท่าขึ้น',
  'ต.โมคลาน',
  'ต.โพธิ์ทอง',
  'ต.สระแก้ว',
  'ต.กลาย',
  'ต.หัวตะพาน',
  'ต.ดอนตะโก',
  'ต.ตลิ่งชัน'
];
