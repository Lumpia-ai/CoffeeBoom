import React, { useState, useMemo } from 'react';
import { Search, Star, Sparkles, Plus, Check, Coffee, CupSoda } from 'lucide-react';
import { sound } from '../utils/audio';

export default function MenuGrid({ menuItems, onSelectItem }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  const categories = ['All', 'Coffee', 'Non Coffee'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStar = !onlyBestsellers || item.isBestseller;
      return matchesCategory && matchesSearch && matchesStar;
    });
  }, [menuItems, selectedCategory, searchQuery, onlyBestsellers]);

  const handleCardClick = (item) => {
    if (!item.available) return;
    sound.playTap();
    onSelectItem(item);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF7F2]">
      {/* Category Navigation Bar & Search */}
      <div className="p-3.5 bg-white border-b border-[#E8DFD5] shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                sound.playTap();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#3E2419] text-white shadow-sm ring-1 ring-[#3E2419]'
                  : 'bg-[#F2ECE4] text-[#694F43] hover:bg-[#EAE1D7]'
              }`}
            >
              {cat === 'Coffee' && <Coffee className="w-3.5 h-3.5" />}
              {cat === 'Non Coffee' && <CupSoda className="w-3.5 h-3.5" />}
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-[#DDD2C6] text-[#694F43]'
              }`}>
                {cat === 'All' 
                  ? menuItems.length 
                  : menuItems.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}

          {/* Star Filter Pill */}
          <button
            onClick={() => {
              setOnlyBestsellers(!onlyBestsellers);
              sound.playTap();
            }}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap active:scale-95 border ${
              onlyBestsellers
                ? 'bg-[#E78B3E] text-white border-[#E78B3E] shadow-sm'
                : 'bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyBestsellers ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
            <span>Top Picks</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-[#A89283] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coffee, matcha, latte..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F4ECE3] text-sm text-[#2C221E] placeholder-[#9E8779] border border-transparent focus:border-[#8D5B4C] focus:bg-white focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9E8779] hover:text-[#2C221E] w-4 h-4 rounded-full bg-[#E5D7CB] flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8C7667]">
            <Coffee className="w-12 h-12 text-[#CBB9AC] mb-3 stroke-1" />
            <p className="text-base font-semibold text-[#573F33]">No drinks match your filter</p>
            <p className="text-xs text-[#947F71] mt-1">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setOnlyBestsellers(false); }}
              className="mt-4 px-4 py-2 bg-[#EFE6DC] hover:bg-[#E2D5C7] text-[#4A3226] text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4 pb-12">
            {filteredItems.map((item) => {
              const isCoffee = item.category === 'Coffee';

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className={`group relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 text-left border shadow-xs select-none active:scale-[0.98] ${
                    item.available
                      ? 'bg-white hover:bg-[#FDFBF7] hover:shadow-md hover:border-[#D6BEAE] border-[#E8DFD5] cursor-pointer'
                      : 'bg-stone-100 opacity-60 border-stone-200 cursor-not-allowed'
                  }`}
                >
                  {/* Top indicators: Category badge, Size, Bestseller star */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCoffee ? 'bg-amber-100/80 text-amber-900' : 'bg-emerald-100/80 text-emerald-900'
                      }`}>
                        {item.size || '16oz'}
                      </span>

                      {item.isBestseller && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Popular</span>
                        </span>
                      )}
                    </div>

                    {/* Drink Name */}
                    <h3 className="font-extrabold text-[#291A14] text-base md:text-lg leading-snug group-hover:text-[#8D5B4C] transition-colors">
                      {item.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-[11px] text-[#786457] line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom bar: Price and Add button */}
                  <div className="mt-4 pt-3 border-t border-[#F2ECE5] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#8C7667] font-medium block leading-none">Price</span>
                      <span className="text-lg md:text-xl font-extrabold text-[#291A14] tracking-tight">
                        ₱{item.price}
                      </span>
                    </div>

                    {item.available ? (
                      <div className="w-9 h-9 rounded-xl bg-[#F4ECE3] text-[#4A3226] group-hover:bg-[#3E2419] group-hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs">
                        <Plus className="w-5 h-5 font-bold" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
