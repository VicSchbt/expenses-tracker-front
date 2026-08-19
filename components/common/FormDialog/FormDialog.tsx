import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/lib/types";
import { useState } from "react";

interface FormDialogProps {
  mode: "create" | "edit";
  triggerLabel: string;
  dialogTitle: string;
  dialogDesc?: string;
  transaction?: Transaction;
  onSubmit: (data: Omit<Transaction, "id" | "type">) => void;
}

// Helper to format a Date as "YYYY-MM-DD" for the date input
function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

// TODO: see more at https://ui.shadcn.com/docs/forms/react-hook-form
export function FormDialog({
  mode,
  triggerLabel,
  dialogTitle,
  dialogDesc,
  transaction,
  onSubmit,
}: FormDialogProps) {
  const [label, setLabel] = useState(
    mode === "edit" && transaction ? transaction.label : undefined,
  );
  const [date, setDate] = useState(
    mode === "edit" && transaction
      ? formatDateForInput(new Date(transaction.date))
      : formatDateForInput(new Date()),
  );
  const [value, setValue] = useState(
    mode === "edit" && transaction ? transaction.value : undefined,
  );

  const resetForm = () => {
    setLabel(undefined);
    setDate(formatDateForInput(new Date()));
    setValue(undefined);
  };

  const handleSubmit = async () => {
    if (label && value) {
      const data = {
        label,
        date: new Date(date),
        value,
      };
      onSubmit(data);
      resetForm();
    } else {
      alert("missing values!");
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={<Button variant="outline">{triggerLabel}</Button>}
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDesc && <DialogDescription>{dialogDesc}</DialogDescription>}
          </DialogHeader>
          <FieldGroup>
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default FormDialog;
