'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { getAuthToken } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && isAuthenticated) {
      logout();
      router.push('/login');
      return;
    }
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, logout, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}

