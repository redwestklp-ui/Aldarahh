import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Utensils, 
  Car, 
  CreditCard 
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminReportsPage: React.FC = () => {
  const { orders, menuItems } = useRestaurant();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Filter orders by time range
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSubtotal = validOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = validOrders.reduce((sum, o) => sum + o.discount, 0);
  const totalDeliveryFees = validOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Payment Breakdown
  const cashTotal = validOrders.filter((o) => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0);
  const cardTotal = validOrders.filter((o) => o.paymentMethod !== 'cash').reduce((sum, o) => sum + o.total, 0);

  // Channels Breakdown
  const dineInRev = validOrders.filter((o) => o.orderType === 'dine_in').reduce((sum, o) => sum + o.total, 0);
  const takeawayRev = validOrders.filter((o) => o.orderType === 'takeaway').reduce((sum, o) => sum + o.total, 0);
  const deliveryRev = validOrders.filter((o) => o.orderType === 'delivery').reduce((sum, o) => sum + o.total, 0);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['رقم الطلب', 'التاريخ', 'اسم العميل', 'الجوال', 'نوع الطلب', 'المجموع الفرعي', 'الخصم', 'التوصيل', 'الإجمالي النهائي', 'طريقة الدفع', 'الحالة'];
    const rows = orders.map((o) => [
      `#${o.orderNumber}`,
      new Date(o.createdAt).toLocaleDateString('ar-SA'),
      o.customerName,
      o.customerPhone,
      o.orderType === 'dine_in' ? `صالة (طاولة ${o.tableNumber})` : o.orderType === 'takeaway' ? 'سفري' : 'توصيل',
      o.subtotal,
      o.discount,
      o.deliveryFee,
      o.total,
      o.paymentMethod === 'cash' ? 'نقداً' : 'شبكة/بطاقة',
      o.status
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقرير_مبيعات_شعاع_الدره_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            التقارير المالية والمحاسبية
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تحليل الإيرادات، متوسط قيمة السلة، أداء قنوات البيع، وتصدير التقارير بتنسيق Excel/CSV
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#1A120D] hover:bg-stone-800 text-amber-400 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تصدير تقرير المبيعات (CSV)</span>
        </button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs">
          <span className="text-stone-500 text-xs font-bold block mb-1">صافي الإيرادات المسجلة</span>
          <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">{totalRevenue} ريال</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            من {validOrders.length} طلبات ناجحة
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs">
          <span className="text-stone-500 text-xs font-bold block mb-1">متوسط قيمة الطلب (AOV)</span>
          <div className="text-2xl sm:text-3xl font-black text-[#1A120D]">{averageOrderValue} ريال</div>
          <div className="text-[11px] text-stone-400 font-medium mt-1">
            معدل إنفاق العميل للطلب
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs">
          <span className="text-stone-500 text-xs font-bold block mb-1">إجمالي الخصومات الممنوحة</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{totalDiscounts} ريال</div>
          <div className="text-[11px] text-stone-400 font-medium mt-1">
            عروض وكوبونات ترويجية
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs">
          <span className="text-stone-500 text-xs font-bold block mb-1">رسوم التوصيل المحصلة</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-950">{totalDeliveryFees} ريال</div>
          <div className="text-[11px] text-stone-400 font-medium mt-1">
            تغطية لمندوبي التوصيل
          </div>
        </div>

      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs space-y-3">
          <h3 className="font-black text-sm text-[#1A120D]">طرق الدفع والتحصيل</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="font-bold text-stone-800">نقداً عند الاستلام / في الصالة:</span>
              <span className="font-black text-amber-950 text-sm">{cashTotal} ريال</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="font-bold text-stone-800">شبكة / مدى / بطاقات ائتمانية:</span>
              <span className="font-black text-amber-950 text-sm">{cardTotal} ريال</span>
            </div>
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs space-y-3">
          <h3 className="font-black text-sm text-[#1A120D]">الإيرادات بحسب القناة</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <span className="font-bold text-amber-950">صالة المطعم (طاولات QR):</span>
              <span className="font-black text-amber-950">{dineInRev} ريال</span>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
              <span className="font-bold text-red-950">الاستلام السريع (سفري):</span>
              <span className="font-black text-red-950">{takeawayRev} ريال</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-emerald-950">التوصيل لمنازل عفيف:</span>
              <span className="font-black text-emerald-950">{deliveryRev} ريال</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
