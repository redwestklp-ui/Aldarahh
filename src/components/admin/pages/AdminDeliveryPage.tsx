import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { DeliveryZone } from '../../../types/index.ts';

export const AdminDeliveryPage: React.FC = () => {
  const { 
    deliveryZones, 
    addDeliveryZone, 
    updateDeliveryZone, 
    deleteDeliveryZone, 
    toggleDeliveryZone,
    minDeliveryAmount,
    deliveryFeeAmount,
    updateDeliverySettings
  } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  const [formName, setFormName] = useState('');
  const [formFee, setFormFee] = useState<number>(10);
  const [formMinOrder, setFormMinOrder] = useState<number>(30);
  const [formEta, setFormEta] = useState<number>(30);

  // Global settings
  const [globalMin, setGlobalMin] = useState<number>(minDeliveryAmount);
  const [globalFee, setGlobalFee] = useState<number>(deliveryFeeAmount);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Close modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setFormName('');
    setFormFee(10);
    setFormMinOrder(30);
    setFormEta(30);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormName(zone.name);
    setFormFee(zone.deliveryFee);
    setFormMinOrder(zone.minOrder);
    setFormEta(zone.estimatedMinutes);
    setIsModalOpen(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingZone) {
      updateDeliveryZone(editingZone.id, {
        name: formName.trim(),
        deliveryFee: Number(formFee),
        minOrder: Number(formMinOrder),
        estimatedMinutes: Number(formEta),
      });
    } else {
      addDeliveryZone({
        id: `zone-${Date.now()}`,
        name: formName.trim(),
        deliveryFee: Number(formFee),
        minOrder: Number(formMinOrder),
        estimatedMinutes: Number(formEta),
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliverySettings(Number(globalMin), Number(globalFee));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            إدارة مناطق التوصيل والرسوم في عفيف
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تحديد رسوم التوصيل والحد الأدنى لكل حي سكني، وتفعيل أو تعطيل التوصيل لمناطق معينة
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة حي / منطقة جديدة</span>
        </button>
      </div>

      {/* Global Delivery Settings Box */}
      <form onSubmit={handleSaveGlobal} className="bg-white p-5 rounded-2xl border border-[#E2D7C7] shadow-xs space-y-3">
        <div className="font-black text-xs text-[#1A120D] flex items-center justify-between">
          <span>الإعدادات العامة للتوصيل داخل محافظة عفيف</span>
          {savedSuccess && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" />
              تم حفظ الإعدادات بنجاح!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-stone-600 font-bold mb-1">الحد الأدنى للطلب العام (ريال):</label>
            <input
              type="number"
              min="0"
              value={globalMin}
              onChange={(e) => setGlobalMin(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-amber-950 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-bold mb-1">رسوم التوصيل الافتراضية (ريال):</label>
            <input
              type="number"
              min="0"
              value={globalFee}
              onChange={(e) => setGlobalFee(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-amber-950 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1A120D] hover:bg-stone-800 text-amber-400 font-black text-xs transition cursor-pointer"
            >
              حفظ الإعدادات العامة
            </button>
          </div>
        </div>
      </form>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deliveryZones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-black text-sm text-[#1A120D]">{zone.name}</span>
                </div>
                <button
                  onClick={() => toggleDeliveryZone(zone.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition cursor-pointer shrink-0 ${
                    zone.isActive ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-stone-200 text-stone-600 border-stone-300'
                  }`}
                >
                  {zone.isActive ? 'متاح' : 'مغلق'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 py-3 border-y border-stone-100 my-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">رسوم التوصيل:</span>
                  <span className="font-black text-amber-900">
                    {zone.deliveryFee === 0 ? 'مجاناً 🎉' : `${zone.deliveryFee} ريال`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">الحد الأدنى:</span>
                  <span className="font-bold">{zone.minOrder} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">الوقت المتوقع:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {zone.estimatedMinutes} دقيقة
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-1.5 text-xs">
              <button
                onClick={() => handleOpenEdit(zone)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                title="تعديل"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteDeliveryZone(zone.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Zone */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">
                {editingZone ? 'تعديل منطقة توصيل' : 'إضافة حي أو منطقة توصيل'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم الحي / المنطقة: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حي الملك فيصل"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">رسوم التوصيل (ريال): *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formFee}
                    onChange={(e) => setFormFee(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">الحد الأدنى للطلب: *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">الوقت التقديري للوصول (بالدقائق):</label>
                <input
                  type="number"
                  min="5"
                  value={formEta}
                  onChange={(e) => setFormEta(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  حفظ المنطقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
