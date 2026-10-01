import React from 'react';
import { Utensils, ShoppingBag, Phone, Clock, ArrowLeft, Navigation } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface StickyMobileBarProps {
  hidden?: boolean;
  onOpenCart: () => void;
  onOpenTracking: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  hidden = false,
  onOpenCart,
  onOpenTracking,
}) => {
  const { cartCount, total } = useRestaurant();

  if (hidden) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden pointer-events-auto transition-transform duration-200">
      
      {/* If cart has items, show rich fixed mobile cart bar (Section 73) */}
      {cartCount > 0 ? (
        <div className="bg-[#140E0B]/98 backdrop-blur-md border-t border-amber-500/40 p-2.5 px-4 pb-[max(0.7rem,env(safe-area-inset-bottom))] shadow-2xl">
          <button
            onClick={onOpenCart}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-98 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-lg cursor-pointer transition"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 text-xs flex items-center justify-center font-black">
                {cartCount}
              </div>
              <span>عرض السلة وإتمام الطلب</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black">{total} ريال</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>
        </div>
      ) : (
        /* Regular bottom navigation when cart is empty */
        <div className="bg-[#140E0B]/98 backdrop-blur-md border-t border-amber-900/40 px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5">
            
            <a
              href="#menu"
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 active:scale-95 transition text-center"
            >
              <Utensils className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-[11px] font-black leading-none">المنيو</span>
            </a>

            <button
              onClick={onOpenCart}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 active:scale-95 transition text-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-[11px] font-black leading-none">السلة</span>
            </button>

            <button
              onClick={onOpenTracking}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 active:scale-95 transition text-center cursor-pointer"
            >
              <Clock className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-[11px] font-black leading-none">التتبع</span>
            </button>

            <a
              href={RESTAURANT_INFO.phoneCallUrl}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 active:scale-95 transition text-center"
            >
              <Phone className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-[11px] font-black leading-none">اتصال</span>
            </a>

          </div>
        </div>
      )}

    </div>
  );
};
