import React from 'react';
import { Utensils, CheckCircle, ShieldCheck, LogOut, Clock } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';

interface TableBannerProps {
  onOpenPINModal: (tableNo: number) => void;
}

export const TableBanner: React.FC<TableBannerProps> = ({ onOpenPINModal }) => {
  const { currentTableSession, endTableSession, orderType, setOrderType } = useRestaurant();

  if (!currentTableSession) {
    return null;
  }

  const handleEndSession = () => {
    if (window.confirm(`هل ترغب في إنهاء جلسة الطاولة رقم ${currentTableSession.tableNumber}؟`)) {
      endTableSession(currentTableSession.tableNumber);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 py-2.5 px-4 shadow-md sticky top-16 z-30 border-b border-amber-600/30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-right">
          <div className="w-7 h-7 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0">
            {currentTableSession.tableNumber}
          </div>
          <div>
            <span className="font-black text-sm">
              أنت الآن تطلب للطاولة رقم ({currentTableSession.tableNumber})
            </span>
            <span className="hidden md:inline mr-2 text-amber-950 font-bold">
              • الجلسة نشطة ومحمية برمز التحقق (PIN)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-black/10 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>صالحة لـ 120 دقيقة</span>
          </span>

          <button
            onClick={handleEndSession}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 hover:bg-stone-800 text-white font-bold transition active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-red-400" />
            <span>إنهاء الجلسة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
