'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddExpenseFormValues, addExpenseSchema } from './config';
import { useState } from 'react';
import { createExpense } from '@/features/expenses/api';

export default function AddExpenseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      label: '',
      value: '',
      date: '',
      categoryId: '',
    },
  });

  const onSubmit = async (data: AddExpenseFormValues) => {
    const amount = parseFloat(data.value);
    if (Number.isNaN(amount)) {
      form.setError('value', { message: 'Please enter a valid number' });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        label: data.label.trim(),
        value: amount,
        date: data.date, // keep as 'YYYY-MM-DD'
        categoryId: data.categoryId?.trim() ? data.categoryId : null,
      };

      const created = await createExpense(payload);

      toast.success(`Expense added: ${created.label} (${created.value}€)`);
      form.reset();
    } catch (error) {
      toast.error('Failed to add expense');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-6 rounded-md border p-6"
      >
        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="What is this expense?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (€)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Expense'}
        </Button>
      </form>
    </Form>
  );
}
