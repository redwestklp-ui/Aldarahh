import React, { useState } from 'react';
import { 
  X, 
  Utensils, 
  ShoppingBag, 
  Car, 
  MapPin, 
  CreditCard, 
  Banknote, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';
import { DeliveryAddress } from '../types/index.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
  onOpenPINModal: (tableNo: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPINModal,
}) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderType,
    currentTableSession,
    submitOrder,
  } = useRestaurant();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_on_delivery' | 'online_card'>('cash');
  const [pickupTime, setPickupTime] = useState('جاهز بأسرع وقت (15-20 دقيقة)');

  // Delivery Specific
  const [district, setDistrict] = useState(RESTAURANT_INFO.deliveryDistricts[0]);
  const [street, setStreet] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [addressNotes, setAddressNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Body scroll lock and Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-validations
    if (orderType === 'dine_in') {
      if (!currentTableSession) {
        setErrorMsg('يجب التحقق من رمز PIN الخاص بالطاولة أولاً لإتمام طلب الصالة.');
        return;
      }
    } else if (orderType === 'delivery') {
      if (!customerPhone.trim()) {
        setErrorMsg('رقم الجوال مطلوب لتوصيل الطلب والتواصل مع المندوب.');
        return;
      }
      const cleanPhone = customerPhone.replace(/[\s\-\+]/g, '');
      if (cleanPhone.length < 9 || isNaN(Number(cleanPhone))) {
        setErrorMsg('يرجى إدخال رقم جوال صحيح للتوصيل (مثال: 05XXXXXXXX).');
        return;
      }
      if (!street.trim()) {
        setErrorMsg('يرجى كتابة اسم الشارع أو المعلم القريب في عفيف.');
        return;
      }
    } else if (orderType === 'takeaway') {
      if (!customerPhone.trim()) {
        setErrorMsg('يرجى إدخال رقم الجوال لتأكيد استلام الطلب من الفرع.');
        return;
      }
      const cleanPhone = customerPhone.replace(/[\s\-\+]/g, '');
      if (cleanPhone.length < 9 || isNaN(Number(cleanPhone))) {
        setErrorMsg('يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX).');
        return;
      }
    }

    setIsSubmitting(true);

    const deliveryAddress: DeliveryAddress | undefined = orderType === 'delivery' ? {
      fullName: customerName,
      phone: customerPhone,
      city: 'عفيف',
      district,
      street,
      buildingNo,
      notes: addressNotes,
    } : undefined;

    const result = await submitOrder({
      customerName,
      customerPhone,
      customerNotes,
      paymentMethod,
      pickupTime,
      deliveryAddress,
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      onSuccess(result.order.id);
      onClose();
    } else {
      setErrorMsg(result.error || 'حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة ثانية.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-black text-base sm:text-lg text-[#1E140E]">
              تأكيد وإتمام الطلب
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmOrder} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Order Mode Indicator */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                {orderType === 'dine_in' && <Utensils className="w-5 h-5" />}
                {orderType === 'takeaway' && <ShoppingBag className="w-5 h-5" />}
                {orderType === 'delivery' && <Car className="w-5 h-5" />}
              </div>

              <div>
                <span className="text-xs font-bold text-amber-900 block">طريقة الطلب المختارة:</span>
                <span className="text-sm font-black text-slate-950">
                  {orderType === 'dine_in' && (
                    currentTableSession 
                      ? `طلب داخل الصالة (الطاولة رقم ${currentTableSession.tableNumber})` 
                      : 'طلب داخل الصالة (يحتاج تحقق PIN)'
                  )}
                  {orderType === 'takeaway' && 'استلام سفري من فرع عفيف'}
                  {orderType === 'delivery' && 'توصيل لباب بيتك داخل عفيف'}
                </span>
              </div>
            </div>

            {orderType === 'dine_in' && currentTableSession && (
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                جلسة نشطة
              </span>
            )}
          </div>

          {/* Dine-In Special Verification Warning if no session */}
          {orderType === 'dine_in' && !currentTableSession && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-xs text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-sm text-red-700">
                <Lock className="w-4 h-4" />
                <span>حماية طلبات الطاولات: لا توجد جلسة طاولة نشطة</span>
              </div>
              <p className="leading-relaxed">
                لمنع التلاعب، يجب إدخال رمز التحقق السري (PIN) المكتوب على بطاقة الطاولة لبدء الجلسة وتأكيد الطلب.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPINModal(1);
                }}
                className="py-2 px-4 rounded-xl bg-red-600 text-white font-black text-xs transition hover:bg-red-700 cursor-pointer shadow-xs"
              >
                التحقق من رمز الطاولة الآن
              </button>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#1E140E] uppercase tracking-wider">
              بيانات العميل:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم الكريم: {orderType !== 'dine_in' && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  placeholder="مثال: سلطان العتيبي"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم الجوال: <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-right"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          {orderType === 'delivery' && (
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E140E] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>عنوان التوصيل (متاح داخل عفيف فقط):</span>
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  عفيف 17571
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الحي داخل عفيف: <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:border-amber-500 outline-none"
                  >
                    {RESTAURANT_INFO.deliveryDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الشارع أو المعلم القريب: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: بجوار جامع الراجحي، شارع الملك فيصل"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم البيت أو العمارة / وصف إضافي:
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: فيلا دورين، الباب الأخضر المقابل للمسجد"
                  value={buildingNo}
                  onChange={(e) => setBuildingNo(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Pickup Time Selection */}
          {orderType === 'takeaway' && (
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <label className="block text-xs font-black text-[#1E140E] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>وقت استلام الطلب من الفرع:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['جاهز بأسرع وقت (15-20 دقيقة)', 'بعد 30 دقيقة', 'بعد 45 دقيقة', 'بعد ساعة'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPickupTime(time)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      pickupTime === time
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="block text-xs font-black text-[#1E140E]">
              طريقة الدفع المفضلة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-black'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">نقداً (كاش)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card_on_delivery')}
                className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'card_on_delivery'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-black'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs">شبكة / بطاقة بالفرع</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online_card')}
                className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'online_card'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-black'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs">دفع إلكتروني (تجريبي)</span>
              </button>
            </div>
          </div>

          {/* General Order Notes */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block text-xs font-black text-[#1E140E]">
              ملاحظات عامة للشيف أو المندوب:
            </label>
            <input
              type="text"
              placeholder="مثلاً: زيادة خبز تميس، الاتصال عند الوصول..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Cost Summary Box */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>المجموع الفرعي ({cart.length} أصناف):</span>
              <span className="font-bold text-stone-900">{subtotal} ريال</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>خصم الكوبون:</span>
                <span>-{discount} ريال</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="flex justify-between">
                <span>رسوم التوصيل في عفيف:</span>
                <span className="font-bold text-stone-900">{deliveryFee === 0 ? 'مجاناً' : `${deliveryFee} ريال`}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-[#1E140E] pt-2 border-t border-stone-200">
              <span>المبلغ المستحق للدفع:</span>
              <span className="text-amber-800">{total} ريال</span>
            </div>
          </div>

          {/* Confirm Button (Protected against double submit) */}
          <button
            type="submit"
            disabled={isSubmitting || (orderType === 'dine_in' && !currentTableSession)}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base shadow-lg transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'جاري التحقق وتأكيد الطلب...' : `تأكيد وإرسال الطلب (${total} ريال)`}</span>
          </button>

        </form>
      </div>
    </div>
  );
};
