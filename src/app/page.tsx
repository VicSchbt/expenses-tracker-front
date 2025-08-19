import AddExpenseForm from '@/components/AddExpenseForm/AddExpenseForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionsDataContainer from '@/components/TransactionsDataTable/TransactionsDataContainer';

export default async function Home() {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="mb-4 text-xl font-bold">Add a New Expense</h1>
        <AddExpenseForm />
        <TransactionsDataContainer />
      </main>
    </ProtectedRoute>
  );
}
