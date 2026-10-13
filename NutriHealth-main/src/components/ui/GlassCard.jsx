import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] shadow-[var(--nc-shadow-md)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}