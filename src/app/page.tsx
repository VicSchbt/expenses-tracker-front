// app/page.tsx
import AddExpenseForm from '@/components/AddExpenseForm/AddExpenseForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="mb-4 text-xl font-bold">Add a New Expense</h1>
        <AddExpenseForm />
      </main>
    </ProtectedRoute>
  );
}
