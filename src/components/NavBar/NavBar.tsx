// ──────────────────────────────────────────────────────────────────────────────
// Component: NavBar
// - Fixed bottom navigation bar with a central primary action button (FAB)
// - A11y-friendly (aria-labels, aria-current, focus states, large hit areas)
// - Safe-area aware for iOS notches
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { NavItem, NavKey } from './navBar.types';
import { cn } from '@/lib/utils';

interface NavBarProps {
  items: [NavItem, NavItem, NavItem, NavItem];
  current: NavKey;
}

const NavBar = ({ items, current }: NavBarProps) => {
  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 m-4 rounded-xl bg-white shadow-[0_0_20px_2px_rgba(0,0,0,0.35)]',
        // safe-area: keep content above iOS home indicator
        'pb-[max(env(safe-area-inset-bottom),0px)]'
      )}
    >
      <ul className="grid grid-cols-4 items-center justify-items-center">
        {items.map((item) => {
          const isActive = current === item.key;

          return (
            <li key={item.key} className="col-span-1 p-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative inline-flex h-14 w-14 items-center justify-center rounded-xl transition outline-none',
                  'focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  'motion-safe:hover:scale-[1.03]',
                  isActive
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <span aria-hidden className="h-6 w-6">
                  {item.icon}
                </span>

                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
