import React from 'react';

import { AuthGuard } from '@/components/auth-guard';
import AppNavbar from '@/components/navigation/AppNavbar';

const MorePage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <h1>More</h1>
        </main>
      </div>
    </AuthGuard>
  );
};

export default MorePage;
