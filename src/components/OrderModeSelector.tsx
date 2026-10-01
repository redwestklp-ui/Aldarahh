import React from 'react';
import { Utensils, ShoppingBag, Car, MapPin } from 'lucide-react';
import { OrderType } from '../types/index.ts';

interface OrderModeSelectorProps {
  orderType: OrderType;
  tableNumber: string;
  onOrderTypeChange: (type: OrderType) => void;
  onTableNumberChange: (table: string) => void;
}

export const OrderModeSelector: React.FC<OrderModeSelectorProps> = ({
  orderType,
  tableNumber,
  onOrderTypeChange,
  onTableNumberChange,
}) => {
  return (
    <div id="order-type" className="max-w-4xl mx-auto px-4 -mt-5 sm:-mt-7 relative z-20">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#E5DCCE] shadow-lg shadow-amber-950/5">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-100">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#1E140E] flex items-center gap-1.5">
              <span>📍 حدد موقع طلبك الآن:</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                منيو إلكتروني ذكي
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
              جالس في الصالة على الطاولة، أو تبغى استلام سفري سريع، أو توصيل لباب بيتك؟
            </p>
          </div>
        </div>

        {/* 3 Order Modes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          
          {/* Mode 1: Dine-in Table */}
          <button
            type="button"
            onClick={() => onOrderTypeChange('dine_in')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center sm:flex-col justify-start sm:justify-center text-right sm:text-center gap-2.5 cursor-pointer ${
              orderType === 'dine_in'
                ? 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              orderType === 'dine_in' ? 'bg-amber-500 text-slate-950' : 'bg-white text-stone-600'
            }`}>
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block">طلب داخل الصالة (طاولة)</span>
              <span className="text-[10px] text-stone-500 block">اطلب مباشرة وأنت جالس</span>
            </div>
          </button>

          {/* Mode 2: Takeaway */}
          <button
            type="button"
            onClick={() => onOrderTypeChange('takeaway')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center sm:flex-col justify-start sm:justify-center text-right sm:text-center gap-2.5 cursor-pointer ${
              orderType === 'takeaway'
                ? 'bg-red-500/10 border-red-600 text-red-950 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              orderType === 'takeaway' ? 'bg-red-600 text-white' : 'bg-white text-stone-600'
            }`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block">استلام سفري (من الفرع)</span>
              <span className="text-[10px] text-stone-500 block">جهّز طلبك واستلمه ساخناً</span>
            </div>
          </button>

          {/* Mode 3: Delivery */}
          <button
            type="button"
            onClick={() => onOrderTypeChange('delivery')}
            className={`p-3 rounded-xl border-2 transition-all flex items-center sm:flex-col justify-start sm:justify-center text-right sm:text-center gap-2.5 cursor-pointer ${
              orderType === 'delivery'
                ? 'bg-emerald-500/10 border-emerald-600 text-emerald-950 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              orderType === 'delivery' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600'
            }`}>
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block">توصيل لموقعك في عفيف</span>
              <span className="text-[10px] text-stone-500 block">يوصلك لباب البيت أو العمل</span>
            </div>
          </button>

        </div>

        {/* Dynamic Input for Table Number if Dine-in */}
        {orderType === 'dine_in' && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-amber-50/70 p-3 rounded-xl">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span>🔢 رقم طاولتك المسجل على الطاولة:</span>
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="مثلاً: طاولة 5"
                value={tableNumber}
                onChange={(e) => onTableNumberChange(e.target.value)}
                className="w-full sm:w-44 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
              />
              <span className="text-[11px] text-amber-800 font-bold shrink-0">
                (ستضاف تلقائياً للطلب)
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
