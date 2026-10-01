import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Copy, Check, ExternalLink, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="location" className="py-12 sm:py-16 bg-[#F6F2EC] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black tracking-wider uppercase text-red-700 mb-1.5 block">
            يسعدنا زيارتكم
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E140E] mb-2">
            موقع المطعم وساعات العمل
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            موقع استراتيجي على طريق الملك عبدالعزيز في قلب محافظة عفيف، مواقف متوفرة وسهولة وصول
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Information Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live 24/7 Status Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-800 text-white shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                </span>
                <div>
                  <span className="font-black text-sm block">
                    مفتوح الآن - على مدار 24 ساعة
                  </span>
                  <span className="text-xs text-emerald-100 font-medium">
                    {RESTAURANT_INFO.hours}
                  </span>
                </div>
              </div>
              <Clock className="w-6 h-6 text-emerald-200" />
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5DCCE] food-card space-y-4">
              <div>
                <span className="text-xs font-extrabold text-red-700 block mb-1">
                  العنوان بالتفصيل:
                </span>
                <p className="text-sm sm:text-base font-black text-[#1E140E] leading-relaxed">
                  {RESTAURANT_INFO.address}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8DE] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block font-medium">
                    رمز بلس (Plus Code):
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-900">
                    {RESTAURANT_INFO.plusCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم نسخ العنوان!' : 'نسخ العنوان'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2.5">
                <a
                  href={RESTAURANT_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-md transition active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>احصل على الاتجاهات</span>
                </a>

                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs sm:text-sm border border-[#DCD3C7] transition active:scale-95"
                >
                  <ExternalLink className="w-4 h-4 text-red-600" />
                  <span>فتح في Google Maps</span>
                </a>
              </div>
            </div>

            {/* Quick Phone Call Card */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-700" />
                <span className="font-extrabold font-mono text-sm" dir="ltr">{RESTAURANT_INFO.displayPhone}</span>
              </div>
              <a
                href={RESTAURANT_INFO.phoneCallUrl}
                className="font-black text-red-700 hover:text-red-800"
              >
                اتصل الآن
              </a>
            </div>

          </div>

          {/* Map Embed Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E5DCCE] shadow-md h-[360px] sm:h-[420px] relative flex flex-col">
              
              <div className="p-3.5 bg-[#1E140E] text-white text-xs flex items-center justify-between px-4 z-10 shrink-0">
                <div className="flex items-center gap-2 font-bold">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{RESTAURANT_INFO.name}</span>
                </div>
                <span className="text-[11px] text-amber-200/80 font-mono">
                  عفيف • طريق الملك عبدالعزيز
                </span>
              </div>

              <div className="flex-1 w-full h-full relative">
                <iframe
                  title="موقع مطعم شعاع الدره"
                  src="https://maps.google.com/maps?q=23.9028804,42.9129885&z=16&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
