import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onPaymentComplete
}) {
  const [method, setMethod] = useState('Cash'); // 'Cash' | 'GCash' | 'Maya'
  const [tenderedStr, setTenderedStr] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  if (!isOpen) return null;

  const tenderedAmount = parseFloat(tenderedStr) || 0;
  const change = Math.max(0, tenderedAmount - totalAmount);
  const isExactOrMore = method !== 'Cash' || tenderedAmount >= totalAmount;

  // Preset bill buttons for Philippine Peso
  const quickBills = [
    { label: 'Exact', value: totalAmount },
    { label: '₱100', value: 100 },
    { label: '₱200', value: 200 },
    { label: '₱500', value: 500 },
    { label: '₱1,000', value: 1000 }
  ];

  const handleKeypad = (char) => {
    sound.playTap();
    if (char === 'C') {
      setTenderedStr('');
    } else if (char === '⌫') {
      setTenderedStr((prev) => prev.slice(0, -1));
    } else {
      if (tenderedStr.length < 7) {
        setTenderedStr((prev) => prev + char);
      }
    }
  };

  const handleSubmit = () => {
    if (!isExactOrMore) return;
    sound.playSuccess();

    // Burst confetti from bottom sides
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8D5B4C', '#E4B07B', '#3E2419', '#F48FB1']
      });
    } catch {
      // Ignore
    }

    onPaymentComplete({
      paymentMethod: method,
      amountTendered: method === 'Cash' ? (tenderedAmount || totalAmount) : totalAmount,
      change: method === 'Cash' ? change : 0,
      referenceNo: method !== 'Cash' ? (referenceNo || `REF-${Date.now().toString().slice(-6)}`) : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E0D4C5] flex flex-col overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#261711] text-white flex items-center justify-between border-b border-[#3D281F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8D5B4C]/40 border border-[#8D5B4C] flex items-center justify-center text-[#E4B07B]">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#FAF3EB] font-serif">
                Collect Payment
              </h2>
              <p className="text-xs text-[#C4A999]">Café BOOM Counter Register</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playTap(); onClose(); }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#E4B07B] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to Pay Banner */}
        <div className="bg-[#FAF3EB] p-4 text-center border-b border-[#E8DFD5] flex items-center justify-between px-6">
          <div className="text-left">
            <span className="text-xs font-bold text-[#8C7667] uppercase tracking-wider block">
              Total Amount Due
            </span>
            <span className="text-3xl font-extrabold text-[#291A14] font-mono tracking-tight">
              ₱{totalAmount}
            </span>
          </div>

          {method === 'Cash' && tenderedAmount > 0 && (
            <div className="text-right">
              <span className="text-xs font-bold text-[#8C7667] uppercase tracking-wider block">
                Change to Return
              </span>
              <span className={`text-3xl font-extrabold font-mono tracking-tight ${
                tenderedAmount >= totalAmount ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                ₱{change}
              </span>
            </div>
          )}
        </div>

        {/* Payment Method Tabs */}
        <div className="p-3 bg-white border-b border-[#E8DFD5] flex gap-2">
          <button
            type="button"
            onClick={() => { sound.playTap(); setMethod('Cash'); }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border ${
              method === 'Cash'
                ? 'bg-[#3E2419] text-white border-[#3E2419] shadow-xs'
                : 'bg-[#F5EFE8] text-[#5C453A] border-transparent hover:bg-[#EAE2D8]'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Cash Tender</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playTap(); setMethod('GCash'); }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border ${
              method === 'GCash'
                ? 'bg-[#0055EE] text-white border-[#0055EE] shadow-xs'
                : 'bg-[#EBF2FF] text-[#0055EE] border-transparent hover:bg-[#DCE7FF]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>GCash QR</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playTap(); setMethod('Maya'); }}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border ${
              method === 'Maya'
                ? 'bg-[#003828] text-emerald-300 border-[#003828] shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-transparent hover:bg-emerald-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Maya / Card</span>
          </button>
        </div>

        {/* Content according to payment method */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          {method === 'Cash' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick Cash Presets */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block">
                  Quick Bill Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickBills.map((bill) => (
                    <button
                      key={bill.label}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setTenderedStr(bill.value.toString());
                      }}
                      className="py-3 px-3 rounded-2xl bg-white hover:bg-[#FAF6F1] border border-[#DFD1C4] font-extrabold text-[#291A14] text-base shadow-2xs hover:border-[#8D5B4C] transition-all text-center active:scale-95"
                    >
                      {bill.label}
                    </button>
                  ))}
                </div>

                {/* Tender display input */}
                <div className="mt-3">
                  <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-1">
                    Cash Received
                  </label>
                  <div className="flex items-center bg-white rounded-2xl border-2 border-[#8D5B4C] px-4 py-3 shadow-inner">
                    <span className="text-xl font-bold text-[#8D5B4C] mr-2">₱</span>
                    <input
                      type="text"
                      readOnly
                      value={tenderedStr || '0'}
                      className="w-full text-2xl font-extrabold font-mono text-[#291A14] bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* iPad Touch Keypad */}
              <div>
                <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-2">
                  Number Pad
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKeypad(k)}
                      className={`h-12 sm:h-14 rounded-2xl font-extrabold text-lg sm:text-xl flex items-center justify-center transition-all active:scale-95 shadow-2xs border ${
                        k === 'C'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : k === '⌫'
                          ? 'bg-[#EAE2D7] text-[#5C453A] border-[#D8C7B7] hover:bg-[#DECDBE]'
                          : 'bg-white text-[#291A14] border-[#DFD1C4] hover:bg-[#FDFBF9]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : method === 'GCash' ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-3xl border border-[#D9E4FA]">
              {/* Simulated GCash QR Code */}
              <div className="w-48 h-48 bg-[#0055EE]/5 border-2 border-dashed border-[#0055EE]/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-[#0055EE] rounded-xl flex flex-col items-center justify-center text-white p-2 shadow-inner">
                  <QrCode className="w-20 h-20" />
                  <span className="text-[10px] font-black tracking-widest mt-1">SCAN TO PAY</span>
                </div>
                <span className="text-[11px] font-bold text-[#0055EE] mt-2">Café BOOM GCash</span>
              </div>

              {/* Instructions & Reference Number */}
              <div className="flex-1 space-y-3 w-full">
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200">
                  <p className="text-xs text-blue-900 font-semibold leading-relaxed">
                    Customer scans the counter QR code and transfers exact amount:
                    <span className="font-extrabold text-blue-950 font-mono text-base block mt-0.5">₱{totalAmount}</span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-1">
                    GCash Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. 1002 9384 1928"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C6B7] text-sm font-mono text-[#291A14] focus:outline-none focus:border-[#0055EE]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-white rounded-3xl border border-[#D0E5DB] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Maya / POS Terminal</h4>
                  <p className="text-xs text-stone-500">Insert or tap customer card on the physical card reader terminal</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-1">
                  Terminal Approval / Auth Code
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. AUTH-8823"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C6B7] text-sm font-mono text-[#291A14] focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFD5] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { sound.playTap(); onClose(); }}
            className="px-5 py-3.5 rounded-2xl bg-[#EFE6DC] hover:bg-[#E2D5C7] text-[#4A3226] font-bold text-sm transition-colors active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isExactOrMore}
            onClick={handleSubmit}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
              isExactOrMore
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white active:scale-[0.98]'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Payment • ₱{totalAmount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
