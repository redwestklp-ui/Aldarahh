import React from 'react';
import { UtensilsCrossed, ShoppingBag, Car, Clock } from 'lucide-react';
import { SERVICES_LIST } from '../data/restaurantData.ts';

export const ServicesSection: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'dine-in':
        return <UtensilsCrossed className="w-6 h-6 text-amber-600" />;
      case 'takeaway':
        return <ShoppingBag className="w-6 h-6 text-red-600" />;
      case 'delivery':
        return <Car className="w-6 h-6 text-emerald-600" />;
      case '24-hours':
      default:
        return <Clock className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="services" className="py-12 sm:py-16 bg-[#F6F2EC] border-b border-[#E5DCCE]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black tracking-wider uppercase text-red-700 mb-1.5 block">
            خيارات تناول الطعام والطلب
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E140E] mb-2">
            خدماتنا لراحتكم في شعاع الدره
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            تفضل بزيارتنا في صالتنا المريحة، أو استلم طلبك بالسيارة، أو اطلب التوصيل لباب بيتك
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SERVICES_LIST.map((srv) => (
            <div
              key={srv.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5DCCE] food-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5DCCE] flex items-center justify-center mb-4 shadow-2xs">
                  {getIcon(srv.id)}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-base text-[#1E140E]">
                    {srv.title}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {srv.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {srv.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DCCE] text-[11px] text-stone-400 font-bold">
                فوال وشعبيات شعاع الدره
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
