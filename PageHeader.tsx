import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="header-content">
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="w-8 h-8 text-white" />}
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>
        {description && (
          <p className="text-white/90 text-lg mb-6">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}