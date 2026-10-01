import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  HelpCircle,
  Tag
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { ModifierGroup } from '../../../types/index.ts';

export const AdminModifiersPage: React.FC = () => {
  const { modifierGroups, addModifierGroup, updateModifierGroup, deleteModifierGroup } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);

  // Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const [formName, setFormName] = useState('');
  const [formMin, setFormMin] = useState(0);
  const [formMax, setFormMax] = useState(3);
  const [formRequired, setFormRequired] = useState(false);
  const [formOptions, setFormOptions] = useState<{ id: string; name: string; price: number; isAvailable: boolean }[]>([]);

  const handleOpenAdd = () => {
    setEditingGroup(null);
    setFormName('');
    setFormMin(0);
    setFormMax(3);
    setFormRequired(false);
    setFormOptions([
      { id: `opt-${Date.now()}-1`, name: 'إضافة 1', price: 2, isAvailable: true },
      { id: `opt-${Date.now()}-2`, name: 'إضافة 2', price: 3, isAvailable: true },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group: ModifierGroup) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormMin(group.minSelections);
    setFormMax(group.maxSelections);
    setFormRequired(group.isRequired);
    setFormOptions([...group.options]);
    setIsModalOpen(true);
  };

  const handleAddOptionItem = () => {
    setFormOptions([
      ...formOptions,
      { id: `opt-${Date.now()}`, name: '', price: 0, isAvailable: true }
    ]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload: ModifierGroup = {
      id: editingGroup ? editingGroup.id : `mod-${Date.now()}`,
      name: formName.trim(),
      minSelections: Number(formMin),
      maxSelections: Number(formMax),
      isRequired: formRequired,
      options: formOptions.filter((o) => o.name.trim() !== ''),
    };

    if (editingGroup) {
      updateModifierGroup(editingGroup.id, payload);
    } else {
      addModifierGroup(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            مجموعات الخيارات والإضافات (Modifiers)
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تحديد أحجام الوجبات، درجات الحرارة، والإضافات المدفوعة مع شروط الاختيار الإجباري أو الاختياري
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة مجموعة خيارات</span>
        </button>
      </div>

      {/* Modifier Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modifierGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-2xl p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-[#1A120D]">{group.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    group.isRequired ? 'bg-red-100 text-red-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {group.isRequired ? 'اختيار إجباري' : 'اختياري'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(group)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                    title="تعديل"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteModifierGroup(group.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 mb-3 font-medium">
                الحد الأدنى: {group.minSelections} • الحد الأقصى: {group.maxSelections}
              </div>

              {/* Options list */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                {group.options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between py-1 px-2 rounded-lg bg-stone-50 text-stone-700">
                    <span className="font-bold">{opt.name}</span>
                    <span className="font-black text-amber-900">
                      {opt.price > 0 ? `+${opt.price} ريال` : 'مجاناً'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 font-bold flex items-center justify-between">
              <span>{group.options.length} خيارات متاحة</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <h3 className="font-black text-base text-[#1A120D]">
                {editingGroup ? 'تعديل مجموعة الخيارات' : 'إنشاء مجموعة خيارات جديدة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1 no-scrollbar">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم المجموعة: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الحجم وطريقة التقديم، الإضافات..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">الحد الأدنى للاختيار:</label>
                  <input
                    type="number"
                    min="0"
                    value={formMin}
                    onChange={(e) => setFormMin(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">الحد الأقصى للاختيار:</label>
                  <input
                    type="number"
                    min="1"
                    value={formMax}
                    onChange={(e) => setFormMax(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-bold text-stone-800 block">اختيار إجباري قبل الإضافة للسلة</span>
                  <span className="text-[10px] text-stone-500">مثل الحجم في الساندويشات أو الكباب</span>
                </div>
                <input
                  type="checkbox"
                  checked={formRequired}
                  onChange={(e) => setFormRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </div>

              {/* Options builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                  <span className="font-black text-stone-800">قائمة الخيارات والأسعار:</span>
                  <button
                    type="button"
                    onClick={handleAddOptionItem}
                    className="text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة خيار</span>
                  </button>
                </div>

                {formOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <input
                      type="text"
                      placeholder="اسم الخيار (مثال: جبنة ذائبة)"
                      value={opt.name}
                      onChange={(e) => {
                        const copy = [...formOptions];
                        copy[idx].name = e.target.value;
                        setFormOptions(copy);
                      }}
                      className="flex-1 p-1.5 rounded-lg border border-stone-300 font-bold"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-stone-400 font-bold">+</span>
                      <input
                        type="number"
                        placeholder="السعر"
                        value={opt.price}
                        onChange={(e) => {
                          const copy = [...formOptions];
                          copy[idx].price = Number(e.target.value);
                          setFormOptions(copy);
                        }}
                        className="w-16 p-1.5 rounded-lg border border-stone-300 font-bold"
                      />
                      <span className="text-[10px] text-stone-500">ريال</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormOptions(formOptions.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs"
                >
                  حفظ المجموعة
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
