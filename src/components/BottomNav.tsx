import { Store, FileText, Award } from 'lucide-react';

export type TabType = 'map' | 'input' | 'results';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  bestPrice?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  bestPrice,
}) => {
  const tabs = [
    {
      id: 'map' as TabType,
      label: 'ร้านรับซื้อ',
      icon: Store,
    },
    {
      id: 'input' as TabType,
      label: 'ข้อมูลก้อนยาง',
      icon: FileText,
    },
    {
      id: 'results' as TabType,
      label: 'ผลเปรียบเทียบ',
      icon: Award,
      badge: bestPrice ? `${bestPrice} ฿` : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 font-normal'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
