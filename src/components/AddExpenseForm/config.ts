// you could put this in a separate file if you want
import { z } from 'zod';

export const addExpenseSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Enter a valid positive number',
  }),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().optional(),
});

export type AddExpenseFormValues = z.infer<typeof addExpenseSchema>;
