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
    default: 'bg-primary-900 text-white hover:bg-primary-800 dark:bg-gold-400 dark:text-primary-950 dark:hover:bg-gold-300 shadow-md',
    gold: 'bg-gradient-to-r from-gold-500 to-gold-400 text-primary-950 font-semibold hover:from-gold-400 hover:to-gold-300 shadow-divine',
    outline: 'border border-border bg-transparent hover:bg-muted hover:text-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-muted/80 text-foreground',
    glass: 'glass-panel hover:bg-white/90 dark:hover:bg-primary-900/90 text-foreground shadow-sm'
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
