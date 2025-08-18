'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token) {
      // preserve where user wanted to go
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
  }, [token, router, pathname]);

  if (!token) return null; // or a skeleton
  return <>{children}</>;
}
