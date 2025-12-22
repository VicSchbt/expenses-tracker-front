'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/use-auth-store';

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogoutClick = (): void => {
    logout();
    router.push('/login');
  };

  const isCurrentPath = (path: string): boolean => {
    return pathname === path;
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-primary-foreground">
            💰
          </span>
          <Link href="/" className="text-sm font-semibold">
            Expense Tracker
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className={`rounded-md px-3 py-1.5 ${
              isCurrentPath('/')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/categories"
            className={`rounded-md px-3 py-1.5 ${
              isCurrentPath('/categories')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/savings"
            className={`rounded-md px-3 py-1.5 ${
              isCurrentPath('/savings-goals')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Savings
          </Link>
          <Button variant="outline" size="sm" type="button" onClick={handleLogoutClick}>
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
