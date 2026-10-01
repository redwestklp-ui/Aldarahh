import React, { useEffect } from 'react';
import { X, MapPin, ExternalLink, Clock, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface RestaurantPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantPhotoModal: React.FC<RestaurantPhotoModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-slate-950 rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {RESTAURANT_INFO.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="إغلاق الصورة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Restaurant Photo Display */}
        <div className="relative w-full bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
          <img
            src={RESTAURANT_INFO.restaurantPhoto}
            alt={RESTAURANT_INFO.name}
            className="w-full h-auto max-h-[65vh] object-contain sm:object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs text-white">
            <span className="bg-amber-500/90 text-slate-950 font-black px-3 py-1 rounded-full shadow">
              فرع محافظة عفيف
            </span>
            <span className="bg-black/70 backdrop-blur text-emerald-400 font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              مفتوح 24 ساعة
            </span>
          </div>
        </div>

        {/* Bottom Details & Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>عرض على خرائط Google</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition active:scale-95 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
