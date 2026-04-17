import React from 'react';

// Simple helper to merge tailwind classes properly
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function Button({ variant = 'default', size = 'md', className = '', children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-[0.98] outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap opacity-100 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-9 w-9 p-0"
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
