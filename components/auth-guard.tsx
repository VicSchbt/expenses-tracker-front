'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getAuthToken } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      if (isAuthenticated) {
        logout();
      }
      router.push('/login');
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, logout, router]);

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  const token = getAuthToken();
  if (!token || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
