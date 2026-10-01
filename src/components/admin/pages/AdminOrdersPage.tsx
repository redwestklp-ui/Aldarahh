import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Printer, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Utensils, 
  Car, 
  Eye,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Check
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { Order, OrderStatus, OrderType } from '../../../types/index.ts';

interface AdminOrdersPageProps {
  selectedOrderId?: string | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  selectedOrderId,
  onClearSelectedOrder,
}) => {
  const { orders, updateOrderStatus, cancelOrder, getOrderById } = useRestaurant();

  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(() => {
    return selectedOrderId ? getOrderById(selectedOrderId) || null : null;
  });

  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('نفاد كمية الصنف / طلب الزبون');

  // Synchronize when selectedOrderId changes from parent / search
  React.useEffect(() => {
    if (selectedOrderId) {
      const found = getOrderById(selectedOrderId);
      if (found) {
        setViewingOrder(found);
      }
    }
  }, [selectedOrderId, getOrderById]);

  // Handle Escape key to close modal/drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cancelModalOrderId) {
          setCancelModalOrderId(null);
        } else if (viewingOrder) {
          setViewingOrder(null);
          if (onClearSelectedOrder) onClearSelectedOrder();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelModalOrderId, viewingOrder, onClearSelectedOrder]);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = activeStatusTab === 'all' || o.status === activeStatusTab;
    const matchesType = activeTypeFilter === 'all' || o.orderType === activeTypeFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toString().includes(searchQuery) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesType && matchesSearch;
  });

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'الكل', count: orders.length },
    { id: 'pending', label: 'جديد', count: orders.filter((o) => o.status === 'pending').length },
    { id: 'confirmed', label: 'مؤكد', count: orders.filter((o) => o.status === 'confirmed').length },
    { id: 'preparing', label: 'قيد التجهيز', count: orders.filter((o) => o.status === 'preparing').length },
    { id: 'ready', label: 'جاهز للاستلام', count: orders.filter((o) => o.status === 'ready').length },
    { id: 'out_for_delivery', label: 'مع المندوب', count: orders.filter((o) => o.status === 'out_for_delivery').length },
    { id: 'completed', label: 'مكتمل', count: orders.filter((o) => o.status === 'completed').length },
    { id: 'cancelled', label: 'ملغي', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  const handleExecuteCancel = () => {
    if (cancelModalOrderId) {
      cancelOrder(cancelModalOrderId, cancelReason);
      if (viewingOrder?.id === cancelModalOrderId) {
        setViewingOrder(getOrderById(cancelModalOrderId) || null);
      }
      setCancelModalOrderId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black px-2.5 py-1 rounded-lg text-xs">جديد بانتظار التأكيد</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-1 rounded-lg text-xs">مؤكد بالمطعم</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2.5 py-1 rounded-lg text-xs">جاري الطهي والتجهيز</span>;
      case 'ready':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded-lg text-xs">جاهز للاستلام</span>;
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2.5 py-1 rounded-lg text-xs">في الطريق مع المندوب</span>;
      case 'completed':
        return <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-1 rounded-lg text-xs">تم التسليم بنجاح</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-lg text-xs">ملغي</span>;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            إدارة ومعالجة الطلبات
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تحديث حالات الطلبات، التواصل مع العملاء، ومتابعة طاقم المطبخ والتوصيل
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Order Type Filter */}
          <select
            value={activeTypeFilter}
            onChange={(e) => setActiveTypeFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 outline-none"
          >
            <option value="all">جميع القنوات (صالة، سفري، توصيل)</option>
            <option value="dine_in">طلبات الصالة (طاولات QR)</option>
            <option value="takeaway">استلام سفري</option>
            <option value="delivery">توصيل عفيف</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = activeStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#1A120D] text-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-[#E2D7C7]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الجوال..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm font-bold py-2.5 pr-10 pl-4 rounded-xl bg-white border border-[#DFD6C7] focus:border-amber-500 outline-none shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2D7C7] p-8 max-w-md mx-auto shadow-xs">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h4 className="text-base font-black text-stone-800 mb-1">
            لا توجد طلبات مطابقة
          </h4>
          <p className="text-xs text-stone-500 font-medium">
            جرب تغيير الفلتر أو البحث بكلمات أخرى.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2D7C7] text-stone-600 font-black">
                <tr>
                  <th className="p-3.5 pr-5">رقم الطلب</th>
                  <th className="p-3.5">العميل</th>
                  <th className="p-3.5">القناة / النوع</th>
                  <th className="p-3.5">الأصناف</th>
                  <th className="p-3.5">الإجمالي</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">الوقت</th>
                  <th className="p-3.5 pl-5 text-left">إجراء سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-500/5 transition">
                    <td className="p-3.5 pr-5 font-mono font-black text-amber-950">
                      #{ord.orderNumber}
                    </td>
                    <td className="p-3.5 font-bold text-stone-900">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{ord.customerPhone}</div>
                    </td>
                    <td className="p-3.5 font-medium text-stone-700">
                      {ord.orderType === 'dine_in' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-bold">
                          <Utensils className="w-3 h-3 text-amber-700" />
                          طاولة #{ord.tableNumber}
                        </span>
                      )}
                      {ord.orderType === 'takeaway' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 px-2 py-0.5 rounded font-bold">
                          <ShoppingBag className="w-3 h-3 text-red-600" />
                          سفري
                        </span>
                      )}
                      {ord.orderType === 'delivery' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          <Car className="w-3 h-3 text-emerald-600" />
                          توصيل ({ord.deliveryAddress?.district || 'عفيف'})
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-stone-600">
                      <span className="font-bold text-stone-900">{ord.items.length} أصناف: </span>
                      <span className="text-[11px] text-stone-500">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join('، ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-amber-900">
                      {ord.total} ريال
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="p-3.5 text-stone-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 pl-5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition active:scale-95 cursor-pointer"
                          >
                            تأكيد
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition active:scale-95 cursor-pointer"
                          >
                            تجهيز
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, ord.orderType === 'delivery' ? 'out_for_delivery' : 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition active:scale-95 cursor-pointer"
                          >
                            {ord.orderType === 'delivery' ? 'إرسال للمندوب' : 'جاهز'}
                          </button>
                        )}
                        {(ord.status === 'ready' || ord.status === 'out_for_delivery') && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition active:scale-95 cursor-pointer"
                          >
                            إكمال
                          </button>
                        )}
                        <button
                          onClick={() => setViewingOrder(ord)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                          title="عرض التفاصيل الكاملة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="lg:hidden divide-y divide-stone-100">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-950 text-sm">
                      #{ord.orderNumber}
                    </span>
                    <span className="font-bold text-stone-900 text-xs">
                      {ord.customerName}
                    </span>
                  </div>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">القناة:</span>
                    <span className="font-bold text-stone-800">
                      {ord.orderType === 'dine_in' && `طاولة #${ord.tableNumber}`}
                      {ord.orderType === 'takeaway' && 'استلام سفري'}
                      {ord.orderType === 'delivery' && `توصيل (${ord.deliveryAddress?.district || 'عفيف'})`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">المبلغ:</span>
                    <span className="font-black text-amber-900 text-sm">{ord.total} ريال</span>
                  </div>
                  <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100 line-clamp-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join('، ')}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => setViewingOrder(ord)}
                    className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>التفاصيل</span>
                  </button>

                  {ord.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black"
                    >
                      تأكيد الطلب
                    </button>
                  )}
                  {ord.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing')}
                      className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-black"
                    >
                      بدء التجهيز
                    </button>
                  )}
                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, ord.orderType === 'delivery' ? 'out_for_delivery' : 'ready')}
                      className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
                    >
                      {ord.orderType === 'delivery' ? 'مع المندوب' : 'جاهز'}
                    </button>
                  )}
                  {(ord.status === 'ready' || ord.status === 'out_for_delivery') && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'completed')}
                      className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-black"
                    >
                      إكمال الطلب
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {viewingOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setViewingOrder(null)}
        >
          <div 
            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-lg text-amber-950 bg-amber-100 px-3 py-1 rounded-xl">
                  #{viewingOrder.orderNumber}
                </span>
                <div>
                  <h3 className="font-black text-base text-[#1A120D]">تفاصيل الطلب الكاملة</h3>
                  <span className="text-[11px] text-stone-500">
                    {new Date(viewingOrder.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs no-scrollbar">
              
              {/* Status and Action banner */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[11px] mb-1">الحالة التشغيلية الحالية:</span>
                  {getStatusBadge(viewingOrder.status)}
                </div>
                <div className="flex items-center gap-1.5">
                  {viewingOrder.status !== 'completed' && viewingOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => setCancelModalOrderId(viewingOrder.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-bold transition"
                    >
                      إلغاء الطلب
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl border border-stone-200 space-y-2.5 bg-white">
                <div className="font-black text-xs text-stone-900 border-b border-stone-100 pb-2">
                  بيانات العميل والاستلام
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px]">الاسم:</span>
                    <span className="font-bold">{viewingOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">الجوال:</span>
                    <a href={`tel:${viewingOrder.customerPhone}`} className="font-bold text-amber-800 hover:underline">
                      {viewingOrder.customerPhone}
                    </a>
                  </div>
                </div>

                {viewingOrder.orderType === 'dine_in' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-950 font-bold flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <span>طلب داخل الصالة على الطاولة رقم ({viewingOrder.tableNumber})</span>
                  </div>
                )}

                {viewingOrder.orderType === 'delivery' && viewingOrder.deliveryAddress && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>عنوان التوصيل: {viewingOrder.deliveryAddress.district} - {viewingOrder.deliveryAddress.street}</span>
                    </div>
                    {viewingOrder.deliveryAddress.notes && (
                      <div className="text-[11px] text-stone-600">
                        ملاحظات العنوان: {viewingOrder.deliveryAddress.notes}
                      </div>
                    )}
                  </div>
                )}

                {viewingOrder.customerNotes && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">ملاحظات العميل الخاصة:</span>
                    <span className="font-bold text-stone-800">{viewingOrder.customerNotes}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="font-black text-xs text-stone-900">
                  الوجبات والأطباق المطلوبة ({viewingOrder.items.length})
                </div>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <span className="font-black text-stone-900 text-sm">{item.name}</span>
                        </div>
                        {item.optionName && (
                          <div className="text-[11px] text-amber-800 font-bold mr-7">
                            الحجم/النوع: {item.optionName}
                          </div>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <div className="text-[11px] text-stone-500 mr-7">
                            إضافات: {item.addons.join('، ')}
                          </div>
                        )}
                        {item.excluded && item.excluded.length > 0 && (
                          <div className="text-[11px] text-red-600 mr-7">
                            بدون: {item.excluded.join('، ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-stone-900 text-sm">{item.totalPrice} ريال</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">المجموع الفرعي:</span>
                  <span className="font-bold text-stone-800">{viewingOrder.subtotal} ريال</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>خصم مطبق:</span>
                    <span>-{viewingOrder.discount} ريال</span>
                  </div>
                )}
                {viewingOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">رسوم التوصيل:</span>
                    <span className="font-bold text-stone-800">{viewingOrder.deliveryFee} ريال</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base text-[#1A120D] pt-2 border-t border-stone-200">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-amber-800">{viewingOrder.total} ريال</span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  طريقة الدفع: {viewingOrder.paymentMethod === 'cash' ? 'نقداً' : 'شبكة/بطاقة'} ({viewingOrder.paymentStatus === 'paid' ? 'مدفوع ✓' : 'غير مدفوع بعد'})
                </div>
              </div>

              {/* Order Timeline */}
              {viewingOrder.timeline && viewingOrder.timeline.length > 0 && (
                <div className="space-y-2">
                  <div className="font-black text-xs text-stone-900">سجل التتبع والمراحل</div>
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-white space-y-3">
                    {viewingOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-stone-900">{event.note || event.status}</span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(event.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {event.by && (
                            <span className="text-[10px] text-stone-500">بواسطة: {event.by}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
              <a
                href={`https://wa.me/${viewingOrder.customerPhone.replace(/[\s\-\+]/g, '')}?text=${encodeURIComponent(
                  `السلام عليكم يا ${viewingOrder.customerName}، بخصوص طلبك #${viewingOrder.orderNumber} من فوال وشعبيات شعاع الدره:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب العميل</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-black text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>تأكيد إلغاء الطلب</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ سيتم حفظ الإلغاء في السجل وإبلاغ العميل.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">سبب الإلغاء:</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                تراجع
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
