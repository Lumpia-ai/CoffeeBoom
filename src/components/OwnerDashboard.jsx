import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Coffee, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Calendar, 
  Download, 
  Printer, 
  ArrowUpRight, 
  Sparkles,
  PieChart,
  Clock,
  Award,
  Trash2,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function OwnerDashboard({ 
  orders, 
  onOpenLedger, 
  onOpenEndDay,
  onClearAllSales,
  onLoadDemoSales
}) {
  const [timeFilter, setTimeFilter] = useState('Today'); // 'Today' | 'Yesterday' | '7Days' | 'Month' | 'All'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter orders based on selected time range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const sevenDaysAgo = todayStart - (6 * 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return orders.filter((o) => {
      if (o.status === 'Voided') return false; // Exclude voided from standard sales
      const orderTime = new Date(o.createdAt).getTime();

      if (timeFilter === 'Today') {
        return orderTime >= todayStart;
      } else if (timeFilter === 'Yesterday') {
        return orderTime >= yesterdayStart && orderTime < todayStart;
      } else if (timeFilter === '7Days') {
        return orderTime >= sevenDaysAgo;
      } else if (timeFilter === 'Month') {
        return orderTime >= monthStart;
      }
      return true; // 'All'
    });
  }, [orders, timeFilter]);

  // Key KPI Calculations
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const totalCups = filteredOrders.reduce((sum, o) => sum + (o.totalCups || 1), 0);
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

  // Payment Breakdown
  const cashSales = filteredOrders
    .filter((o) => o.paymentMethod === 'Cash')
    .reduce((sum, o) => sum + o.total, 0);
  const gcashSales = filteredOrders
    .filter((o) => o.paymentMethod === 'GCash')
    .reduce((sum, o) => sum + o.total, 0);
  const cardSales = filteredOrders
    .filter((o) => o.paymentMethod === 'Maya')
    .reduce((sum, o) => sum + o.total, 0);

  // Category & Bestseller Breakdown
  const drinkStats = useMemo(() => {
    const stats = {};
    const categoryTotals = { Coffee: 0, 'Non Coffee': 0, 'Add-ons': 0 };

    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const name = item.name;
        if (!stats[name]) {
          stats[name] = { name, count: 0, revenue: 0, category: item.category };
        }
        stats[name].count += item.quantity || 1;
        stats[name].revenue += item.total || (item.price * item.quantity);

        if (item.category === 'Coffee') categoryTotals.Coffee += item.total;
        else if (item.category === 'Non Coffee') categoryTotals['Non Coffee'] += item.total;

        // Add-ons
        if (item.addOns && item.addOns.length > 0) {
          item.addOns.forEach(ao => {
            categoryTotals['Add-ons'] += (ao.price * item.quantity);
          });
        }
      });
    });

    const sortedDrinks = Object.values(stats).sort((a, b) => b.count - a.count);
    return { sortedDrinks, categoryTotals };
  }, [filteredOrders]);

  // Hourly Distribution (8 AM - 8 PM)
  const hourlyData = useMemo(() => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const map = {};
    hours.forEach(h => { map[h] = { hour: h, sales: 0, orders: 0 }; });

    filteredOrders.forEach((order) => {
      const h = new Date(order.createdAt).getHours();
      if (map[h]) {
        map[h].sales += order.total;
        map[h].orders += 1;
      }
    });

    return hours.map(h => map[h]);
  }, [filteredOrders]);

  const maxHourlySales = Math.max(...hourlyData.map(d => d.sales), 300);

  // Last order time
  const lastOrder = orders.length > 0 ? orders[0] : null;

  // Export to CSV Function
  const exportToCSV = () => {
    sound.playTap();
    if (filteredOrders.length === 0) return;
    const headers = ['Order ID,Time,Type,Cashier,Payment Method,Cups,Total,Status\n'];
    const rows = filteredOrders.map(o => 
      `"${o.id}","${new Date(o.createdAt).toLocaleString()}","${o.orderType}","${o.cashier}","${o.paymentMethod}",${o.totalCups},${o.total},"${o.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CafeBOOM_Sales_${timeFilter}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const confirmClearSales = () => {
    sound.playTap();
    onClearAllSales();
    setShowClearConfirm(false);
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] p-3 sm:p-5 md:p-6 overflow-y-auto space-y-4 sm:space-y-6">
      {/* Top Banner: Owner Review Title & Time Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#E8DFD5]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#3E2419] text-[#E4B07B] shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#261711] font-serif leading-none">
                  Owner Sales Review
                </h2>
                {/* Live Real-Time Sync Indicator */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Counter Sync</span>
                </span>
              </div>
              <p className="text-xs text-[#7D6657] mt-1">
                {orders.length === 0 
                  ? 'Ready for orders. Sales rung up at the Counter POS will automatically appear here.' 
                  : `Real-time register summary • Last sale: ${new Date(lastOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Order ${lastOrder.id})`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Time Filter & Reset / Demo Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E0D4C5] shadow-xs gap-1 overflow-x-auto">
            {['Today', 'Yesterday', '7Days', 'Month', 'All'].map((t) => (
              <button
                key={t}
                onClick={() => { sound.playTap(); setTimeFilter(t); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  timeFilter === t
                    ? 'bg-[#3E2419] text-white shadow-xs'
                    : 'text-[#694F43] hover:bg-[#F2ECE4]'
                }`}
              >
                {t === '7Days' ? 'Last 7 Days' : t === 'Month' ? 'This Month' : t}
              </button>
            ))}
          </div>

          {/* Clear Sales Data Button */}
          <button
            type="button"
            onClick={() => { sound.playTap(); setShowClearConfirm(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-bold border border-stone-200 hover:border-rose-300 transition-colors shadow-2xs active:scale-95"
            title="Clear all sales history"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Clear Sales</span>
          </button>

          {/* Optional Demo Data Button if empty */}
          {orders.length === 0 && (
            <button
              type="button"
              onClick={() => { sound.playTap(); onLoadDemoSales(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors shadow-2xs active:scale-95"
              title="Populate test sales to preview charts"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Test Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row (Responsive Grid for iPad) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold">
              ₱
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#261711] font-mono tracking-tight">
            ₱{totalSales.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'sale' : 'sales'} in {timeFilter}</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Ticket</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-900 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#261711] font-mono tracking-tight">
            ₱{avgOrderValue}
          </div>
          <div className="text-[11px] text-[#8C7667] mt-2 font-medium">
            Avg spend per customer visit
          </div>
        </div>

        {/* Cups Sold */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Cups Sold</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-orange-900 flex items-center justify-center font-bold">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#261711] font-mono tracking-tight">
            {totalCups} <span className="text-sm font-sans font-normal text-stone-500">cups</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-2 font-medium">
            16oz standard drink size
          </div>
        </div>

        {/* Cash in Drawer vs Digital */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cash in Counter</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-900 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono tracking-tight">
            ₱{cashSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#8C7667] mt-2 font-medium flex justify-between">
            <span>GCash: ₱{gcashSales}</span>
            <span>Maya: ₱{cardSales}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Hourly Sales Rush Curve & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly Rush Bar Graph */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#261711] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8D5B4C]" />
                <span>Hourly Sales Rush Curve</span>
              </h3>
              <p className="text-xs text-[#8C7667]">Counter traffic distribution (8 AM - 8 PM)</p>
            </div>
            {totalSales > 0 && (
              <span className="text-xs font-bold text-[#8D5B4C] bg-[#FAF3EB] px-2.5 py-1 rounded-xl">
                Peak Hours Tracked
              </span>
            )}
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 sm:h-52 w-full flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-1 border-b border-[#ECE2D6]">
            {hourlyData.map((d) => {
              const heightPct = maxHourlySales > 0 ? (d.sales / maxHourlySales) * 100 : 0;
              const formattedHour = d.hour > 12 ? `${d.hour - 12}P` : d.hour === 12 ? '12P' : `${d.hour}A`;

              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover/touch */}
                  {d.sales > 0 && (
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#261711] text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                      ₱{d.sales} ({d.orders} orders)
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    className={`w-full max-w-[26px] rounded-t-lg transition-all duration-300 ${
                      d.sales > 0
                        ? 'bg-gradient-to-t from-[#8D5B4C] to-[#C27838] group-hover:from-[#3E2419] group-hover:to-[#D98A44]'
                        : 'bg-stone-100'
                    }`}
                  />
                  {/* Hour label */}
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#8C7667] mt-2 font-mono">
                    {formattedHour}
                  </span>
                </div>
              );
            })}
          </div>
          {totalSales === 0 && (
            <p className="text-center text-[11px] text-[#9E8779] mt-3 italic">
              No sales logged yet for this time filter. Enter an order at the Counter POS to see the hourly bars rise.
            </p>
          )}
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#261711] flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-[#8D5B4C]" />
              <span>Payment Breakdown</span>
            </h3>
            <p className="text-xs text-[#8C7667]">Cash vs Digital Payments</p>
          </div>

          <div className="my-4 space-y-3.5">
            {/* Cash */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash Tender</span>
                </span>
                <span className="font-mono text-emerald-800 font-extrabold">
                  ₱{cashSales} ({totalSales > 0 ? Math.round((cashSales / totalSales) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300" 
                  style={{ width: `${totalSales > 0 ? (cashSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* GCash */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>GCash QR</span>
                </span>
                <span className="font-mono text-blue-800 font-extrabold">
                  ₱{gcashSales} ({totalSales > 0 ? Math.round((gcashSales / totalSales) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                  style={{ width: `${totalSales > 0 ? (gcashSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Maya */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Maya / Card</span>
                </span>
                <span className="font-mono text-stone-800 font-extrabold">
                  ₱{cardSales} ({totalSales > 0 ? Math.round((cardSales / totalSales) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-800 rounded-full transition-all duration-300" 
                  style={{ width: `${totalSales > 0 ? (cardSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#ECE2D6] text-[11px] text-[#7D6657]">
            💡 Cash in drawer = physical bills at counter. Digital sales go directly to cafe bank/e-wallet.
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Selling Drinks Leaderboard & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 5 Bestsellers */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#261711] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Top Selling Drinks Leaderboard</span>
              </h3>
              <p className="text-xs text-[#8C7667]">Ranked by total cups sold at the counter</p>
            </div>
          </div>

          {drinkStats.sortedDrinks.length === 0 ? (
            <div className="p-8 text-center text-[#8C7667] bg-[#FAF8F5] rounded-2xl border border-[#EADBCE]">
              <Coffee className="w-8 h-8 text-[#CBB9AC] mx-auto mb-2 stroke-1" />
              <p className="font-bold text-sm text-[#4A3226]">No drinks ordered yet</p>
              <p className="text-xs text-[#9E8779] mt-1">
                As drinks are rung up at the counter, your top performers will rank here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {drinkStats.sortedDrinks.slice(0, 5).map((drink, index) => {
                const rankColor = index === 0 ? 'bg-amber-400 text-stone-900' : index === 1 ? 'bg-slate-300 text-stone-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600';

                return (
                  <div
                    key={drink.name}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EADBCE] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${rankColor}`}>
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#261711]">{drink.name}</h4>
                        <span className="text-[10px] text-[#8C7667]">{drink.category}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-base text-[#261711] font-mono block">
                        {drink.count} <span className="text-xs font-sans font-normal text-stone-500">cups</span>
                      </span>
                      <span className="text-[11px] font-bold text-[#8D5B4C] font-mono">
                        ₱{drink.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Owner Actions Card */}
        <div className="bg-[#261711] text-white p-4 sm:p-5 rounded-3xl border border-[#3D281F] shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#FAF3EB] font-serif mb-1">
              End-of-Day Operations
            </h3>
            <p className="text-xs text-[#C4A999] mb-4">
              Close cashier shift, reconcile counter drawer cash, or export sales logs.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => { sound.playTap(); onOpenEndDay(); }}
                className="w-full py-3 px-4 rounded-2xl bg-[#8D5B4C] hover:bg-[#A67C52] text-white font-extrabold text-xs flex items-center justify-between transition-colors shadow-xs active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-amber-200" />
                  <span>X / Z-Reading Close Report</span>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                disabled={filteredOrders.length === 0}
                onClick={exportToCSV}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-colors border active:scale-95 ${
                  filteredOrders.length > 0
                    ? 'bg-[#3D281F] hover:bg-[#4E3429] text-[#FAF3EB] border-[#5A3F33]'
                    : 'bg-[#2F1D16] text-[#7A6054] border-transparent cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#E4B07B]" />
                  <span>Export Sales to Excel (CSV)</span>
                </div>
                <span>.csv</span>
              </button>

              <button
                type="button"
                onClick={() => { sound.playTap(); onOpenLedger(); }}
                className="w-full py-3 px-4 rounded-2xl bg-[#3D281F] hover:bg-[#4E3429] text-[#FAF3EB] font-bold text-xs flex items-center justify-between transition-colors border border-[#5A3F33] active:scale-95"
              >
                <span>View Full Transaction Ledger</span>
                <span>{filteredOrders.length} records</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#3D281F] text-[10px] text-[#A68F81] text-center">
            Café BOOM Mis. Or. • Encrypted Local Vault
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear All Sales */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 font-serif">Clear Sales History?</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                This will reset the counter sales register to ₱0 and clear all transactions. New orders entered from the counter will start fresh.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearSales}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
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
