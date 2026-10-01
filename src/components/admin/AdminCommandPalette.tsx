import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  ShoppingBag, 
  UtensilsCrossed, 
  FolderTree, 
  Grid3X3, 
  Tag, 
  Users, 
  Settings, 
  ArrowLeft 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.tsx';
import { AdminTab } from './AdminSidebar.tsx';

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder?: (orderId: string) => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectOrder,
}) => {
  const { menuItems, orders, tables, categories, coupons, customers } = useRestaurant();
  const [query, setQuery] = useState('');

  // Reset query when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  // Matched items
  const matchedProducts = cleanQ
    ? menuItems.filter((m) => m.name.toLowerCase().includes(cleanQ) || m.description.toLowerCase().includes(cleanQ)).slice(0, 4)
    : [];

  const matchedOrders = cleanQ
    ? orders.filter((o) => o.id.toLowerCase().includes(cleanQ) || o.customerName.toLowerCase().includes(cleanQ) || o.orderNumber.toString().includes(cleanQ)).slice(0, 4)
    : [];

  const matchedCategories = cleanQ
    ? categories.filter((c) => c.name.toLowerCase().includes(cleanQ)).slice(0, 3)
    : [];

  const allQuickNavItems: { tab: AdminTab; label: string; icon: any; desc: string }[] = [
    { tab: 'orders', label: 'الطلبات الجارية', icon: ShoppingBag, desc: 'عرض ومعالجة طلبات الصالة والتوصيل' },
    { tab: 'products', label: 'إدارة الأصناف والوجبات', icon: UtensilsCrossed, desc: 'تعديل الأسعار وإضافة أطباق جديدة' },
    { tab: 'categories', label: 'أقسام القائمة', icon: FolderTree, desc: 'إعادة ترتيب وتعديل التصنيفات' },
    { tab: 'tables', label: 'الطاولات والـ QR', icon: Grid3X3, desc: 'متابعة طاولات الصالة ورموز PIN' },
    { tab: 'offers', label: 'العروض والكوبونات', icon: Tag, desc: 'إنشاء وتفعيل خصومات المطعم' },
    { tab: 'customers', label: 'سجل العملاء', icon: Users, desc: 'إجمالي المشتريات ومعلومات التواصل' },
    { tab: 'settings', label: 'إعدادات المطعم', icon: Settings, desc: 'ساعات العمل والإيقاف المؤقت' },
  ];

  const quickNavItems = allQuickNavItems.filter((item) => !cleanQ || item.label.toLowerCase().includes(cleanQ));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="ابحث عن صنف، رقم طلب (#1048)، قسم، طاولة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-stone-900 outline-none placeholder:text-stone-400 placeholder:font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              مسح
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white text-[10px] font-mono text-stone-500 border border-stone-200 shadow-2xs">
            ESC للإغلاق
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-4 no-scrollbar">
          
          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-stone-400 px-3 mb-1.5">
                الطلبات المطابقة
              </div>
              <div className="space-y-1">
                {matchedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      onNavigateTab('orders');
                      if (onSelectOrder) onSelectOrder(ord.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-amber-500/10 transition flex items-center justify-between group cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                        #{ord.orderNumber}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{ord.customerName}</div>
                        <div className="text-[10px] text-stone-500">
                          {ord.orderType === 'dine_in' ? `طاولة #${ord.tableNumber}` : ord.orderType === 'takeaway' ? 'سفري' : 'توصيل'} • {ord.total} ريال
                        </div>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-stone-400 px-3 mb-1.5">
                الأصناف والوجبات
              </div>
              <div className="space-y-1">
                {matchedProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onNavigateTab('products');
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-amber-500/10 transition flex items-center justify-between group cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{prod.name}</div>
                        <div className="text-[10px] text-stone-500">{prod.basePrice} ريال • {prod.isAvailable ? 'متوفر' : 'غير متوفر'}</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Sections */}
          <div>
            <div className="text-[10px] font-black uppercase text-stone-400 px-3 mb-1.5">
              الأقسام والإجراءات السريعة
            </div>
            <div className="space-y-1">
              {quickNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onNavigateTab(item.tab);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-stone-100 transition flex items-center justify-between group cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-amber-500 group-hover:text-slate-950 text-stone-600 flex items-center justify-center transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{item.label}</div>
                        <div className="text-[10px] text-stone-500">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 transition" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>اكتب للتصفح السريع والبحث الشامل</span>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-bold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
