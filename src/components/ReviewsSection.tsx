import React from 'react';
import { Star, ExternalLink, ThumbsUp } from 'lucide-react';
import { REVIEWS_DATA, RESTAURANT_INFO } from '../data/restaurantData.ts';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-12 sm:py-16 bg-white border-b border-[#E5DCCE]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-black tracking-wider uppercase text-red-700 mb-1.5 block">
            ثقة أهالي عفيف وزوارها
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E140E] mb-2">
            آراء رواد فوال وشعبيات شعاع الدره
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            تقييمات واقعية وموثقة من زوارنا على خرائط Google في محافظة عفيف
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="max-w-3xl mx-auto bg-[#FAF7F2] rounded-2xl p-5 sm:p-7 border border-[#E5DCCE] mb-8 sm:mb-10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="w-18 h-18 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center text-amber-950 shrink-0 p-2">
              <span className="text-3xl font-black leading-none">{RESTAURANT_INFO.rating}</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                ))}
                <Star className="w-3 h-3 fill-amber-200 text-amber-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="font-extrabold text-base sm:text-lg text-[#1E140E]">
                  متوسط التقييم 3.9 من 5
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Google Maps
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                بناءً على 158 مراجعة حقيقية على خرائط Google
              </p>
            </div>
          </div>

          <a
            href={RESTAURANT_INFO.googleMapsReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 font-black text-xs sm:text-sm transition active:scale-95 shadow"
          >
            <ExternalLink className="w-4 h-4" />
            <span>شاركنا تقييمك على Google Maps</span>
          </a>
        </div>

        {/* Customer Review Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E5DCCE] food-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-900 font-black text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E140E]">{rev.author}</h4>
                      <span className="text-[11px] text-stone-400">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4 font-normal">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5DCCE] flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ThumbsUp className="w-3 h-3" />
                  {rev.verifiedSource}
                </span>
                <span>عميل في عفيف</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
