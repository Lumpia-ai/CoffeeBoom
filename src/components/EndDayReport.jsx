import React, { useState } from 'react';
import { X, Printer, ShieldCheck, Calculator, AlertCircle, CheckCircle2, Banknote } from 'lucide-react';
import { STORE_INFO } from '../data/menu';
import { sound } from '../utils/audio';

export default function EndDayReport({ isOpen, onClose, orders }) {
  const [openingFloat, setOpeningFloat] = useState(1000); // ₱1,000 standard petty cash float
  const [actualCashCounted, setActualCashCounted] = useState('');

  if (!isOpen) return null;

  // Calculate today's sales
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayOrders = orders.filter((o) => {
    return o.status !== 'Voided' && new Date(o.createdAt).getTime() >= todayStart;
  });

  const grossSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalDiscounts = todayOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const totalOrders = todayOrders.length;
  const totalCups = todayOrders.reduce((sum, o) => sum + (o.totalCups || 1), 0);

  const cashSales = todayOrders
    .filter((o) => o.paymentMethod === 'Cash')
    .reduce((sum, o) => sum + o.total, 0);

  const gcashSales = todayOrders
    .filter((o) => o.paymentMethod === 'GCash')
    .reduce((sum, o) => sum + o.total, 0);

  const cardSales = todayOrders
    .filter((o) => o.paymentMethod === 'Maya')
    .reduce((sum, o) => sum + o.total, 0);

  const vatAmount = Math.round((grossSales / 1.12) * 0.12);
  const vatableSales = grossSales - vatAmount;

  const expectedCashInDrawer = openingFloat + cashSales;
  const actualCash = parseFloat(actualCashCounted) || 0;
  const variance = actualCashCounted ? actualCash - expectedCashInDrawer : 0;

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E0D4C5] flex flex-col overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#261711] text-white flex items-center justify-between border-b border-[#3D281F]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E4B07B]" />
            <div>
              <h2 className="text-base font-extrabold text-[#FAF3EB] font-serif">
                Counter Shift & Z-Reading Close
              </h2>
              <p className="text-[11px] text-[#C4A999]">End of Day Cashier Reconciliation</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playTap(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#E4B07B] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Report */}
        <div className="p-5 overflow-y-auto space-y-4 bg-stone-50 font-mono text-xs">
          {/* Printable Container */}
          <div id="printable-receipt" className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="text-center pb-2 border-b border-dashed border-stone-300">
              <h3 className="font-serif font-black text-lg text-stone-900">{STORE_INFO.name}</h3>
              <p className="text-[10px] text-stone-600">{STORE_INFO.location}</p>
              <div className="mt-2 py-1 bg-stone-100 rounded-lg font-bold text-stone-800 text-[11px]">
                OFFICIAL Z-READING (DAY CLOSE)
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Sales Summary */}
            <div className="space-y-1.5 pb-2 border-b border-dashed border-stone-300">
              <div className="flex justify-between font-bold text-stone-800">
                <span>GROSS SALES</span>
                <span>₱{grossSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Total Transactions</span>
                <span>{totalOrders}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Total Cups Sold</span>
                <span>{totalCups} cups</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>Discounts Given</span>
                <span>-₱{totalDiscounts}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[10px]">
                <span>Vatable Sales (12%)</span>
                <span>₱{vatableSales}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[10px]">
                <span>12% VAT</span>
                <span>₱{vatAmount}</span>
              </div>
            </div>

            {/* Tender Breakdown */}
            <div className="space-y-1.5 pb-2 border-b border-dashed border-stone-300">
              <div className="font-bold text-stone-800 text-[11px]">TENDER BREAKDOWN:</div>
              <div className="flex justify-between text-stone-700">
                <span>Cash Payments</span>
                <span className="font-bold">₱{cashSales}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>GCash QR</span>
                <span className="font-bold">₱{gcashSales}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Maya / Card</span>
                <span className="font-bold">₱{cardSales}</span>
              </div>
            </div>

            {/* Cash Drawer Reconciliation */}
            <div className="space-y-2 pt-1">
              <div className="font-bold text-stone-800 text-[11px]">CASH RECONCILIATION:</div>
              <div className="flex justify-between text-stone-600">
                <span>Opening Cash Float:</span>
                <span>₱{openingFloat}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>+ Cash Sales Today:</span>
                <span>+₱{cashSales}</span>
              </div>
              <div className="flex justify-between font-extrabold text-stone-900 border-t border-stone-200 pt-1">
                <span>EXPECTED DRAWER CASH:</span>
                <span className="text-sm">₱{expectedCashInDrawer}</span>
              </div>

              {actualCashCounted !== '' && (
                <>
                  <div className="flex justify-between text-stone-800 font-bold">
                    <span>Actual Cash Counted:</span>
                    <span>₱{actualCash}</span>
                  </div>
                  <div className={`flex justify-between font-bold text-xs p-1.5 rounded-lg ${
                    variance === 0
                      ? 'bg-emerald-50 text-emerald-800'
                      : variance > 0
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-rose-50 text-rose-800'
                  }`}>
                    <span>VARIANCE:</span>
                    <span>{variance === 0 ? 'BALANCED (₱0)' : variance > 0 ? `+₱${variance} (OVER)` : `-₱${Math.abs(variance)} (SHORT)`}</span>
                  </div>
                </>
              )}
            </div>

            <div className="text-center pt-3 text-[10px] text-stone-400">
              Approved by Owner / Manager Signature: __________________
            </div>
          </div>

          {/* Interactive Input Form for Counter Reconciliation */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 font-sans">
            <h4 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#8D5B4C]" />
              <span>Counter Cash Drawer Balancing</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Starting Float (₱)
                </label>
                <input
                  type="number"
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Physical Cash Counted (₱)
                </label>
                <input
                  type="number"
                  value={actualCashCounted}
                  onChange={(e) => setActualCashCounted(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-mono font-bold focus:border-[#8D5B4C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#E8DFD5] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { sound.playTap(); onClose(); }}
            className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#261711] hover:bg-[#3D281F] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4 text-[#E4B07B]" />
            <span>Print Z-Reading Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
