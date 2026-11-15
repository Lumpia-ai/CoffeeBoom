import React from 'react';
import { X, Play, Trash2, PauseCircle, Clock } from 'lucide-react';
import { sound } from '../utils/audio';

export default function HeldOrdersModal({
  isOpen,
  onClose,
  heldOrders,
  onResumeOrder,
  onDeleteHeldOrder
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <PauseCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-base text-stone-900">
              Parked / Held Orders ({heldOrders.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Held Orders */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1">
          {heldOrders.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              No parked orders currently.
            </div>
          ) : (
            heldOrders.map((ho) => (
              <div
                key={ho.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EADBCE] flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-xs text-[#291A14] block">
                      {ho.customerInfo?.customerName || ho.customerInfo?.tableNumber 
                        ? `${ho.customerInfo.customerName || 'Guest'} (${ho.customerInfo.tableNumber || ''})`
                        : `Parked Order #${ho.id.slice(-4)}`}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ho.parkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>Take-Out</span>
                    </span>
                  </div>

                  <span className="text-sm font-extrabold font-mono text-[#291A14]">
                    ₱{ho.cart.reduce((s, i) => s + i.total, 0)}
                  </span>
                </div>

                <div className="text-[11px] text-stone-600 truncate">
                  {ho.cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => { sound.playTap(); onDeleteHeldOrder(ho.id); }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                    title="Discard parked order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onResumeOrder(ho);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E2419] hover:bg-[#5C3B30] text-white text-xs font-bold transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Resume Order</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
