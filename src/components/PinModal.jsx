import React, { useState } from 'react';
import { X, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { STORE_INFO } from '../data/menu';
import { sound } from '../utils/audio';

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleKey = (digit) => {
    sound.playTap();
    setError(false);
    if (digit === 'C') {
      setPin('');
      return;
    }
    if (digit === '⌫') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }

    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === 4) {
        if (nextPin === STORE_INFO.defaultPin) {
          sound.playSuccess();
          setTimeout(() => {
            onSuccess();
            setPin('');
          }, 200);
        } else {
          setError(true);
          sound.playTap();
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 -mr-2 -mt-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="font-extrabold text-lg text-stone-900 font-serif">Owner Authorization</h3>
          <p className="text-xs text-stone-500 mt-0.5">Enter 4-digit PIN (Default: 1234)</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                error
                  ? 'bg-rose-500 ring-2 ring-rose-200'
                  : pin.length > idx
                  ? 'bg-[#3E2419] scale-110'
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-600 animate-pulse">Incorrect PIN. Try 1234.</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKey(k)}
              className={`h-12 rounded-2xl font-bold text-lg flex items-center justify-center transition-all active:scale-95 shadow-2xs border ${
                k === 'C'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : k === '⌫'
                  ? 'bg-stone-100 text-stone-600 border-stone-200'
                  : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
