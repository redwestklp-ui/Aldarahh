import React from 'react';
import { X, Printer, QrCode, ShieldCheck, Lock } from 'lucide-react';
import { Table } from '../types/index.ts';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface PrintableTableCardModalProps {
  table: Table | null;
  onClose: () => void;
}

export const PrintableTableCardModal: React.FC<PrintableTableCardModalProps> = ({
  table,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && table) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [table, onClose]);

  if (!table) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/40 p-6 sm:p-8 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Card Area */}
        <div id="printable-card" className="w-full space-y-4">
          
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1E140E] text-amber-400 flex items-center justify-center font-black text-xl mb-1.5 shadow-sm">
              شع
            </div>
            <h3 className="font-black text-lg text-[#1E140E]">
              {RESTAURANT_INFO.name}
            </h3>
            <span className="text-[11px] text-amber-800 font-bold">
              {RESTAURANT_INFO.shortAddress}
            </span>
          </div>

          {/* Table Number Highlight */}
          <div className="py-2 px-6 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl shadow-md inline-block">
            طاولة رقم {table.tableNumber}
          </div>

          {/* QR Code SVG */}
          <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 shadow-inner max-w-xs mx-auto">
            <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#1E140E" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#D97706" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#1E140E" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#D97706" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#1E140E" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#D97706" />

              <rect x="36" y="8" width="6" height="6" fill="#1E140E" />
              <rect x="46" y="8" width="6" height="6" fill="#D97706" />
              <rect x="56" y="8" width="6" height="6" fill="#1E140E" />

              <rect x="36" y="18" width="6" height="6" fill="#D97706" />
              <rect x="46" y="24" width="6" height="6" fill="#1E140E" />
              <rect x="56" y="18" width="6" height="6" fill="#D97706" />

              <rect x="10" y="38" width="6" height="6" fill="#1E140E" />
              <rect x="20" y="44" width="6" height="6" fill="#D97706" />
              <rect x="36" y="36" width="28" height="28" rx="6" fill="#FAF7F2" stroke="#D97706" strokeWidth="2" />
              <circle cx="50" cy="50" r="8" fill="#1E140E" />

              <rect x="70" y="38" width="6" height="6" fill="#1E140E" />
              <rect x="80" y="44" width="6" height="6" fill="#1E140E" />
              <rect x="70" y="54" width="6" height="6" fill="#D97706" />

              <rect x="36" y="72" width="6" height="6" fill="#1E140E" />
              <rect x="46" y="78" width="6" height="6" fill="#D97706" />
              <rect x="56" y="72" width="6" height="6" fill="#1E140E" />
              <rect x="72" y="76" width="14" height="14" rx="2" fill="#D97706" />
            </svg>

            <span className="text-[10px] text-stone-500 font-mono block mt-1">
              shuaa-durrah.sa/table/{table.tableNumber}
            </span>
          </div>

          {/* Secret PIN Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-400 space-y-1">
            <span className="text-xs font-bold text-amber-900 block flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              رمز التحقق السري الخاص بالطاولة (PIN):
            </span>
            <div className="font-mono text-2xl font-black text-amber-950 tracking-widest">
              {table.currentPin}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-right text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="font-bold text-[#1E140E]">خطوات الطلب من طاولتك:</div>
            <div>1. وجّه كاميرا جوالك نحو رمز QR لبدء الطلب.</div>
            <div>2. أدخل رمز التحقق PIN الظاهر أمامك ({table.currentPin}).</div>
            <div>3. اختر وجباتك وتصلك طازجة إلى طاولتك مباشرة!</div>
          </div>

        </div>

        {/* Print Button */}
        <div className="mt-5 w-full flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 font-black text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة بطاقة الطاولة (Print Tent)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
