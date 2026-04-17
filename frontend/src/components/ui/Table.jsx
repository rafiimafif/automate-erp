import React from 'react';
import { cn } from './Button';

export const Table = ({ children, className }) => (
  <div className="w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className={cn("w-full text-left text-sm text-slate-600", className)}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className }) => (
  <thead className={cn("bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100", className)}>
    {children}
  </thead>
);

export const TableRow = ({ children, isHoverable = true, className }) => (
  <tr className={cn("border-b border-slate-100 last:border-0", isHoverable && "hover:bg-slate-50 transition-colors", className)}>
    {children}
  </tr>
);

export const TableHead = ({ children, className }) => (
  <th className={cn("p-4 align-middle font-semibold", className)}>
    {children}
  </th>
);

export const TableCell = ({ children, className }) => (
  <td className={cn("p-4 align-middle", className)}>
    {children}
  </td>
);

export const TableBody = ({ children, className }) => (
  <tbody className={cn("divide-y divide-slate-50", className)}>
    {children}
  </tbody>
);
