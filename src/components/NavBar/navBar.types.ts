import React from 'react';

export type NavKey = 'home' | 'transactions' | 'budgets' | 'settings';

export type NavItem = {
  key: NavKey;
  label: string;
  icon: React.ReactNode;
  href: string;
};
