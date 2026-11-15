export const INITIAL_MENU = [
  // --- COFFEE (16oz) ---
  {
    id: 'c1',
    name: 'Dark Mocha',
    category: 'Coffee',
    size: '16oz',
    price: 130,
    isBestseller: true,
    available: true,
    color: '#3E2723',
    description: 'Rich dark espresso blended with Dutch cocoa and steamed milk'
  },
  {
    id: 'c2',
    name: 'White Choco Latte',
    category: 'Coffee',
    size: '16oz',
    price: 120,
    isBestseller: false,
    available: true,
    color: '#5D4037',
    description: 'Velvety espresso combined with smooth white chocolate'
  },
  {
    id: 'c3',
    name: 'Caramel Mocha',
    category: 'Coffee',
    size: '16oz',
    price: 139,
    isBestseller: false,
    available: true,
    color: '#6D4C41',
    description: 'Signature espresso, artisan chocolate and golden caramel drizzle'
  },
  {
    id: 'c4',
    name: 'Seasalt Spanish Oat',
    category: 'Coffee',
    size: '16oz',
    price: 130,
    isBestseller: true,
    available: true,
    color: '#8D6E63',
    description: 'Spanish latte layered with creamy oat milk and sea salt cream topping'
  },
  {
    id: 'c5',
    name: 'Hazelnut',
    category: 'Coffee',
    size: '16oz',
    price: 110,
    isBestseller: false,
    available: true,
    color: '#A1887F',
    description: 'Aromatic espresso infused with toasted hazelnut essence'
  },
  {
    id: 'c6',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    size: '16oz',
    price: 129,
    isBestseller: false,
    available: true,
    color: '#795548',
    description: 'Fresh steamed milk with vanilla, marked with espresso and caramel grid'
  },
  {
    id: 'c7',
    name: 'Caramel Latte',
    category: 'Coffee',
    size: '16oz',
    price: 119,
    isBestseller: false,
    available: true,
    color: '#8D6E63',
    description: 'Smooth espresso, rich caramel syrup and silky microfoam'
  },
  {
    id: 'c8',
    name: 'Pistachio Latte',
    category: 'Coffee',
    size: '16oz',
    price: 119,
    isBestseller: false,
    available: true,
    color: '#556B2F',
    description: 'Nutty Mediterranean pistachio infused with rich double shot'
  },
  {
    id: 'c9',
    name: 'Java Chip Frappe',
    category: 'Coffee',
    size: '16oz',
    price: 149,
    isBestseller: true,
    available: true,
    color: '#4E342E',
    description: 'Blended mocha coffee frappe loaded with decadent chocolate chips'
  },
  {
    id: 'c10',
    name: 'Dirty Matcha',
    category: 'Coffee',
    size: '16oz',
    price: 145,
    isBestseller: false,
    available: true,
    color: '#4A5D23',
    description: 'Ceremonial Uji matcha poured over milk with a float of dark espresso'
  },

  // --- NON COFFEE (16oz) ---
  {
    id: 'nc1',
    name: 'Matcha Oat',
    category: 'Non Coffee',
    size: '16oz',
    price: 130,
    isBestseller: true,
    available: true,
    color: '#33691E',
    description: 'Premium matcha whisked fresh and blended with velvety oat milk'
  },
  {
    id: 'nc2',
    name: 'Matcha Oreo',
    category: 'Non Coffee',
    size: '16oz',
    price: 139,
    isBestseller: true,
    available: true,
    color: '#2E7D32',
    description: 'Sweet earthy matcha layered with real crushed Oreo cookies'
  },
  {
    id: 'nc3',
    name: 'Matcha Strawberry',
    category: 'Non Coffee',
    size: '16oz',
    price: 139,
    isBestseller: false,
    available: true,
    color: '#C2185B',
    description: 'Layered strawberry fruit puree, fresh milk, and rich matcha'
  },
  {
    id: 'nc4',
    name: 'Matcha Oreo Milkshake',
    category: 'Non Coffee',
    size: '16oz',
    price: 149,
    isBestseller: true,
    available: true,
    color: '#1B5E20',
    description: 'Thick creamy milkshake with Japanese matcha and crunchy Oreo chunks'
  },
  {
    id: 'nc5',
    name: 'Oreo Milkshake',
    category: 'Non Coffee',
    size: '16oz',
    price: 130,
    isBestseller: true,
    available: true,
    color: '#212121',
    description: 'Classic creamy vanilla ice cream shake blended with real Oreos'
  },
  {
    id: 'nc6',
    name: 'Strawberry Latte',
    category: 'Non Coffee',
    size: '16oz',
    price: 120,
    isBestseller: true,
    available: true,
    color: '#E91E63',
    description: 'House-made strawberry compote topped with creamy chilled milk'
  },
  {
    id: 'nc7',
    name: 'Cocoa Caramel',
    category: 'Non Coffee',
    size: '16oz',
    price: 89,
    isBestseller: true,
    available: true,
    color: '#795548',
    description: 'Rich comforting Belgian cocoa swirled with sweet buttery caramel'
  },
  {
    id: 'nc8',
    name: 'Thai Pink Milk',
    category: 'Non Coffee',
    size: '16oz',
    price: 70,
    isBestseller: true,
    available: true,
    color: '#F48FB1',
    description: 'Authentic Thai sweet sala syrup mixed with sweetened cream milk'
  }
];

export const ADD_ONS = [
  { id: 'ao1', name: 'Extra Shot', price: 30 },
  { id: 'ao2', name: 'Oreo', price: 10 },
  { id: 'ao3', name: 'Seasalt Cream', price: 15 },
  { id: 'ao4', name: 'Cold Foam', price: 15 },
  { id: 'ao5', name: 'Cream Cheese', price: 15 }
];

export const STORE_INFO = {
  name: 'Café BOOM',
  slogan: 'LIFE HAPPENS, COFFEE HELPS 🤎',
  location: 'Kimaya Jasaan Mis. Or.',
  contact: '+63 917 800 2666',
  currency: '₱',
  taxRate: 0.12, // 12% VAT standard in PH
  defaultPin: '1234'
};
