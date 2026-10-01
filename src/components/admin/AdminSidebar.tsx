import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  FolderTree, 
  SlidersHorizontal, 
  Percent, 
  Tag, 
  Grid3X3, 
  Car, 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  LogOut,
  Bell,
  Eye,
  Store
} from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurantData.ts';
import { useRestaurant } from '../../context/RestaurantContext.tsx';

export type AdminTab = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'modifiers'
  | 'offers'
  | 'tables'
  | 'delivery'
  | 'customers'
  | 'staff'
  | 'reports'
  | 'settings'
  | 'audit';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onPreviewSite: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onLogout,
  onPreviewSite,
}) => {
  const { currentStaffUser, orders, unreadNotificationsCount, settings } = useRestaurant();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const navigationGroups = [
    {
      group: 'الرئيسية والعمليات',
      items: [
        {
          id: 'dashboard' as AdminTab,
          label: 'لوحة التحكم',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'orders' as AdminTab,
          label: 'إدارة الطلبات',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} جديد` : null,
          badgeColor: 'bg-red-500 text-white',
        },
      ],
    },
    {
      group: 'إدارة قائمة الطعام',
      items: [
        {
          id: 'products' as AdminTab,
          label: 'الأصناف والوجبات',
          icon: UtensilsCrossed,
          badge: null,
        },
        {
          id: 'categories' as AdminTab,
          label: 'أقسام القائمة',
          icon: FolderTree,
          badge: null,
        },
        {
          id: 'modifiers' as AdminTab,
          label: 'الخيارات والإضافات',
          icon: SlidersHorizontal,
          badge: null,
        },
      ],
    },
    {
      group: 'التسويق والمبيعات',
      items: [
        {
          id: 'offers' as AdminTab,
          label: 'العروض والكوبونات',
          icon: Percent,
          badge: null,
        },
      ],
    },
    {
      group: 'الصالة والخدمات',
      items: [
        {
          id: 'tables' as AdminTab,
          label: 'الطاولات والـ QR',
          icon: Grid3X3,
          badge: null,
        },
        {
          id: 'delivery' as AdminTab,
          label: 'مناطق التوصيل',
          icon: Car,
          badge: null,
        },
      ],
    },
    {
      group: 'العملاء والفريق',
      items: [
        {
          id: 'customers' as AdminTab,
          label: 'سجل العملاء',
          icon: Users,
          badge: null,
        },
        {
          id: 'staff' as AdminTab,
          label: 'الموظفين والصلاحيات',
          icon: UserCheck,
          badge: null,
        },
      ],
    },
    {
      group: 'التقارير والإعدادات',
      items: [
        {
          id: 'reports' as AdminTab,
          label: 'التقارير المالية',
          icon: BarChart3,
          badge: null,
        },
        {
          id: 'settings' as AdminTab,
          label: 'إعدادات المطعم',
          icon: Settings,
          badge: null,
        },
        {
          id: 'audit' as AdminTab,
          label: 'سجل العمليات',
          icon: FileText,
          badge: null,
        },
      ],
    },
  ];

  const handleItemClick = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 flex flex-col bg-[#140E0B] text-stone-300 border-l border-amber-950/60 transition-all duration-300 shadow-2xl ${
          // Desktop collapsing width
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          // Mobile responsive slide-over drawer
          isMobileOpen ? 'translate-x-0 w-72 sm:w-80' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-amber-950/60 bg-[#0F0A08] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 shrink-0 bg-stone-900 shadow-sm">
              <img
                src={RESTAURANT_INFO.restaurantLogo || RESTAURANT_INFO.restaurantPhoto}
                alt="شعار المطعم"
                className="w-full h-full object-cover"
              />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm text-white truncate">
                  شعاع الدره
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${settings.isRestaurantOpen ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
                  لوحة الإدارة الذكية
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white items-center justify-center transition"
            title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 mx-3 mt-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                {currentStaffUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentStaffUser.name}
                </div>
                <div className="text-[10px] text-amber-400 font-medium">
                  {currentStaffUser.role === 'manager' ? 'المدير العام' : currentStaffUser.role}
                </div>
              </div>
            </div>
            <button
              onClick={onPreviewSite}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-white/10 transition"
              title="معاينة الموقع كعميل"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">
                  {group.group}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                        : 'text-stone-300 hover:text-white hover:bg-white/8'
                    } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-stone-400 group-hover:text-amber-400'}`} />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="flex-1 text-right truncate">
                        {item.label}
                      </span>
                    )}

                    {(!isCollapsed || isMobileOpen) && item.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-400/20 text-amber-300'}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Badge Dot */}
                    {isCollapsed && !isMobileOpen && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-amber-950/60 bg-[#0F0A08] space-y-1.5 shrink-0">
          <button
            onClick={onPreviewSite}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
            title="معاينة الموقع للعملاء"
          >
            <Store className="w-4 h-4 text-amber-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>معاينة متجر المطعم</span>}
          </button>

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
            title="تسجيل الخروج من الإدارة"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
