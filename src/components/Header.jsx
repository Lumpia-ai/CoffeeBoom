import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  BarChart3, 
  ReceiptText, 
  Settings, 
  Maximize, 
  Minimize, 
  Clock, 
  ShieldCheck, 
  PauseCircle,
  Sparkles,
  User
} from 'lucide-react';
import { STORE_INFO } from '../data/menu';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  heldOrdersCount, 
  onOpenHeldOrders, 
  onOpenOwnerPin,
  isOwnerUnlocked,
  cashierName
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'owner' && !isOwnerUnlocked) {
      onOpenOwnerPin();
    } else {
      setCurrentTab(tabId);
    }
  };

  return (
    <header className="bg-[#261711] text-[#F5EBE1] shadow-lg sticky top-0 z-30 border-b border-[#3D281F]">
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8D5B4C] to-[#4A2E24] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#2E1A12] flex items-center justify-center border border-[#A67C52]/40">
              <Coffee className="w-6 h-6 text-[#E4B07B]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-serif text-[#FAF3EB] leading-none">
                {STORE_INFO.name}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A67C52]/25 text-[#E4B07B] font-semibold border border-[#A67C52]/40 tracking-wider uppercase">
                iPad POS
              </span>
            </div>
            <p className="text-[11px] text-[#C4A999] tracking-wide mt-0.5 flex items-center gap-1.5">
              <span>{STORE_INFO.location}</span>
              <span>•</span>
              <span className="italic font-medium text-[#E4B07B]">{STORE_INFO.slogan}</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Optimized for iPad Finger Taps) */}
        <nav className="flex items-center bg-[#1A0E0A] p-1.5 rounded-2xl border border-[#3D281F] shadow-inner gap-1">
          <button
            onClick={() => handleTabClick('pos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'pos'
                ? 'bg-gradient-to-r from-[#8D5B4C] to-[#A67C52] text-white shadow-md'
                : 'text-[#D0B8A8] hover:bg-[#2C1912] hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Counter POS</span>
          </button>

          <button
            onClick={() => handleTabClick('owner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 relative ${
              currentTab === 'owner'
                ? 'bg-gradient-to-r from-[#C27838] to-[#D98A44] text-white shadow-md ring-2 ring-[#E4B07B]/40'
                : 'text-[#D0B8A8] hover:bg-[#2C1912] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#F3C28E]" />
            <span>Owner Sales Review</span>
            {!isOwnerUnlocked && (
              <span className="w-2 h-2 rounded-full bg-[#E4B07B] animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('ledger')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'ledger'
                ? 'bg-[#8D5B4C] text-white shadow-md'
                : 'text-[#D0B8A8] hover:bg-[#2C1912] hover:text-white'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span className="hidden sm:inline">Transactions</span>
          </button>

          <button
            onClick={() => handleTabClick('menu')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
              currentTab === 'menu'
                ? 'bg-[#8D5B4C] text-white shadow-md'
                : 'text-[#D0B8A8] hover:bg-[#2C1912] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Menu Setup</span>
          </button>
        </nav>

        {/* Right Info: Live Clock, Cashier, Parked Orders, Fullscreen */}
        <div className="flex items-center gap-2.5">
          {/* Parked/Held Orders Button */}
          {heldOrdersCount > 0 && (
            <button
              onClick={onOpenHeldOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C25E38]/20 border border-[#C25E38]/50 text-[#F5A17B] text-xs font-bold animate-pulse hover:bg-[#C25E38]/30"
              title="View Parked Orders"
            >
              <PauseCircle className="w-4 h-4" />
              <span>{heldOrdersCount} Held</span>
            </button>
          )}

          {/* Cashier Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A0E0A]/80 rounded-xl border border-[#3D281F] text-xs font-semibold text-[#E4B07B]">
            <User className="w-3.5 h-3.5 text-[#C4A999]" />
            <span>Cashier: <strong className="text-white">{cashierName}</strong></span>
          </div>

          {/* Clock Widget */}
          <div className="hidden lg:flex flex-col items-end px-3 py-1 bg-[#1A0E0A]/70 rounded-xl border border-[#3D281F]/70 text-right">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F3E2D5]">
              <Clock className="w-3.5 h-3.5 text-[#E4B07B]" />
              <span>{timeStr}</span>
            </div>
            <span className="text-[10px] text-[#A68F81] font-medium leading-none">{dateStr}</span>
          </div>

          {/* iPad Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#1A0E0A] hover:bg-[#341F17] border border-[#3D281F] text-[#D0B8A8] hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "iPad Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
