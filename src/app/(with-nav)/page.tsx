import AddExpenseModal from '@/components/AddExpenseModal/AddExpenseModal';
import ProtectedRoute from '@/components/ProtectedRoute';

export default async function Home() {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Home</h1>
          <AddExpenseModal /> {/* Button that opens the modal */}
        </header>
      </main>
    </ProtectedRoute>
  );
}
