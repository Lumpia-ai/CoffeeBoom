import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Edit2, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  Coffee, 
  CupSoda, 
  Star 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function MenuManager({ 
  menuItems, 
  onUpdateMenu 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Coffee');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsBestseller, setNewIsBestseller] = useState(false);

  const handleToggleStock = (item) => {
    sound.playTap();
    const updated = menuItems.map(m => m.id === item.id ? { ...m, available: !m.available } : m);
    onUpdateMenu(updated);
  };

  const handleStartEdit = (item) => {
    sound.playTap();
    setEditingId(item.id);
    setEditPrice(item.price.toString());
  };

  const handleSavePrice = (item) => {
    sound.playTap();
    const p = parseFloat(editPrice);
    if (!isNaN(p) && p > 0) {
      const updated = menuItems.map(m => m.id === item.id ? { ...m, price: p } : m);
      onUpdateMenu(updated);
    }
    setEditingId(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    sound.playTap();
    const p = parseFloat(newPrice);
    if (!newName.trim() || isNaN(p) || p <= 0) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      size: '16oz',
      price: p,
      isBestseller: newIsBestseller,
      available: true,
      description: newDescription.trim() || `${newCategory} drink`
    };

    onUpdateMenu([...menuItems, newItem]);
    setShowAddModal(false);
    setNewName('');
    setNewPrice('');
    setNewDescription('');
    setNewIsBestseller(false);
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] p-4 md:p-6 overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DFD5]">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#261711] font-serif flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#8D5B4C]" />
            <span>Menu & Pricing Management</span>
          </h2>
          <p className="text-xs text-[#7D6657] mt-0.5">
            Update counter prices, toggle sold-out drinks, or introduce new seasonal creations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { sound.playTap(); setShowAddModal(true); }}
          className="px-4 py-2 rounded-xl bg-[#3E2419] hover:bg-[#5C3B30] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Add New Drink</span>
        </button>
      </div>

      {/* Menu Items Table / Grid */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[11px] font-bold text-[#6D5548] uppercase tracking-wider">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Price (₱)</th>
                <th className="py-3 px-4 text-center">Bestseller</th>
                <th className="py-3 px-4 text-center">Stock Availability</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE5] text-xs">
              {menuItems.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4 font-extrabold text-[#261711]">
                      {item.name}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.category === 'Coffee'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 text-[#786355] font-semibold">
                      {item.size || '16oz'}
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[#8D5B4C]">₱</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-20 px-2 py-1 rounded-lg border border-[#8D5B4C] text-xs font-mono font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(item)}
                            className="p-1 rounded bg-emerald-600 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-stone-200 text-stone-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-extrabold font-mono text-sm text-[#261711]">
                          ₱{item.price}
                        </span>
                      )}
                    </td>

                    {/* Bestseller Star */}
                    <td className="py-3 px-4 text-center">
                      {item.isBestseller && (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500 inline-block" />
                      )}
                    </td>

                    {/* Stock Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                          item.available
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <span>{item.available ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>

                    {/* Edit button */}
                    <td className="py-3 px-4 text-right">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg bg-[#FAF3EB] text-[#4A3226] hover:bg-[#EADBCE] transition-colors"
                          title="Change Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Drink Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form 
            onSubmit={handleAddItem}
            className="bg-white rounded-3xl p-5 max-w-md w-full border border-stone-200 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Add New Drink</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Drink Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Vanilla Sweet Cream Cold Brew"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Non Coffee">Non Coffee</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Price (₱)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="130"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Ingredients & flavor notes..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isBestsellerCheck"
                checked={newIsBestseller}
                onChange={(e) => setNewIsBestseller(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 w-4 h-4"
              />
              <label htmlFor="isBestsellerCheck" className="text-xs font-bold text-stone-700">
                Mark as ⭐ Top Pick / Bestseller
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#3E2419] text-white font-bold text-xs hover:bg-[#5C3B30]"
              >
                Save Drink
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
