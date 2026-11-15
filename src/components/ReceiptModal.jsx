import React from 'react';
import { X, Printer, Check, Coffee, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/menu';
import { sound } from '../utils/audio';

export default function ReceiptModal({ order, onClose, onNewOrder }) {
  if (!order) return null;

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  const vatAmount = Math.round((order.total / 1.12) * 0.12);
  const vatableSales = order.total - vatAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E0D4C5] flex flex-col overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="p-3.5 bg-[#261711] text-white flex items-center justify-between">
          <span className="text-xs font-bold text-[#E4B07B] uppercase tracking-wider">
            Order Receipt & Token
          </span>
          <button
            onClick={() => { sound.playTap(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#E4B07B] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="p-5 overflow-y-auto bg-stone-50 text-stone-900 font-mono text-xs flex justify-center">
          <div 
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white p-5 rounded-2xl shadow-sm border border-stone-200 text-stone-800"
          >
            {/* Header info */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <h2 className="font-serif font-black text-xl text-stone-900 tracking-tight">
                {STORE_INFO.name}
              </h2>
              <p className="text-[10px] text-stone-600 mt-0.5">{STORE_INFO.location}</p>
              <p className="text-[10px] text-stone-500 italic mt-0.5">{STORE_INFO.slogan}</p>
              <p className="text-[10px] text-stone-500">{STORE_INFO.contact}</p>

              {/* Big Queue Token */}
              <div className="my-3 py-2 bg-stone-100 rounded-xl border border-stone-300">
                <span className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-widest block">
                  ORDER TOKEN NUMBER
                </span>
                <span className="text-4xl font-black font-sans text-stone-900 tracking-wider">
                  #{order.queueNumber || '01'}
                </span>
                <span className="text-[10px] font-bold text-stone-600 block mt-0.5">
                  Take-Out {order.tableNo ? `• Buzzer #${order.tableNo}` : ''}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="py-2.5 border-b border-dashed border-stone-300 space-y-1 text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span className="font-bold text-stone-800">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{order.cashier || 'Counter Staff'}</span>
              </div>
              {order.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold">{order.customerName}</span>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="py-3 border-b border-dashed border-stone-300 space-y-2">
              <div className="flex justify-between font-bold text-stone-900 pb-1 border-b border-stone-200">
                <span>ITEM</span>
                <span>TOTAL</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₱{item.total}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 pl-2">
                    Size: {item.size || '16oz'} | Sugar: {item.sugarLevel || '100%'} | {item.iceLevel || 'Regular Ice'}
                  </div>
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="text-[10px] text-stone-500 pl-2">
                      Add-ons: {item.addOns.map(a => `${a.name} (+₱${a.price})`).join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[10px] text-stone-500 italic pl-2">
                      Note: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals & Tax */}
            <div className="py-2.5 border-b border-dashed border-stone-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Discount ({order.discountType})</span>
                  <span>-₱{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500 text-[10px]">
                <span>Vatable Sales</span>
                <span>₱{vatableSales}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[10px]">
                <span>12% VAT</span>
                <span>₱{vatAmount}</span>
              </div>
              <div className="flex justify-between font-extrabold text-stone-950 text-sm pt-1 border-t border-stone-200">
                <span>TOTAL AMOUNT</span>
                <span>₱{order.total}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2.5 border-b border-dashed border-stone-300 space-y-1 text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-stone-800">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'Cash' ? (
                <>
                  <div className="flex justify-between">
                    <span>Cash Tendered:</span>
                    <span>₱{order.amountTendered}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>Change:</span>
                    <span>₱{order.change}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>Reference #:</span>
                  <span className="font-bold">{order.referenceNo || 'APPROVED'}</span>
                </div>
              )}
            </div>

            {/* Footer message */}
            <div className="text-center pt-3 text-[10px] text-stone-500 space-y-1">
              <p className="font-semibold text-stone-700">Thank you for visiting Café BOOM!</p>
              <p>Please present this token at the pick-up counter.</p>
              <p className="text-[9px] text-stone-400 mt-2">--- END OF OFFICIAL RECEIPT ---</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 bg-white border-t border-[#E8DFD5] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#EFE6DC] hover:bg-[#E2D5C7] text-[#4A3226] font-bold text-xs sm:text-sm transition-colors active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onNewOrder();
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#2F1C15] to-[#5C3B30] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:from-[#3E2419] hover:to-[#6E473B] transition-all active:scale-95"
          >
            <span>Next Order</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
