// app/page.tsx
import AddExpenseForm from '@/components/AddExpenseForm/AddExpenseForm';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-xl font-bold">Add a New Expense</h1>
      <AddExpenseForm />
    </main>
  );
}
