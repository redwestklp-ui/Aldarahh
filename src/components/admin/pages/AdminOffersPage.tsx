import React, { useState } from 'react';
import { 
  Percent, 
  Tag, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { Coupon, DiscountOffer } from '../../../types/index.ts';

export const AdminOffersPage: React.FC = () => {
  const { 
    coupons, 
    addNewCoupon, 
    updateCoupon, 
    deleteCoupon, 
    toggleCouponActive,
    discountOffers,
    addDiscountOffer,
    updateDiscountOffer,
    deleteDiscountOffer,
    toggleDiscountOffer,
    categories,
    menuItems
  } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'discounts' | 'coupons'>('discounts');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(30);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number>(20);
  const [couponDesc, setCouponDesc] = useState('');

  // Discount Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerType, setOfferType] = useState<'percentage' | 'fixed'>('percentage');
  const [offerValue, setOfferValue] = useState<number>(15);
  const [offerTargetType, setOfferTargetType] = useState<'all' | 'category' | 'product'>('category');
  const [offerTargetId, setOfferTargetId] = useState<string>(categories[1]?.id || '');
  const [offerMinOrder, setOfferMinOrder] = useState<number>(40);

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCouponModalOpen) setIsCouponModalOpen(false);
        if (isOfferModalOpen) setIsOfferModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCouponModalOpen, isOfferModalOpen]);

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    addNewCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: couponDiscount,
      minOrderAmount: couponMinOrder,
      maxDiscount: couponMaxDiscount,
      isActive: true,
      description: couponDesc.trim() || `خصم ${couponDiscount}% عند الطلب بـ ${couponMinOrder} ريال فأكثر`,
      timesUsed: 0,
    });

    setCouponCode('');
    setIsCouponModalOpen(false);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;

    addDiscountOffer({
      id: `disc-${Date.now()}`,
      title: offerTitle.trim(),
      type: offerType,
      value: Number(offerValue),
      targetType: offerTargetType,
      targetIds: offerTargetId ? [offerTargetId] : [],
      minOrderAmount: Number(offerMinOrder) || 0,
      isActive: true,
    });

    setOfferTitle('');
    setIsOfferModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            العروض الترويجية وكوبونات الخصم
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            تنشيط المبيعات، خصومات فئات محددة، وأكواد الخصم الترويجية للعملاء
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'discounts' ? (
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إنشاء عرض خصم جديد</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إنشاء كوبون جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2D7C7] pb-2">
        <button
          onClick={() => setActiveSubTab('discounts')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'discounts'
              ? 'bg-[#1A120D] text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>عروض وخصومات الأصناف ({discountOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'coupons'
              ? 'bg-[#1A120D] text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>كوبونات الخصم ({coupons.length})</span>
        </button>
      </div>

      {/* Tab 1: Discount Offers */}
      {activeSubTab === 'discounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discountOffers.map((offer) => {
            const targetCat = offer.targetType === 'category' ? categories.find((c) => c.id === offer.targetIds[0]) : null;
            const targetProd = offer.targetType === 'product' ? menuItems.find((p) => p.id === offer.targetIds[0]) : null;

            return (
              <div key={offer.id} className="bg-white rounded-2xl p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-black text-sm text-[#1A120D]">{offer.title}</span>
                    <button
                      onClick={() => toggleDiscountOffer(offer.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border transition cursor-pointer ${
                        offer.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {offer.isActive ? 'نشط ومطبق' : 'متوقف'}
                    </button>
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-black text-amber-900">
                      {offer.type === 'percentage' ? `${offer.value}%` : `${offer.value} ريال`}
                    </span>
                    <span className="text-xs text-stone-500 font-bold">خصم مباشر</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-stone-400">يطبق على: </span>
                      <span className="font-bold text-stone-800">
                        {offer.targetType === 'all' && 'جميع أصناف المنيو'}
                        {offer.targetType === 'category' && `قسم: ${targetCat?.name || offer.targetIds[0]}`}
                        {offer.targetType === 'product' && `صنف: ${targetProd?.name || offer.targetIds[0]}`}
                      </span>
                    </div>

                    {offer.minOrderAmount && offer.minOrderAmount > 0 && (
                      <div>
                        <span className="text-stone-400">الحد الأدنى للطلب: </span>
                        <span className="font-bold">{offer.minOrderAmount} ريال</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-700 font-bold">
                    يطبق تلقائياً في السلة
                  </span>
                  <button
                    onClick={() => deleteDiscountOffer(offer.id)}
                    className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                    title="حذف العرض"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Coupons */}
      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.code} className="bg-white rounded-2xl p-5 border border-[#E2D7C7] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-base text-amber-950 bg-amber-100 px-3 py-1 rounded-xl">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => toggleCouponActive(coupon.code)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border transition cursor-pointer ${
                      coupon.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-100 text-stone-500 border-stone-300'
                    }`}
                  >
                    {coupon.isActive ? 'مفعل للعملاء' : 'معطل'}
                  </button>
                </div>

                <p className="text-xs text-stone-600 font-medium mb-3">
                  {coupon.description}
                </p>

                <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">قيمة الخصم:</span>
                    <span className="font-bold text-amber-900">
                      {coupon.discountPercent ? `${coupon.discountPercent}%` : `${coupon.discountAmount} ريال`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">الحد الأدنى للطلب:</span>
                    <span className="font-bold">{coupon.minOrderAmount} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">مرات الاستخدام:</span>
                    <span className="font-bold">{coupon.timesUsed || 0} مرات</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400">يدخله العميل في السلة</span>
                <button
                  onClick={() => deleteCoupon(coupon.code)}
                  className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                  title="حذف الكوبون"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Discount Offer */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">إنشاء عرض خصم جديد</h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">عنوان العرض الترويجي: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خصم وجبات الغداء 15%"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">نوع الخصم:</label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ريال)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">قيمة الخصم: *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={offerValue}
                    onChange={(e) => setOfferValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">يطبق الخصم على:</label>
                <select
                  value={offerTargetType}
                  onChange={(e) => setOfferTargetType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold mb-2"
                >
                  <option value="category">قسم كامل من المنيو</option>
                  <option value="product">صنف واحد محدد</option>
                  <option value="all">جميع أصناف المطعم</option>
                </select>

                {offerTargetType === 'category' && (
                  <select
                    value={offerTargetId}
                    onChange={(e) => setOfferTargetId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}

                {offerTargetType === 'product' && (
                  <select
                    value={offerTargetId}
                    onChange={(e) => setOfferTargetId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  >
                    {menuItems.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.basePrice} ريال)</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">الحد الأدنى لقيمة الطلب (ريال):</label>
                <input
                  type="number"
                  min="0"
                  value={offerMinOrder}
                  onChange={(e) => setOfferMinOrder(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  حفظ وتفعيل العرض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Coupon */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">إنشاء كود كوبون جديد</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">كود الكوبون: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: AFIF15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono font-black text-sm uppercase outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">نسبة الخصم (%): *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="90"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">الحد الأدنى للطلب (ريال): *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">وصف الكوبون التوضيحي للعميل:</label>
                <input
                  type="text"
                  placeholder="مثال: خصم 15% بمناسبة الافتتاح"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  حفظ الكوبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
