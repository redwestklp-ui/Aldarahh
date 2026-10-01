export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface ProductOption {
  id: string;
  name: string;
  priceModifier: number; // added to base price
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  image: string;
  isAvailable: boolean; // if false, cannot be added to cart
  isSpecialHighlight?: boolean;
  status?: 'published' | 'draft' | 'hidden' | 'archived';
  visibility?: {
    website: boolean;
    dineIn: boolean;
    pickup: boolean;
    delivery: boolean;
  };
  timeAvailability?: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
  tag?: string;
  sku?: string;
  sortOrder?: number;
  options?: ProductOption[];
  addons?: ProductAddon[];
  removableIngredients?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  orderTypeRestrictions?: OrderType[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  options: {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
}

export interface CartItemOption {
  optionId?: string;
  optionName?: string;
  optionPrice: number;
  selectedAddons: ProductAddon[];
  excludedIngredients: string[];
  notes?: string;
}

export interface CartItem {
  cartItemId: string; // unique item id in cart
  menuItem: MenuItem;
  quantity: number;
  selectedOption?: ProductOption;
  selectedAddons: ProductAddon[];
  excludedIngredients: string[];
  notes?: string;
  unitPrice: number; // calculated base + option + addons
  totalPrice: number; // unitPrice * quantity
}

export interface Table {
  id: string;
  tableNumber: number;
  currentPin: string; // 4-digit secret PIN printed on table
  status: 'available' | 'active' | 'occupied' | 'closed';
  activeSessionId?: string;
  sessionStartedAt?: string;
  activeOrderCount: number;
  qrCodeUrl: string;
  notes?: string;
}

export interface TableSession {
  sessionId: string;
  tableNumber: number;
  token: string;
  startedAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  city: string; // Must be Afif
  district: string;
  street: string;
  buildingNo?: string;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  optionName?: string;
  addons?: string[];
  excluded?: string[];
  notes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  by?: string;
}

export interface Order {
  id: string; // e.g. "ORD-1048"
  orderNumber: number; // e.g. 1048
  orderType: OrderType;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card_on_delivery' | 'online_card';
  paymentStatus: 'pending' | 'paid';
  
  // Table Specific
  tableNumber?: number;
  tableSessionToken?: string;
  
  // Takeaway Specific
  pickupTime?: string; // "asap" or scheduled
  
  // Delivery Specific
  deliveryAddress?: DeliveryAddress;
  
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  riskFlag?: boolean;
  riskReason?: string;
  timeline?: OrderTimelineEvent[];
}

export interface Coupon {
  code: string;
  discountPercent?: number; // e.g. 10 for 10%
  discountAmount?: number; // e.g. 15 for 15 SAR
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  timesUsed?: number;
  isActive: boolean;
  description: string;
  expiryDate?: string;
}

export interface DiscountOffer {
  id: string;
  title: string;
  type: 'percentage' | 'fixed';
  value: number; // percent or amount
  targetType: 'all' | 'category' | 'product';
  targetIds: string[]; // category ids or product ids
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isStackable?: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  minOrder: number;
  estimatedMinutes: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'blocked';
  notes?: string;
  addresses?: string[];
}

export type StaffRole = 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'delivery';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: StaffRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface RolePermissions {
  role: StaffRole;
  label: string;
  permissions: {
    orders: { view: boolean; edit: boolean; cancel: boolean };
    products: { view: boolean; edit: boolean; delete: boolean };
    categories: { view: boolean; edit: boolean; delete: boolean };
    discounts: { view: boolean; edit: boolean };
    tables: { view: boolean; edit: boolean; reset: boolean };
    settings: { view: boolean; edit: boolean };
    staff: { view: boolean; edit: boolean };
  };
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'warning' | 'system';
  timestamp: string;
  isRead: boolean;
  linkToTab?: string;
}

export interface RestaurantSettings {
  isRestaurantOpen: boolean;
  emergencyPauseOrders: boolean;
  emergencyMessage: string;
  orderChannels: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
  };
  paymentMethods: {
    cash: boolean;
    cardOnDelivery: boolean;
    onlineCard: boolean;
  };
  businessHours: {
    [day: string]: { open: string; close: string; isOpen: boolean };
  };
  soundNotifications: boolean;
  name: string;
  tagline: string;
  phone: string;
  displayPhone: string;
  whatsappNumber: string;
  address: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
