import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  items: {
    path: string;
    label: string;
  }[];
}

export function Navigation({ items }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex space-x-8">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={location.pathname === item.path ? 'nav-link-active' : 'nav-link'}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}