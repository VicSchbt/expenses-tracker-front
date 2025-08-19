import { NavItem } from './navBar.types';
import { Home, ArrowLeftRight, ChartPie, Settings } from 'lucide-react';

const size = 'size-6';

export const NavItems: [NavItem, NavItem, NavItem, NavItem] = [
  {
    key: 'home',
    label: 'Home',
    icon: <Home className={size} aria-hidden />,
    href: '/',
  },
  {
    key: 'transactions',
    label: 'Transactions',
    icon: <ArrowLeftRight className={size} aria-hidden />,
    href: '/transactions',
  },
  {
    key: 'budgets',
    label: 'Budgets',
    icon: <ChartPie className={size} aria-hidden />,
    href: '/budgets',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <Settings className={size} aria-hidden />,
    href: '/settings',
  },
];

export default NavItems;
