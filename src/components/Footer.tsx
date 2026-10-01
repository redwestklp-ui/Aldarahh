import React from 'react';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface FooterProps {
  onOpenPhotoModal: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPhotoModal, onOpenAdmin }) => {
  return (
    <footer className="bg-[#140E0B] text-stone-300 pt-12 pb-24 lg:pb-12 border-t border-amber-950/40">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenPhotoModal}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm shrink-0 bg-stone-900 hover:scale-105 transition cursor-pointer"
                title="معاينة صورة المطعم"
              >
                <img
                  src={RESTAURANT_INFO.restaurantPhoto}
                  alt={RESTAURANT_INFO.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <div>
                <h3 className="text-lg font-black text-white">
                  {RESTAURANT_INFO.name}
                </h3>
                <p className="text-xs text-amber-400 font-bold">
                  {RESTAURANT_INFO.shortAddress}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm font-normal">
              وجهتكم الأولى في محافظة عفيف لألذ وجبات الفطور الشعبي، الشاورما المحمصة، المشويات، وطبخ سمك التنور الأصيل على مدار 24 ساعة.
            </p>

            <div className="pt-1 text-xs text-emerald-400 font-bold">
              <span>محافظة عفيف • المملكة العربية السعودية</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              أقسام الموقع
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <a href="#order-type" className="hover:text-amber-400 transition-colors">
                  طريقة الطلب (صالة / سفري / توصيل)
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  قائمة الطعام والمأكولات
                </a>
              </li>
              <li>
                <a href="#tannour" className="hover:text-amber-400 transition-colors">
                  طبخ سمك تنور طازج
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  خدمات تناول الطعام
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  آراء زوار المطعم
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  الموقع وساعات العمل
                </a>
              </li>
              {onOpenAdmin && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAdmin}
                    className="text-stone-400 hover:text-amber-400 transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔐 بوابة الإدارة ولوحة التحكم</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              تواصل معنا
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>

              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{RESTAURANT_INFO.hours}</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={RESTAURANT_INFO.phoneCallUrl}
                  className="font-mono hover:text-white transition font-bold"
                  dir="ltr"
                >
                  {RESTAURANT_INFO.displayPhone}
                </a>
              </li>

              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={RESTAURANT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition font-bold"
                >
                  تواصل عبر واتساب مباشر
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div>جميع الحقوق محفوظة © فوال وشعبيات شعاع الدره</div>
          <div className="text-[11px] text-amber-400/80 font-bold">
            <span>خدمة مستمرة 24 ساعة يومياً في عفيف</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
