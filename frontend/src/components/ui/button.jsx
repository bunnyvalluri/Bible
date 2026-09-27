import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

  const variants = {
    default: 'bg-primary-900 text-white hover:bg-primary-800 shadow-sm',
    gold: 'bg-gold-500 text-white font-medium hover:bg-gold-600 shadow-sm',
    outline: 'border border-border bg-white text-foreground hover:bg-muted hover:text-foreground',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    ghost: 'hover:bg-muted/80 text-foreground',
    glass: 'bg-white/90 border border-border text-foreground hover:bg-white shadow-sm'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base font-semibold',
    icon: 'h-10 w-10 p-0'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
