import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';
import { StaffMember, StaffRole, RolePermissions } from '../../../types/index.ts';

export const AdminStaffPage: React.FC = () => {
  const { 
    staff, 
    addStaffMember, 
    updateStaffMember, 
    deleteStaffMember, 
    rolesPermissions, 
    updateRolePermissions,
    currentStaffUser,
    switchStaffRole
  } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'staff' | 'roles'>('staff');

  // Add staff modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<StaffRole>('cashier');

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
    setEditingStaff(null);
    setFormName('');
    setFormPhone('');
    setFormRole('cashier');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setFormName(s.name);
    setFormPhone(s.phone);
    setFormRole(s.role);
    setIsModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        role: formRole,
      });
    } else {
      addStaffMember({
        id: `staff-${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        role: formRole,
        status: 'active',
        lastLogin: 'لم يسجل دخول بعد',
      });
    }

    setIsModalOpen(false);
  };

  const getRoleLabel = (role: StaffRole) => {
    switch (role) {
      case 'manager':
        return 'المدير العام';
      case 'cashier':
        return 'أمين الصندوق (الكاشير)';
      case 'kitchen':
        return 'طاقم المطبخ والتنور';
      case 'waiter':
        return 'كابتن الصالة';
      case 'delivery':
        return 'مندوب التوصيل';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2D7C7] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1A120D]">
            إدارة الموظفين والصلاحيات
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            توزيع الأدوار التشغيلية (المدير، الكاشير، الشيف، الصالة، التوصيل) وتحديد صلاحيات كل دور
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'staff' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة موظف جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2D7C7] pb-2">
        <button
          onClick={() => setActiveSubTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'staff'
              ? 'bg-[#1A120D] text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>طاقم العمل والموظفين ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'roles'
              ? 'bg-[#1A120D] text-amber-400 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>مصفوفة الأدوار والصلاحيات</span>
        </button>
      </div>

      {/* SubTab 1: Staff Directory */}
      {activeSubTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-[#E2D7C7] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2D7C7] text-stone-600 font-black">
                <tr>
                  <th className="p-3.5 pr-5">اسم الموظف</th>
                  <th className="p-3.5">الدور الوظيفي</th>
                  <th className="p-3.5">الجوال</th>
                  <th className="p-3.5">آخر تسجيل دخول</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 pl-5 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/70 transition">
                    <td className="p-3.5 pr-5 font-black text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div>{s.name}</div>
                          {s.id === currentStaffUser.id && (
                            <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                              حسابك الحالي
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-bold text-stone-800">
                      <span className="bg-stone-100 px-2.5 py-1 rounded-lg">
                        {getRoleLabel(s.role)}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-stone-600 font-bold">
                      {s.phone}
                    </td>

                    <td className="p-3.5 text-stone-500 font-medium">
                      {s.lastLogin || 'الآن'}
                    </td>

                    <td className="p-3.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {s.status === 'active' ? 'نشط' : 'معطل'}
                      </span>
                    </td>

                    <td className="p-3.5 pl-5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => switchStaffRole(s.role)}
                          className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] transition cursor-pointer"
                          title="تجربة الدخول بهذا الحساب"
                        >
                          تسجيل دخول
                        </button>

                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {s.id !== currentStaffUser.id && (
                          <button
                            onClick={() => deleteStaffMember(s.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Roles Permissions Matrix */}
      {activeSubTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-[#E2D7C7] p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-black text-sm text-[#1A120D]">
              صلاحيات الأقسام بحسب الدور الوظيفي
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              يتم تطبيق هذه القواعد آلياً على مستوى العمليات لمنع التعديلات غير المصرح بها
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2D7C7] text-stone-700 font-black">
                <tr>
                  <th className="p-3 pr-4">الدور الوظيفي</th>
                  <th className="p-3">معالجة الطلبات</th>
                  <th className="p-3">إلغاء الطلبات</th>
                  <th className="p-3">إدارة الأصناف</th>
                  <th className="p-3">العروض والخصومات</th>
                  <th className="p-3">الطاولات والـ QR</th>
                  <th className="p-3">إعدادات المطعم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rolesPermissions.map((rp) => (
                  <tr key={rp.role} className="hover:bg-stone-50/70">
                    <td className="p-3 pr-4 font-black text-stone-900">
                      {rp.label}
                    </td>
                    <td className="p-3">
                      {rp.permissions.orders.edit ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rp.permissions.orders.cancel ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rp.permissions.products.edit ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rp.permissions.discounts.edit ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rp.permissions.tables.edit ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rp.permissions.settings.edit ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1">✓ مسموح</span>
                      ) : (
                        <span className="text-stone-300">✕ محظور</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-black text-base text-[#1A120D]">
                {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد لطاقم المطعم'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم الموظف: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الشيف عبدالله"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">رقم الجوال: *</label>
                <input
                  type="text"
                  required
                  placeholder="05XXXXXXXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">الدور الوظيفي والصلاحيات: *</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold outline-none"
                >
                  <option value="manager">المدير العام (صلاحيات كاملة)</option>
                  <option value="cashier">أمين الصندوق (الكاشير)</option>
                  <option value="kitchen">شيف المطبخ والتنور</option>
                  <option value="waiter">كابتن الصالة والطاولات</option>
                  <option value="delivery">سائق التوصيل</option>
                </select>
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
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
