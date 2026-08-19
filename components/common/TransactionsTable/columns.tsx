"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { type DataTableFeatures } from "./data-table-features";
import { type Transaction } from "@/lib/types";
import { formatDateFR } from "@/lib/utils/date.util";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Transaction>();

export const columns = columnHelper.columns([
  columnHelper.accessor("label", {
    header: "Label",
  }),
  columnHelper.accessor("date", {
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-center font-medium">{formatDateFR(date)}</div>
      );
    },
  }),
  columnHelper.accessor("value", {
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(value);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  }),
]);
