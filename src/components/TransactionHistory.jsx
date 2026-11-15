import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ReceiptText, 
  Eye, 
  Ban, 
  Download, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Coffee
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function TransactionHistory({ 
  orders, 
  onViewReceipt, 
  onVoidOrder,
  onClearAllSales
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [voidConfirmOrder, setVoidConfirmOrder] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        o.id.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.tableNo && o.tableNo.toLowerCase().includes(q)) ||
        o.cashier.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q));

      const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [orders, searchQuery, paymentFilter]);

  const handleVoid = (order) => {
    sound.playTap();
    onVoidOrder(order.id);
    setVoidConfirmOrder(null);
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] p-4 md:p-6 overflow-y-auto space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DFD5]">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#261711] font-serif flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-[#8D5B4C]" />
            <span>Sales Transaction Ledger</span>
          </h2>
          <p className="text-xs text-[#7D6657] mt-0.5">
            Full record of customer orders, receipts, and counter tender records.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#9E8779] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, item, table..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white text-xs border border-[#E0D4C5] focus:outline-none focus:border-[#8D5B4C]"
            />
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => { sound.playTap(); setPaymentFilter(e.target.value); }}
            className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold border border-[#E0D4C5] text-[#4A3226] focus:outline-none"
          >
            <option value="All">All Payments</option>
            <option value="Cash">Cash Only</option>
            <option value="GCash">GCash Only</option>
            <option value="Maya">Maya / Card</option>
          </select>

          {orders.length > 0 && onClearAllSales && (
            <button
              type="button"
              onClick={() => { sound.playTap(); setClearConfirmText(''); setShowClearConfirm(true); }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 text-xs font-bold transition-colors active:scale-95"
              title="Clear all transactions"
            >
              Clear Ledger
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#8C7667]">
            <ReceiptText className="w-12 h-12 text-[#CBB9AC] mx-auto mb-2 stroke-1" />
            <p className="font-bold text-sm">No transactions match your search</p>
            <p className="text-xs text-[#A89588] mt-1">Try clearing your search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[11px] font-bold text-[#6D5548] uppercase tracking-wider">
                  <th className="py-3 px-4">Token / ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer / Buzzer</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE5] text-xs">
                {filteredOrders.map((order) => {
                  const isVoided = order.status === 'Voided';
                  const dateObj = new Date(order.createdAt);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${isVoided ? 'opacity-50 bg-stone-50' : ''}`}
                    >
                      {/* Token & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-[#261711] text-[#E4B07B] flex items-center justify-center font-extrabold text-xs">
                            #{order.queueNumber || '01'}
                          </span>
                          <div>
                            <span className="font-extrabold text-[#261711] block font-mono">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-[#8C7667]">
                              {order.cashier && order.cashier !== 'Jhoan (Shift 1)' ? order.cashier : 'Camz'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-[#5C453A]">
                        <div>{dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-[#8C7667]">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Customer / Buzzer */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3EB] text-[#6D5548] border border-[#EADBCE]">
                          {order.tableNo ? `Buzzer #${order.tableNo}` : order.customerName || 'Take-Out Guest'}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="text-stone-900 font-semibold truncate">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {order.totalCups} total cups
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          order.paymentMethod === 'Cash'
                            ? 'bg-emerald-100 text-emerald-900'
                            : order.paymentMethod === 'GCash'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right font-extrabold font-mono text-sm text-[#261711]">
                        ₱{order.total}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isVoided ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Voided</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => { sound.playTap(); onViewReceipt(order); }}
                            className="p-1.5 rounded-lg bg-[#FAF3EB] text-[#4A3226] hover:bg-[#EADBCE] transition-colors"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isVoided && (
                            <button
                              type="button"
                              onClick={() => setVoidConfirmOrder(order)}
                              className="p-1.5 rounded-lg bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Void / Refund Order"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Void Confirmation Modal */}
      {voidConfirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Void Order {voidConfirmOrder.id}?</h3>
              <p className="text-xs text-stone-600 mt-1">
                This will cancel the ₱{voidConfirmOrder.total} sale and remove it from gross counter totals.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVoidConfirmOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVoid(voidConfirmOrder)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Confirm Void
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Clear All Transactions?</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                This will permanently delete all sales from the ledger and reset the counter register to ₱0.
              </p>
              <div className="mt-3.5 text-left">
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Type <span className="font-mono text-rose-600 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Yes-Clear All</span> to confirm:
                </label>
                <input
                  type="text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="Yes-Clear All"
                  className="w-full px-3 py-2 rounded-xl border-2 border-stone-300 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-rose-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setShowClearConfirm(false); setClearConfirmText(''); }}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clearConfirmText.trim().toLowerCase() !== 'yes-clear all'}
                onClick={() => {
                  sound.playTap();
                  onClearAllSales();
                  setShowClearConfirm(false);
                  setClearConfirmText('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  clearConfirmText.trim().toLowerCase() === 'yes-clear all'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
