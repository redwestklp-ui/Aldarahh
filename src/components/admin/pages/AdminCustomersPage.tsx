import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  ShoppingBag, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { Customer } from '../../../types/index.ts';

export const AdminCustomersPage: React.FC = () => {
  const { customers, toggleCustomerBlock, addCustomerNote, orders } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Close drawer on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCustomer) {
        setSelectedCustomer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCustomer]);

  const filtered = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  });

  const handleOpenCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setNoteInput(c.notes || '');
  };

  const handleSaveNote = () => {
    if (selectedCustomer) {
      addCustomerNote(selectedCustomer.id, noteInput.trim());
      setSelectedCustomer({ ...selectedCustomer, notes: noteInput.trim() });
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            سجل وقاعدة بيانات العملاء
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            متابعة العملاء الأكثر طلباً، إجمالي الإنفاق، وتاريخ الطلبات السابقة
          </p>
        </div>

        <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-2 rounded-xl">
          إجمالي العملاء المسجلين: <strong className="text-amber-950 font-black">{customers.length} عميل</strong>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="ابحث باسم العميل أو رقم الجوال..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-bold py-2.5 pr-10 pl-4 rounded-xl bg-white border border-[#DFD6C7] focus:border-amber-500 outline-none shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E2D7C7] text-stone-600 font-black">
              <tr>
                <th className="p-3.5 pr-5">العميل</th>
                <th className="p-3.5">رقم الجوال</th>
                <th className="p-3.5">عدد الطلبات</th>
                <th className="p-3.5">إجمالي المشتريات</th>
                <th className="p-3.5">آخر طلب</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 pl-5 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition">
                  <td className="p-3.5 pr-5 font-black text-stone-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div>{c.name}</div>
                        {c.notes && (
                          <div className="text-[10px] text-stone-400 font-normal line-clamp-1">
                            {c.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-stone-700 font-bold">
                    <a href={`tel:${c.phone}`} className="hover:text-amber-800 hover:underline">
                      {c.phone}
                    </a>
                  </td>
                  <td className="p-3.5 font-bold text-stone-800">
                    {c.ordersCount} طلبات
                  </td>
                  <td className="p-3.5 font-black text-amber-950 text-sm">
                    {c.totalSpent} ريال
                  </td>
                  <td className="p-3.5 text-stone-500 font-medium">
                    {c.lastOrderDate || 'غير مسجل'}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status === 'active' ? 'نشط' : 'محظور'}
                    </span>
                  </td>
                  <td className="p-3.5 pl-5 text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenCustomer(c)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition cursor-pointer"
                      >
                        سجل العميل
                      </button>
                      <button
                        onClick={() => toggleCustomerBlock(c.id)}
                        className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                          c.status === 'active'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={c.status === 'active' ? 'حظر العميل' : 'إلغاء الحظر'}
                      >
                        {c.status === 'active' ? 'حظر' : 'تفعيل'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-base text-[#1A120D]">{selectedCustomer.name}</h3>
                  <span className="text-stone-400 font-mono text-[11px]">{selectedCustomer.phone}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 no-scrollbar">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <div>
                  <span className="text-stone-400 text-[10px] block">إجمالي الطلبات</span>
                  <span className="font-black text-base text-stone-900">{selectedCustomer.ordersCount} طلب</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] block">إجمالي الإنفاق</span>
                  <span className="font-black text-base text-amber-950">{selectedCustomer.totalSpent} ريال</span>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="block text-stone-700 font-bold">ملاحظات الإدارة الخاصة بالعميل:</label>
                <textarea
                  rows={2}
                  placeholder="مثال: يفضل السمك الحار، عميل دائم لطلبات الصالة..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-normal outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-3 py-1.5 rounded-lg bg-[#1A120D] text-amber-400 font-bold text-[11px]"
                >
                  حفظ الملاحظة
                </button>
              </div>

              {/* Customer Past Orders */}
              <div className="space-y-2">
                <div className="font-black text-stone-900">الطلبات المسجلة لهذا العميل:</div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                  {orders.filter((o) => o.customerPhone === selectedCustomer.phone).map((ord) => (
                    <div key={ord.id} className="p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="font-black text-amber-950">#{ord.orderNumber} ({ord.orderType})</div>
                        <div className="text-[10px] text-stone-400">{new Date(ord.createdAt).toLocaleDateString('ar-SA')}</div>
                      </div>
                      <span className="font-black text-sm text-[#1A120D]">{ord.total} ريال</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => toggleCustomerBlock(selectedCustomer.id)}
                className={`px-3 py-2 rounded-xl font-bold text-xs ${
                  selectedCustomer.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {selectedCustomer.status === 'active' ? 'حظر هذا العميل' : 'إلغاء حظر العميل'}
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
