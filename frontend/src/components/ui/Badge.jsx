import React from 'react';
import { cn } from './Button';

export function Badge({ variant = 'default', className, children, ...props }) {
  const baseStyles = "inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border transition-colors";
  
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-blue-50 text-blue-600 border-blue-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    danger: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
