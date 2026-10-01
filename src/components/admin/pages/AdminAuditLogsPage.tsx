import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Clock, 
  User, 
  AlertCircle, 
  Tag, 
  CheckCircle2, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext.tsx';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');

  // Available unique users
  const uniqueUsers = Array.from(new Set(auditLogs.map((l) => l.user)));

  const filteredLogs = auditLogs.filter((log) => {
    const matchesUser = selectedUserFilter === 'all' || log.user === selectedUserFilter;
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUser && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['التاريخ والوقت', 'المستخدم', 'نوع العملية', 'التفاصيل'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shuaa_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionColor = (action: string) => {
    if (action.includes('حذف') || action.includes('فاشل') || action.includes('إلغاء') || action.includes('طوارئ')) {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (action.includes('تعديل') || action.includes('سعر') || action.includes('تحديث')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (action.includes('دخول') || action.includes('إضافة') || action.includes('إنشاء') || action.includes('تأكيد')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    return 'bg-stone-50 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>الحماية والرقابة الإدارية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            سجل العمليات والتدقيق (Audit Trail)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            توثيق دقيق لكل عملية: من قام بها، في أي وقت، وما هي التعديلات التي تمت.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>تصدير السجل CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في السجل (نوع العملية، التفاصيل، اسم الموظف)..."
            className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-amber-500 text-xs font-medium text-stone-900 outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">كل الموظفين والمشرفين</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold space-y-2">
            <FileText className="w-10 h-10 mx-auto text-stone-300" />
            <div>لا توجد سجلات مطابقة لخيارات البحث.</div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                    <th className="py-3 px-4">الوقت والتاريخ</th>
                    <th className="py-3 px-4">الموظف / المشرف</th>
                    <th className="py-3 px-4">نوع الإجراء</th>
                    <th className="py-3 px-4">التفاصيل والتغييرات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-700" />
                          <span>{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-black ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium leading-relaxed">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-stone-100">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>{log.user}</span>
                  </div>
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  );
};
