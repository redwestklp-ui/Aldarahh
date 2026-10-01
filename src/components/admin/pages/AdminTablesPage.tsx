import React, { useState } from 'react';
import { 
  Grid3X3, 
  Plus, 
  QrCode, 
  Printer, 
  RefreshCw, 
  Power, 
  Lock, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { Table } from '../../../types/index.ts';
import { PrintableTableCardModal } from '../../PrintableTableCardModal.tsx';

interface AdminTablesPageProps {
  onSimulateTable?: (tableNo: number) => void;
}

export const AdminTablesPage: React.FC<AdminTablesPageProps> = ({ onSimulateTable }) => {
  const { 
    tables, 
    addTable, 
    deleteTable, 
    rotateTablePin, 
    closeTable, 
    openTable, 
    endTableSession,
    orders 
  } = useRestaurant();

  const [selectedTableForPrint, setSelectedTableForPrint] = useState<Table | null>(null);
  const [newTableNumber, setNewTableNumber] = useState<number>(tables.length + 1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableNumber > 0) {
      addTable(newTableNumber);
      setIsAddModalOpen(false);
      setNewTableNumber(tables.length + 2);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            إدارة طاولات الصالة ورموز الـ QR
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            متابعة حالة الطاولات في الصالة، رموز التحقق (PIN)، وطباعة بطاقات الـ QR للطاولات
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة طاولة جديدة</span>
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((tbl) => {
          const activeOrdersForTable = orders.filter(
            (o) => o.orderType === 'dine_in' && o.tableNumber === tbl.tableNumber && ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
          );

          const isOccupied = tbl.status === 'active' || tbl.status === 'occupied' || activeOrdersForTable.length > 0;
          const isClosed = tbl.status === 'closed';

          return (
            <div 
              key={tbl.id}
              className={`rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition-all bg-white ${
                isClosed
                  ? 'border-stone-300 opacity-60 bg-stone-50'
                  : isOccupied
                  ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-400/20'
                  : 'border-[#E2D7C7] hover:border-amber-300'
              }`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-xs ${
                      isClosed 
                        ? 'bg-stone-200 text-stone-600'
                        : isOccupied 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {tbl.tableNumber}
                    </div>
                    <div>
                      <div className="font-black text-sm text-[#1A120D]">
                        طاولة رقم {tbl.tableNumber}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {isClosed ? '🔴 مغلقة للصيانة' : isOccupied ? '🟠 جلسة نشطة' : '🟢 متاحة وجاهزة'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isClosed
                      ? 'bg-red-100 text-red-800'
                      : isOccupied
                      ? 'bg-amber-100 text-amber-950 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isClosed ? 'مغلقة' : isOccupied ? 'مشغولة' : 'شاغرة'}
                  </span>
                </div>

                {/* Table PIN and Orders Status */}
                <div className="space-y-2 py-3 border-y border-stone-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">رمز التحقق المطبوع (PIN):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm bg-stone-100 px-2.5 py-0.5 rounded-lg text-amber-950 border border-stone-200">
                        {tbl.currentPin}
                      </span>
                      <button
                        onClick={() => rotateTablePin(tbl.tableNumber)}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 cursor-pointer"
                        title="توليد رمز PIN جديد"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">طلبات جارية للطاولة:</span>
                    <span className="font-black text-stone-900">
                      {activeOrdersForTable.length} طلبات
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 mt-3 flex items-center justify-between gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedTableForPrint(tbl)}
                  className="flex-1 py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>بطاقة QR</span>
                </button>

                {isOccupied && (
                  <button
                    onClick={() => endTableSession(tbl.tableNumber)}
                    className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold transition cursor-pointer"
                    title="إنهاء الجلسة وتفريغ الطاولة"
                  >
                    إنهاء
                  </button>
                )}

                {isClosed ? (
                  <button
                    onClick={() => openTable(tbl.tableNumber)}
                    className="py-2 px-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold transition cursor-pointer"
                    title="فتح الطاولة للخدمة"
                  >
                    فتح
                  </button>
                ) : (
                  <button
                    onClick={() => closeTable(tbl.tableNumber)}
                    className="py-2 px-2.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 font-bold transition cursor-pointer"
                    title="إغلاق مؤقت"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">إضافة طاولة طعام جديدة</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">رقم الطاولة في الصالة: *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="99"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-base text-amber-950 outline-none"
                />
              </div>

              <p className="text-[11px] text-stone-500">
                سيقوم النظام تلقائياً بتوليد رمز PIN ورابط QR خاص بهذه الطاولة فور الإضافة.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  إضافة الطاولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable QR Card Modal */}
      <PrintableTableCardModal
        table={selectedTableForPrint}
        onClose={() => setSelectedTableForPrint(null)}
      />

    </div>
  );
};
