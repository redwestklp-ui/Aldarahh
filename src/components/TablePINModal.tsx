import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext.tsx';

interface TablePINModalProps {
  isOpen: boolean;
  targetTableNumber: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const TablePINModal: React.FC<TablePINModalProps> = ({
  isOpen,
  targetTableNumber,
  onClose,
  onSuccess,
}) => {
  const { verifyAndStartTableSession, addAuditLog } = useRestaurant();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Rate-limiting / Brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setTimeout(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setPin('');
      setError('');
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLockedOut = lockoutTimer > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (pin.length !== 4) {
      setError('يرجى إدخال رمز التحقق المكون من 4 أرقام.');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      const res = verifyAndStartTableSession(targetTableNumber, pin);
      setIsVerifying(false);
      
      if (res.success) {
        setFailedAttempts(0);
        onSuccess();
        onClose();
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 4) {
          setLockoutTimer(60); // 60 seconds lockout
          setError('تم تجاوز الحد الأقصى للمحاولات الخاطئة. تم قفل المحاولات مؤقتاً لمدة 60 ثانية لحماية الطاولة.');
          addAuditLog('حماية الأمان', 'قفل محاولات PIN', `تم قفل محاولات إدخال PIN للطاولة رقم ${targetTableNumber} بعد 4 محاولات فاشلة متتالية.`);
        } else {
          setError(`${res.message} (تبقى لديك ${4 - newAttempts} محاولات قبل القفل المؤقت)`);
        }
      }
    }, 250);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-900 border-2 border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            نظام حماية طلبات الطاولات المشفر
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#1E140E]">
            تأكيد الجلوس على الطاولة رقم {targetTableNumber}
          </h3>
          <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
            لحماية طلباتك ومنع التلاعب، يرجى إدخال رمز التحقق السري (PIN) المطبوع على بطاقة طاولتك:
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-stone-800 mb-1.5 text-center">
              رمز التحقق المكون من 4 أرقام (PIN)
            </label>
            <input
              type="text"
              maxLength={4}
              pattern="\d*"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              disabled={isLockedOut}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              autoFocus
              className="w-full text-center text-3xl font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 bg-stone-50 text-stone-900 focus:bg-white outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Cooldown or Error Display */}
          {isLockedOut && (
            <div className="p-3.5 rounded-2xl bg-red-100 border border-red-300 text-xs text-red-900 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-700 animate-spin" />
                <span>إعادة المحاولة بعد:</span>
              </span>
              <span className="font-mono text-base font-black text-red-700">{lockoutTimer} ثانية</span>
            </div>
          )}

          {error && !isLockedOut && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || pin.length !== 4 || isLockedOut}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1E140E] hover:bg-stone-800 disabled:opacity-50 text-amber-400 font-black text-sm transition active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isVerifying ? 'جاري التحقق...' : 'بدء جلسة الطلب للطاولة'}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-stone-400 font-medium">
            رمز PIN مطبوع مباشرة على حامل بطاقة الطاولة، أو اطلب المساعدة من طاقم الضيافة.
          </p>
        </div>

      </div>
    </div>
  );
};
