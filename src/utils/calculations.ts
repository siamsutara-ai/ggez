import { CalculationInput, DealerCalculationResult, RubberDealer, UserPlantationLocation } from '../types';
import { RouteGeometry } from './routing';

/**
 * Calculates Haversine straight line road distance estimate
 */
export function calculateRoadDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  return Math.max(0.5, Math.round(straightLine * 1.28 * 10) / 10);
}

/**
 * Estimate driving duration in minutes
 */
export function estimateDrivingMinutes(distanceKm: number): number {
  return Math.max(3, Math.round((distanceKm / 45) * 60 + 2));
}

/**
 * Calculate full comparison and dynamic analysis for all entered dealers
 */
export function calculateDealerResults(
  dealers: RubberDealer[],
  userLocation: UserPlantationLocation,
  input: CalculationInput,
  routesMap: Record<string, RouteGeometry> = {}
): DealerCalculationResult[] {
  if (!dealers || dealers.length === 0) return [];

  const rawResults = dealers.map((dealer) => {
    // Check if we have fetched real road route
    const cachedRoute = routesMap[dealer.id];

    let distanceKm: number = 1;

    if (dealer.distanceKm != null && dealer.distanceKm > 0) {
      distanceKm = dealer.distanceKm;
    } else if (input.manualDistanceKm != null && input.manualDistanceKm > 0) {
      distanceKm = input.manualDistanceKm;
    } else if (cachedRoute) {
      distanceKm = cachedRoute.distanceKm;
    } else if (dealer.lat != null && dealer.lng != null) {
      distanceKm = calculateRoadDistanceKm(
        userLocation.lat,
        userLocation.lng,
        dealer.lat,
        dealer.lng
      );
    } else {
      distanceKm = 5;
    }

    const drivingMinutes = estimateDrivingMinutes(distanceKm);

    // Moisture calculation:
    // Dealer's minimum deduction or actual rubber moisture estimate
    const minDeduction = dealer.minMoistureDeductionPercent ?? 0;
    const effectiveMoisturePercent = Math.max(
      minDeduction,
      Math.min(45, input.moisturePercent)
    );

    // Weight deduction
    const weightLossKg = (input.weightKg * effectiveMoisturePercent) / 100;
    const dryWeightKg = Math.max(0, input.weightKg - weightLossKg);

    // Gross income
    const grossIncome = dryWeightKg * dealer.pricePerKg;

    // Fuel cost
    const travelDistance = input.roundTrip ? distanceKm * 2 : distanceKm;
    const fuelCostRaw =
      (travelDistance / (input.fuelEconomyKmPerLiter || 11)) *
      (input.fuelPricePerLiter || 33);
    const fuelCost = input.includeFuelCost ? Math.round(fuelCostRaw) : 0;

    // Net income
    const netIncome = Math.round(grossIncome - fuelCost);

    return {
      dealer,
      distanceKm,
      drivingMinutes,
      routeGeometry: cachedRoute,
      rawWeightKg: input.weightKg,
      effectiveMoisturePercent,
      weightLossKg: Math.round(weightLossKg * 10) / 10,
      dryWeightKg: Math.round(dryWeightKg * 10) / 10,
      grossIncome: Math.round(grossIncome),
      fuelCost,
      netIncome,
      rank: 1,
      isBest: false,
      profitDifferenceFromBest: 0,
      analysisReason: '',
    };
  });

  // Sort by net income descending
  rawResults.sort((a, b) => b.netIncome - a.netIncome);

  const bestResult = rawResults[0];
  const bestIncome = bestResult ? bestResult.netIncome : 0;

  // Generate analytical reasoning for each option
  return rawResults.map((item, index) => {
    const isBest = index === 0;
    const profitDifference = Math.max(0, bestIncome - item.netIncome);

    let analysisReason = '';
    if (isBest) {
      if (rawResults.length === 1) {
        analysisReason = 'จุดรับซื้อเดียวที่ระบุไว้ ได้เงินสุทธิตามราคานี้';
      } else {
        const secondBest = rawResults[1];
        const diff = bestIncome - secondBest.netIncome;
        if (item.distanceKm <= secondBest.distanceKm && item.dealer.pricePerKg >= secondBest.dealer.pricePerKg) {
          analysisReason = `ให้ราคาสูงที่สุด (${item.dealer.pricePerKg.toFixed(2)} บ./กก.) และอยู่ใกล้กว่า ประหยัดทั้งค่าน้ำมันและได้เงินมากกว่าอันดับ 2 ถึง ${formatCurrency(diff)} บาท`;
        } else if (item.dealer.pricePerKg > secondBest.dealer.pricePerKg) {
          analysisReason = `ให้ราคาสูงกว่าอันดับ 2 (+${(item.dealer.pricePerKg - secondBest.dealer.pricePerKg).toFixed(2)} บ./กก.) ชดเชยค่าน้ำมันเดินทางได้เกินพอ ได้เงินสุทธิมากกว่า ${formatCurrency(diff)} บาท`;
        } else {
          analysisReason = `อยู่ใกล้กว่ามาก ประหยัดค่าน้ำมันไป-กลับได้คุ้มกว่า จึงทำให้เงินสุทธิที่ได้จริงสูงกว่า ${formatCurrency(diff)} บาท`;
        }
      }
    } else {
      if (item.dealer.pricePerKg < bestResult.dealer.pricePerKg && item.distanceKm > bestResult.distanceKm) {
        analysisReason = `ให้ราคาต่อ กก. ต่ำกว่า และอยู่ไกลกว่า ทำให้เสียค่าน้ำมันเพิ่มและได้เงินน้อยกว่าอันดับ 1 ถึง ${formatCurrency(profitDifference)} บาท`;
      } else if (item.distanceKm > bestResult.distanceKm) {
        analysisReason = `ระยะทางไกลกว่า ${ (item.distanceKm - bestResult.distanceKm).toFixed(1) } กม. ค่าน้ำมันที่เพิ่มขึ้นทำให้เงินสุทธิลดลง ${formatCurrency(profitDifference)} บาท`;
      } else {
        analysisReason = `ราคาต่อ กก. น้อยกว่าอันดับ 1 อยู่ ${(bestResult.dealer.pricePerKg - item.dealer.pricePerKg).toFixed(2)} บาท ทำให้ยอดเงินรวมน้อยกว่า ${formatCurrency(profitDifference)} บาท`;
      }
    }

    return {
      ...item,
      rank: index + 1,
      isBest,
      profitDifferenceFromBest: profitDifference,
      analysisReason,
    };
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDecimal(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}
