import React from 'react';
import { Flame, Plus, Phone, Check, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';
import { MenuItem } from '../types/index.ts';

interface TannourSpotlightProps {
  onCustomizeItem: (item: MenuItem) => void;
}

export const TannourSpotlight: React.FC<TannourSpotlightProps> = ({ onCustomizeItem }) => {
  const { menuItems } = useRestaurant();
  const fishItem = menuItems.find((m) => m.id === 'tannour-fish');

  return (
    <section id="tannour" className="py-12 sm:py-16 bg-[#18110D] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Information */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                تخصص الفرع المميز
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                الأكثر طلباً بالفرع
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3.5 leading-tight">
              سمك تنور طازج بالأفران الطينية الأصيلة
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              نتميز في فوال وشعبيات شعاع الدره بطبخ السمك الطازج داخل أفران التنور الطينية التقليدية. الحرارة المرتفعة تمنح السمك قشرة مقرمشة محمرة من الخارج مع لحم طري مشبع بنكهة التوابل الشرقية.
            </p>

            {/* Features list */}
            <div className="space-y-2.5 mb-7 w-full">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200">
                  تتبيلة خاصة محضرة بعناية من التوابل والبهارات الشعبية الأصيلة
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200">
                  طهي داخل أفران طينية حارة يمنح السمك قرمشة خارجية وطراوة لا تقاوم
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200">
                  يُحضر طازجاً ومباشرة عند طلبكم لضمان المذاق الأشهى
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => fishItem && onCustomizeItem(fishItem)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>طلب سمك التنور وإضافته للسلة (يبدأ من 48 ر.س)</span>
              </button>

              <a
                href={RESTAURANT_INFO.phoneCallUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>اتصال للاستفسار</span>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80"
                alt="سمك تنور طازج"
                className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-base text-amber-400">
                    سمك تنور على أصوله
                  </span>
                  <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                    طازج يومياً
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  أفران طين ملتهبة لإعطاء قرمشة خارجية وطراوة غنية بالبهارات
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
