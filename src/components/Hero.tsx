import React from 'react';
import { Utensils, MessageCircle, Phone, Star, Flame, Clock, MapPin, Truck, Award } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#160E0B] text-white pt-6 pb-12 sm:pt-14 sm:pb-20">
      {/* Background Ambient Warm Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={RESTAURANT_INFO.restaurantCover}
          alt="أجواء مطعم فوال وشعبيات شعاع الدره"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160E0B] via-[#160E0B]/85 to-[#160E0B]/70"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          
          {/* 1. Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black mb-3.5 shadow-sm">
            <span>✨</span>
            <span>المطعم الشعبي الأول في عفيف على مدار الساعة</span>
          </div>

          {/* 2. Main Title */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 tracking-tight">
            <span>طعم الأصالة الشعبية</span>
            <span className="block text-amber-400 mt-1">و طبخ سمك تنور طازج</span>
            <span className="block text-stone-200 text-lg sm:text-2xl md:text-3xl font-bold mt-1">
              على أصوله في عفيف
            </span>
          </h1>

          {/* 3. Description */}
          <p className="text-amber-100/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mb-4 font-normal">
            {RESTAURANT_INFO.tagline} • فول قلابة، مطبق، معصوب ملكي، شاورما، وأسماك أفران الطين الساخنة يومياً.
          </p>

          {/* 4. Statistics / Highlights (3 Compact Cards) */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto mb-5">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mb-1"></span>
              <span className="text-[11px] font-black text-emerald-300">24 ساعة</span>
              <span className="text-[9px] text-stone-400 font-medium">خدمة متواصلة</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <Flame className="w-4 h-4 text-amber-400 mb-0.5" />
              <span className="text-[11px] font-black text-amber-300">سمك تنور</span>
              <span className="text-[9px] text-stone-400 font-medium">أفران طين طازجة</span>
            </div>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 flex flex-col items-center justify-center text-center transition"
            >
              <div className="flex items-center gap-0.5 mb-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-black text-white">3.9</span>
              </div>
              <span className="text-[9px] text-stone-400 font-medium">158 تقييم عفيف</span>
            </a>
          </div>

          {/* 5. Action Buttons */}
          <div className="w-full max-w-md mx-auto space-y-2.5 mb-6">
            {/* Primary: Menu & Ordering */}
            <a
              href="#menu"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Utensils className="w-5 h-5 stroke-[2.5]" />
              <span>تصفح المنيو واطلب الآن</span>
            </a>

            {/* Secondary: Branch Call & Map Location */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={RESTAURANT_INFO.phoneCallUrl}
                className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-100 font-bold text-xs sm:text-sm border border-white/20 shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">اتصال بالفرع</span>
              </a>

              <a
                href={RESTAURANT_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-100 font-bold text-xs sm:text-sm border border-white/20 shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span className="truncate">الموقع على الخريطة</span>
              </a>
            </div>
          </div>

          {/* 6. Hero Image with Stacked Feature Cards (Section 16 & 17) */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-900 aspect-16/10">
              <img
                src={RESTAURANT_INFO.restaurantPhoto}
                alt={RESTAURANT_INFO.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-white">
                <span className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>تخصصنا: سمك تنور طازج</span>
                </span>

                <span className="bg-emerald-600/90 backdrop-blur-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>توصيل سريع بعفيف</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
