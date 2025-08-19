import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionsDataContainer from '@/components/TransactionsDataTable/TransactionsDataContainer';

const TransactionsPage = () => {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <TransactionsDataContainer />
      </main>
    </ProtectedRoute>
  );
};

export default TransactionsPage;
