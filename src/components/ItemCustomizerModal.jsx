import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, MessageSquare } from 'lucide-react';
import { ADD_ONS } from '../data/menu';
import { sound } from '../utils/audio';

export default function ItemCustomizerModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [sugarLevel, setSugarLevel] = useState('100%');
  const [iceLevel, setIceLevel] = useState('Regular Ice');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const sugarOptions = ['0%', '25%', '50%', '75%', '100%'];
  const iceOptions = ['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'];

  const toggleAddOn = (addOn) => {
    sound.playTap();
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const unitPrice = item.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    sound.playTap();
    onAddToCart({
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      menuId: item.id,
      name: item.name,
      category: item.category,
      size: item.size || '16oz',
      basePrice: item.price,
      unitTotal: unitPrice,
      quantity: quantity,
      total: totalPrice,
      sugarLevel: sugarLevel,
      iceLevel: iceLevel,
      addOns: selectedAddOns,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E0D4C5] flex flex-col overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2F1C15] to-[#4A2E24] text-white flex items-center justify-between border-b border-[#5C3B30]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4B07B]/20 text-[#E4B07B] uppercase tracking-wider border border-[#E4B07B]/30">
                {item.category} • {item.size || '16oz'}
              </span>
              {item.isBestseller && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 uppercase">
                  ⭐ Bestseller
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif mt-1 text-[#FAF3EB]">
              {item.name}
            </h2>
          </div>
          <button
            onClick={() => { sound.playTap(); onClose(); }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#E4B07B] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-[#2C221E]">
          {/* Sugar Level */}
          <div>
            <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-2">
              Sweetness / Sugar Level
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {sugarOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { sound.playTap(); setSugarLevel(opt); }}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center active:scale-95 ${
                    sugarLevel === opt
                      ? 'bg-[#3E2419] text-white border-[#3E2419] shadow-xs'
                      : 'bg-white text-[#5C453A] border-[#E2D5C8] hover:bg-[#F2ECE5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block mb-2">
              Ice Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {iceOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { sound.playTap(); setIceLevel(opt); }}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center active:scale-95 ${
                    iceLevel === opt
                      ? 'bg-[#3E2419] text-white border-[#3E2419] shadow-xs'
                      : 'bg-white text-[#5C453A] border-[#E2D5C8] hover:bg-[#F2ECE5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons from Menu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider block">
                Add-ons (Optional)
              </label>
              <span className="text-[11px] text-[#8C7667]">Tap to add</span>
            </div>
            <div className="space-y-1.5">
              {ADD_ONS.map((addOn) => {
                const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                return (
                  <div
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isChecked
                        ? 'bg-[#F4ECE3] border-[#8D5B4C] text-[#291A14]'
                        : 'bg-white border-[#E8DFD5] text-[#5C453A] hover:bg-[#F9F6F1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-[#3E2419] border-[#3E2419] text-white' : 'border-[#CBB9AC] bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-bold">{addOn.name}</span>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      +₱{addOn.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barista Notes / Instructions */}
          <div>
            <label className="text-xs font-bold text-[#6D5548] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Barista Notes / Special Request</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra hot, separate bag, oat milk preference..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D4C5] text-sm text-[#2C221E] focus:outline-none focus:border-[#8D5B4C]"
            />
          </div>
        </div>

        {/* Footer: Quantity Stepper & Add to Order CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFD5] flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#F2ECE4] rounded-2xl p-1 border border-[#E0D4C5]">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              className="w-9 h-9 rounded-xl bg-white text-[#4A3226] hover:bg-[#FAF6F1] flex items-center justify-center font-bold shadow-xs active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-extrabold text-base text-[#291A14]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setQuantity(quantity + 1);
              }}
              className="w-9 h-9 rounded-xl bg-white text-[#4A3226] hover:bg-[#FAF6F1] flex items-center justify-center font-bold shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#3E2419] to-[#5C3B30] text-white font-extrabold text-base shadow-md hover:from-[#4A2E24] hover:to-[#6E473B] transition-all flex items-center justify-between active:scale-[0.98]"
          >
            <span>Add to Order</span>
            <span className="text-amber-200 font-mono tracking-tight text-lg">
              ₱{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
