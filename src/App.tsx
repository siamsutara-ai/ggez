/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Maximize2,
  RefreshCw,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DealerListScreen } from './components/DealerListScreen';
import { InputScreen } from './components/InputScreen';
import { ResultScreen } from './components/ResultScreen';
import { DealerDetailModal } from './components/DealerDetailModal';
import { DealerFormModal } from './components/DealerFormModal';
import { InfoGuideModal } from './components/InfoGuideModal';
import { DEFAULT_DEALERS, INITIAL_USER_LOCATION } from './data/dealers';
import {
  CalculationInput,
  RubberDealer,
  UserPlantationLocation,
} from './types';
import { calculateDealerResults } from './utils/calculations';
import { fetchRealRoadRoute, RouteGeometry } from './utils/routing';

const INITIAL_CHANNELS: RubberDealer[] = [
  {
    id: 'dealer-1',
    name: 'ร้านที่ 1 (ล้งใกล้บ้าน)',
    distanceKm: 5.7,
    pricePerKg: 72.50,
  },
  {
    id: 'dealer-2',
    name: 'ร้านที่ 2 (ล้งในเมือง)',
    distanceKm: 11.4,
    pricePerKg: 71.20,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');

  // Candidate dealer channels where user fills in name, distance in km, and price
  const [dealers, setDealers] = useState<RubberDealer[]>(() => {
    try {
      const saved = localStorage.getItem('rubber_user_dealers_list');
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // User's plantation or starting location
  const [userLocation, setUserLocation] = useState<UserPlantationLocation>(() => {
    try {
      const saved = localStorage.getItem('rubber_user_location');
      return saved ? JSON.parse(saved) : INITIAL_USER_LOCATION;
    } catch {
      return INITIAL_USER_LOCATION;
    }
  });

  // Rubber batch specs
  const [input, setInput] = useState<CalculationInput>(() => {
    try {
      const saved = localStorage.getItem('rubber_batch_input');
      return saved
        ? JSON.parse(saved)
        : {
            weightKg: 500,
            moisturePercent: 10,
            includeFuelCost: true,
            fuelPricePerLiter: 33.0,
            fuelEconomyKmPerLiter: 11.0,
            roundTrip: true,
            manualDistanceKm: null,
          };
    } catch {
      return {
        weightKg: 500,
        moisturePercent: 10,
        includeFuelCost: true,
        fuelPricePerLiter: 33.0,
        fuelEconomyKmPerLiter: 11.0,
        roundTrip: true,
        manualDistanceKm: null,
      };
    }
  });

  // Subdistricts filter
  const [selectedSubdistrict, setSelectedSubdistrict] =
    useState<string>('ทุกตำบลใน อ.ท่าศาลา');

  // Real road routes cache
  const [routesMap, setRoutesMap] = useState<Record<string, RouteGeometry>>({});

  // Modals state
  const [selectedDealer, setSelectedDealer] = useState<RubberDealer | null>(null);
  const [editingDealer, setEditingDealer] = useState<RubberDealer | null>(null);
  const [showDealerForm, setShowDealerForm] = useState<boolean>(false);
  const [presetFormCoords, setPresetFormCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // View frame mode
  const [viewMode, setViewMode] = useState<'mobile' | 'wide'>('mobile');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rubber_user_dealers_list', JSON.stringify(dealers));
    } catch (e) {}
  }, [dealers]);

  useEffect(() => {
    try {
      localStorage.setItem('rubber_user_location', JSON.stringify(userLocation));
    } catch (e) {}
  }, [userLocation]);

  useEffect(() => {
    try {
      localStorage.setItem('rubber_batch_input', JSON.stringify(input));
    } catch (e) {}
  }, [input]);

  // Sync distance updates from InputScreen
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setDealers((prev) =>
          prev.map((d) =>
            d.id === e.detail.id ? { ...d, distanceKm: e.detail.distanceKm } : d
          )
        );
      }
    };
    window.addEventListener('updateDealerDistance', handler);
    return () => window.removeEventListener('updateDealerDistance', handler);
  }, []);

  // Fetch real road routes if coordinates exist
  useEffect(() => {
    let isCancelled = false;

    const fetchAllRoutes = async () => {
      const newRoutesMap: Record<string, RouteGeometry> = {};

      for (const dealer of dealers) {
        if (isCancelled) return;
        if (dealer.lat != null && dealer.lng != null) {
          const route = await fetchRealRoadRoute(
            userLocation.lat,
            userLocation.lng,
            dealer.lat,
            dealer.lng
          );
          newRoutesMap[dealer.id] = route;
        }
      }

      if (!isCancelled) {
        setRoutesMap(newRoutesMap);
      }
    };

    fetchAllRoutes();

    return () => {
      isCancelled = true;
    };
  }, [userLocation.lat, userLocation.lng, dealers]);

  // Calculations
  const results = useMemo(() => {
    return calculateDealerResults(dealers, userLocation, input, routesMap);
  }, [dealers, userLocation, input, routesMap]);

  const selectedDealerResult = useMemo(() => {
    if (!selectedDealer) return null;
    return results.find((r) => r.dealer.id === selectedDealer.id) || null;
  }, [selectedDealer, results]);

  // Handler functions
  const handleAddDealerSlot = () => {
    const nextNum = dealers.length + 1;
    const newDealer: RubberDealer = {
      id: `dealer-${Date.now()}`,
      name: `ร้านที่ ${nextNum}`,
      distanceKm: 8.0,
      pricePerKg: 71.50,
    };
    setDealers((prev) => [...prev, newDealer]);
  };

  const handleUpdateDealer = (dealerId: string, updates: Partial<RubberDealer>) => {
    setDealers((prev) =>
      prev.map((d) => (d.id === dealerId ? { ...d, ...updates } : d))
    );
  };

  const handleSaveDealer = (savedDealer: RubberDealer) => {
    setDealers((prev) => {
      const index = prev.findIndex((d) => d.id === savedDealer.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = savedDealer;
        return updated;
      }
      return [...prev, savedDealer];
    });
    setEditingDealer(null);
    setShowDealerForm(false);
    setPresetFormCoords(null);
  };

  const handleDeleteDealer = (dealerId: string) => {
    setDealers((prev) => prev.filter((d) => d.id !== dealerId));
    if (selectedDealer?.id === dealerId) {
      setSelectedDealer(null);
    }
  };

  const handleUpdateDealerPrice = (dealerId: string, newPrice: number) => {
    setDealers((prev) =>
      prev.map((d) => (d.id === dealerId ? { ...d, pricePerKg: newPrice } : d))
    );
  };

  const handleOpenAddDealer = (presetCoords?: { lat: number; lng: number }) => {
    setEditingDealer(null);
    setPresetFormCoords(presetCoords || null);
    setShowDealerForm(true);
  };

  const handleEditDealer = (dealer: RubberDealer) => {
    setEditingDealer(dealer);
    setShowDealerForm(true);
  };

  const handleResetToSample = () => {
    if (confirm('ต้องการโหลดข้อมูลตัวอย่างจุดรับซื้อใน อ.ท่าศาลา เพื่อทดสอบหรือไม่?')) {
      setDealers(DEFAULT_DEALERS);
      setUserLocation(INITIAL_USER_LOCATION);
    }
  };

  const handleClearAllDealers = () => {
    if (confirm('ต้องการล้างรายการร้านรับซื้อทั้งหมดเพื่อเริ่มกรอกใหม่หรือไม่?')) {
      setDealers([]);
      localStorage.removeItem('rubber_user_dealers_list');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start md:py-6 md:px-4 font-['Prompt',sans-serif]">
      {/* Desktop helper bar */}
      <div className="w-full max-w-4xl mb-3 hidden md:flex items-center justify-between text-xs text-slate-300 px-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white">
            ระบบเปรียบเทียบจุดรับซื้อยางพารา กรอกระยะทาง (กม.) และราคาเพื่อหาที่คุ้มที่สุด
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAllDealers}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors text-xs"
            title="ล้างข้อมูลเพื่อเริ่มกรอกเองใหม่"
          >
            ล้างข้อมูลทั้งหมด
          </button>

          <button
            onClick={handleResetToSample}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1"
            title="โหลดตัวอย่างท่าศาลา"
          >
            <RotateCcw className="w-3 h-3" />
            ตัวอย่างท่าศาลา
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'wide' : 'mobile')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors cursor-pointer text-xs"
          >
            {viewMode === 'mobile' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ขยายเต็มจอ</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>มุมมองมือถือ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full bg-slate-100 flex flex-col transition-all duration-300 shadow-2xl relative overflow-hidden ${
          viewMode === 'mobile'
            ? 'max-w-[420px] md:rounded-[40px] md:border-[10px] md:border-slate-800 md:min-h-[840px] md:h-[840px]'
            : 'max-w-4xl md:rounded-3xl md:min-h-[840px]'
        }`}
      >
        {/* Status bar */}
        <div className="bg-white px-6 pt-2 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 select-none border-b border-slate-100">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Header */}
        {activeTab === 'map' && (
          <Header
            selectedSubdistrict={selectedSubdistrict}
            onSelectSubdistrict={setSelectedSubdistrict}
            onOpenInfo={() => setShowInfoModal(true)}
          />
        )}

        {/* Main Content Router */}
        <main className="flex-1 overflow-y-auto relative">
          {activeTab === 'map' && (
            <DealerListScreen
              dealers={dealers}
              input={input}
              results={results}
              onAddDealer={handleAddDealerSlot}
              onUpdateDealer={handleUpdateDealer}
              onDeleteDealer={handleDeleteDealer}
              onNavigateToInput={() => setActiveTab('input')}
              onNavigateToResults={() => setActiveTab('results')}
            />
          )}

          {activeTab === 'input' && (
            <InputScreen
              input={input}
              dealers={dealers}
              userLocation={userLocation}
              onUpdateInput={setInput}
              onUpdateDealerPrice={handleUpdateDealerPrice}
              onOpenAddDealer={() => handleOpenAddDealer()}
              onEditDealer={handleEditDealer}
              onDeleteDealer={handleDeleteDealer}
              onBack={() => setActiveTab('map')}
              onSubmit={() => setActiveTab('results')}
            />
          )}

          {activeTab === 'results' && (
            <ResultScreen
              results={results}
              input={input}
              userLocation={userLocation}
              onBack={() => setActiveTab('input')}
              onSelectDealer={(dealer) => setSelectedDealer(dealer)}
              onViewOnMap={() => setActiveTab('map')}
              onUpdateWeight={(newWeight) =>
                setInput((prev) => ({ ...prev, weightKg: newWeight }))
              }
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bestPrice={results[0]?.dealer.pricePerKg}
        />

        {/* Modals */}
        {showDealerForm && (
          <DealerFormModal
            initialDealer={
              editingDealer ||
              (presetFormCoords
                ? {
                    id: '',
                    name: '',
                    pricePerKg: 72.0,
                    lat: presetFormCoords.lat,
                    lng: presetFormCoords.lng,
                    pinColor: '#ef4444',
                    address: 'อ.ท่าศาลา จ.นครศรีธรรมราช',
                  }
                : null)
            }
            userLocation={userLocation}
            onSave={handleSaveDealer}
            onClose={() => {
              setShowDealerForm(false);
              setEditingDealer(null);
              setPresetFormCoords(null);
            }}
          />
        )}

        {selectedDealerResult && (
          <DealerDetailModal
            result={selectedDealerResult}
            userLocation={userLocation}
            onClose={() => setSelectedDealer(null)}
          />
        )}

        {showInfoModal && (
          <InfoGuideModal onClose={() => setShowInfoModal(false)} />
        )}
      </div>

      <div className="max-w-md w-full text-center mt-3 text-[11px] text-slate-400 hidden md:block">
        💡 คุณสามารถกรอกข้อมูล แก้ไขราคา และปักหมุดจุดรับซื้อได้ด้วยตนเองอย่างอิสระ
      </div>
    </div>
  );
}
