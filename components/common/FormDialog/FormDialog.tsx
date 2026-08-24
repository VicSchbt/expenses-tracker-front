'use client';

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/lib/types";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FormDialogProps {
  mode: "create" | "edit";
  triggerLabel: string;
  dialogTitle: string;
  dialogDesc?: string;
  transaction?: Transaction;
  handleSubmit: (
    data: Omit<Transaction, "id" | "type">,
  ) => Promise<Transaction | null>;
}

const createExpenseFormSchema = z.object({
  label: z.string().min(3, "Label must be at least 3 characters."),
  date: z.date({
    error: "Please select a date.",
  }),
  value: z.number().min(0.01, "The value must be at least 0.01."),
});

export function FormDialog({
  mode,
  triggerLabel,
  dialogTitle,
  dialogDesc,
  transaction,
  handleSubmit,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createExpenseFormSchema>>({
    resolver: zodResolver(createExpenseFormSchema),
    defaultValues: {
      label: "",
      date: new Date(),
      value: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof createExpenseFormSchema>) {
    const newExpense = await handleSubmit(data);
    console.log(newExpense);
    form.reset({
      label: "",
      date: new Date(),
      value: undefined,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline">{triggerLabel}</Button>}
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDesc && <DialogDescription>{dialogDesc}</DialogDescription>}
        </DialogHeader>
        <form id="form-create-expense" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="create-transaction-label">
                    Label
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-transaction-label"
                    aria-invalid={fieldState.invalid}
                    placeholder="Groceries"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Date</FieldLabel>

                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(field.value, "dd MMMM yyyy")
                            : "Choose a date"}
                        </Button>
                      }
                    />

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            field.onChange(selectedDate);
                          }
                        }}
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="create-transaction-value">
                    Value
                  </FieldLabel>

                  <Input
                    {...field}
                    id="create-transaction-value"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="12.97"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="form-create-expense">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
