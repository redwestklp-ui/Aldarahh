import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Utensils, 
  Car, 
  AlertTriangle, 
  Plus, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  Tag, 
  Eye,
  Store,
  Grid3X3
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { AdminTab } from '../AdminSidebar.tsx';
import { OrderStatus } from '../../../types/index.ts';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onOpenAddProduct,
  onSelectOrder,
}) => {
  const { 
    orders, 
    updateOrderStatus, 
    menuItems, 
    tables, 
    settings, 
    toggleRestaurantOpen, 
    toggleEmergencyPause 
  } = useRestaurant();

  // Real KPI calculations from orders database
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const dineInOrders = orders.filter((o) => o.orderType === 'dine_in');
  const deliveryOrders = orders.filter((o) => o.orderType === 'delivery');
  const takeawayOrders = orders.filter((o) => o.orderType === 'takeaway');

  const unavailableProducts = menuItems.filter((m) => !m.isAvailable);
  const occupiedTables = tables.filter((t) => t.status === 'active' || t.status === 'occupied');

  // Top Products Calculation
  const productSalesMap: { [id: string]: { name: string; count: number; totalRev: number; image: string } } = {};
  orders.forEach((ord) => {
    if (ord.status === 'cancelled') return;
    ord.items.forEach((item) => {
      if (!productSalesMap[item.menuItemId]) {
        const prod = menuItems.find((m) => m.id === item.menuItemId);
        productSalesMap[item.menuItemId] = {
          name: item.name,
          count: 0,
          totalRev: 0,
          image: prod?.image || '',
        };
      }
      productSalesMap[item.menuItemId].count += item.quantity;
      productSalesMap[item.menuItemId].totalRev += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentOrders = orders.slice(0, 6);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black px-2.5 py-0.5 rounded-full text-[10px]">جديد بانتظار التأكيد</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مؤكد</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">قيد التجهيز</span>;
      case 'ready':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">جاهز للاستلام</span>;
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مع المندوب</span>;
      case 'completed':
        return <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">مكتمل</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">ملغي</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Emergency / Operational Banner if paused or closed */}
      {(!settings.isRestaurantOpen || settings.emergencyPauseOrders) && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 font-bold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-black text-sm block">
                {!settings.isRestaurantOpen ? 'المطعم مغلق حالياً أمام الزبائن' : 'الطلبات متوقفة مؤقتاً عبر الموقع'}
              </span>
              <span className="font-normal text-stone-700">
                {!settings.isRestaurantOpen ? 'لا يمكن للزبائن إتمام أي طلبات جديدة حتى إعادة الفتح' : settings.emergencyMessage}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!settings.isRestaurantOpen ? (
              <button
                onClick={toggleRestaurantOpen}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition"
              >
                إعادة فتح المطعم
              </button>
            ) : (
              <button
                onClick={() => toggleEmergencyPause()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black hover:bg-stone-800 transition"
              >
                استئناف استقبال الطلبات
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Sales */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">مبيعات اليوم المسجلة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
              ر.س
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {totalSales} <span className="text-xs font-bold text-stone-500">ريال</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{completedOrders.length} طلبات مكتملة</span>
            </div>
          </div>
        </div>

        {/* 2. Pending Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101 ${
            pendingOrders.length > 0 ? 'border-amber-400 bg-amber-50/40' : 'border-[#E2D7C7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">طلبات جديدة معلقة</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              pendingOrders.length > 0 ? 'bg-red-500 text-white animate-bounce' : 'bg-stone-100 text-stone-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">
              {pendingOrders.length > 0 ? 'تتطلب تأكيد فوري من الكاشير' : 'لا توجد طلبات معلقة'}
            </div>
          </div>
        </div>

        {/* 3. Active Orders In Progress */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">طلبات نشطة بالمطبخ</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <Flame className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {activeOrders.length}
            </div>
            <div className="text-[11px] text-purple-800 font-bold mt-1">
              قيد الطهي أو في طريقها للعميل
            </div>
          </div>
        </div>

        {/* 4. Active Tables */}
        <div 
          onClick={() => onNavigateTab('tables')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between cursor-pointer transition hover:scale-101"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500">طاولات الصالة النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Utensils className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">
              {occupiedTables.length} <span className="text-xs font-bold text-stone-400">/ {tables.length}</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              جلسات طعام مفتوحة عبر QR
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Strip */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2D7C7] shadow-xs">
        <div className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3">
          إجراءات تشغيلية سريعة
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
          <button
            onClick={onOpenAddProduct}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs font-black"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة صنف جديد</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>معالجة الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('tables')}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Grid3X3 className="w-4 h-4 text-emerald-700" />
            <span>طاولات الصالة و QR</span>
          </button>

          <button
            onClick={() => onNavigateTab('offers')}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-red-600" />
            <span>إدارة العروض والكوبونات</span>
          </button>
        </div>
      </div>

      {/* Orders Types Breakdown & Alert Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Order Channels Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2D7C7] shadow-xs">
          <h3 className="font-black text-sm text-[#1A120D] mb-4 flex items-center justify-between">
            <span>توزيع الطلبات حسب القناة</span>
            <span className="text-xs font-normal text-stone-400">إجمالي {orders.length} طلب</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Dine-in */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-black text-stone-900">طلبات الصالة (QR)</div>
                  <div className="text-[10px] text-stone-500">طلب مباشر من الطاولة</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-[#1A120D]">{dineInOrders.length}</span>
                <span className="text-[10px] text-stone-500 block">
                  ({orders.length > 0 ? Math.round((dineInOrders.length / orders.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* Takeaway */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-black text-stone-900">استلام سفري</div>
                  <div className="text-[10px] text-stone-500">استلام فوري بالفرع</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-[#1A120D]">{takeawayOrders.length}</span>
                <span className="text-[10px] text-stone-500 block">
                  ({orders.length > 0 ? Math.round((takeawayOrders.length / orders.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Car className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-black text-stone-900">توصيل عفيف</div>
                  <div className="text-[10px] text-stone-500">إلى باب العميل</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-[#1A120D]">{deliveryOrders.length}</span>
                <span className="text-[10px] text-stone-500 block">
                  ({orders.length > 0 ? Math.round((deliveryOrders.length / orders.length) * 100) : 0}%)
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2D7C7] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-sm text-[#1A120D]">الأصناف الأكثر مبيعاً وإقبالاً</h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-amber-800 font-bold hover:underline"
            >
              عرض كل الأصناف ←
            </button>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              لم تسجل طلبات مكتملة بعد لحساب الأصناف الأكثر مبيعاً
            </div>
          ) : (
            <div className="space-y-2.5">
              {topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-stone-100 hover:border-amber-200 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-black text-stone-400 text-center">{idx + 1}</span>
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Utensils className="w-4 h-4 m-auto text-stone-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{p.name}</div>
                      <div className="text-[10px] text-stone-500">{p.count} مرات طلب</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-amber-900">{p.totalRev} ريال</span>
                    <span className="text-[10px] text-stone-400 block">إجمالي العائد</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm sm:text-base text-[#1A120D]">آخر الطلبات الواردة</h3>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              يمكنك اعتماد الطلب وبدء تحضيره مباشرة
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>جميع الطلبات ({orders.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-400">
            لا توجد طلبات مسجلة حتى الآن
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 hover:bg-stone-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Order ID & Customer */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-mono font-black text-sm shrink-0">
                    #{ord.orderNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900">{ord.customerName}</span>
                      {getStatusBadge(ord.status)}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {ord.orderType === 'dine_in' && `🍽️ صالة (طاولة #${ord.tableNumber})`}
                      {ord.orderType === 'takeaway' && '🛍️ استلام سفري'}
                      {ord.orderType === 'delivery' && `🚗 توصيل (${ord.deliveryAddress?.district || 'عفيف'})`}
                      {' • '}
                      {ord.items.length} أصناف
                    </div>
                  </div>
                </div>

                {/* Amount & Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-right">
                    <span className="font-black text-sm text-[#1A120D]">{ord.total} ريال</span>
                    <span className="text-[10px] text-stone-400 block">{ord.paymentMethod === 'cash' ? 'نقداً' : 'شبكة'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {ord.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                      >
                        تأكيد الطلب
                      </button>
                    )}
                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing')}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                      >
                        بدء التجهيز
                      </button>
                    )}
                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer active:scale-95"
                      >
                        جاهز الآن
                      </button>
                    )}
                    <button
                      onClick={() => onSelectOrder(ord.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
                      title="عرض التفاصيل الكاملة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
