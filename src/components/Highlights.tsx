import React from 'react';
import { Coffee, Flame, Utensils, Clock, CheckCircle2 } from 'lucide-react';

export const Highlights: React.FC = () => {
  const highlights = [
    {
      icon: <Coffee className="w-6 h-6 text-amber-600" />,
      title: 'فطور وشعبيات ساخنة',
      desc: 'فول مدمس بالجرة، شكشوكة بالجبن، كبدة بلدي طازجة بالصاج مع خبز الفرن الساخن.',
      tag: 'فطور الصباح',
    },
    {
      icon: <Flame className="w-6 h-6 text-red-600" />,
      title: 'طبخ سمك تنور طازج',
      desc: 'نطهو السمك الطازج في أفران التنور الطينية الملتهبة بنكهة وتتبيلة خاصة لا تُنسى.',
      tag: 'تخصص الفرع',
    },
    {
      icon: <Utensils className="w-6 h-6 text-amber-700" />,
      title: 'شاورما ومشويات دجاج',
      desc: 'كباب دجاج مشوي على الفحم وشاورما على السيخ مع بطاطس مقرمشة ومقبلات طازجة.',
      tag: 'مشويات وشاورما',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      title: 'مفتوح 24 ساعة يومياً',
      desc: 'جاهزون لاستقبالكم في أي وقت، فطور بعد الفجر أو غداء أو عشاء متأخر.',
      tag: 'خدمة 24 ساعة',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#E5DCCE]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black tracking-wider uppercase text-red-700 mb-1.5 block">
            مميزات المطعم
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E140E] mb-2">
            أشهى ما نقدم في شعاع الدره
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            أطباق طازجة محضرة يومياً بأيدي خبيرة وخدمة متواصلة على مدار الساعة في عفيف
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E5DCCE] food-card transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DCCE] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#1E140E] mb-1.5 group-hover:text-red-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DCCE] flex items-center gap-1.5 text-xs text-red-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>طعم شعبي أصيل</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
