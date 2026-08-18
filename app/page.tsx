"use client";

import { useExpenseStore } from "@/store/useExpensesStore";
import { useEffect } from "react";

import FormDialog from "@/components/common/FormDialog/FormDialog";
import { Transaction } from "@/lib/types";

const Home = () => {
  const { expenses, getExpenses, createExpense } = useExpenseStore();

  useEffect(() => {
    function fetchData() {
      try {
        getExpenses();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load recent transactions";
        console.log(errorMessage);
      }
    }
    void fetchData();
  }, [getExpenses]);

  const handleSubmit = async (data: Omit<Transaction, "id" | "type">) => {
    await createExpense(data);
    getExpenses();
  };

  return (
    <main className="flex flex-col gap-4 p-8">
      <FormDialog
        mode="create"
        triggerLabel="Add an expense"
        dialogTitle="Add an expense"
        onSubmit={handleSubmit}
      />

      <ul>
        {expenses.map((expense) => {
          return (
            <li key={expense.id}>
              {expense.label} - {expense.value} - {expense.date.toString()}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Home;
