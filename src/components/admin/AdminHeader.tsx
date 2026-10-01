import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  Search, 
  Bell, 
  Power, 
  AlertOctagon, 
  User, 
  ExternalLink, 
  Check, 
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.tsx';
import { StaffRole } from '../../types/index.ts';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onPreviewSite: () => void;
  pageTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onOpenCommandPalette,
  onPreviewSite,
  pageTitle,
}) => {
  const { 
    settings, 
    toggleRestaurantOpen, 
    toggleEmergencyPause, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    clearAllNotifications,
    currentStaffUser,
    switchStaffRole,
    staff,
    updateSettings
  } = useRestaurant();

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotificationsMenu(false);
        setShowRoleMenu(false);
      }
    };
    if (showNotificationsMenu || showRoleMenu) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNotificationsMenu, showRoleMenu]);

  const availableRoles: { role: StaffRole; label: string; desc: string }[] = [
    { role: 'manager', label: 'المدير العام', desc: 'صلاحيات كاملة على كل شيء' },
    { role: 'cashier', label: 'الكاشير', desc: 'الطلبات، الفواتير، الطاولات' },
    { role: 'kitchen', label: 'شيف المطبخ والتنور', desc: 'طلبات المطبخ وتجهيز الوجبات' },
    { role: 'waiter', label: 'كابتن الصالة', desc: 'خدمة الطاولات والـ QR' },
    { role: 'delivery', label: 'مندوب التوصيل', desc: 'طلبات التوصيل ومناطق عفيف' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2D7C7] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
      
      {/* Right / Start (Mobile Hamburger + Page Title) */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition active:scale-95 shrink-0"
          aria-label="فتح القائمة الجانبية"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="text-[11px] font-bold text-amber-800 hidden sm:block">
            إدارة فوال وشعبيات شعاع الدره
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#1A120D] truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle: Quick Search / Command Bar Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <button
          onClick={onOpenCommandPalette}
          className="w-full py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-500 text-xs font-medium flex items-center justify-between transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-400" />
            <span>بحث سريع في الطلبات، الأصناف، الطاولات، العملاء...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-stone-500 border border-stone-300">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Left / End Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
          aria-label="بحث سريع"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* 1. Restaurant Open/Closed Toggle */}
        <button
          onClick={toggleRestaurantOpen}
          className={`px-3 py-1.5 rounded-xl text-xs font-black border transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            settings.isRestaurantOpen
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
          }`}
          title={settings.isRestaurantOpen ? 'المطعم مفتوح لاستقبال الطلبات (انقر للإغلاق المؤقت)' : 'المطعم مغلق حالياً (انقر للفتح)'}
        >
          <span className={`w-2 h-2 rounded-full ${settings.isRestaurantOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`} />
          <span className="hidden sm:inline">
            {settings.isRestaurantOpen ? 'المطعم مفتوح' : 'المطعم مغلق'}
          </span>
        </button>

        {/* 2. Emergency Order Pause */}
        <button
          onClick={() => toggleEmergencyPause()}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black border transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            settings.emergencyPauseOrders
              ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
          }`}
          title="إيقاف استقبال طلبات جديدة مؤقتاً عند ضغط العمل"
        >
          <AlertOctagon className="w-4 h-4" />
          <span className="hidden md:inline">
            {settings.emergencyPauseOrders ? 'الطلبات متوقفة مؤقتاً' : 'إيقاف طوارئ'}
          </span>
        </button>

        {/* 3. Notifications Bell Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition active:scale-95 cursor-pointer"
            aria-label="التنبيهات"
            title="مركز التنبيهات"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotificationsMenu && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100">
                <div className="flex items-center gap-1.5 font-black text-xs text-[#1A120D]">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>تنبيهات النظام والطلبات</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full text-[10px]">
                      {unreadNotificationsCount} غير مقروء
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-stone-400 hover:text-red-600 font-bold transition"
                >
                  مسح الكل
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-stone-400 font-medium">
                    لا توجد تنبيهات جديدة حالياً
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                        notif.isRead
                          ? 'bg-stone-50/60 border-stone-200 text-stone-600'
                          : 'bg-amber-500/10 border-amber-300 text-amber-950 font-bold'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-black text-xs">{notif.title}</span>
                        <span className="text-[10px] text-stone-400 font-normal">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-normal leading-relaxed text-stone-600">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Staff Role Switcher Popover (Interactive Role Testing) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 transition active:scale-95 cursor-pointer text-xs font-bold"
            title="تبديل الصلاحية لتجربة الواجهة بأدوار مختلفة"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">
              {currentStaffUser.name.charAt(0)}
            </div>
            <span className="hidden sm:inline font-bold">
              {currentStaffUser.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 mb-1.5 border-b border-stone-100">
                <span className="text-[10px] font-black uppercase text-stone-400 block">
                  تبديل الصلاحية النشطة
                </span>
                <span className="text-xs font-bold text-stone-700">
                  اختبر النظام كمدير أو كاشير أو شيف
                </span>
              </div>

              <div className="space-y-1">
                {availableRoles.map((r) => {
                  const isSelected = currentStaffUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchStaffRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{r.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-stone-400'}`}>
                          {r.desc}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Customer Site Preview */}
        <button
          onClick={onPreviewSite}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#140E0B] hover:bg-stone-800 text-amber-400 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          title="معاينة الموقع للعميل"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden md:inline">عرض الموقع</span>
        </button>

      </div>
      {/* Backdrop overlay for dismissing dropdown menus */}
      {(showNotificationsMenu || showRoleMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-2xs"
          onClick={() => {
            setShowNotificationsMenu(false);
            setShowRoleMenu(false);
          }}
        />
      )}
    </header>
  );
};
