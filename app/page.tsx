"use client";

import { useTransactionsStore } from "@/store/useTransactionsStore";
import Form from "next/form";
import { useEffect } from "react";

const Home = () => {
  const { transactions, getTransactions } = useTransactionsStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await getTransactions();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load recent transactions";
      }
    }
    void fetchData();
  }, [getTransactions]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* <Form action={createTransaction} className="space-y-6">
        <div>
          <label htmlFor="label" className="block text-lg mb-2">
            Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            placeholder="Enter your transaction label"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-lg mb-2">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </Form> */}
        <ul>
          {transactions.map((transaction) => {
            return (
              <li key={transaction.id}>
                {transaction.label} - {transaction.amount} -{" "}
                {transaction.date.toString()}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default Home;
