import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MenuItem, 
  MenuCategory,
  ModifierGroup,
  CartItem, 
  Table, 
  TableSession, 
  Order, 
  OrderType, 
  OrderStatus, 
  Coupon, 
  DiscountOffer,
  DeliveryZone,
  Customer,
  StaffMember,
  StaffRole,
  RolePermissions,
  AdminNotification,
  RestaurantSettings,
  AuditLog, 
  DeliveryAddress,
  ProductOption,
  ProductAddon
} from '../types/index.ts';
import { 
  RESTAURANT_INFO, 
  INITIAL_MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_COUPONS,
  INITIAL_CATEGORIES,
  INITIAL_MODIFIER_GROUPS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_STAFF,
  INITIAL_ROLES_PERMISSIONS,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNT_OFFERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESTAURANT_SETTINGS
} from '../data/restaurantData.ts';

interface RestaurantContextType {
  // Catalog & Categories
  menuItems: MenuItem[];
  categories: MenuCategory[];
  addProduct: (product: MenuItem) => void;
  updateProduct: (id: string, updates: Partial<MenuItem>) => void;
  deleteProduct: (id: string, hardDelete?: boolean) => { success: boolean; message: string };
  archiveProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<MenuItem>) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  
  addCategory: (category: MenuCategory) => void;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string, reassignToCategoryId?: string) => { success: boolean; message: string };
  reorderCategories: (newOrder: MenuCategory[]) => void;

  // Modifiers
  modifierGroups: ModifierGroup[];
  addModifierGroup: (group: ModifierGroup) => void;
  updateModifierGroup: (id: string, updates: Partial<ModifierGroup>) => void;
  deleteModifierGroup: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem, 
    quantity: number, 
    selectedOption?: ProductOption, 
    selectedAddons?: ProductAddon[], 
    excludedIngredients?: string[], 
    notes?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;

  // Discounts & Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addNewCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponActive: (code: string) => void;

  discountOffers: DiscountOffer[];
  addDiscountOffer: (offer: DiscountOffer) => void;
  updateDiscountOffer: (id: string, updates: Partial<DiscountOffer>) => void;
  deleteDiscountOffer: (id: string) => void;
  toggleDiscountOffer: (id: string) => void;

  // Order Mode & Table Sessions
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  currentTableSession: TableSession | null;
  activateTableSession: (tableNumber: number) => TableSession;
  verifyAndStartTableSession: (tableNumber: number, pin: string) => { success: boolean; message: string; session?: TableSession };
  endTableSession: (tableNumber: number) => void;
  tables: Table[];
  addTable: (tableNumber: number, pin?: string) => void;
  updateTable: (tableNumber: number, updates: Partial<Table>) => void;
  deleteTable: (tableNumber: number) => void;
  rotateTablePin: (tableNumber: number) => string;
  closeTable: (tableNumber: number) => void;
  openTable: (tableNumber: number) => void;
  simulateScanTableQR: (tableNumber: number) => void;

  // Delivery Zones
  deliveryZones: DeliveryZone[];
  addDeliveryZone: (zone: DeliveryZone) => void;
  updateDeliveryZone: (id: string, updates: Partial<DeliveryZone>) => void;
  deleteDeliveryZone: (id: string) => void;
  toggleDeliveryZone: (id: string) => void;
  minDeliveryAmount: number;
  deliveryFeeAmount: number;
  updateDeliverySettings: (minAmount: number, fee: number) => void;

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  submitOrder: (details: {
    customerName: string;
    customerPhone: string;
    customerNotes?: string;
    paymentMethod: 'cash' | 'card_on_delivery' | 'online_card';
    pickupTime?: string;
    deliveryAddress?: DeliveryAddress;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => { success: boolean; message: string };
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; message: string };
  getOrderById: (orderIdOrNumber: string) => Order | undefined;

  // Customers
  customers: Customer[];
  toggleCustomerBlock: (customerId: string) => void;
  addCustomerNote: (customerId: string, note: string) => void;

  // Staff & Permissions
  staff: StaffMember[];
  rolesPermissions: RolePermissions[];
  currentStaffUser: StaffMember;
  switchStaffRole: (role: StaffRole) => void;
  addStaffMember: (staff: StaffMember) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
  updateRolePermissions: (role: StaffRole, permissions: RolePermissions['permissions']) => void;

  // Settings & Status
  settings: RestaurantSettings;
  updateSettings: (updates: Partial<RestaurantSettings>) => void;
  toggleRestaurantOpen: () => void;
  toggleEmergencyPause: (message?: string) => void;
  toggleOrderChannel: (channel: 'dineIn' | 'takeaway' | 'delivery') => void;

  // Notifications
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type: 'order' | 'warning' | 'system', linkToTab?: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (user: string, action: string, details: string) => void;

  // UI state helpers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartShake: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Persistent Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('shuaa_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // 2. Persistent Categories
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem('shuaa_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // 3. Persistent Modifier Groups
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(() => {
    const saved = localStorage.getItem('shuaa_modifiers');
    return saved ? JSON.parse(saved) : INITIAL_MODIFIER_GROUPS;
  });

  // 4. Persistent Tables
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('shuaa_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  // 5. Persistent Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('shuaa_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // 6. Persistent Discount Offers
  const [discountOffers, setDiscountOffers] = useState<DiscountOffer[]>(() => {
    const saved = localStorage.getItem('shuaa_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_OFFERS;
  });

  // 7. Persistent Delivery Zones
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('shuaa_delivery_zones');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ZONES;
  });

  // 8. Persistent Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('shuaa_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // 9. Persistent Staff & Roles
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('shuaa_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [rolesPermissions, setRolesPermissions] = useState<RolePermissions[]>(() => {
    const saved = localStorage.getItem('shuaa_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES_PERMISSIONS;
  });

  const [currentStaffUser, setCurrentStaffUser] = useState<StaffMember>(() => {
    const saved = localStorage.getItem('shuaa_current_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STAFF[0]; // Manager by default
  });

  // 10. Persistent Restaurant Settings
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('shuaa_settings');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_SETTINGS;
  });

  // 11. Persistent Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('shuaa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 12. Persistent Table Session
  const [currentTableSession, setCurrentTableSession] = useState<TableSession | null>(() => {
    const saved = localStorage.getItem('shuaa_table_session');
    if (saved) {
      try {
        const session: TableSession = JSON.parse(saved);
        if (new Date(session.expiresAt).getTime() > Date.now() && session.isActive) {
          return session;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 13. Order Type
  const [orderType, setOrderTypeState] = useState<OrderType>(() => {
    return currentTableSession ? 'dine_in' : 'dine_in';
  });

  // 14. Cart Items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shuaa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [cartShake, setCartShake] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 15. Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shuaa_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // 16. Delivery Settings amounts
  const [minDeliveryAmount, setMinDeliveryAmount] = useState<number>(RESTAURANT_INFO.minDeliveryAmount);
  const [deliveryFeeAmount, setDeliveryFeeAmount] = useState<number>(RESTAURANT_INFO.deliveryFee);

  // 17. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('shuaa_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString('ar-SA'),
        user: 'النظام',
        action: 'تهيئة النظام',
        details: 'بدء تشغيل منصة إدارة مطعم فوال وشعبيات شعاع الدره',
      }
    ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('shuaa_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('shuaa_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shuaa_modifiers', JSON.stringify(modifierGroups));
  }, [modifierGroups]);

  useEffect(() => {
    localStorage.setItem('shuaa_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('shuaa_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('shuaa_discounts', JSON.stringify(discountOffers));
  }, [discountOffers]);

  useEffect(() => {
    localStorage.setItem('shuaa_delivery_zones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem('shuaa_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('shuaa_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('shuaa_roles', JSON.stringify(rolesPermissions));
  }, [rolesPermissions]);

  useEffect(() => {
    localStorage.setItem('shuaa_current_staff', JSON.stringify(currentStaffUser));
  }, [currentStaffUser]);

  useEffect(() => {
    localStorage.setItem('shuaa_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('shuaa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentTableSession) {
      localStorage.setItem('shuaa_table_session', JSON.stringify(currentTableSession));
    } else {
      localStorage.removeItem('shuaa_table_session');
    }
  }, [currentTableSession]);

  useEffect(() => {
    localStorage.setItem('shuaa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shuaa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shuaa_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Audit Log Helper
  const addAuditLog = (user: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user,
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Notification Helper
  const addNotification = (title: string, message: string, type: 'order' | 'warning' | 'system', linkToTab?: string) => {
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'الآن',
      isRead: false,
      linkToTab,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Settings Handlers
  const updateSettings = (updates: Partial<RestaurantSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      addAuditLog(currentStaffUser.name, 'تعديل إعدادات المطعم', 'تم تحديث الإعدادات العامة للمطعم');
      return next;
    });
  };

  const toggleRestaurantOpen = () => {
    setSettings((prev) => {
      const nextState = !prev.isRestaurantOpen;
      addAuditLog(currentStaffUser.name, 'تغيير حالة المطعم', nextState ? 'تم فتح المطعم لاستقبال الزبائن' : 'تم إغلاق المطعم مؤقتاً');
      return { ...prev, isRestaurantOpen: nextState };
    });
  };

  const toggleEmergencyPause = (message?: string) => {
    setSettings((prev) => {
      const nextState = !prev.emergencyPauseOrders;
      addAuditLog(currentStaffUser.name, 'إيقاف طوارئ للطلبات', nextState ? `تم إيقاف الطلبات مؤقتاً: ${message || prev.emergencyMessage}` : 'تم استئناف استقبال الطلبات');
      return { 
        ...prev, 
        emergencyPauseOrders: nextState,
        emergencyMessage: message || prev.emergencyMessage
      };
    });
  };

  const toggleOrderChannel = (channel: 'dineIn' | 'takeaway' | 'delivery') => {
    setSettings((prev) => {
      const channels = { ...prev.orderChannels, [channel]: !prev.orderChannels[channel] };
      addAuditLog(currentStaffUser.name, 'تعديل قنوات الطلب', `تم تغيير حالة قناة ${channel} إلى ${channels[channel] ? 'مفعل' : 'معطل'}`);
      return { ...prev, orderChannels: channels };
    });
  };

  // Staff and Role Handlers
  const switchStaffRole = (role: StaffRole) => {
    const found = staff.find((s) => s.role === role);
    if (found) {
      setCurrentStaffUser(found);
      addAuditLog('النظام', 'تبديل الحساب الإداري', `تم تسجيل الدخول بصلاحية: ${found.role} (${found.name})`);
    }
  };

  const addStaffMember = (newStaff: StaffMember) => {
    setStaff((prev) => [...prev, newStaff]);
    addAuditLog(currentStaffUser.name, 'إضافة موظف جديد', `تم إضافة الموظف ${newStaff.name} بدور ${newStaff.role}`);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
    addAuditLog(currentStaffUser.name, 'تعديل بيانات موظف', `تم تعديل بيانات الموظف #${id}`);
  };

  const deleteStaffMember = (id: string) => {
    const member = staff.find((s) => s.id === id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    addAuditLog(currentStaffUser.name, 'حذف موظف', `تم حذف الموظف: ${member?.name || id}`);
  };

  const updateRolePermissions = (role: StaffRole, permissions: RolePermissions['permissions']) => {
    setRolesPermissions((prev) => prev.map((r) => r.role === role ? { ...r, permissions } : r));
    addAuditLog(currentStaffUser.name, 'تعديل صلاحيات الدور', `تم تحديث صلاحيات دور: ${role}`);
  };

  // Product CRUD
  const addProduct = (product: MenuItem) => {
    const newProd = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: product.status || 'published',
      isAvailable: product.isAvailable !== false,
    };
    setMenuItems((prev) => [newProd, ...prev]);
    addAuditLog(currentStaffUser.name, 'إضافة صنف جديد', `تمت إضافة الصنف: ${newProd.name} بسعر ${newProd.basePrice} ر.س`);
    addNotification('إضافة صنف جديد', `تم نشر الصنف الجديد: ${newProd.name}`, 'system', 'products');
  };

  const updateProduct = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
    addAuditLog(currentStaffUser.name, 'تعديل صنف', `تم تحديث بيانات الصنف #${id}`);
  };

  const deleteProduct = (id: string, hardDelete = false) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return { success: false, message: 'الصنف غير موجود' };

    // Check if item is in existing active orders
    const hasActiveOrders = orders.some((o) => 
      o.items.some((oi) => oi.menuItemId === id) && 
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    );

    if (hasActiveOrders && hardDelete) {
      return { 
        success: false, 
        message: 'لا يمكن حذف هذا الصنف نهائياً لأنه مرتبط بطلبات جارية حالياً. يمكنك أرشفته أو إخفاؤه بدلاً من ذلك.' 
      };
    }

    if (hardDelete) {
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
      addAuditLog(currentStaffUser.name, 'حذف صنف نهائياً', `تم حذف الصنف: ${item.name}`);
      return { success: true, message: `تم حذف الصنف ${item.name} بنجاح` };
    } else {
      // Safe Archive
      updateProduct(id, { status: 'archived', isAvailable: false });
      addAuditLog(currentStaffUser.name, 'أرشفة صنف', `تم أرشفة الصنف: ${item.name}`);
      return { success: true, message: `تم نقل الصنف ${item.name} إلى الأرشيف بأمان` };
    }
  };

  const archiveProduct = (id: string) => {
    deleteProduct(id, false);
  };

  const duplicateProduct = (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;
    const duplicated: MenuItem = {
      ...item,
      id: `prod-${Date.now()}`,
      name: `${item.name} (نسخة)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMenuItems((prev) => [duplicated, ...prev]);
    addAuditLog(currentStaffUser.name, 'نسخ صنف', `تم عمل نسخة من الصنف: ${item.name}`);
  };

  const toggleProductAvailability = (productId: string) => {
    setMenuItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          const newAvail = !item.isAvailable;
          addAuditLog(currentStaffUser.name, 'تغيير توفر الصنف', `${item.name}: ${newAvail ? 'متوفر' : 'غير متوفر'}`);
          return { ...item, isAvailable: newAvail };
        }
        return item;
      });
    });
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setMenuItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          const oldPrice = item.basePrice;
          addAuditLog(currentStaffUser.name, 'تعديل سعر الصنف', `${item.name}: ${oldPrice} ر.س → ${newPrice} ر.س`);
          return { ...item, basePrice: newPrice, compareAtPrice: oldPrice };
        }
        return item;
      });
    });
  };

  const bulkUpdateProducts = (ids: string[], updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, ...updates } : item))
    );
    addAuditLog(currentStaffUser.name, 'تحديث جماعي للأصناف', `تم تحديث ${ids.length} أصناف دفعة واحدة`);
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setMenuItems((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, status: 'archived', isAvailable: false } : item))
    );
    addAuditLog(currentStaffUser.name, 'أرشفة جماعية للأصناف', `تم أرشفة ${ids.length} أصناف`);
  };

  // Categories CRUD
  const addCategory = (category: MenuCategory) => {
    const newCat = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
      sortOrder: category.sortOrder || categories.length + 1,
      isActive: true,
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog(currentStaffUser.name, 'إضافة تصنيف جديد', `تمت إضافة التصنيف: ${newCat.name}`);
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    addAuditLog(currentStaffUser.name, 'تعديل تصنيف', `تم تعديل بيانات التصنيف #${id}`);
  };

  const deleteCategory = (id: string, reassignToCategoryId?: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return { success: false, message: 'التصنيف غير موجود' };

    const assignedProducts = menuItems.filter((m) => m.category === id);
    if (assignedProducts.length > 0 && !reassignToCategoryId) {
      return {
        success: false,
        message: `هذا التصنيف يحتوي على ${assignedProducts.length} أصناف. يرجى اختيار تصنيف بديل لنقل الأصناف إليه قبل الحذف.`,
      };
    }

    if (reassignToCategoryId) {
      setMenuItems((prev) =>
        prev.map((m) => (m.category === id ? { ...m, category: reassignToCategoryId } : m))
      );
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    addAuditLog(currentStaffUser.name, 'حذف تصنيف', `تم حذف التصنيف: ${cat.name}`);
    return { success: true, message: `تم حذف التصنيف ${cat.name} بنجاح` };
  };

  const reorderCategories = (newOrder: MenuCategory[]) => {
    setCategories(newOrder);
    addAuditLog(currentStaffUser.name, 'إعادة ترتيب التصنيفات', 'تم حفظ الترتيب الجديد للأقسام');
  };

  // Modifiers CRUD
  const addModifierGroup = (group: ModifierGroup) => {
    const newGroup = {
      ...group,
      id: group.id || `mod-${Date.now()}`,
    };
    setModifierGroups((prev) => [...prev, newGroup]);
    addAuditLog(currentStaffUser.name, 'إضافة مجموعة خيارات', `تمت إضافة مجموعة الخيارات: ${newGroup.name}`);
  };

  const updateModifierGroup = (id: string, updates: Partial<ModifierGroup>) => {
    setModifierGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    addAuditLog(currentStaffUser.name, 'تعديل مجموعة خيارات', `تم تعديل خيارات المجموعة #${id}`);
  };

  const deleteModifierGroup = (id: string) => {
    setModifierGroups((prev) => prev.filter((g) => g.id !== id));
    addAuditLog(currentStaffUser.name, 'حذف مجموعة خيارات', `تم حذف مجموعة الخيارات #${id}`);
  };

  // Discounts & Offers CRUD
  const addDiscountOffer = (offer: DiscountOffer) => {
    const newOffer = {
      ...offer,
      id: offer.id || `disc-${Date.now()}`,
      isActive: true,
    };
    setDiscountOffers((prev) => [newOffer, ...prev]);
    addAuditLog(currentStaffUser.name, 'إنشاء عرض خصم', `تم إنشاء العرض: ${newOffer.title}`);
  };

  const updateDiscountOffer = (id: string, updates: Partial<DiscountOffer>) => {
    setDiscountOffers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    addAuditLog(currentStaffUser.name, 'تعديل عرض خصم', `تم تحديث العرض #${id}`);
  };

  const deleteDiscountOffer = (id: string) => {
    setDiscountOffers((prev) => prev.filter((d) => d.id !== id));
    addAuditLog(currentStaffUser.name, 'حذف عرض خصم', `تم حذف العرض #${id}`);
  };

  const toggleDiscountOffer = (id: string) => {
    setDiscountOffers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  // Coupons CRUD
  const addNewCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addAuditLog(currentStaffUser.name, 'إضافة كوبون خصم', `تم إضافة الكوبون: ${coupon.code}`);
  };

  const updateCoupon = (code: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, ...updates } : c))
    );
    addAuditLog(currentStaffUser.name, 'تعديل كوبون', `تم تعديل بيانات الكوبون ${code}`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addAuditLog(currentStaffUser.name, 'حذف كوبون', `تم حذف الكوبون ${code}`);
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Tables Management
  const addTable = (tableNumber: number, pin = '1234') => {
    const newTbl: Table = {
      id: `tbl-${tableNumber}`,
      tableNumber,
      currentPin: pin,
      status: 'available',
      activeOrderCount: 0,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        window.location.origin + '?table=' + tableNumber
      )}`,
    };
    setTables((prev) => [...prev, newTbl].sort((a, b) => a.tableNumber - b.tableNumber));
    addAuditLog(currentStaffUser.name, 'إضافة طاولة', `تمت إضافة الطاولة رقم #${tableNumber}`);
  };

  const updateTable = (tableNumber: number, updates: Partial<Table>) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, ...updates } : t))
    );
  };

  const deleteTable = (tableNumber: number) => {
    setTables((prev) => prev.filter((t) => t.tableNumber !== tableNumber));
    addAuditLog(currentStaffUser.name, 'حذف طاولة', `تم حذف الطاولة رقم #${tableNumber}`);
  };

  const rotateTablePin = (tableNumber: number) => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, currentPin: newPin } : t))
    );
    addAuditLog(currentStaffUser.name, 'تغيير رمز PIN للطاولة', `طاولة #${tableNumber}: الرمز الجديد ${newPin}`);
    return newPin;
  };

  const closeTable = (tableNumber: number) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'closed' } : t))
    );
    addAuditLog(currentStaffUser.name, 'إغلاق طاولة', `تم إغلاق الطاولة رقم #${tableNumber}`);
  };

  const openTable = (tableNumber: number) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'available' } : t))
    );
    addAuditLog(currentStaffUser.name, 'فتح طاولة', `تم فتح الطاولة رقم #${tableNumber}`);
  };

  const endTableSession = (tableNumber: number) => {
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? {
              ...t,
              status: 'available',
              activeSessionId: undefined,
              sessionStartedAt: undefined,
              activeOrderCount: 0,
            }
          : t
      )
    );

    if (currentTableSession?.tableNumber === tableNumber) {
      setCurrentTableSession(null);
    }
    addAuditLog(currentStaffUser.name, 'إنهاء جلسة طاولة', `تم إنهاء جلسة الطاولة رقم ${tableNumber}`);
  };

  const activateTableSession = (tableNumber: number) => {
    const sessionId = `sess_${tableNumber}_${Date.now()}`;
    const token = `tok_${tableNumber}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    const startedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 120 * 60 * 1000).toISOString();

    const session: TableSession = {
      sessionId,
      tableNumber,
      token,
      startedAt,
      expiresAt,
      isActive: true,
    };

    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? {
              ...t,
              status: 'active',
              activeSessionId: sessionId,
              sessionStartedAt: startedAt,
            }
          : t
      )
    );

    setCurrentTableSession(session);
    setOrderTypeState('dine_in');
    addAuditLog('الزبون', 'بدء طلب من الصالة', `تم تفعيل طلب الطاولة #${tableNumber}`);
    return session;
  };

  const verifyAndStartTableSession = (tableNumber: number, pin: string) => {
    const table = tables.find((t) => t.tableNumber === tableNumber);
    if (!table) {
      return { success: false, message: `الطاولة رقم ${tableNumber} غير مسجلة بالنظام.` };
    }
    if (table.currentPin.trim() !== pin.trim()) {
      return { success: false, message: 'رمز التحقق (PIN) الخاص بهذه الطاولة غير صحيح.' };
    }

    const session = activateTableSession(tableNumber);
    return { success: true, message: `تم التحقق بنجاح من الطاولة #${tableNumber}`, session };
  };

  const simulateScanTableQR = (tableNumber: number) => {
    activateTableSession(tableNumber);
  };

  // Delivery Zones CRUD
  const addDeliveryZone = (zone: DeliveryZone) => {
    const newZone = { ...zone, id: zone.id || `zone-${Date.now()}` };
    setDeliveryZones((prev) => [...prev, newZone]);
    addAuditLog(currentStaffUser.name, 'إضافة منطقة توصيل', `تم إضافة المنطقة: ${newZone.name}`);
  };

  const updateDeliveryZone = (id: string, updates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...updates } : z))
    );
    addAuditLog(currentStaffUser.name, 'تعديل منطقة توصيل', `تم تعديل بيانات المنطقة #${id}`);
  };

  const deleteDeliveryZone = (id: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== id));
    addAuditLog(currentStaffUser.name, 'حذف منطقة توصيل', `تم حذف المنطقة #${id}`);
  };

  const toggleDeliveryZone = (id: string) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z))
    );
  };

  const updateDeliverySettings = (minAmount: number, fee: number) => {
    setMinDeliveryAmount(minAmount);
    setDeliveryFeeAmount(fee);
    addAuditLog(currentStaffUser.name, 'تعديل رسوم التوصيل العامة', `الحد الأدنى: ${minAmount} ر.س | الرسوم: ${fee} ر.س`);
  };

  // Customers
  const toggleCustomerBlock = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c))
    );
    addAuditLog(currentStaffUser.name, 'تغيير حالة العميل', `تم تعديل حالة العميل #${customerId}`);
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: note } : c))
    );
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity: number,
    selectedOption?: ProductOption,
    selectedAddons: ProductAddon[] = [],
    excludedIngredients: string[] = [],
    notes = ''
  ) => {
    const optionCost = selectedOption ? selectedOption.priceModifier : 0;
    const addonsCost = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    const unitPrice = item.basePrice + optionCost + addonsCost;
    const totalPrice = unitPrice * quantity;

    const cartItemId = `${item.id}_${selectedOption?.id || 'base'}_${selectedAddons
      .map((a) => a.id)
      .sort()
      .join('-')}_${excludedIngredients.sort().join('-')}_${Date.now()}`;

    const newCartItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity,
      selectedOption,
      selectedAddons,
      excludedIngredients,
      notes,
      unitPrice,
      totalPrice,
    };

    setCart((prevCart) => [...prevCart, newCartItem]);
    setCartShake(true);
    setTimeout(() => setCartShake(false), 800);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية.' };
    }
    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minOrderAmount} ريال.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `تم تفعيل الخصم بنجاح! (${found.description})` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart Totals with Discount Offers
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Compute active discount
  let computedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      computedDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      computedDiscount = appliedCoupon.discountAmount;
    }
    if (appliedCoupon.maxDiscount && computedDiscount > appliedCoupon.maxDiscount) {
      computedDiscount = appliedCoupon.maxDiscount;
    }
  }

  // Also check active discount offers
  discountOffers
    .filter((d) => d.isActive)
    .forEach((offer) => {
      if (offer.minOrderAmount && subtotal < offer.minOrderAmount) return;
      if (offer.targetType === 'all') {
        const disc = offer.type === 'percentage' ? Math.round((subtotal * offer.value) / 100) : offer.value;
        computedDiscount = Math.max(computedDiscount, disc);
      }
    });

  const discount = Math.min(computedDiscount, subtotal);

  // Delivery fee computation based on zone
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (subtotal >= RESTAURANT_INFO.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = deliveryFeeAmount;
    }
  }

  const total = Math.max(0, subtotal - discount + deliveryFee);

  // Orders Management
  const submitOrder = async (details: {
    customerName: string;
    customerPhone: string;
    customerNotes?: string;
    paymentMethod: 'cash' | 'card_on_delivery' | 'online_card';
    pickupTime?: string;
    deliveryAddress?: DeliveryAddress;
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (isSubmitting) {
      return { success: false, error: 'الطلب قيد المعالجة بالفعل.' };
    }

    if (settings.emergencyPauseOrders) {
      return { success: false, error: settings.emergencyMessage };
    }

    if (!settings.isRestaurantOpen) {
      return { success: false, error: 'المطعم مغلق حالياً، نعتذر عن استقبال الطلبات.' };
    }

    if (orderType === 'dine_in' && !settings.orderChannels.dineIn) {
      return { success: false, error: 'الطلب المباشر من داخل الصالة متوقف مؤقتاً بأمر الإدارة.' };
    }
    if (orderType === 'takeaway' && !settings.orderChannels.takeaway) {
      return { success: false, error: 'خدمة الاستلام السفري من الفرع متوقفة حالياً.' };
    }
    if (orderType === 'delivery' && !settings.orderChannels.delivery) {
      return { success: false, error: 'خدمة التوصيل متوقفة مؤقتاً في الوقت الحالي.' };
    }

    if (cart.length === 0) {
      return { success: false, error: 'السلة فارغة. يرجى اختيار وجبة أولاً.' };
    }

    setIsSubmitting(true);

    try {
      const orderNumber = 1000 + orders.length + 1;
      const orderId = `ORD-${orderNumber}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        orderType,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedMinutes: orderType === 'delivery' ? 35 : 15,
        items: cart.map((c) => ({
          menuItemId: c.menuItem.id,
          name: c.menuItem.name,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice,
          optionName: c.selectedOption?.name,
          addons: c.selectedAddons.map((a) => a.name),
          excluded: c.excludedIngredients,
          notes: c.notes,
        })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: details.paymentMethod,
        paymentStatus: details.paymentMethod === 'online_card' ? 'paid' : 'pending',
        tableNumber: currentTableSession ? currentTableSession.tableNumber : undefined,
        tableSessionToken: currentTableSession ? currentTableSession.token : undefined,
        pickupTime: details.pickupTime,
        deliveryAddress: details.deliveryAddress,
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        customerNotes: details.customerNotes,
        timeline: [
          { status: 'pending', timestamp: new Date().toISOString(), note: 'تم استلام الطلب من العميل', by: 'العميل' }
        ]
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);

      // Record Customer profile or update existing
      setCustomers((prev) => {
        const cleanPhone = details.customerPhone.trim();
        const existing = prev.find((c) => c.phone === cleanPhone);
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  name: details.customerName || c.name,
                  ordersCount: c.ordersCount + 1,
                  totalSpent: c.totalSpent + total,
                  lastOrderDate: new Date().toISOString().split('T')[0],
                }
              : c
          );
        } else {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            name: details.customerName,
            phone: cleanPhone,
            ordersCount: 1,
            totalSpent: total,
            lastOrderDate: new Date().toISOString().split('T')[0],
            status: 'active',
          };
          return [newCust, ...prev];
        }
      });

      // Clear cart
      setCart([]);
      setAppliedCoupon(null);

      // Audit and notification
      addAuditLog('العميل', 'إنشاء طلب جديد', `تم إنشاء طلب #${orderNumber} بمبلغ ${total} ر.س (${orderType})`);
      addNotification(
        'طلب جديد وارد 🔔',
        `طلب #${orderNumber} بقيمة ${total} ر.س (${orderType === 'dine_in' ? `طاولة #${newOrder.tableNumber}` : orderType === 'takeaway' ? 'سفري' : 'توصيل'})`,
        'order',
        'orders'
      );

      return { success: true, order: newOrder };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string): { success: boolean; message: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'الطلب غير موجود.' };

    // Disallow invalid backwards transitions from completed or cancelled
    if (order.status === 'completed' && status !== 'completed') {
      return { success: false, message: 'لا يمكن تعديل طلب تم اكتماله بالفعل.' };
    }
    if (order.status === 'cancelled' && status !== 'cancelled') {
      return { success: false, message: 'لا يمكن تعديل طلب تم إلغاؤه.' };
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timeline = o.timeline || [];
          const newTimelineEvent = {
            status,
            timestamp: new Date().toISOString(),
            note: note || `تم تحديث الحالة إلى ${status}`,
            by: currentStaffUser.name,
          };
          return {
            ...o,
            status,
            paymentStatus: status === 'completed' ? 'paid' : o.paymentStatus,
            timeline: [...timeline, newTimelineEvent],
          };
        }
        return o;
      })
    );

    addAuditLog(currentStaffUser.name, 'تحديث حالة الطلب', `طلب #${order.orderNumber}: ${order.status} → ${status}`);
    return { success: true, message: `تم تحديث حالة الطلب #${order.orderNumber} بنجاح` };
  };

  const cancelOrder = (orderId: string, reason = 'إلغاء بواسطة الإدارة') => {
    return updateOrderStatus(orderId, 'cancelled', reason);
  };

  const getOrderById = (orderIdOrNumber: string) => {
    return orders.find(
      (o) => o.id.toLowerCase() === orderIdOrNumber.toLowerCase() || o.orderNumber.toString() === orderIdOrNumber
    );
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        archiveProduct,
        duplicateProduct,
        toggleProductAvailability,
        updateProductPrice,
        bulkUpdateProducts,
        bulkDeleteProducts,

        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,

        modifierGroups,
        addModifierGroup,
        updateModifierGroup,
        deleteModifierGroup,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        total,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addNewCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,

        discountOffers,
        addDiscountOffer,
        updateDiscountOffer,
        deleteDiscountOffer,
        toggleDiscountOffer,

        orderType,
        setOrderType: setOrderTypeState,
        currentTableSession,
        activateTableSession,
        verifyAndStartTableSession,
        endTableSession,
        tables,
        addTable,
        updateTable,
        deleteTable,
        rotateTablePin,
        closeTable,
        openTable,
        simulateScanTableQR,

        deliveryZones,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        toggleDeliveryZone,
        minDeliveryAmount,
        deliveryFeeAmount,
        updateDeliverySettings,

        orders,
        currentOrder,
        setCurrentOrder,
        submitOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,

        customers,
        toggleCustomerBlock,
        addCustomerNote,

        staff,
        rolesPermissions,
        currentStaffUser,
        switchStaffRole,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        updateRolePermissions,

        settings,
        updateSettings,
        toggleRestaurantOpen,
        toggleEmergencyPause,
        toggleOrderChannel,

        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,

        auditLogs,
        addAuditLog,

        isCartOpen,
        setIsCartOpen,
        cartShake,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
