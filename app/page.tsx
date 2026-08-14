"use client";

import { useTransactionsStore } from "@/store/useTransactionsStore";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

const Home = () => {
  const { transactions, getTransactions, createTransaction } =
    useTransactionsStore();
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState(0);

  useEffect(() => {
    function fetchData() {
      try {
        getTransactions();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load recent transactions";
      }
    }
    void fetchData();
  }, [getTransactions]);

  const handleSubmit = async () => {
    const data = {
      label,
      date: new Date(date),
      value,
    };
    await createTransaction(data);
    setLabel("");
    setDate("");
    setValue(0);
  };

  return (
    <main className="flex flex-col md:flex-row">
      <form>
        <Field>
          <FieldLabel htmlFor="create-transaction-label">Label</FieldLabel>
          <Input
            id="create-transaction-label"
            placeholder="Groceries"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="create-transaction-date">Date</FieldLabel>
          <Input
            id="create-transaction-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="create-transaction-value">Value</FieldLabel>
          <Input
            id="create-transaction-value"
            type="number"
            min="0"
            step="0.01"
            placeholder="12.97"
            required
            value={value}
            onChange={(e) => setValue(+e.target.value)}
          />
        </Field>
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </form>

      <ul>
        {transactions.map((transaction) => {
          return (
            <li key={transaction.id}>
              {transaction.label} - {transaction.value} -{" "}
              {transaction.date.toString()}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Home;
