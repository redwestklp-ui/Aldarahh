import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { MenuItem, ProductOption, ProductAddon } from '../types/index.ts';
import { useRestaurant } from '../context/RestaurantContext.tsx';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  // Initialize defaults on item open
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedOption(item.options && item.options.length > 0 ? item.options[0] : undefined);
      setSelectedAddons([]);
      setExcludedIngredients([]);
      setNotes('');
      setAddedToast(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  // Toggle Addon
  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Toggle Excluded ingredient
  const toggleExcluded = (ing: string) => {
    if (excludedIngredients.includes(ing)) {
      setExcludedIngredients(excludedIngredients.filter((i) => i !== ing));
    } else {
      setExcludedIngredients([...excludedIngredients, ing]);
    }
  };

  // Calculate live total
  const optionCost = selectedOption ? selectedOption.priceModifier : 0;
  const addonsCost = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = item.basePrice + optionCost + addonsCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(item, quantity, selectedOption, selectedAddons, excludedIngredients, notes);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-md"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-white">
            <span className="font-black px-3 py-1 rounded-lg bg-amber-500 text-slate-950 shadow">
              {item.tag || 'شعبيات أصيلة'}
            </span>
            <span className="bg-black/70 backdrop-blur px-3 py-1 rounded-lg font-bold text-amber-300">
              يبدأ من {item.basePrice} ريال
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Header */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1E140E] mb-1">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* 1. Options (Sizes or Variations) */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-black text-[#1E140E]">
                الحجم أو طريقة التقديم: <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map((opt) => {
                  const isSelected = selectedOption?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3 rounded-xl border text-right transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-black'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                      }`}
                    >
                      <span className="text-xs">{opt.name}</span>
                      <span className="text-xs font-bold text-amber-800">
                        {opt.priceModifier > 0 ? `+${opt.priceModifier} ريال` : 'السعر الأساسي'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-black text-[#1E140E]">
                إضافات شهية حسب رغبتك:
              </label>
              <div className="space-y-1.5">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-800">
                        +{addon.price} ريال
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Removable ingredients */}
          {item.removableIngredients && item.removableIngredients.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-black text-[#1E140E]">
                تفضيلات المكونات (إزالة مكون):
              </label>
              <div className="flex flex-wrap gap-2">
                {item.removableIngredients.map((ing) => {
                  const isExcluded = excludedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleExcluded(ing)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        isExcluded
                          ? 'bg-red-50 border-red-400 text-red-700 line-through'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Order notes */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block text-xs font-black text-[#1E140E]">
              ملاحظات خاصة للطلب (اختياري):
            </label>
            <input
              type="text"
              maxLength={120}
              placeholder="مثال: زيادة تحمير، بدون شطة، ليمون إضافي..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            />
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          
          {/* Quantity Adjuster */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-stone-300 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-black text-sm text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>{addedToast ? '✓ تمت الإضافة!' : 'إضافة إلى السلة'}</span>
            </div>
            <span className="font-extrabold text-sm">
              {totalPrice} ريال
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
