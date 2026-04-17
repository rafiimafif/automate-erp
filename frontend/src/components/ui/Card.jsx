import React from 'react';
import { cn } from './Button'; 

export function Card({ className, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-premium transition-all duration-300 ease-out",
        "hover:shadow-glass hover:-translate-y-1 hover:border-slate-300/60",
        className
      )} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-lg font-bold text-slate-900 tracking-tight", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-slate-500 mt-1", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  );
}

