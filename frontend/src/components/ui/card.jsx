import React from 'react';
import { cn } from './button';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-semibold leading-none tracking-tight text-xl', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-primary-900 text-white',
    gold: 'bg-gold-100 text-gold-900 border border-gold-300',
    outline: 'border border-border text-foreground bg-white',
    secondary: 'bg-muted text-muted-foreground'
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
