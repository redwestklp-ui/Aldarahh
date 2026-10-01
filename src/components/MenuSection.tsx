import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Flame, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  LayoutGrid, 
  List, 
  Sparkles,
  SlidersHorizontal,
  Eye,
  Check
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';
import { MenuItem } from '../types/index.ts';

interface MenuSectionProps {
  onSelectDish: (dish: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectDish }) => {
  const { menuItems, categories } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to display edge fade masks and arrow states
  const checkScrollState = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      // In RTL, scrollLeft can be negative or positive depending on browser implementation
      const maxScroll = scrollWidth - clientWidth;
      const absScroll = Math.abs(scrollLeft);
      
      setCanScrollLeft(absScroll < maxScroll - 5);
      setCanScrollRight(absScroll > 5);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [categories]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  // Filter items by category, search query, and visibility
  const filteredItems = menuItems.filter((item) => {
    // Hide archived or hidden items from customer website
    if (item.status === 'archived' || item.status === 'hidden' || item.visibility?.website === false) {
      return false;
    }
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerified = !onlyVerified || item.isSpecialHighlight;
    return matchesCategory && matchesQuery && matchesVerified;
  });

  // Calculate items count per category
  const getCategoryCount = (catId: string) => {
    const visibleItems = menuItems.filter((i) => i.status !== 'archived' && i.status !== 'hidden' && i.visibility?.website !== false);
    if (catId === 'all') return visibleItems.length;
    return visibleItems.filter((i) => i.category === catId).length;
  };

  return (
    <section id="menu" className="py-12 sm:py-16 bg-[#F6F2EC] scroll-mt-16 border-b border-[#E2D7C7]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black tracking-wider uppercase text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
            قائمة الطعام والمأكولات اليومية
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A120D] mb-2 tracking-tight">
            أشهى وجبات فوال وشعبيات شعاع الدره
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            تصفح أطباق الفطور الشعبي، الشاورما، المشويات، وأسماك أفران التنور الطازجة
          </p>
        </div>

        {/* Search Bar & View Mode Controls */}
        <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن وجبتك المفضلة (فول، شاورما، سمك، كباب...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm font-bold py-3 pr-10 pl-4 rounded-2xl bg-white border-[1.5px] border-[#DFD6C7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none text-right shadow-xs transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Filters & View Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Best Sellers Filter Toggle */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                onlyVerified
                  ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-xs'
                  : 'bg-white border-[#DFD6C7] text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${onlyVerified ? 'text-slate-950 fill-slate-950' : 'text-amber-500'}`} />
              <span>الأكثر طلباً</span>
            </button>

            {/* Grid vs List View Toggle */}
            <div className="flex items-center bg-white border border-[#DFD6C7] p-1 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="عرض شبكي"
                aria-label="عرض شبكي"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="عرض قائمة سريع"
                aria-label="عرض قائمة سريع"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar with Explicit Scroll Indicators on Mobile & PC */}
        <div className="mb-8">
          
          {/* Visual Helper Banner for Scrolling */}
          <div className="flex items-center justify-between gap-2 mb-2 px-1 text-xs">
            <span className="font-extrabold text-[#1A120D] flex items-center gap-1.5">
              <span>الأقسام الرئيسية:</span>
              <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                {categories.length} أقسام
              </span>
            </span>

            {/* Horizontal Scroll Hint with animated arrow */}
            <div className="flex items-center gap-1 text-[11px] text-amber-900 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
              <span>مرر لرؤية بقية الأقسام</span>
              <span className="text-amber-700">←</span>
            </div>
          </div>

          {/* Scrollable Categories Container with Floating Arrows */}
          <div className="relative flex items-center group">
            
            {/* Right Scroll Arrow (Visible on both mobile & desktop) */}
            <button
              onClick={() => scrollCategories('right')}
              className="flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#D8CABE] text-[#1A120D] shadow-md items-center justify-center hover:bg-amber-500 hover:border-amber-600 hover:text-slate-950 transition shrink-0 z-20 -mr-1 sm:-mr-2 cursor-pointer active:scale-90"
              aria-label="تمرير للأمام"
              title="مرر لليمين"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Fade Mask Right */}
            <div className="absolute right-7 inset-y-0 w-8 bg-gradient-to-l from-[#F6F2EC] to-transparent pointer-events-none z-10"></div>

            {/* Scrollable Chips */}
            <div
              ref={categoriesRef}
              onScroll={checkScrollState}
              className="flex-1 flex items-center gap-2 overflow-x-auto py-2 px-2 no-scrollbar scroll-smooth"
            >
              {categories.filter((c) => c.isActive !== false).map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = getCategoryCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                    }}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#1A120D] text-amber-400 shadow-md ring-2 ring-amber-400/60 scale-102 border border-[#1A120D]'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border-[1.5px] border-[#DFD6C7] hover:border-amber-400'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Fade Mask Left */}
            <div className="absolute left-7 inset-y-0 w-8 bg-gradient-to-r from-[#F6F2EC] to-transparent pointer-events-none z-10"></div>

            {/* Left Scroll Arrow (Visible on both mobile & desktop) */}
            <button
              onClick={() => scrollCategories('left')}
              className="flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#D8CABE] text-[#1A120D] shadow-md items-center justify-center hover:bg-amber-500 hover:border-amber-600 hover:text-slate-950 transition shrink-0 z-20 -ml-1 sm:-ml-2 cursor-pointer active:scale-90"
              aria-label="تمرير للخلف"
              title="مرر لليسار"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-[1.5px] border-[#DFD6C7] p-8 max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-600/50 mx-auto mb-3" />
            <h4 className="text-base font-black text-[#1A120D] mb-1">
              لا توجد وجبات تطابق بحثك
            </h4>
            <p className="text-xs text-stone-500 mb-4 font-medium">
              جرب البحث بكلمة أخرى أو تصفح الأقسام بالكامل.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setOnlyVerified(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1A120D] text-amber-400 text-xs font-bold hover:bg-stone-800 transition"
            >
              إعادة تعيين البحث
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* ======================================================== */
          /* 1. GRID VIEW MODE (بطاقات منظمة وعالية التباين) */
          /* ======================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.isAvailable && onSelectDish(item)}
                className={`food-card rounded-3xl overflow-hidden flex flex-col justify-between group ${
                  item.isAvailable ? 'cursor-pointer' : 'opacity-65 grayscale-20 cursor-not-allowed'
                }`}
              >
                <div>
                  {/* Food Image Container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100 border-b border-[#E8DEC\-F]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity"></div>
                    
                    {/* Top Right Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-start">
                      {item.tag && (
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Category Flame for Tannour Fish */}
                    {item.category === 'tannour_fish' && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 shadow-md">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          أفران طين ملتهبة
                        </span>
                      </div>
                    )}

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-600 text-white font-black text-xs px-4 py-1.5 rounded-xl shadow-lg">
                          غير متوفر حالياً
                        </span>
                      </div>
                    )}

                    {/* Customize Preview Button on Hover */}
                    {item.isAvailable && (
                      <div className="absolute bottom-3 left-3 opacity-95 sm:opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] font-black flex items-center gap-1 bg-black/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20 shadow">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>تخصيص الوجبة</span>
                      </div>
                    )}
                  </div>

                  {/* Details Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-black text-base sm:text-lg text-[#1A120D] group-hover:text-amber-800 transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3.5 font-medium">
                      {item.description}
                    </p>

                    {/* Distinct Price Box */}
                    <div className="text-xs font-bold text-amber-950 bg-amber-500/15 p-2.5 rounded-xl border border-amber-400/50 flex items-center justify-between">
                      <span className="text-stone-700">السعر يبدأ من:</span>
                      <div className="flex items-baseline gap-1 font-black text-base text-[#1A120D]">
                        <span>{item.basePrice}</span>
                        <span className="text-xs text-amber-800 font-extrabold">ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-3 mt-1 flex items-center justify-between gap-2.5 border-t border-[#EDE4D8] bg-[#FDFBF8]">
                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.isAvailable) onSelectDish(item);
                    }}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 py-2 px-1 transition cursor-pointer"
                  >
                    عرض الخيارات
                  </button>

                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.isAvailable) onSelectDish(item);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>أضف للطلب</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* ======================================================== */
          /* 2. COMPACT LIST VIEW MODE (عرض القائمة السريعة مثل جاهز) */
          /* ======================================================== */
          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.isAvailable && onSelectDish(item)}
                className={`food-card rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-200 group ${
                  item.isAvailable ? 'cursor-pointer hover:border-amber-500' : 'opacity-65 grayscale-20 cursor-not-allowed'
                }`}
              >
                {/* Right / Start Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.tag && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                      {item.tag.split('•')[0]}
                    </span>
                  )}
                </div>

                {/* Middle Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-sm sm:text-base text-[#1A120D] group-hover:text-amber-800 transition-colors truncate">
                      {item.name}
                    </h3>
                    {item.category === 'tannour_fish' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600 text-white shrink-0">
                        تنور
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2 font-medium">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1A120D] bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-300/50">
                      {item.basePrice} ر.س
                    </span>
                    {item.options && item.options.length > 0 && (
                      <span className="text-[11px] text-stone-500 font-medium">
                        ({item.options.length} أحجام متاحة)
                      </span>
                    )}
                  </div>
                </div>

                {/* Left / Action Button */}
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.isAvailable) onSelectDish(item);
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black flex items-center justify-center shadow-xs transition active:scale-90 cursor-pointer disabled:opacity-50"
                    title="تخصيص وإضافة"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <span className="text-[10px] text-stone-500 font-bold hidden sm:inline">
                    تخصيص
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
