import React from 'react';

import { AuthGuard } from '@/components/auth-guard';
import AppNavbar from '@/components/navigation/AppNavbar';

const SettingsPage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <h1>Settings</h1>
        </main>
      </div>
    </AuthGuard>
  );
};

export default SettingsPage;
