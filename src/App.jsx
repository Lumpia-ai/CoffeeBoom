import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import ItemCustomizerModal from './components/ItemCustomizerModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import OwnerDashboard from './components/OwnerDashboard';
import TransactionHistory from './components/TransactionHistory';
import MenuManager from './components/MenuManager';
import PinModal from './components/PinModal';
import HeldOrdersModal from './components/HeldOrdersModal';
import EndDayReport from './components/EndDayReport';
import { INITIAL_MENU, STORE_INFO } from './data/menu';
import { 
  getStoredOrders, 
  saveStoredOrders, 
  clearStoredOrders, 
  generateDemoOrders 
} from './data/mockSales';
import { sound } from './utils/audio';

export default function App() {
  // Navigation & Security
  const [currentTab, setCurrentTab] = useState('pos'); // 'pos' | 'owner' | 'ledger' | 'menu'
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [cashierName, setCashierName] = useState('Camz');

  useEffect(() => {
    localStorage.setItem('cafeboom_cashier_name', 'Camz');
    setOrders((prev) => {
      const updated = prev.map((o) => ({
        ...o,
        cashier: 'Camz'
      }));
      saveStoredOrders(updated);
      return updated;
    });
  }, []);

  // Responsive mobile cart toggle (< 768px)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('cafeboom_menu_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_MENU;
  });

  // Sales Orders State - Starts clean and fresh from counter!
  const [orders, setOrders] = useState(() => {
    // Purge old mock data from previous version if present
    localStorage.removeItem('cafeboom_orders_v1');
    return getStoredOrders();
  });

  // Cart State
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ customerName: '', tableNumber: '' });
  const [discountType, setDiscountType] = useState('None');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Held / Parked Orders
  const [heldOrders, setHeldOrders] = useState(() => {
    const saved = localStorage.getItem('cafeboom_held_orders_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Modals
  const [selectedCustomizingItem, setSelectedCustomizingItem] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isEndDayOpen, setIsEndDayOpen] = useState(false);

  // Persist Menu
  const handleUpdateMenu = (newMenu) => {
    setMenuItems(newMenu);
    localStorage.setItem('cafeboom_menu_v1', JSON.stringify(newMenu));
  };

  // Persist Orders
  const updateOrdersList = (newOrders) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  // Clear all sales data
  const handleClearAllSales = () => {
    clearStoredOrders();
    setOrders([]);
  };

  // Load demo sales for previewing charts
  const handleLoadDemoSales = () => {
    const demo = generateDemoOrders();
    setOrders(demo);
  };

  // Add Item to Cart
  const handleAddToCart = (customizedItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => 
        i.menuId === customizedItem.menuId &&
        i.sugarLevel === customizedItem.sugarLevel &&
        i.iceLevel === customizedItem.iceLevel &&
        JSON.stringify(i.addOns) === JSON.stringify(customizedItem.addOns) &&
        i.notes === customizedItem.notes
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        const item = copy[existingIdx];
        const newQty = item.quantity + customizedItem.quantity;
        copy[existingIdx] = {
          ...item,
          quantity: newQty,
          total: item.unitTotal * newQty
        };
        return copy;
      }
      return [...prev, customizedItem];
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, total: item.unitTotal * newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountType('None');
    setDiscountPercent(0);
    setCustomerInfo({ customerName: '', tableNumber: '' });
  };

  // Park Order
  const handleParkOrder = () => {
    if (cart.length === 0) return;
    const parked = {
      id: `PARK-${Date.now()}`,
      parkedAt: new Date().toISOString(),
      cart: cart,
      orderType: 'Take-Out',
      customerInfo: customerInfo,
      discountType: discountType,
      discountPercent: discountPercent
    };
    const updated = [parked, ...heldOrders];
    setHeldOrders(updated);
    localStorage.setItem('cafeboom_held_orders_v1', JSON.stringify(updated));
    handleClearCart();
  };

  const handleResumeOrder = (parkedOrder) => {
    setCart(parkedOrder.cart);
    setCustomerInfo(parkedOrder.customerInfo);
    setDiscountType(parkedOrder.discountType);
    setDiscountPercent(parkedOrder.discountPercent);

    // Remove from held
    const updated = heldOrders.filter((h) => h.id !== parkedOrder.id);
    setHeldOrders(updated);
    localStorage.setItem('cafeboom_held_orders_v1', JSON.stringify(updated));
  };

  const handleDeleteHeldOrder = (heldId) => {
    const updated = heldOrders.filter((h) => h.id !== heldId);
    setHeldOrders(updated);
    localStorage.setItem('cafeboom_held_orders_v1', JSON.stringify(updated));
  };

  // Total Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalCartCups = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Complete Payment: Rung up at counter, inputs data immediately into Owner Sales
  const handlePaymentComplete = (paymentDetails) => {
    const nextTokenNumber = (orders.filter(o => {
      const d = new Date(o.createdAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length % 99) + 1;

    const newOrder = {
      id: `CB-${Date.now().toString().slice(-5)}`,
      queueNumber: nextTokenNumber,
      createdAt: new Date().toISOString(),
      orderType: 'Take-Out',
      customerName: customerInfo.customerName || null,
      tableNo: customerInfo.tableNumber || null,
      cashier: cashierName,
      items: [...cart],
      totalCups: cart.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: subtotal,
      discountType: discountType,
      discountAmount: discountAmount,
      total: finalTotal,
      paymentMethod: paymentDetails.paymentMethod,
      amountTendered: paymentDetails.amountTendered,
      change: paymentDetails.change,
      referenceNo: paymentDetails.referenceNo,
      status: 'Completed'
    };

    // Prepend to orders so it appears first and updates owner sales immediately
    const updated = [newOrder, ...orders];
    updateOrdersList(updated);
    setIsPaymentOpen(false);
    setIsMobileCartOpen(false);
    handleClearCart();
    setActiveReceiptOrder(newOrder);
  };

  // Void Order
  const handleVoidOrder = (orderId) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: 'Voided' } : o);
    updateOrdersList(updated);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF7F2]">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        heldOrdersCount={heldOrders.length}
        onOpenHeldOrders={() => setIsHeldModalOpen(true)}
        onOpenOwnerPin={() => setShowPinModal(true)}
        isOwnerUnlocked={isOwnerUnlocked}
        cashierName={cashierName}
      />

      {/* Main Workspace Area (Responsive for iPad portrait & landscape) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {currentTab === 'pos' && (
          <>
            {/* Drinks Catalog Grid */}
            <MenuGrid
              menuItems={menuItems}
              onSelectItem={(item) => setSelectedCustomizingItem(item)}
            />

            {/* Desktop & iPad Side-by-Side Cart */}
            <div className={`
              ${isMobileCartOpen ? 'fixed inset-0 z-40 flex flex-col' : 'hidden md:flex'}
              md:relative md:h-full
            `}>
              {/* Mobile Back / Close Button */}
              {isMobileCartOpen && (
                <div className="p-3 bg-[#261711] text-white flex justify-between items-center md:hidden">
                  <span className="font-bold text-sm">Current Order</span>
                  <button
                    onClick={() => setIsMobileCartOpen(false)}
                    className="text-xs bg-white/20 px-3 py-1 rounded-lg font-bold"
                  >
                    Back to Menu
                  </button>
                </div>
              )}

              <CartSidebar
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onParkOrder={handleParkOrder}
                onProceedToPay={() => setIsPaymentOpen(true)}
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                discountType={discountType}
                setDiscountType={setDiscountType}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
              />
            </div>

            {/* Mobile Bottom Floating Cart Bar (< 768px) */}
            {cart.length > 0 && !isMobileCartOpen && (
              <div className="md:hidden fixed bottom-3 left-3 right-3 z-30 animate-in slide-in-from-bottom duration-200">
                <button
                  type="button"
                  onClick={() => { sound.playTap(); setIsMobileCartOpen(true); }}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-[#2F1C15] to-[#5C3B30] text-white rounded-2xl shadow-xl flex items-center justify-between font-bold"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-extrabold text-xs flex items-center justify-center">
                      {totalCartCups}
                    </span>
                    <span>View Order</span>
                  </span>
                  <span className="font-mono text-amber-200 text-lg">
                    ₱{finalTotal} →
                  </span>
                </button>
              </div>
            )}
          </>
        )}

        {currentTab === 'owner' && (
          <OwnerDashboard
            orders={orders}
            onOpenLedger={() => setCurrentTab('ledger')}
            onOpenEndDay={() => setIsEndDayOpen(true)}
            onClearAllSales={handleClearAllSales}
            onLoadDemoSales={handleLoadDemoSales}
          />
        )}

        {currentTab === 'ledger' && (
          <TransactionHistory
            orders={orders}
            onViewReceipt={(order) => setActiveReceiptOrder(order)}
            onVoidOrder={handleVoidOrder}
            onClearAllSales={handleClearAllSales}
          />
        )}

        {currentTab === 'menu' && (
          <MenuManager
            menuItems={menuItems}
            onUpdateMenu={handleUpdateMenu}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {selectedCustomizingItem && (
        <ItemCustomizerModal
          item={selectedCustomizingItem}
          onClose={() => setSelectedCustomizingItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          totalAmount={finalTotal}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {activeReceiptOrder && (
        <ReceiptModal
          order={activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
          onNewOrder={() => {
            setActiveReceiptOrder(null);
            setCurrentTab('pos');
          }}
        />
      )}

      {isHeldModalOpen && (
        <HeldOrdersModal
          isOpen={isHeldModalOpen}
          onClose={() => setIsHeldModalOpen(false)}
          heldOrders={heldOrders}
          onResumeOrder={handleResumeOrder}
          onDeleteHeldOrder={handleDeleteHeldOrder}
        />
      )}

      {isEndDayOpen && (
        <EndDayReport
          isOpen={isEndDayOpen}
          onClose={() => setIsEndDayOpen(false)}
          orders={orders}
        />
      )}

      {showPinModal && (
        <PinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            setIsOwnerUnlocked(true);
            setShowPinModal(false);
            setCurrentTab('owner');
          }}
        />
      )}
    </div>
  );
}
