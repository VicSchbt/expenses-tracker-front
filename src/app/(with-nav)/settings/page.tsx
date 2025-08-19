import ProtectedRoute from '@/components/ProtectedRoute';

const SettingsPage = () => {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1>Settings</h1>
      </main>
    </ProtectedRoute>
  );
};

export default SettingsPage;
