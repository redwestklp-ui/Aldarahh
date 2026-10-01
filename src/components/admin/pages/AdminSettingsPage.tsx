import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Clock, 
  Truck, 
  CreditCard, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Check, 
  Save, 
  RotateCcw,
  ShieldAlert,
  Phone,
  MessageCircle,
  MapPin,
  Utensils,
  ShoppingBag,
  Power,
  Info
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminSettingsPage: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    toggleRestaurantOpen, 
    toggleEmergencyPause, 
    toggleOrderChannel,
    addAuditLog 
  } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'hours' | 'channels' | 'payments' | 'emergency'>('general');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Local editable form states
  const [name, setName] = useState(settings.name || 'فوال وشعبيات شعاع الدره');
  const [tagline, setTagline] = useState(settings.tagline || 'أشهى المأكولات الشعبية والفطور الصباحي في محافظة عفيف');
  const [phone, setPhone] = useState(settings.phone || '0555319888');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '966555319888');
  const [address, setAddress] = useState(settings.address || 'طريق الملك عبدالعزيز، حي العزيزية، محافظة عفيف 11971، المملكة العربية السعودية');
  
  // Business hours state
  const [businessHours, setBusinessHours] = useState(settings.businessHours || {
    saturday: { open: '05:30', close: '23:30', isOpen: true },
    sunday: { open: '05:30', close: '23:30', isOpen: true },
    monday: { open: '05:30', close: '23:30', isOpen: true },
    tuesday: { open: '05:30', close: '23:30', isOpen: true },
    wednesday: { open: '05:30', close: '23:30', isOpen: true },
    thursday: { open: '05:30', close: '00:00', isOpen: true },
    friday: { open: '05:30', close: '23:30', isOpen: true },
  });

  // Emergency Pause text
  const [emergencyMsg, setEmergencyMsg] = useState(settings.emergencyMessage || 'نعتذر منكم، الطلبات متوقفة مؤقتاً لأعمال الصيانة والتجهيز');

  const daysLabels: { [key: string]: string } = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
  };

  const showSuccessFeedback = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      tagline,
      phone,
      whatsappNumber,
      address,
    });
    addAuditLog('المدير العام', 'تحديث الإعدادات العامة', 'تم تحديث بيانات المطعم والعناوين وأرقام التواصل.');
    showSuccessFeedback('تم حفظ بيانات المطعم والتواصل بنجاح!');
  };

  const handleSaveHours = () => {
    updateSettings({ businessHours });
    addAuditLog('المدير العام', 'تعديل ساعات العمل', 'تم تحديث أوقات الدوام لجميع أيام الأسبوع.');
    showSuccessFeedback('تم تحديث جدول ساعات العمل الأسبوعية بنجاح!');
  };

  const handleToggleEmergency = () => {
    toggleEmergencyPause(emergencyMsg);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
            <Settings className="w-4 h-4 text-amber-600" />
            <span>مركز إدارة النظام والإعدادات</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            إعدادات المطعم والتشغيل
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            تحكم بساعات العمل، قنوات الطلب، خيارات الدفع، والتنبيهات وحالة الطوارئ.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200">
          <button
            onClick={toggleRestaurantOpen}
            className={`py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer ${
              settings.isRestaurantOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{settings.isRestaurantOpen ? 'المطعم: مفتوح الآن' : 'المطعم: مغلق حالياً'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage('')} className="text-stone-400 hover:text-stone-600">
            ✕
          </button>
        </div>
      )}

      {/* Emergency Mode Alert Banner if active */}
      {settings.emergencyPauseOrders && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-black text-red-700">وضع الطوارئ نشط: استقبال الطلبات متوقف حالياً!</div>
            <div className="text-[11px] text-red-600 mt-0.5">الرسالة المعروضة للزبائن: "{settings.emergencyMessage}"</div>
          </div>
          <button
            onClick={handleToggleEmergency}
            className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition"
          >
            إلغاء وضع الطوارئ
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200">
        {[
          { id: 'general', label: 'المعلومات والتواصل', icon: Store },
          { id: 'hours', label: 'ساعات العمل والدوام', icon: Clock },
          { id: 'channels', label: 'قنوات الطلب (صالة / سفري / توصيل)', icon: Utensils },
          { id: 'payments', label: 'طرق الدفع والتسوية', icon: CreditCard },
          { id: 'emergency', label: 'منطقة الطوارئ والحماية', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General & Contact */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-black text-stone-900">بيانات المتجر والفرع الرسمي</h3>
            <p className="text-xs text-stone-500 mt-0.5">هذه البيانات تظهر في ترويسة الموقع، الفواتير، ورسائل الواتساب.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">اسم المطعم التجاري</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:border-amber-500 text-xs font-bold text-stone-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">الشعار التسويقي (Slogan)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 focus:border-amber-500 text-xs text-stone-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">رقم الهاتف للاتصال المباشر</label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 pr-10 pl-3.5 rounded-xl border border-stone-200 focus:border-amber-500 text-xs font-mono font-bold text-stone-900 outline-none text-left"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">رقم الواتساب لاستقبال الطلبات (صيغة دولية)</label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full py-2.5 pr-10 pl-3.5 rounded-xl border border-stone-200 focus:border-amber-500 text-xs font-mono font-bold text-stone-900 outline-none text-left"
                />
                <MessageCircle className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">العنوان التفصيلي وموقع الفرع</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-2.5 pr-10 pl-3.5 rounded-xl border border-stone-200 focus:border-amber-500 text-xs font-bold text-stone-900 outline-none"
                />
                <MapPin className="w-4 h-4 text-amber-600 absolute right-3 top-3" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات العامة</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Business Hours */}
      {activeSubTab === 'hours' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-stone-900">ساعات العمل والدوام الأسبوعي</h3>
              <p className="text-xs text-stone-500 mt-0.5">حدد أوقات بدء الفطور ونهاية العشاء لكل يوم في الأسبوع.</p>
            </div>
            <button
              onClick={handleSaveHours}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التوقيتات</span>
            </button>
          </div>

          <div className="space-y-3">
            {Object.keys(daysLabels).map((dayKey) => {
              const dayConfig = (businessHours as any)[dayKey] || { open: '05:30', close: '23:30', isOpen: true };
              return (
                <div 
                  key={dayKey}
                  className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    dayConfig.isOpen ? 'bg-stone-50 border-stone-200' : 'bg-stone-100/70 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessHours((prev: any) => ({
                          ...prev,
                          [dayKey]: { ...prev[dayKey], isOpen: !prev[dayKey].isOpen },
                        }));
                      }}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                        dayConfig.isOpen ? 'bg-emerald-600' : 'bg-stone-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          dayConfig.isOpen ? 'left-1' : 'right-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-black text-stone-900 w-20">
                      {daysLabels[dayKey]}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      dayConfig.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {dayConfig.isOpen ? 'يعمل' : 'مغلق'}
                    </span>
                  </div>

                  {dayConfig.isOpen ? (
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <span>من:</span>
                        <input
                          type="time"
                          value={dayConfig.open}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBusinessHours((prev: any) => ({
                              ...prev,
                              [dayKey]: { ...prev[dayKey], open: val },
                            }));
                          }}
                          className="py-1 px-2 rounded-lg bg-white border border-stone-300 text-xs font-mono font-bold text-stone-900"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <span>إلى:</span>
                        <input
                          type="time"
                          value={dayConfig.close}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBusinessHours((prev: any) => ({
                              ...prev,
                              [dayKey]: { ...prev[dayKey], close: val },
                            }));
                          }}
                          className="py-1 px-2 rounded-lg bg-white border border-stone-300 text-xs font-mono font-bold text-stone-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-bold self-end sm:self-auto">
                      مغلق طوال اليوم
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Order Channels */}
      {activeSubTab === 'channels' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-black text-stone-900">التحكم في قنوات استقبال الطلبات</h3>
            <p className="text-xs text-stone-500 mt-0.5">يمكنك تشغيل أو إيقاف أي قناة طلب بشكل مستقل حسب الضغط وساعات الذروة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Dine In */}
            <div className={`p-5 rounded-2xl border-2 transition ${
              settings.orderChannels.dineIn 
                ? 'bg-amber-50/50 border-amber-300' 
                : 'bg-stone-50 border-stone-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <button
                  onClick={() => toggleOrderChannel('dineIn')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    settings.orderChannels.dineIn
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {settings.orderChannels.dineIn ? 'مفعل' : 'معطل'}
                </button>
              </div>
              <h4 className="text-sm font-black text-stone-900">طلبات داخل الصالة (الطاولات)</h4>
              <p className="text-xs text-stone-500 mt-1">
                الطلب المباشر من الجوال لزبائن الصالة عبر مسح QR أو اختيار رقم الطاولة.
              </p>
            </div>

            {/* Takeaway / Pickup */}
            <div className={`p-5 rounded-2xl border-2 transition ${
              settings.orderChannels.takeaway 
                ? 'bg-amber-50/50 border-amber-300' 
                : 'bg-stone-50 border-stone-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <button
                  onClick={() => toggleOrderChannel('takeaway')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    settings.orderChannels.takeaway
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {settings.orderChannels.takeaway ? 'مفعل' : 'معطل'}
                </button>
              </div>
              <h4 className="text-sm font-black text-stone-900">الاستلام من الفرع (سفري)</h4>
              <p className="text-xs text-stone-500 mt-1">
                تجهيز الطلب مسبقاً وتحديده للاستلام الفوري من كاونتر المطعم.
              </p>
            </div>

            {/* Delivery */}
            <div className={`p-5 rounded-2xl border-2 transition ${
              settings.orderChannels.delivery 
                ? 'bg-amber-50/50 border-amber-300' 
                : 'bg-stone-50 border-stone-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <button
                  onClick={() => toggleOrderChannel('delivery')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    settings.orderChannels.delivery
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {settings.orderChannels.delivery ? 'مفعل' : 'معطل'}
                </button>
              </div>
              <h4 className="text-sm font-black text-stone-900">خدمة التوصيل لأحياء عفيف</h4>
              <p className="text-xs text-stone-500 mt-1">
                توصيل الطلبات للبيوت والاستراحات ومواقع العمل عبر مناديب المطعم.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Payment Methods */}
      {activeSubTab === 'payments' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-black text-stone-900">طرق الدفع والتسوية المالية</h3>
            <p className="text-xs text-stone-500 mt-0.5">حدد وسائل السداد المتاحة للزبائن أثناء إنهاء الطلب.</p>
          </div>

          <div className="space-y-3 max-w-xl">
            {[
              {
                id: 'cash',
                label: 'الدفع نقداً (كاش)',
                desc: 'السداد نقداً للكاشير أو لمندوب التوصيل عند استلام الوجبة.',
                active: settings.paymentMethods.cash,
                onToggle: () => {
                  updateSettings({
                    paymentMethods: { ...settings.paymentMethods, cash: !settings.paymentMethods.cash },
                  });
                },
              },
              {
                id: 'cardOnDelivery',
                label: 'شبكة مدى / بطاقة بنكية عند الاستلام أو التوصيل',
                desc: 'يتوفر جهاز نقاط بيع (POS) محمول مع المندوب وفي الكاونتر.',
                active: settings.paymentMethods.cardOnDelivery,
                onToggle: () => {
                  updateSettings({
                    paymentMethods: { ...settings.paymentMethods, cardOnDelivery: !settings.paymentMethods.cardOnDelivery },
                  });
                },
              },
              {
                id: 'onlineCard',
                label: 'الدفع الإلكتروني المباشر (مدى، فيزا، Apple Pay)',
                desc: 'خصم مباشر عبر بوابة الدفع الآمنة قبل تأكيد الطلب.',
                active: settings.paymentMethods.onlineCard,
                onToggle: () => {
                  updateSettings({
                    paymentMethods: { ...settings.paymentMethods, onlineCard: !settings.paymentMethods.onlineCard },
                  });
                },
              },
            ].map((method) => (
              <div
                key={method.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-black text-stone-900">{method.label}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{method.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={method.onToggle}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    method.active
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {method.active ? 'مفعل' : 'معطل'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Emergency Zone */}
      {activeSubTab === 'emergency' && (
        <div className="bg-white p-6 rounded-3xl border-2 border-red-200 shadow-xs space-y-6">
          <div className="border-b border-red-100 pb-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-black text-red-700">منطقة الطوارئ والحماية التشغيلية</h3>
            </div>
            <p className="text-xs text-stone-500">
              عمليات حساسة تؤثر فوراً على استقبال طلبات الزبائن في المتجر الإلكتروني.
            </p>
          </div>

          {/* Emergency Pause Orders */}
          <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-red-900">
                  إيقاف مؤقت لجميع الطلبات (Emergency Pause)
                </h4>
                <p className="text-xs text-red-700/80 mt-0.5">
                  استخدم هذا الخيار في أوقات الذروة الشديدة أو عند انقطاع الكهرباء أو الطوارئ.
                </p>
              </div>
              <button
                onClick={handleToggleEmergency}
                className={`py-2 px-5 rounded-xl text-xs font-black transition cursor-pointer shadow-sm ${
                  settings.emergencyPauseOrders
                    ? 'bg-stone-800 hover:bg-stone-900 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {settings.emergencyPauseOrders ? 'استئناف استقبال الطلبات' : 'تفعيل الإيقاف المؤقت فوراً'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-red-800 mb-1">
                نص الرسالة التي ستظهر للزبائن عند محاولة الطلب:
              </label>
              <input
                type="text"
                value={emergencyMsg}
                onChange={(e) => setEmergencyMsg(e.target.value)}
                placeholder="مثال: نعتذر منكم، الطلبات متوقفة مؤقتاً لأعمال الصيانة والتجهيز"
                className="w-full py-2.5 px-3.5 rounded-xl border border-red-300 bg-white text-xs font-bold text-stone-900 outline-none"
              />
            </div>
          </div>

          {/* Master Open / Close */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-stone-900">إغلاق المطعم بالكامل</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                تغيير حالة المطعم إلى مغلق في غير أوقات الدوام أو أثناء الإجازات الرسمية.
              </p>
            </div>
            <button
              onClick={toggleRestaurantOpen}
              className={`py-2 px-5 rounded-xl text-xs font-black transition cursor-pointer ${
                settings.isRestaurantOpen
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {settings.isRestaurantOpen ? 'إغلاق المطعم الآن' : 'فتح المطعم الآن'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
