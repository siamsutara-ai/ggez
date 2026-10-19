import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  ChevronRight,
  LocateFixed,
  Route,
  Sparkles,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Crosshair,
  Compass,
  AlertCircle,
  Home,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { RubberDealer, UserPlantationLocation, DealerCalculationResult } from '../types';
import { formatCurrency } from '../utils/calculations';
import { RouteGeometry } from '../utils/routing';
import { QuickPinModal } from './QuickPinModal';

interface MapScreenProps {
  dealers: RubberDealer[];
  userLocation: UserPlantationLocation;
  results: DealerCalculationResult[];
  routesMap: Record<string, RouteGeometry>;
  onUpdateUserLocation: (newLocation: UserPlantationLocation) => void;
  onSelectDealer: (dealer: RubberDealer) => void;
  onEditDealer: (dealer: RubberDealer) => void;
  onDeleteDealer: (dealerId: string) => void;
  onSaveNewDealer: (dealer: RubberDealer) => void;
  onUpdateDealerCoordinates: (dealerId: string, lat: number, lng: number) => void;
  onNavigateToInput: () => void;
  onNavigateToResults: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  dealers,
  userLocation,
  results,
  routesMap,
  onUpdateUserLocation,
  onSelectDealer,
  onEditDealer,
  onDeleteDealer,
  onSaveNewDealer,
  onUpdateDealerCoordinates,
  onNavigateToInput,
  onNavigateToResults,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Pinning Mode: 'add-dealer' (default) vs 'move-plantation'
  const [pinMode, setPinMode] = useState<'add-dealer' | 'move-plantation'>('add-dealer');

  const [activeDealerId, setActiveDealerId] = useState<string | null>(
    dealers[0]?.id ?? null
  );
  const [routeMode, setRouteMode] = useState<'best' | 'closest' | 'all'>('all');
  const [isLocating, setIsLocating] = useState(false);
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  // Quick pin modal state when user taps map
  const [pendingPinCoords, setPendingPinCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Synchronize pin mode into ref for Leaflet event listener
  const pinModeRef = useRef(pinMode);
  useEffect(() => {
    pinModeRef.current = pinMode;
  }, [pinMode]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);

      markersLayerRef.current = markersLayer;
      routeLayerRef.current = routeLayer;
      mapInstanceRef.current = map;

      // Handle map clicks based on current pinning mode
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (pinModeRef.current === 'add-dealer') {
          // Open quick pin modal for new buying point!
          setPendingPinCoords({ lat, lng });
        } else {
          // Move plantation
          onUpdateUserLocation({
            lat,
            lng,
            name: 'จุดสวนยางที่คุณปักหมุด',
          });
          setPinFeedback('ย้ายจุดปักหมุดสวนยางของคุณแล้ว!');
          setTimeout(() => setPinFeedback(null), 3000);
        }
      });
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Render & Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. User Plantation Marker (Draggable Blue Marker)
    const userIconHtml = `
      <div class="relative flex flex-col items-center cursor-grab active:cursor-grabbing">
        <div class="w-8 h-8 rounded-full bg-blue-600 border-3 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-blue-500/30">
          <div class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        </div>
        <div class="bg-blue-900/95 text-white font-bold text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-md mt-1 pointer-events-none">
          🏡 สวนยางของคุณ (ลากได้)
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-pin-icon',
      html: userIconHtml,
      iconSize: [32, 52],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      draggable: true,
      zIndexOffset: 1000,
    }).addTo(markersLayer);

    userMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      onUpdateUserLocation({
        lat: pos.lat,
        lng: pos.lng,
        name: 'จุดสวนยางที่คุณปักหมุด',
      });
      setPinFeedback('อัปเดตจุดสวนยางของคุณเรียบร้อย! คำนวณเส้นทางใหม่ทันที');
      setTimeout(() => setPinFeedback(null), 3000);
    });

    // 2. User-Created Dealer Pins (Draggable)
    dealers.forEach((dealer, index) => {
      const result = results.find((r) => r.dealer.id === dealer.id);
      const isSelected = activeDealerId === dealer.id;
      const isBest = result?.isBest ?? false;
      const dist = result?.distanceKm ?? 0;
      const color = dealer.pinColor || '#ef4444';

      const dealerIconHtml = `
        <div class="flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-110 ${
          isSelected ? 'scale-110 z-50' : 'z-20'
        }">
          <div class="bg-white px-2.5 py-1.5 rounded-xl shadow-xl border-2 flex flex-col items-center text-center whitespace-nowrap leading-tight transition-all"
               style="border-color: ${color};">
            <div class="flex items-center gap-1 font-bold text-slate-900 text-[11px]">
              <span class="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center font-black" style="background-color: ${color}">${index + 1}</span>
              <span class="truncate max-w-[80px]">${dealer.name}</span>
            </div>
            <div class="flex items-center gap-1 text-[12px] font-extrabold mt-0.5" style="color: ${color}">
              ${dealer.pricePerKg.toFixed(2)}
              <span class="text-[9px] text-slate-500 font-normal">บ./กก.</span>
            </div>
            <div class="text-[10px] font-semibold text-slate-600 mt-0.5">
              ${dist.toFixed(1)} กม.
            </div>
            ${
              isBest
                ? `<span class="bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 shadow-xs">คุ้มที่สุด 🏆</span>`
                : ''
            }
          </div>
          <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px]"
               style="border-top-color: ${color};"></div>
          <div class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm -mt-1"
               style="background-color: ${color};"></div>
        </div>
      `;

      const dealerIcon = L.divIcon({
        className: 'custom-dealer-pin',
        html: dealerIconHtml,
        iconSize: [95, 68],
        iconAnchor: [47, 68],
      });

      if (dealer.lat == null || dealer.lng == null) return;

      const marker = L.marker([dealer.lat, dealer.lng], {
        icon: dealerIcon,
        draggable: true,
      }).addTo(markersLayer);

      marker.on('click', () => {
        setActiveDealerId(dealer.id);
        onSelectDealer(dealer);
      });

      // Allow dragging dealer pins to move their location
      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        onUpdateDealerCoordinates(dealer.id, pos.lat, pos.lng);
        setPinFeedback(`ย้ายพิกัด "${dealer.name}" แล้ว! คำนวณระยะทางใหม่ทันที`);
        setTimeout(() => setPinFeedback(null), 3000);
      });
    });
  }, [dealers, results, userLocation, activeDealerId]);

  // Draw Real Road Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (dealers.length === 0) return;

    const bestResult = results[0];
    const closestResult = [...results].sort((a, b) => a.distanceKm - b.distanceKm)[0];

    const targetResults: DealerCalculationResult[] = [];

    if (routeMode === 'best' && bestResult) {
      targetResults.push(bestResult);
    } else if (routeMode === 'closest' && closestResult) {
      targetResults.push(closestResult);
    } else {
      targetResults.push(...results);
    }

    targetResults.forEach((res) => {
      const isSelected = activeDealerId === res.dealer.id;
      const isBest = res.isBest;

      const routeGeo = routesMap[res.dealer.id];
      const coords = routeGeo?.coordinates || [
        [userLocation.lat, userLocation.lng],
        [res.dealer.lat ?? userLocation.lat, res.dealer.lng ?? userLocation.lng],
      ];

      const polyline = L.polyline(coords as L.LatLngExpression[], {
        color: isBest ? '#059669' : isSelected ? '#2563eb' : res.dealer.pinColor || '#94a3b8',
        weight: isBest ? 6 : isSelected ? 5 : 4,
        opacity: isBest ? 0.95 : 0.75,
        dashArray: routeGeo?.isRealRoad ? undefined : '6, 8',
      }).addTo(routeLayer);

      polyline.bindTooltip(
        `${res.dealer.name}: ${res.distanceKm.toFixed(1)} กม. (~${res.drivingMinutes} นาที)`,
        { sticky: true, className: 'route-tooltip' }
      );
    });
  }, [activeDealerId, routeMode, userLocation, results, routesMap, dealers]);

  // Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onUpdateUserLocation({
          lat: latitude,
          lng: longitude,
          name: 'ตำแหน่ง GPS ของสวนยางคุณ',
        });
        mapInstanceRef.current?.flyTo([latitude, longitude], 13);
        setPinFeedback('ระบุพิกัดสวนยางจาก GPS ปัจจุบันสำเร็จแล้ว!');
        setTimeout(() => setPinFeedback(null), 3000);
      },
      () => {
        setIsLocating(false);
        alert('ไม่สามารถดึงตำแหน่ง GPS ได้ กรุณาแตะบนแผนที่เพื่อปักหมุดด้วยตนเอง');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const activeResult = results.find((r) => r.dealer.id === activeDealerId) || results[0];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Toast feedback */}
      {pinFeedback && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium text-center shadow-xs flex items-center justify-center gap-1.5 animate-fade-in z-20">
          <Sparkles className="w-4 h-4 text-amber-300" />
          {pinFeedback}
        </div>
      )}

      {/* Pinning Mode Selector & Guidance Header Bar */}
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shadow-xs z-10">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setPinMode('add-dealer')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              pinMode === 'add-dealer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>ปักหมุดล้งรับซื้อยาง</span>
          </button>
          <button
            onClick={() => setPinMode('move-plantation')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              pinMode === 'move-plantation'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>ปักหมุดสวนยาง</span>
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 shrink-0">
          ปักแล้ว <span className="font-bold text-emerald-700">{dealers.length}</span> จุด
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-200 border-b border-slate-200">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Dynamic Action Instructions floating on Map */}
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pinMode === 'add-dealer' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-medium">
                    {dealers.length === 0
                      ? '👉 แตะบนแผนที่เพื่อปักหมุดจุดรับซื้อแห่งแรก'
                      : dealers.length === 1
                      ? '👉 แตะบนแผนที่เพิ่มอีก 1 จุดเพื่อเปรียบเทียบราคา'
                      : '👉 แตะบนแผนที่เพื่อเพิ่มล้ง หรือลากหมุดเพื่อปรับตำแหน่ง'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span className="font-medium">
                    👉 แตะหรือลากหมุดสีน้ำเงิน เพื่อตั้งจุดสวนยางของคุณ
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Route Filter Controls */}
        {dealers.length >= 2 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setRouteMode('all')}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                routeMode === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              ทุกเส้นทาง ({dealers.length})
            </button>
            <button
              onClick={() => setRouteMode('best')}
              className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 ${
                routeMode === 'best'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              คุ้มสุด
            </button>
            <button
              onClick={() => setRouteMode('closest')}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                routeMode === 'closest'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              ใกล้สุด
            </button>
          </div>
        )}

        {/* GPS Control */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            title="ค้นหาตำแหน่ง GPS สวนยางของคุณ"
            className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-emerald-700 shadow-md border border-slate-200 flex items-center justify-center transition-all active:scale-95"
          >
            <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Selected Dealer Highlight Bar */}
      {activeResult && (
        <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeResult.dealer.pinColor }}
            />
            <div className="truncate">
              <span className="font-bold text-slate-900">
                {activeResult.dealer.name}:
              </span>
              <span className="font-bold text-emerald-700 ml-1">
                {activeResult.dealer.pricePerKg.toFixed(2)} บ./กก.
              </span>
              <span className="text-slate-500 ml-1.5">
                (ระยะทางถนน {activeResult.distanceKm.toFixed(1)} กม. ~{activeResult.drivingMinutes} นาที)
              </span>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${activeResult.dealer.lat},${activeResult.dealer.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <Navigation className="w-3 h-3" />
            เปิด Google Maps
          </a>
        </div>
      )}

      {/* Dealers List below map */}
      <div className="flex-1 overflow-y-auto px-4 py-3 max-w-md mx-auto w-full pb-20 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              จุดรับซื้อที่คุณปักหมุดไว้ ({dealers.length} จุด)
            </h2>
            <p className="text-[11px] text-slate-500">
              {dealers.length === 0
                ? 'แตะบนแผนที่เพื่อเริ่มปักหมุดจุดแรก'
                : 'คลิกที่หมุดเพื่อดูเส้นทาง หรือลากหมุดบนแผนที่เพื่อปรับตำแหน่ง'}
            </p>
          </div>
        </div>

        {dealers.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-emerald-300 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              ยังไม่มีจุดรับซื้อที่ปักหมุด
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              แตะบนแผนที่ด้านบนตรงตำแหน่งล้งรับซื้อยางพาราที่คุณอยากนำมาเปรียบเทียบ (แนะนำปักหมุด 2-4 จุด)
            </p>
            <button
              onClick={() => {
                setPinMode('add-dealer');
                setPendingPinCoords({
                  lat: userLocation.lat + 0.02,
                  lng: userLocation.lng + 0.02,
                });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              ปักหมุดจุดรับซื้อแห่งแรกทันที
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dealers.map((dealer, index) => {
              const res = results.find((r) => r.dealer.id === dealer.id);
              const isSelected = activeDealerId === dealer.id;
              const isBest = res?.isBest;
              const distance = res?.distanceKm ?? 0;

              return (
                <div
                  key={dealer.id}
                  onClick={() => {
                    setActiveDealerId(dealer.id);
                    onSelectDealer(dealer);
                  }}
                  className={`bg-white rounded-xl p-3 border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: dealer.pinColor }}
                    >
                      {index + 1}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {dealer.name}
                        </h3>
                        {isBest && dealers.length >= 2 && (
                          <span className="shrink-0 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            คุ้มที่สุด 🏆
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-bold text-emerald-700 text-[13px]">
                          {dealer.pricePerKg.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-500">บาท/กก.</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {distance.toFixed(1)} กม.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEditDealer(dealer)}
                      title="แก้ไขราคาหรือชื่อ"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`ต้องการลบหมุด "${dealer.name}" หรือไม่?`)) {
                          onDeleteDealer(dealer.id);
                        }
                      }}
                      title="ลบหมุดนี้"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button: Go to calculate or results */}
        <div className="pt-2 space-y-2">
          {dealers.length >= 2 ? (
            <button
              onClick={onNavigateToResults}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              ดูผลวิเคราะห์ว่าที่ไหนคุ้มที่สุด ({dealers.length} จุด)
            </button>
          ) : (
            <button
              onClick={onNavigateToInput}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
            >
              ไปกรอกน้ำหนักยาง & ความชื้น
            </button>
          )}
        </div>
      </div>

      {/* Quick Pin Dialog when user taps map */}
      {pendingPinCoords && (
        <QuickPinModal
          lat={pendingPinCoords.lat}
          lng={pendingPinCoords.lng}
          dealerNumber={dealers.length + 1}
          onSave={(newDealer) => {
            onSaveNewDealer(newDealer);
            setPendingPinCoords(null);
            setPinFeedback(`ปักหมุด "${newDealer.name}" สำเร็จแล้ว!`);
            setTimeout(() => setPinFeedback(null), 3000);
          }}
          onCancel={() => setPendingPinCoords(null)}
        />
      )}
    </div>
  );
};
