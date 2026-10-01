import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Archive, 
  Copy, 
  Eye, 
  Check, 
  X, 
  Flame, 
  Upload, 
  Image as ImageIcon,
  Clock,
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { MenuItem, ProductOption, ProductAddon } from '../../../types/index.ts';

interface AdminProductsPageProps {
  onOpenAddModal?: () => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = () => {
  const { 
    menuItems, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    archiveProduct, 
    duplicateProduct,
    toggleProductAvailability,
    updateProductPrice,
    bulkUpdateProducts,
    bulkDeleteProducts
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');

  // Multi-select for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Inline price editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<number>(0);

  // Add / Edit Modal Drawer
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for editor
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[1]?.id || 'shaabiat');
  const [formDescription, setFormDescription] = useState('');
  const [formBasePrice, setFormBasePrice] = useState<number>(15);
  const [formCompareAtPrice, setFormCompareAtPrice] = useState<number | undefined>(undefined);
  const [formImage, setFormImage] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formTag, setFormTag] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'archived' | 'hidden'>('published');
  
  // Channels
  const [visWebsite, setVisWebsite] = useState(true);
  const [visDineIn, setVisDineIn] = useState(true);
  const [visPickup, setVisPickup] = useState(true);
  const [visDelivery, setVisDelivery] = useState(true);

  // Options & Addons inside form
  const [formOptions, setFormOptions] = useState<ProductOption[]>([]);
  const [formAddons, setFormAddons] = useState<ProductAddon[]>([]);
  const [formRemovables, setFormRemovables] = useState<string[]>([]);
  const [newRemovableInput, setNewRemovableInput] = useState('');

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // Escape key listener for editor and delete confirmation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteConfirmId) {
          setDeleteConfirmId(null);
        } else if (isEditorOpen) {
          setIsEditorOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirmId, isEditorOpen]);

  // Open modal for new product
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory(categories[1]?.id || 'shaabiat');
    setFormDescription('');
    setFormBasePrice(15);
    setFormCompareAtPrice(undefined);
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
    setFormIsAvailable(true);
    setFormTag('');
    setFormStatus('published');
    setVisWebsite(true);
    setVisDineIn(true);
    setVisPickup(true);
    setVisDelivery(true);
    setFormOptions([]);
    setFormAddons([]);
    setFormRemovables([]);
    setIsEditorOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormBasePrice(item.basePrice);
    setFormCompareAtPrice(item.compareAtPrice);
    setFormImage(item.image);
    setFormIsAvailable(item.isAvailable);
    setFormTag(item.tag || '');
    setFormStatus(item.status || 'published');
    setVisWebsite(item.visibility?.website !== false);
    setVisDineIn(item.visibility?.dineIn !== false);
    setVisPickup(item.visibility?.pickup !== false);
    setVisDelivery(item.visibility?.delivery !== false);
    setFormOptions(item.options ? [...item.options] : []);
    setFormAddons(item.addons ? [...item.addons] : []);
    setFormRemovables(item.removableIngredients ? [...item.removableIngredients] : []);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload: MenuItem = {
      id: editingItem ? editingItem.id : `prod-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      basePrice: Number(formBasePrice) || 0,
      compareAtPrice: formCompareAtPrice ? Number(formCompareAtPrice) : undefined,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isAvailable: formIsAvailable,
      tag: formTag.trim() || undefined,
      status: formStatus,
      visibility: {
        website: visWebsite,
        dineIn: visDineIn,
        pickup: visPickup,
        delivery: visDelivery,
      },
      options: formOptions.length > 0 ? formOptions : undefined,
      addons: formAddons.length > 0 ? formAddons : undefined,
      removableIngredients: formRemovables.length > 0 ? formRemovables : undefined,
    };

    if (editingItem) {
      updateProduct(editingItem.id, payload);
    } else {
      addProduct(payload);
    }

    setIsEditorOpen(false);
  };

  // Inline price save
  const handleSaveInlinePrice = (id: string) => {
    if (inlinePriceVal > 0) {
      updateProductPrice(id, inlinePriceVal);
    }
    setEditingPriceId(null);
  };

  // Add Option helper
  const handleAddOption = () => {
    setFormOptions([
      ...formOptions,
      { id: `opt-${Date.now()}`, name: 'حجم عادي', priceModifier: 0 }
    ]);
  };

  // Add Addon helper
  const handleAddAddon = () => {
    setFormAddons([
      ...formAddons,
      { id: `add-${Date.now()}`, name: 'إضافة جديدة', price: 2 }
    ]);
  };

  // Filtered Products
  let filtered = menuItems.filter((item) => {
    const matchesQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesAvail = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' ? item.isAvailable : !item.isAvailable);
    const matchesStatus = 
      statusFilter === 'all' || (item.status || 'published') === statusFilter;

    return matchesQuery && matchesCat && matchesAvail && matchesStatus;
  });

  // Sorting
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }

  // Bulk toggles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            إدارة الأصناف وقائمة المأكولات
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تعديل الأسعار مباشرة، التحكم بالتوفر، إضافة أحجام وإضافات خاصة لكل طبق
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة صنف جديد</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2D7C7] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              placeholder="ابحث باسم الوجبة، الوصف، أو الكلمات الدلالية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold py-2 pr-9 pl-3 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-bold p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 outline-none"
          >
            <option value="all">جميع الأقسام ({menuItems.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as any)}
            className="text-xs font-bold p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 outline-none"
          >
            <option value="all">حالة التوفر (الكل)</option>
            <option value="available">متوفر حالياً للطلب</option>
            <option value="unavailable">غير متوفر (نافد)</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 outline-none"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="name">أبجدياً (أ - ي)</option>
          </select>

        </div>

        {/* Bulk Action Strip if items selected */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-bold text-amber-950">
              تم تحديد ({selectedIds.length}) أصناف
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  bulkUpdateProducts(selectedIds, { isAvailable: true });
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
              >
                تفعيل التوفر للكل
              </button>
              <button
                onClick={() => {
                  bulkUpdateProducts(selectedIds, { isAvailable: false });
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-800 text-white font-bold text-[11px]"
              >
                تعطيل التوفر للكل
              </button>
              <button
                onClick={() => {
                  bulkDeleteProducts(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px]"
              >
                أرشفة المحددة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table on Desktop */}
      <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E2D7C7] text-stone-600 font-black">
              <tr>
                <th className="p-3.5 pr-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-stone-300 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">الصورة والاسم</th>
                <th className="p-3.5">القسم</th>
                <th className="p-3.5">السعر الأساسي</th>
                <th className="p-3.5">حالة التوفر</th>
                <th className="p-3.5">الخيارات والإضافات</th>
                <th className="p-3.5">القنوات</th>
                <th className="p-3.5 pl-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                const catObj = categories.find((c) => c.id === item.category);
                const isEditingPrice = editingPriceId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition">
                    <td className="p-3.5 pr-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleSelectOne(item.id)}
                        className="rounded border-stone-300 cursor-pointer"
                      />
                    </td>
                    
                    {/* Image & Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-black text-sm text-[#1A120D] flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.category === 'tannour_fish' && (
                              <Flame className="w-3.5 h-3.5 text-red-600 fill-current" />
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 line-clamp-1 max-w-xs font-normal">
                            {item.description}
                          </div>
                          {item.tag && (
                            <span className="inline-block mt-1 text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 font-bold text-stone-700">
                      {catObj?.name || item.category}
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="p-3.5">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={inlinePriceVal}
                            onChange={(e) => setInlinePriceVal(Number(e.target.value))}
                            className="w-16 p-1 text-xs font-black border border-amber-500 rounded bg-white text-stone-900"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setInlinePriceVal(item.basePrice);
                          }}
                          className="font-black text-sm text-amber-950 cursor-pointer hover:text-amber-600 flex items-center gap-1 group"
                          title="انقر لتعديل السعر مباشرة"
                        >
                          <span>{item.basePrice} ريال</span>
                          <Edit className="w-3 h-3 text-stone-300 group-hover:text-amber-600 transition" />
                        </div>
                      )}
                      {item.compareAtPrice && (
                        <span className="text-[10px] text-stone-400 line-through block">
                          {item.compareAtPrice} ريال
                        </span>
                      )}
                    </td>

                    {/* Availability Switch */}
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleProductAvailability(item.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black border transition cursor-pointer flex items-center gap-1.5 ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        <span>{item.isAvailable ? 'متوفر' : 'غير متوفر'}</span>
                      </button>
                    </td>

                    {/* Options / Addons count */}
                    <td className="p-3.5 text-[11px] text-stone-500">
                      <div>{item.options?.length || 0} أحجام</div>
                      <div>{item.addons?.length || 0} إضافات</div>
                    </td>

                    {/* Channels Visibility */}
                    <td className="p-3.5 text-[10px] font-bold text-stone-500">
                      <div className="flex items-center gap-1">
                        <span className={item.visibility?.dineIn !== false ? 'text-emerald-700' : 'text-stone-300 line-through'}>صالة</span>
                        <span>•</span>
                        <span className={item.visibility?.pickup !== false ? 'text-emerald-700' : 'text-stone-300 line-through'}>سفري</span>
                        <span>•</span>
                        <span className={item.visibility?.delivery !== false ? 'text-emerald-700' : 'text-stone-300 line-through'}>توصيل</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pl-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                          title="تعديل الصنف"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => duplicateProduct(item.id)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                          title="نسخ الصنف"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteConfirmId(item.id);
                            setDeleteMessage(null);
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          title="حذف / أرشفة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-stone-100">
          {filtered.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#1A120D] truncate">{item.name}</span>
                    <span className="font-black text-amber-900 text-sm">{item.basePrice} ريال</span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 font-normal mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => toggleProductAvailability(item.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.isAvailable ? 'متوفر ✓' : 'غير متوفر ✕'}
                    </button>
                    {item.tag && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => duplicateProduct(item.id)}
                  className="p-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
                  title="نسخ"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Product Drawer / Modal (Add / Edit) */}
      {isEditorOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsEditorOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-black text-base text-[#1A120D]">
                {editingItem ? `تعديل صنف: ${editingItem.name}` : 'إضافة صنف جديد للقائمة'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs no-scrollbar">
              
              {/* Section 1: Basic Information */}
              <div className="space-y-3">
                <div className="font-black text-xs text-stone-900 border-b border-stone-200 pb-1.5 flex items-center gap-2">
                  <span>1. المعلومات الأساسية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">اسم الوجبة / الصنف: *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: سمك تنور بالخلطة الحارة"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">القسم الرئيسي: *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">وصف الصنف والمكونات الشهية:</label>
                  <textarea
                    rows={2}
                    placeholder="وصف مشهي يوضح طريقة الطبخ والتتبيلة والتقديم..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">شارة ترويجية (Tag):</label>
                    <input
                      type="text"
                      placeholder="مثال: الأكثر طلباً • طازج يومياً"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">حالة النشر:</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none"
                    >
                      <option value="published">منشور وظاهر بالموقع</option>
                      <option value="draft">مسودة داخلية (مخفي)</option>
                      <option value="archived">مؤرشف</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing */}
              <div className="space-y-3">
                <div className="font-black text-xs text-stone-900 border-b border-stone-200 pb-1.5">
                  2. الأسعار والعروض
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">السعر الأساسي (ريال): *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-sm text-amber-950 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">السعر قبل الخصم (اختياري):</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="لإظهار سعر مشطوب"
                      value={formCompareAtPrice || ''}
                      onChange={(e) => setFormCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Food Image */}
              <div className="space-y-3">
                <div className="font-black text-xs text-stone-900 border-b border-stone-200 pb-1.5">
                  3. صورة الوجبة
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-300 shrink-0">
                    {formImage ? (
                      <img src={formImage} alt="معاينة" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 m-auto text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="block text-stone-700 font-bold">رابط صورة عالية الدقة (URL):</label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 rounded-xl border border-stone-300 font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Sizes & Presentation Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="font-black text-xs text-stone-900">4. خيارات الحجم والتقديم ({formOptions.length})</span>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة حجم</span>
                  </button>
                </div>

                {formOptions.map((opt, idx) => (
                  <div key={opt.id || idx} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <input
                      type="text"
                      placeholder="اسم الحجم (مثال: حجم عائلي)"
                      value={opt.name}
                      onChange={(e) => {
                        const updated = [...formOptions];
                        updated[idx].name = e.target.value;
                        setFormOptions(updated);
                      }}
                      className="flex-1 p-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-stone-500 font-bold">+</span>
                      <input
                        type="number"
                        placeholder="فارق السعر"
                        value={opt.priceModifier}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx].priceModifier = Number(e.target.value);
                          setFormOptions(updated);
                        }}
                        className="w-16 p-1.5 rounded-lg border border-stone-300 text-xs font-bold"
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

              {/* Section 5: Add-ons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="font-black text-xs text-stone-900">5. الإضافات المدفوعة ({formAddons.length})</span>
                  <button
                    type="button"
                    onClick={handleAddAddon}
                    className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مكمل</span>
                  </button>
                </div>

                {formAddons.map((addon, idx) => (
                  <div key={addon.id || idx} className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <input
                      type="text"
                      placeholder="اسم الإضافة (مثال: جبنة ذائبة)"
                      value={addon.name}
                      onChange={(e) => {
                        const updated = [...formAddons];
                        updated[idx].name = e.target.value;
                        setFormAddons(updated);
                      }}
                      className="flex-1 p-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-stone-500 font-bold">+</span>
                      <input
                        type="number"
                        placeholder="السعر"
                        value={addon.price}
                        onChange={(e) => {
                          const updated = [...formAddons];
                          updated[idx].price = Number(e.target.value);
                          setFormAddons(updated);
                        }}
                        className="w-16 p-1.5 rounded-lg border border-stone-300 text-xs font-bold"
                      />
                      <span className="text-[10px] text-stone-500">ريال</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormAddons(formAddons.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Section 6: Channels Visibility */}
              <div className="space-y-2">
                <div className="font-black text-xs text-stone-900 border-b border-stone-200 pb-1.5">
                  6. قنوات ظهور الصنف
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={visWebsite} onChange={(e) => setVisWebsite(e.target.checked)} />
                    <span className="font-bold">الموقع العام</span>
                  </label>
                  <label className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={visDineIn} onChange={(e) => setVisDineIn(e.target.checked)} />
                    <span className="font-bold">طاولات الصالة</span>
                  </label>
                  <label className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={visPickup} onChange={(e) => setVisPickup(e.target.checked)} />
                    <span className="font-bold">استلام سفري</span>
                  </label>
                  <label className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={visDelivery} onChange={(e) => setVisDelivery(e.target.checked)} />
                    <span className="font-bold">توصيل المنازل</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md cursor-pointer transition active:scale-95"
                >
                  {editingItem ? 'حفظ التعديلات' : 'نشر الصنف'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-black text-base">
              <Trash2 className="w-5 h-5" />
              <span>خيارات حذف أو أرشفة الصنف</span>
            </div>
            
            <p className="text-stone-600 leading-relaxed font-medium">
              لحماية سجل الطلبات التاريخية والفواتير، ننصح بنقل الصنف إلى <strong>الأرشيف</strong> ليختفي من قائمة الزبائن دون حذف بياناته المحاسبية.
            </p>

            {deleteMessage && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 font-bold">
                {deleteMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
              >
                تراجع
              </button>

              <button
                onClick={() => {
                  archiveProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
              >
                نقل إلى الأرشيف (آمن)
              </button>

              <button
                onClick={() => {
                  const res = deleteProduct(deleteConfirmId, true);
                  if (res.success) {
                    setDeleteConfirmId(null);
                  } else {
                    setDeleteMessage(res.message);
                  }
                }}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
