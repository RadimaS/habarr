import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'content';
  icon?: LucideIcon;
  className?: string;
}

export function Card({ children, variant = 'content', icon: Icon, className = '' }: CardProps) {
  const baseClass = variant === 'gradient' ? 'gradient-card' : 'content-card';
  
  return (
    <div className={`${baseClass} ${className}`}>
      {Icon && (
        <div className="mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      {children}
    </div>
  );
}