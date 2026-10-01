import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { MenuCategory } from '../../../types/index.ts';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories, menuItems } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);

  // Delete category safety modal
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>('');
  const [deleteError, setDeleteError] = useState('');

  // Handle Escape key to close open dialogs
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletingCatId) {
          setDeletingCatId(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletingCatId, isModalOpen]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDesc('');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDesc(cat.description || '');
    setFormActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        isActive: formActive,
      });
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        sortOrder: categories.length + 1,
        isActive: formActive,
      });
    }

    setIsModalOpen(false);
  };

  // Reorder helpers (Move up / down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    // Update sortOrder
    const updated = list.map((c, i) => ({ ...c, sortOrder: i + 1 }));
    reorderCategories(updated);
  };

  const handleDeletePrompt = (id: string) => {
    const assignedCount = menuItems.filter((m) => m.category === id).length;
    const remaining = categories.filter((c) => c.id !== id);
    setDeletingCatId(id);
    setDeleteError('');
    setReassignTargetId(remaining[0]?.id || '');
  };

  const handleExecuteDelete = () => {
    if (!deletingCatId) return;
    const res = deleteCategory(deletingCatId, reassignTargetId || undefined);
    if (res.success) {
      setDeletingCatId(null);
    } else {
      setDeleteError(res.message);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            أقسام وتصنيفات المنيو
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            ترتيب الأقسام الرئيسية، التحكم بظهورها في الموقع، وحماية الأصناف المرتبطة
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {categories.map((cat, idx) => {
            const productCount = menuItems.filter((m) => m.category === cat.id).length;
            const isFirst = idx === 0;
            const isLast = idx === categories.length - 1;

            return (
              <div 
                key={cat.id} 
                className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition"
              >
                {/* Drag / Reorder Buttons + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      disabled={isFirst}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={isLast}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs shrink-0">
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1A120D]">{cat.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {cat.isActive ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-stone-500 font-normal line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Counts & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="font-black text-xs text-stone-900">{productCount} أصناف</span>
                    <span className="text-[10px] text-stone-400 block">مرتبطة بالقسم</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                      title="تعديل القسم"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {cat.id !== 'all' && (
                      <button
                        onClick={() => handleDeletePrompt(cat.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">
                {editingCategory ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للمنيو'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم القسم: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مشويات طازجة، مقبلات ساخنة..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">وصف مختصر للقسم:</label>
                <textarea
                  rows={2}
                  placeholder="وصف بسيط يوضح ما تحتويه هذه القائمة..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-bold text-stone-800 block">ظهور القسم في الموقع</span>
                  <span className="text-[10px] text-stone-500">إذا تم تعطيله لن يظهر لزوار الموقع العام</span>
                </div>
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  حفظ
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Category Protection Modal */}
      {deletingCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-black text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>حماية الأصناف المرتبطة بالقسم</span>
            </div>

            <p className="text-stone-600 leading-relaxed font-medium">
              هذا القسم يحتوي على أصناف معروضة. لحماية بيانات الأصناف من الضياع، اختر القسم البديل الذي ترغب في نقل الأصناف إليه:
            </p>

            <div className="space-y-1.5">
              <label className="block font-bold text-stone-700">نقل الأصناف إلى قسم:</label>
              <select
                value={reassignTargetId}
                onChange={(e) => setReassignTargetId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
              >
                {categories.filter((c) => c.id !== deletingCatId).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-bold">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCatId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black"
              >
                تأكيد النقل والحذف
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
