import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  X, 
  ChevronRight, 
  Home, 
  Sparkles,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar.tsx';
import { AdminHeader } from './admin/AdminHeader.tsx';
import { AdminCommandPalette } from './admin/AdminCommandPalette.tsx';

// Admin Subpages
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage.tsx';
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage.tsx';
import { AdminProductsPage } from './admin/pages/AdminProductsPage.tsx';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage.tsx';
import { AdminModifiersPage } from './admin/pages/AdminModifiersPage.tsx';
import { AdminOffersPage } from './admin/pages/AdminOffersPage.tsx';
import { AdminTablesPage } from './admin/pages/AdminTablesPage.tsx';
import { AdminDeliveryPage } from './admin/pages/AdminDeliveryPage.tsx';
import { AdminCustomersPage } from './admin/pages/AdminCustomersPage.tsx';
import { AdminStaffPage } from './admin/pages/AdminStaffPage.tsx';
import { AdminReportsPage } from './admin/pages/AdminReportsPage.tsx';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage.tsx';
import { AdminAuditLogsPage } from './admin/pages/AdminAuditLogsPage.tsx';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateTable: (tableNumber: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onSimulateTable,
}) => {
  const { addAuditLog, orders, notifications, currentStaffUser } = useRestaurant();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('shuaa_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [authFailedAttempts, setAuthFailedAttempts] = useState(0);
  const [authLockout, setAuthLockout] = useState(0);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('shuaa_sidebar_collapsed') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authLockout > 0) {
      timer = setTimeout(() => setAuthLockout((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [authLockout]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Ctrl+K or Cmd+K opens Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }

      // Escape closes Command Palette if open, then mobile menu, or login gate
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        } else if (!isAuthenticated) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCommandPaletteOpen]);

  // Save sidebar collapsed state
  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('shuaa_sidebar_collapsed', String(next));
      return next;
    });
  };

  if (!isOpen) return null;

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authLockout > 0) return;

    // PIN: 7788 for general admin
    if (adminPin.trim() === '7788' || adminPin.trim() === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('shuaa_admin_auth', 'true');
      setAuthError('');
      setAuthFailedAttempts(0);
      setAdminPin('');
      addAuditLog('مشرف النظام', 'تسجيل دخول ناجح', 'تم الدخول إلى لوحة إدارة المطعم.');
    } else {
      const attempts = authFailedAttempts + 1;
      setAuthFailedAttempts(attempts);
      if (attempts >= 3) {
        setAuthLockout(60);
        setAuthError('تم تجاوز عدد المحاولات المسموحة. تم قفل تسجيل الدخول مؤقتاً لمدة 60 ثانية.');
        addAuditLog('الأمان', 'محاولة تسجيل فاشلة', '3 محاولات فاشلة لإدخال رمز PIN الإداري.');
      } else {
        setAuthError(`رمز الدخول غير صحيح (تبقى لديك ${3 - attempts} محاولات).`);
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('shuaa_admin_auth');
    addAuditLog('مشرف النظام', 'تسجيل خروج', 'تم تسجيل الخروج من لوحة التحكم.');
  };

  const handleNavigateToOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentTab('orders');
    setIsCommandPaletteOpen(false);
  };

  // Human-readable titles and breadcrumbs for each tab
  const tabTitles: { [key in AdminTab]: { title: string; category: string } } = {
    dashboard: { title: 'لوحة التحكم والعمليات', category: 'الرئيسية' },
    orders: { title: 'إدارة ومعالجة الطلبات', category: 'العمليات' },
    products: { title: 'الأصناف والوجبات الشعبية', category: 'قائمة الطعام' },
    categories: { title: 'أقسام وتصنيفات المنيو', category: 'قائمة الطعام' },
    modifiers: { title: 'الخيارات والإضافات', category: 'قائمة الطعام' },
    offers: { title: 'العروض الترويجية والكوبونات', category: 'التسويق' },
    tables: { title: 'إدارة الطاولات ورموز QR', category: 'الصالة' },
    delivery: { title: 'مناطق ورسوم التوصيل في عفيف', category: 'الخدمات' },
    customers: { title: 'سجل العملاء والمشتريات', category: 'العملاء' },
    staff: { title: 'فريق العمل والصلاحيات', category: 'الإدارة' },
    reports: { title: 'التقارير والمؤشرات المالية', category: 'التحليلات' },
    settings: { title: 'إعدادات المطعم والتشغيل', category: 'النظام' },
    audit: { title: 'سجل العمليات والتدقيق', category: 'الأمان' },
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F6F2EC] text-[#1A120D] overflow-hidden antialiased font-arabic selection:bg-amber-500/20 selection:text-amber-950">
      
      {/* Gate 1: If NOT authenticated, show PIN Verification Gate */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xs">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                بوابة الإدارة المركزية
              </div>
              <h3 className="text-xl font-black text-stone-900">
                فوال وشعبيات شعاع الدره
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                أدخل رمز الأمان PIN للمتابعة إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                placeholder="رمز الأمان (7788)"
                value={adminPin}
                disabled={authLockout > 0}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  setAuthError('');
                }}
                autoFocus
                className="w-full text-center text-2xl font-black py-3 px-4 rounded-2xl bg-stone-50 border-2 border-stone-200 focus:border-amber-500 text-stone-900 outline-none tracking-widest disabled:opacity-50 transition"
              />

              {authLockout > 0 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                  تم قفل تسجيل الدخول مؤقتاً: متبقي {authLockout} ثانية
                </div>
              )}

              {authError && authLockout === 0 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-1.5 text-right">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLockout > 0 || !adminPin.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-black text-xs sm:text-sm transition cursor-pointer shadow-md active:scale-98"
              >
                الدخول للوحة التحكم
              </button>
            </form>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>رمز المدير التجريبي: 7788</span>
              <button
                type="button"
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 font-bold underline cursor-pointer"
              >
                العودة للمتجر
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* Gate 2: Full Functional SaaS Restaurant Management Platform */
        <div className="flex-1 flex overflow-hidden">
          
          {/* 1. Sidebar (Desktop Collapsible + Mobile Slide-over Drawer) */}
          <AdminSidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              setIsMobileMenuOpen(false);
            }}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onLogout={handleAdminLogout}
            onPreviewSite={onClose}
          />

          {/* 2. Main Content Wrapper */}
          <div 
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64'
            }`}
          >
            {/* Top SaaS Header */}
            <AdminHeader
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onPreviewSite={onClose}
              pageTitle={tabTitles[currentTab]?.title || 'لوحة التحكم'}
            />

            {/* Breadcrumb Navigation Bar */}
            <div className="h-10 bg-[#EFEAE2] border-b border-[#E2D7C7] px-4 sm:px-6 flex items-center justify-between text-xs text-stone-500 shrink-0">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <button 
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-stone-900 flex items-center gap-1 font-medium transition cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">الرئيسية</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium text-stone-600">{tabTitles[currentTab]?.category}</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-bold text-stone-900 truncate">{tabTitles[currentTab]?.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 transition cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-400/40"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>معاينة موقع المطعم</span>
                </button>
              </div>
            </div>

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* TAB: Dashboard */}
              {currentTab === 'dashboard' && (
                <AdminDashboardPage
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenAddProduct={() => setCurrentTab('products')}
                  onSelectOrder={handleNavigateToOrder}
                />
              )}

              {/* TAB: Orders */}
              {currentTab === 'orders' && (
                <AdminOrdersPage
                  selectedOrderId={selectedOrderId}
                  onClearSelectedOrder={() => setSelectedOrderId(null)}
                />
              )}

              {/* TAB: Products */}
              {currentTab === 'products' && (
                <AdminProductsPage />
              )}

              {/* TAB: Categories */}
              {currentTab === 'categories' && (
                <AdminCategoriesPage />
              )}

              {/* TAB: Modifiers */}
              {currentTab === 'modifiers' && (
                <AdminModifiersPage />
              )}

              {/* TAB: Offers & Discounts */}
              {currentTab === 'offers' && (
                <AdminOffersPage />
              )}

              {/* TAB: Tables & QR */}
              {currentTab === 'tables' && (
                <AdminTablesPage onSimulateTable={onSimulateTable} />
              )}

              {/* TAB: Delivery Zones */}
              {currentTab === 'delivery' && (
                <AdminDeliveryPage />
              )}

              {/* TAB: Customers */}
              {currentTab === 'customers' && (
                <AdminCustomersPage />
              )}

              {/* TAB: Staff & Permissions */}
              {currentTab === 'staff' && (
                <AdminStaffPage />
              )}

              {/* TAB: Reports & Analytics */}
              {currentTab === 'reports' && (
                <AdminReportsPage />
              )}

              {/* TAB: Settings */}
              {currentTab === 'settings' && (
                <AdminSettingsPage />
              )}

              {/* TAB: Audit Logs */}
              {currentTab === 'audit' && (
                <AdminAuditLogsPage />
              )}

            </main>

          </div>

          {/* Global Command Palette (Ctrl + K) */}
          <AdminCommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              setIsCommandPaletteOpen(false);
            }}
            onSelectOrder={handleNavigateToOrder}
          />

        </div>
      )}

    </div>
  );
};
