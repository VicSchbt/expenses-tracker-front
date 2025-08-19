import ProtectedRoute from '@/components/ProtectedRoute';

const BudgetsPage = () => {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1>Budgets</h1>
      </main>
    </ProtectedRoute>
  );
};

export default BudgetsPage;
