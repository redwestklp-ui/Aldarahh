import React, { useState } from 'react';
import { Utensils, ShoppingBag, Car, QrCode, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';

interface OrderModeCardsProps {
  onOpenPINModal: (tableNo: number) => void;
  onTableGuideClick: () => void;
}

export const OrderModeCards: React.FC<OrderModeCardsProps> = ({
  onOpenPINModal,
  onTableGuideClick,
}) => {
  const { 
    orderType, 
    setOrderType, 
    currentTableSession, 
    tables, 
    activateTableSession, 
    settings 
  } = useRestaurant();
  const [showTablePicker, setShowTablePicker] = useState(false);

  const isDineInActive = settings.orderChannels?.dineIn !== false;
  const isTakeawayActive = settings.orderChannels?.takeaway !== false;
  const isDeliveryActive = settings.orderChannels?.delivery !== false;

  const handleDineInClick = () => {
    if (!isDineInActive) return;
    if (currentTableSession) {
      setOrderType('dine_in');
      const menuEl = document.getElementById('menu');
      menuEl?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowTablePicker(true);
    }
  };

  const handleSelectTableDirect = (tableNumber: number) => {
    activateTableSession(tableNumber);
    setShowTablePicker(false);
    const menuEl = document.getElementById('menu');
    menuEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTakeawayClick = () => {
    if (!isTakeawayActive) return;
    setOrderType('takeaway');
    const menuEl = document.getElementById('menu');
    menuEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeliveryClick = () => {
    if (!isDeliveryActive) return;
    setOrderType('delivery');
    const menuEl = document.getElementById('menu');
    menuEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="order-type" className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-20 mb-12">
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#E5DCCE] shadow-xl shadow-amber-950/5">
        
        {/* Emergency or Closed Banners */}
        {settings.emergencyPauseOrders && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 text-xs font-bold flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
            <div>
              <span className="font-black text-red-700 block">تنبيه من إدارة المطعم:</span>
              <span className="text-red-800">{settings.emergencyMessage || 'الطلبات متوقفة مؤقتاً لأعمال الصيانة والتجهيز'}</span>
            </div>
          </div>
        )}
        {!settings.isRestaurantOpen && !settings.emergencyPauseOrders && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
            <div>
              <span className="font-black text-amber-800 block">المطعم مغلق حالياً:</span>
              <span>يمكنك تصفح قائمة الطعام وسنعاود استقبال الطلبات في أوقات العمل الرسمية.</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider inline-block mb-2">
            منظومة طلبات متكاملة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E140E]">
            كيف تفضل استلام وجبتك اليوم؟
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            اختر طريقة الطلب المناسبة واستمتع بأشهى أكلات شعاع الدره
          </p>
        </div>

        {/* 3 Distinct Order Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          
          {/* 1. Dine-In Card */}
          <div
            onClick={handleDineInClick}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between group ${
              !isDineInActive 
                ? 'opacity-60 cursor-not-allowed bg-stone-100 border-stone-200'
                : orderType === 'dine_in'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20 cursor-pointer'
                  : 'bg-[#FAF8F5] border-[#E8E0D5] hover:border-amber-400 hover:bg-white cursor-pointer'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  orderType === 'dine_in' ? 'bg-amber-500 text-slate-950' : 'bg-white border border-[#E5DCCE] text-amber-700'
                }`}>
                  <Utensils className="w-7 h-7" />
                </div>

                {!isDineInActive ? (
                  <span className="text-[11px] font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-md">
                    معطل حالياً
                  </span>
                ) : currentTableSession ? (
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    طاولة {currentTableSession.tableNumber} نشطة
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    مسح QR الطاولة
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-[#1E140E] mb-1">
                طلب داخل الصالة
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4">
                اجلس على طاولتك واطلب مباشرة عبر هاتفك دون الحاجة للوقوف عند الكاشير.
              </p>
            </div>

            <button
              type="button"
              disabled={!isDineInActive}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs ${
                !isDineInActive
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                  : 'bg-[#1E140E] group-hover:bg-amber-600 text-white cursor-pointer'
              }`}
            >
              <span>{!isDineInActive ? 'الخدمة معطلة مؤقتاً' : currentTableSession ? 'متابعة طلب الطاولة' : 'ابدأ طلب الطاولة'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Takeaway Card */}
          <div
            onClick={handleTakeawayClick}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between group ${
              !isTakeawayActive
                ? 'opacity-60 cursor-not-allowed bg-stone-100 border-stone-200'
                : orderType === 'takeaway'
                  ? 'bg-red-500/10 border-red-600 shadow-md ring-2 ring-red-500/20 cursor-pointer'
                  : 'bg-[#FAF8F5] border-[#E8E0D5] hover:border-red-400 hover:bg-white cursor-pointer'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  orderType === 'takeaway' ? 'bg-red-600 text-white' : 'bg-white border border-[#E5DCCE] text-red-600'
                }`}>
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded-md">
                  {!isTakeawayActive ? 'معطل حالياً' : 'جاهز في 15 دقيقة'}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#1E140E] mb-1">
                استلام سفري
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4">
                اطلب وجبتك مسبقاً واستلمها ساخنة وطازجة من الفرع بدون أي تأخير أو انتظار.
              </p>
            </div>

            <button
              type="button"
              disabled={!isTakeawayActive}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs ${
                !isTakeawayActive
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                  : 'bg-red-600 group-hover:bg-red-700 text-white cursor-pointer'
              }`}
            >
              <span>{!isTakeawayActive ? 'الخدمة معطلة مؤقتاً' : 'اطلب للاستلام'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Delivery Card */}
          <div
            onClick={handleDeliveryClick}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between group ${
              !isDeliveryActive
                ? 'opacity-60 cursor-not-allowed bg-stone-100 border-stone-200'
                : orderType === 'delivery'
                  ? 'bg-emerald-500/10 border-emerald-600 shadow-md ring-2 ring-emerald-500/20 cursor-pointer'
                  : 'bg-[#FAF8F5] border-[#E8E0D5] hover:border-emerald-400 hover:bg-white cursor-pointer'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  orderType === 'delivery' ? 'bg-emerald-600 text-white' : 'bg-white border border-[#E5DCCE] text-emerald-600'
                }`}>
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {!isDeliveryActive ? 'معطل حالياً' : 'عفيف فقط (30 دقيقة)'}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#1E140E] mb-1">
                توصيل في عفيف
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4">
                نوصل طلباتك إلى باب البيت أو العمل في جميع أحياء عفيف ساخنة وبأسرع وقت.
              </p>
            </div>

            <button
              type="button"
              disabled={!isDeliveryActive}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs ${
                !isDeliveryActive
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                  : 'bg-emerald-600 group-hover:bg-emerald-700 text-white cursor-pointer'
              }`}
            >
              <span>{!isDeliveryActive ? 'الخدمة معطلة مؤقتاً' : 'اطلب توصيل'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Anti-Tamper Table Selector Dialog (Shown when clicking Dine-in without active session) */}
        {showTablePicker && (
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 mb-1">
                  <Utensils className="w-4 h-4 text-amber-700" />
                  <span>طلب مباشر من داخل المطعم (استغنِ عن المنيو الورقي)</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  أنت جالس على كرسيك؟ اضغط على رقم طاولتك أدناه وسينقلك الموقع مباشرة لاختيار وجبتك وطلبها:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTablePicker(false)}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {/* Quick Table Buttons (Simulating scanning table QR) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {tables.map((tbl) => (
                <button
                  key={tbl.id}
                  onClick={() => handleSelectTableDirect(tbl.tableNumber)}
                  className="py-3 px-3 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-600 hover:bg-amber-500 text-stone-800 hover:text-slate-950 font-black text-xs transition active:scale-95 flex flex-col items-center gap-0.5 shadow-sm cursor-pointer group"
                >
                  <span className="text-[10px] text-stone-500 group-hover:text-slate-900 font-bold">طاولة</span>
                  <span className="text-base font-black text-amber-950 group-hover:text-slate-950">#{tbl.tableNumber}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs text-stone-600">
              <span className="font-medium text-[11px]">
                💡 عند تأكيد الطلب، سيصل الشيف رقم طاولتك بدقة متناهية.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowTablePicker(false);
                  onOpenPINModal(1);
                }}
                className="text-[11px] font-bold text-amber-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>التحقق عبر رمز PIN</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
