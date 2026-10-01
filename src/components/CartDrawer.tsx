import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowLeft, 
  Utensils, 
  Car, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
    currentTableSession,
    minDeliveryAmount,
  } = useRestaurant();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  const isDeliveryUnderMin = orderType === 'delivery' && subtotal < minDeliveryAmount;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#1E140E]">سلة طلباتك</h3>
              <span className="text-xs text-stone-500 font-medium">
                {cart.length > 0 ? `${cart.length} أصناف في السلة` : 'السلة فارغة'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Mode Badge inside Cart */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950">طريقة الاستلام:</span>
            {orderType === 'dine_in' && (
              <span className="font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                {currentTableSession 
                  ? `داخل الصالة (طاولة ${currentTableSession.tableNumber})` 
                  : 'داخل الصالة (مسح QR الطاولة)'}
              </span>
            )}
            {orderType === 'takeaway' && (
              <span className="font-black text-red-900 bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" />
                استلام سفري
              </span>
            )}
            {orderType === 'delivery' && (
              <span className="font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Car className="w-3 h-3" />
                توصيل في عفيف
              </span>
            )}
          </div>

          {!currentTableSession && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600">
              <button
                onClick={() => setOrderType('dine_in')}
                className={`px-1.5 py-0.5 rounded ${orderType === 'dine_in' ? 'bg-amber-600 text-white' : 'hover:bg-stone-200'}`}
              >
                صالة
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`px-1.5 py-0.5 rounded ${orderType === 'takeaway' ? 'bg-red-600 text-white' : 'hover:bg-stone-200'}`}
              >
                سفري
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`px-1.5 py-0.5 rounded ${orderType === 'delivery' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-200'}`}
              >
                توصيل
              </button>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 text-stone-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-black text-lg text-stone-800 mb-1">
                سلة طلباتك فارغة حالياً
              </h4>
              <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto mb-6">
                تصفح قائمة طعامنا وأضف وجباتك المفضلة لتجهيزها لك بأسرع وقت.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                تصفح قائمة الطعام
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-2xl bg-white border border-[#E5DCCE] shadow-2xs space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-black text-sm text-[#1E140E] leading-snug">
                        {item.menuItem.name}
                      </h4>
                      {item.selectedOption && (
                        <span className="text-[11px] text-amber-800 font-bold block">
                          {item.selectedOption.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="حذف الصنف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Customizations tags */}
                {(item.selectedAddons.length > 0 || item.excludedIngredients.length > 0 || item.notes) && (
                  <div className="text-[11px] text-stone-600 space-y-0.5 bg-stone-50 p-2 rounded-lg">
                    {item.selectedAddons.length > 0 && (
                      <div className="text-emerald-700 font-bold">
                        إضافات: {item.selectedAddons.map(a => `${a.name} (+${a.price}ر)`).join('، ')}
                      </div>
                    )}
                    {item.excludedIngredients.length > 0 && (
                      <div className="text-red-600 font-medium">
                        تفضيلات: {item.excludedIngredients.join('، ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-stone-500 italic">
                        ملاحظة: "{item.notes}"
                      </div>
                    )}
                  </div>
                )}

                {/* Price & Quantity Adjuster */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-sm text-stone-900">
                    {item.totalPrice} ريال
                  </span>

                  <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-black text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Box */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    كوبون مفعل: {appliedCoupon.code} (-{discount} ريال)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    إزالة
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم (مثل: AFIF10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white focus:border-amber-500 focus:outline-none uppercase font-bold text-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 font-bold text-xs transition cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>
              )}

              {couponMsg && (
                <span className={`text-[11px] block mt-1 font-bold ${couponMsg.isError ? 'text-red-600' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1 border-t border-stone-200">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-stone-900">{subtotal} ريال</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم:</span>
                  <span>-{discount} ريال</span>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>رسوم التوصيل (داخل عفيف):</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? 'مجاناً 🎉' : `${deliveryFee} ريال`}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm sm:text-base font-black text-[#1E140E] pt-2 border-t border-stone-200">
                <span>المجموع النهائي:</span>
                <span className="text-amber-700">{total} ريال</span>
              </div>
            </div>

            {/* Minimum Delivery Warning */}
            {isDeliveryUnderMin && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>
                  الحد الأدنى لطلب التوصيل داخل عفيف هو {minDeliveryAmount} ريال (ينقصك {minDeliveryAmount - subtotal} ريال).
                </span>
              </div>
            )}

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              disabled={isDeliveryUnderMin}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-md transition active:scale-98 flex items-center justify-between cursor-pointer"
            >
              <span>متابعة إتمام الطلب</span>
              <div className="flex items-center gap-1.5">
                <span>{total} ريال</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
