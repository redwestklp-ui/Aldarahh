import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, Clock, Utensils, ShoppingBag, Car, ArrowLeft, Eye, X } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../data/restaurantData.ts';

interface OrderSuccessModalProps {
  orderId: string | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderId,
  onClose,
  onTrackOrder,
}) => {
  const { getOrderById } = useRestaurant();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && orderId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderId, onClose]);

  if (!orderId) return null;

  const order = getOrderById(orderId);
  if (!order) return null;

  // Build WhatsApp share confirmation text
  const whatsappMsg = encodeURIComponent(
    `السلام عليكم فوال وشعبيات شعاع الدره،
قمت بإرسال طلب جديد عبر الموقع:
*رقم الطلب: #${order.orderNumber}*
طريقة الطلب: ${order.orderType === 'dine_in' ? `داخل الصالة (طاولة ${order.tableNumber})` : order.orderType === 'takeaway' ? 'استلام سفري' : 'توصيل في عفيف'}
إجمالي المبلغ: ${order.total} ريال
الاسم: ${order.customerName}`
  );

  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Success Badge */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-[#1E140E] mb-1">
          تم استلام طلبك بنجاح! 🎉
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mb-6 font-medium">
          شكراً لاختيارك فوال وشعبيات شعاع الدره، طاقم الشيف بدأ بتجهيز أطباقك الآن.
        </p>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-right space-y-2 mb-6 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="font-bold text-stone-500">رقم الطلب:</span>
            <span className="font-mono font-black text-base text-amber-900 bg-amber-100 px-3 py-0.5 rounded-lg">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-stone-500">نوع الطلب:</span>
            <span className="font-black text-stone-900">
              {order.orderType === 'dine_in' && `داخل الصالة (طاولة ${order.tableNumber})`}
              {order.orderType === 'takeaway' && `استلام سفري (${order.pickupTime || 'بأسرع وقت'})`}
              {order.orderType === 'delivery' && `توصيل لعفيف (${order.deliveryAddress?.district || ''})`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-stone-500">الوقت التقديري:</span>
            <span className="font-black text-emerald-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {order.estimatedMinutes} دقيقة تقريباً
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
            <span className="font-bold text-stone-500">إجمالي الحساب:</span>
            <span className="font-black text-base text-[#1E140E]">
              {order.total} ريال ({order.paymentMethod === 'cash' ? 'نقداً عند الاستلام' : 'شبكة/بطاقة'})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>تتبع حالة الطلب والتحضير</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xs transition active:scale-98 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>إشعار المطعم عبر واتساب للطلب #{order.orderNumber}</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            العودة للقائمة
          </button>
        </div>

      </div>
    </div>
  );
};
