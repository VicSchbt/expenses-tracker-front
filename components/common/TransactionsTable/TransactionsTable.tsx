"use client";

import { useExpenseStore } from "@/store/useExpensesStore";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const TransactionTable = () => {
  const { expenses } = useExpenseStore();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={expenses} />
    </div>
  );
};

export default TransactionTable;
