import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  PauseCircle, 
  CreditCard, 
  Percent, 
  User, 
  ShoppingBag, 
  UtensilsCrossed, 
  Sparkles,
  Coffee
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function CartSidebar({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onParkOrder,
  onProceedToPay,
  customerInfo,
  setCustomerInfo,
  discountType,
  setDiscountType,
  discountPercent,
  setDiscountPercent
}) {
  const [showDiscountSelector, setShowDiscountSelector] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalCups = cart.reduce((sum, item) => sum + item.quantity, 0);

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);
  // PH 12% VAT Breakdown
  const vatAmount = Math.round((finalTotal / 1.12) * 0.12);
  const vatableSales = finalTotal - vatAmount;

  const handleDiscountSelect = (type, pct) => {
    sound.playTap();
    setDiscountType(type);
    setDiscountPercent(pct);
    setShowDiscountSelector(false);
  };

  return (
    <aside className="w-full md:w-[330px] lg:w-[380px] xl:w-[420px] shrink-0 bg-white border-l border-[#E5DAD0] flex flex-col h-full shadow-lg z-20">
      {/* Top Controls: Take-Out Badge, Customer / Buzzer Name */}
      <div className="p-3.5 bg-[#FAF7F2] border-b border-[#E8DFD5] space-y-2.5">
        {/* Take-Out Permanent Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#FAF3EB] rounded-2xl border border-[#EADBCE]">
          <span className="flex items-center gap-2 text-xs font-bold text-[#4A3226]">
            <ShoppingBag className="w-4 h-4 text-[#8D5B4C]" />
            <span>Take-Out Order</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8D5B4C]/15 text-[#8D5B4C] uppercase tracking-wider">
            Counter Pickup
          </span>
        </div>

        {/* Customer Name or Buzzer Number */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="w-3.5 h-3.5 text-[#9E8779] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customerInfo.customerName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
              placeholder="Customer Name (optional)"
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white text-xs border border-[#E0D4C5] focus:outline-none focus:border-[#8D5B4C]"
            />
          </div>
          <input
            type="text"
            value={customerInfo.tableNumber}
            onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
            placeholder="Buzzer #"
            className="w-24 px-2.5 py-1.5 rounded-xl bg-white text-xs border border-[#E0D4C5] focus:outline-none focus:border-[#8D5B4C] text-center font-bold"
          />
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9E8779]">
            <div className="w-16 h-16 rounded-2xl bg-[#F4ECE3] flex items-center justify-center mb-3">
              <Coffee className="w-8 h-8 text-[#B8A394]" />
            </div>
            <p className="font-bold text-sm text-[#5C453A]">Order is empty</p>
            <p className="text-xs text-[#A89588] mt-1 max-w-[200px]">
              Tap any coffee or drink from the menu to start customer order.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EADBCE] shadow-xs flex flex-col gap-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-[#291A14] leading-tight">
                    {item.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] text-[#786355]">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#ECE2D6] font-semibold text-[#4A3226]">
                      {item.size || '16oz'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#ECE2D6]">
                      Sugar: {item.sugarLevel}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#ECE2D6]">
                      {item.iceLevel}
                    </span>
                  </div>

                  {/* Add-ons tag list */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.addOns.map((ao) => (
                        <span
                          key={ao.id}
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                        >
                          +{ao.name} (₱{ao.price})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Note if present */}
                  {item.notes && (
                    <p className="text-[10px] text-amber-800 italic mt-1 bg-amber-50/60 px-2 py-0.5 rounded border border-amber-100">
                      Note: {item.notes}
                    </p>
                  )}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => { sound.playTap(); onRemoveItem(item.id); }}
                  className="p-1 text-[#B8A394] hover:text-rose-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price and Quantity Stepper */}
              <div className="flex items-center justify-between pt-1 border-t border-[#EFE8DF]">
                <span className="text-xs font-semibold text-[#8C7667]">
                  ₱{item.unitTotal} × {item.quantity}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-xl border border-[#DED0C3] p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        onUpdateQuantity(item.id, item.quantity - 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#ECE3D8] text-[#4A3226] flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-[#291A14]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        onUpdateQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#ECE3D8] text-[#4A3226] flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-[#291A14] w-14 text-right">
                    ₱{item.total}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Calculation & Checkout Footer */}
      <div className="p-3.5 bg-[#FAF7F2] border-t border-[#E8DFD5] space-y-3">
        {/* Discount Selector Dropdown / Pills */}
        <div className="relative">
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowDiscountSelector(!showDiscountSelector)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#8D5B4C] hover:text-[#5C3B30] py-1 px-2 rounded-lg bg-white border border-[#E0D4C5]"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Discount: {discountType}</span>
            </button>
            {discountAmount > 0 && (
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                -₱{discountAmount} ({discountPercent}%)
              </span>
            )}
          </div>

          {showDiscountSelector && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-2xl shadow-xl border border-[#E0D4C5] p-2 space-y-1 z-30 animate-in fade-in">
              <div className="text-[11px] font-bold text-[#8C7667] px-2 py-1 uppercase">
                Select Discount
              </div>
              <button
                type="button"
                onClick={() => handleDiscountSelect('None', 0)}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl flex justify-between ${
                  discountType === 'None' ? 'bg-[#3E2419] text-white' : 'hover:bg-[#FAF6F1]'
                }`}
              >
                <span>None (Standard)</span>
                <span>0%</span>
              </button>
              <button
                type="button"
                onClick={() => handleDiscountSelect('Senior / PWD', 20)}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl flex justify-between ${
                  discountType === 'Senior / PWD' ? 'bg-[#3E2419] text-white' : 'hover:bg-[#FAF6F1]'
                }`}
              >
                <span>Senior Citizen / PWD</span>
                <span className="font-bold text-emerald-600">20%</span>
              </button>
              <button
                type="button"
                onClick={() => handleDiscountSelect('Friend / Staff', 10)}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl flex justify-between ${
                  discountType === 'Friend / Staff' ? 'bg-[#3E2419] text-white' : 'hover:bg-[#FAF6F1]'
                }`}
              >
                <span>Staff & Friends</span>
                <span>10%</span>
              </button>
            </div>
          )}
        </div>

        {/* Breakdown Breakdown */}
        <div className="space-y-1 text-xs text-[#6D5548]">
          <div className="flex justify-between">
            <span>Subtotal ({totalCups} {totalCups === 1 ? 'cup' : 'cups'})</span>
            <span className="font-bold text-[#291A14]">₱{subtotal}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount ({discountType})</span>
              <span className="font-bold">-₱{discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-[11px] text-[#9E8779]">
            <span>VAT Included (12%)</span>
            <span>₱{vatAmount}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-[#291A14] pt-1.5 border-t border-[#E8DFD5]">
            <span>Total Payable</span>
            <span className="text-xl text-[#3E2419] font-mono">₱{finalTotal}</span>
          </div>
        </div>

        {/* Action Buttons: Hold Order & Tender Cash / Card */}
        <div className="flex items-center gap-2 pt-1">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => { sound.playTap(); onParkOrder(); }}
              className="p-3 rounded-2xl bg-[#EFE6DC] hover:bg-[#E2D5C7] text-[#4A3226] font-bold text-xs flex items-center justify-center transition-colors active:scale-95"
              title="Park / Hold this order to serve next customer"
            >
              <PauseCircle className="w-5 h-5" />
            </button>
          )}

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => { sound.playTap(); onClearCart(); }}
              className="p-3 rounded-2xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors active:scale-95"
              title="Clear Cart"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => { sound.playTap(); onProceedToPay(); }}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-base flex items-center justify-between transition-all duration-150 shadow-md ${
              cart.length > 0
                ? 'bg-gradient-to-r from-[#2F1C15] to-[#5C3B30] hover:from-[#3E2419] hover:to-[#6E473B] text-white active:scale-[0.98]'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-200" />
              <span>Charge</span>
            </span>
            <span className="font-mono text-lg text-amber-200 tracking-tight">
              ₱{finalTotal}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
