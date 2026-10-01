import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, ChefHat, Truck, Check, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { Order, OrderStatus } from '../types/index.ts';

interface OrderTrackingModalProps {
  isOpen: boolean;
  initialOrderId?: string;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  initialOrderId,
  onClose,
}) => {
  const { getOrderById, orders } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(() => {
    return initialOrderId ? getOrderById(initialOrderId) : orders[0];
  });

  // Synchronize when initialOrderId or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setSearchQuery(initialOrderId);
        setSearchedOrder(getOrderById(initialOrderId));
      } else if (orders.length > 0) {
        setSearchedOrder(orders[0]);
      }
    }
  }, [isOpen, initialOrderId, orders, getOrderById]);

  // Handle Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getOrderById(searchQuery);
    setSearchedOrder(found);
  };

  const steps: { key: OrderStatus[]; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed'],
      title: 'تم استلام الطلب',
      desc: 'تم تسجيل طلبك بالنظام وبانتظار بدء التحضير',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      key: ['preparing', 'ready', 'out_for_delivery', 'completed'],
      title: 'جاري تحضير الأطباق',
      desc: 'يقوم الشيف الآن بطهي وشواء وجبتك طازجة',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      key: ['ready', 'out_for_delivery', 'completed'],
      title: searchedOrder?.orderType === 'delivery' ? 'خرج مع المندوب للتوصيل' : 'الطلب جاهز للاستلام',
      desc: searchedOrder?.orderType === 'delivery' ? 'المندوب في طريقه لعنوانك بعفيف' : 'وجبتك جاهزة وساخنة بانتظارك',
      icon: <Truck className="w-5 h-5" />,
    },
    {
      key: ['completed'],
      title: 'تم التسليم بنجاح',
      desc: 'بالعافية والشفاء ونرحب بك دائماً',
      icon: <Check className="w-5 h-5" />,
    },
  ];

  const getStepStatus = (stepKeys: OrderStatus[]) => {
    if (!searchedOrder) return 'upcoming';
    if (searchedOrder.status === 'cancelled') return 'cancelled';
    return stepKeys.includes(searchedOrder.status) ? 'current' : 'upcoming';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#1E140E]">
                تتبع مسار طلبك مباشرة
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                تابع حالة طلبك لحظة بلحظة حتى وصوله
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="ابحث برقم الطلب (مثال: 1048 أو ORD-1048)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none text-right"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#1E140E] hover:bg-stone-800 text-amber-400 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </form>

          {searchedOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 block">رقم الطلب:</span>
                  <span className="text-lg font-black text-[#1E140E]">
                    #{searchedOrder.orderNumber}
                  </span>
                  <span className="text-xs text-stone-600 block mt-0.5">
                    {searchedOrder.orderType === 'dine_in' && `داخل الصالة - طاولة ${searchedOrder.tableNumber}`}
                    {searchedOrder.orderType === 'takeaway' && 'استلام سفري من الفرع'}
                    {searchedOrder.orderType === 'delivery' && `توصيل في عفيف (${searchedOrder.deliveryAddress?.district || ''})`}
                  </span>
                </div>

                <div className="text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                    searchedOrder.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : searchedOrder.status === 'cancelled'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {searchedOrder.status === 'pending' && 'قيد المراجعة'}
                    {searchedOrder.status === 'confirmed' && 'تم التأكيد'}
                    {searchedOrder.status === 'preparing' && 'جاري التحضير'}
                    {searchedOrder.status === 'ready' && 'جاهز للاستلام'}
                    {searchedOrder.status === 'out_for_delivery' && 'خرج للتوصيل'}
                    {searchedOrder.status === 'completed' && 'مكتمل ومسلّم'}
                    {searchedOrder.status === 'cancelled' && 'ملغي'}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    وقت الطلب: {searchedOrder.createdAt}
                  </span>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4 px-2">
                {steps.map((step, idx) => {
                  const isDone = step.key.includes(searchedOrder.status) && searchedOrder.status !== 'cancelled';
                  return (
                    <div key={idx} className="flex items-start gap-3.5 relative">
                      {/* Connecting Line */}
                      {idx < steps.length - 1 && (
                        <div className={`absolute top-8 right-4 w-0.5 h-10 ${
                          isDone ? 'bg-emerald-500' : 'bg-stone-200'
                        }`} />
                      )}

                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isDone 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}>
                        {step.icon}
                      </div>

                      {/* Details */}
                      <div>
                        <h4 className={`text-xs sm:text-sm font-black ${isDone ? 'text-[#1E140E]' : 'text-stone-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Items in order */}
              <div className="pt-3 border-t border-stone-200">
                <h5 className="text-xs font-black text-stone-800 mb-2">الأصناف المطلوبة:</h5>
                <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.quantity}× {item.name} {item.optionName ? `(${item.optionName})` : ''}</span>
                      <span className="font-bold">{item.totalPrice} ريال</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-[#1E140E]">
                    <span>الإجمالي:</span>
                    <span>{searchedOrder.total} ريال</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-600">
                لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من الرقم والمحاولة مرة أخرى.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
