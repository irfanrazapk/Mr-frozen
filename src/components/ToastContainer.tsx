import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold backdrop-blur-md border transition-all animate-in slide-in-from-left duration-200 ${
            t.type === 'error'
              ? 'bg-red-900/90 text-white border-red-700'
              : t.type === 'info'
              ? 'bg-slate-900/90 text-white border-slate-700'
              : 'bg-brand-primary text-white border-brand-leaf/40'
          }`}
        >
          {t.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
          ) : t.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-brand-leaf shrink-0" />
          )}
          <span className="leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
