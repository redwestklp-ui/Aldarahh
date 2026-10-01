import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  ZoomIn, 
  Utensils, 
  Clock, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface NavbarProps {
  onOpenPhotoModal: () => void;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPhotoModal,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, total, currentTableSession, cartShake } = useRestaurant();

  // Lock body scroll and Escape key listener when mobile drawer is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Notification Strip */}
      <div className="bg-[#140E0B] text-amber-200/90 text-xs py-1.5 px-3 border-b border-amber-900/40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>مفتوح 24 ساعة يومياً في عفيف</span>
            </span>
            <span className="hidden sm:inline text-amber-600/40">|</span>
            <span className="hidden md:inline text-stone-300 text-[11px] truncate">
              {RESTAURANT_INFO.shortAddress}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a
              href={RESTAURANT_INFO.phoneCallUrl}
              className="text-stone-300 hover:text-amber-400 font-bold text-[11px] transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>اتصل بالفرع</span>
            </a>

            <button
              onClick={onOpenTracking}
              className="text-stone-300 hover:text-amber-400 font-bold text-[11px] transition cursor-pointer flex items-center gap-1 border-r border-stone-800 pr-2"
            >
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>تتبع طلبك</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 border-r border-stone-800 pr-2"
            >
              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="hidden xs:inline">بوابة الموظفين</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#E6DDD2] shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          
          {/* Restaurant Logo/Photo with Click to Zoom */}
          <div className="flex items-center gap-2.5 shrink-0 min-w-0">
            <button
              onClick={onOpenPhotoModal}
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm shrink-0 bg-stone-100 hover:scale-105 transition-transform group cursor-pointer"
              title="انقر لتكبير صورة المطعم"
            >
              <img
                src={RESTAURANT_INFO.restaurantLogo || RESTAURANT_INFO.restaurantPhoto}
                alt={RESTAURANT_INFO.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <ZoomIn className="w-4 h-4 text-amber-300" />
              </div>
            </button>

            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm sm:text-base text-[#1E140E] leading-tight tracking-tight truncate">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-[11px] text-[#78695E] font-medium flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                <span>طريق الملك عبدالعزيز - عفيف</span>
              </span>
            </div>
          </div>

          {/* Active Table Badge if sitting inside restaurant */}
          {currentTableSession && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500 text-amber-950 text-xs font-black">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              <span>أنت في طاولة ({currentTableSession.tableNumber})</span>
            </div>
          )}

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            <a href="#order-type" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              طريقة الطلب
            </a>
            <a href="#menu" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              قائمة الطعام
            </a>
            <a href="#tannour" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              سمك تنور
            </a>
            <a href="#services" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              خدماتنا
            </a>
            <a href="#reviews" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              آراء الزوار
            </a>
            <a href="#location" className="text-sm font-bold text-[#4E3F35] hover:text-red-700 transition">
              الموقع
            </a>
          </nav>

          {/* Cart & Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Live Cart Button with Shake feedback */}
            <button
              onClick={onOpenCart}
              className={`relative inline-flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer ${
                cartShake ? 'animate-bounce ring-4 ring-amber-400/40' : ''
              }`}
              aria-label="عرض السلة"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline">السلة</span>
              {total > 0 && (
                <span className="bg-black/10 px-1.5 py-0.5 rounded text-[11px] font-extrabold mr-1">
                  {total} ر.س
                </span>
              )}
            </button>

            <a
              href={RESTAURANT_INFO.phoneCallUrl}
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 transition shadow-sm active:scale-95"
              aria-label="اتصال بالمطعم"
              title={RESTAURANT_INFO.displayPhone}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Mobile Drawer Trigger (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-800 hover:bg-stone-100 transition active:scale-90"
              aria-label="فتح القائمة الرئيسية"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer from RIGHT (RTL) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-visibility duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel (Opens from Right) */}
        <div
          className={`fixed top-0 bottom-0 right-0 w-[82%] max-w-sm bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out border-l border-stone-200 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top Drawer Header */}
          <div className="p-4 bg-[#140E0B] text-white flex items-center justify-between border-b border-amber-950/60 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
                <img
                  src={RESTAURANT_INFO.restaurantLogo || RESTAURANT_INFO.restaurantPhoto}
                  alt={RESTAURANT_INFO.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-white truncate">
                  {RESTAURANT_INFO.name}
                </h3>
                <span className="text-[11px] text-amber-400 font-bold block truncate">
                  عفيف • مفتوح 24 ساعة
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Active Session Alert if inside restaurant */}
          {currentTableSession && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-black text-amber-950">
                <Utensils className="w-4 h-4 text-amber-700" />
                <span>أنت في طاولة رقم ({currentTableSession.tableNumber})</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                جلسة نشطة
              </span>
            </div>
          )}

          {/* Navigation Links List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-bold text-stone-800">
            <a
              href="#order-type"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>طريقة الطلب (صالة / سفري / توصيل)</span>
              <span className="text-amber-600 text-xs">←</span>
            </a>

            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>قائمة الطعام والمأكولات</span>
              <span className="text-amber-600 text-xs">←</span>
            </a>

            <a
              href="#tannour"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>طبخ سمك تنور طازج</span>
              <span className="text-red-600 text-xs font-black">🔥 خاص</span>
            </a>

            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>خدمات المطعم</span>
              <span className="text-amber-600 text-xs">←</span>
            </a>

            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>آراء الزوار والتقييمات</span>
              <span className="text-amber-600 text-xs">←</span>
            </a>

            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-amber-50 active:bg-amber-100 transition"
            >
              <span>الموقع وساعات العمل</span>
              <span className="text-amber-600 text-xs">←</span>
            </a>
          </div>

          {/* Bottom Actions Section */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-800" />
              <span>تتبع طلب سابق</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={RESTAURANT_INFO.phoneCallUrl}
                className="py-2.5 px-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>اتصال بالفرع</span>
              </a>

              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>واتساب</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>بوابة الموظفين والإدارة</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
