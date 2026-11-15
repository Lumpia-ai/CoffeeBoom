// Sales Database Manager with LocalStorage Persistence
const STORAGE_KEY = 'cafeboom_orders_v2'; // Bumped key to ensure old mock data is wiped clean

export function getStoredOrders() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch (e) {
    console.error('Failed to load orders', e);
  }
  return []; // Clean fresh slate for counter sales
}

export function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function clearStoredOrders() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cafeboom_orders_v1'); // Clean up old key as well
  } catch (e) {
    console.error('Failed to clear orders', e);
  }
  return [];
}

// Optional helper if owner wants to populate demo sales for testing
export function generateDemoOrders() {
  const now = new Date();
  const sampleDrinkNames = [
    { name: 'Dark Mocha', price: 130, category: 'Coffee' },
    { name: 'Seasalt Spanish Oat', price: 130, category: 'Coffee' },
    { name: 'Java Chip Frappe', price: 149, category: 'Coffee' },
    { name: 'Matcha Oreo Milkshake', price: 149, category: 'Non Coffee' },
    { name: 'Oreo Milkshake', price: 130, category: 'Non Coffee' },
    { name: 'Strawberry Latte', price: 120, category: 'Non Coffee' },
    { name: 'Thai Pink Milk', price: 70, category: 'Non Coffee' }
  ];

  const demoOrders = [];
  let token = 1;

  for (let i = 0; i < 8; i++) {
    const t = new Date(now.getTime() - (i * 35 * 60 * 1000));
    const drink = sampleDrinkNames[i % sampleDrinkNames.length];
    const total = drink.price;

    demoOrders.push({
      id: `CB-${1000 + i}`,
      queueNumber: token++,
      createdAt: t.toISOString(),
      orderType: 'Take-Out',
      cashier: 'Jhoan (Shift 1)',
      customerName: i % 3 === 0 ? 'Guest' : null,
      tableNo: i % 2 === 0 ? `T-${i + 1}` : null,
      items: [{
        id: `demo-${i}`,
        name: drink.name,
        category: drink.category,
        size: '16oz',
        price: drink.price,
        unitTotal: drink.price,
        quantity: 1,
        total: total,
        sugarLevel: '100%',
        iceLevel: 'Regular Ice',
        addOns: [],
        notes: ''
      }],
      totalCups: 1,
      subtotal: total,
      discountType: 'None',
      discountAmount: 0,
      total: total,
      paymentMethod: i % 2 === 0 ? 'Cash' : 'GCash',
      amountTendered: total,
      change: 0,
      status: 'Completed'
    });
  }

  saveStoredOrders(demoOrders);
  return demoOrders;
}
