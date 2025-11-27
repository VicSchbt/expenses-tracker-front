 'use client';

 import { useEffect, useState } from 'react';

 import { Button } from '@/components/ui/button';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { createCategory, createExpense, getCategories } from '@/lib/api';
 import type { Category } from '@/lib/types/category';

 interface AddExpenseFormProps {
   onCancel: () => void;
   onSuccess: () => void;
 }

 const ADD_CATEGORY_VALUE = '__add_category__' as const;

 export function AddExpenseForm({ onCancel, onSuccess }: AddExpenseFormProps) {
   const [expenseForm, setExpenseForm] = useState<{
     label: string;
     date: string;
     value: string;
     categoryId: string;
   }>({
     label: '',
     date: '',
     value: '',
     categoryId: '',
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);
   const [categories, setCategories] = useState<Category[]>([]);
   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
   const [categoriesError, setCategoriesError] = useState<string | null>(null);
   const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
   const [newCategoryLabel, setNewCategoryLabel] = useState('');
   const [isCreatingCategory, setIsCreatingCategory] = useState(false);
   const [createCategoryError, setCreateCategoryError] = useState<string | null>(null);

   useEffect(() => {
     async function fetchCategories() {
       try {
         setIsCategoriesLoading(true);
         setCategoriesError(null);
         const data = await getCategories();
         setCategories(data);
       } catch (error) {
         const message = error instanceof Error ? error.message : 'Failed to load categories';
         setCategoriesError(message);
       } finally {
         setIsCategoriesLoading(false);
       }
     }
     if (categories.length > 0 || isCategoriesLoading) {
       return;
     }
     void fetchCategories();
   }, [categories.length, isCategoriesLoading]);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
     event.preventDefault();
     setSubmitError(null);
     setIsSubmitting(true);
     try {
       await createExpense({
         label: expenseForm.label,
         date: expenseForm.date,
         value: Number(expenseForm.value),
         categoryId: expenseForm.categoryId || undefined,
       });
       onSuccess();
     } catch (error) {
       const message = error instanceof Error ? error.message : 'Failed to create expense';
       setSubmitError(message);
     } finally {
       setIsSubmitting(false);
     }
   };

   const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
     const { value } = event.target;
     if (value === ADD_CATEGORY_VALUE) {
       setIsAddCategoryDialogOpen(true);
       return;
     }
     setExpenseForm((previous) => ({
       ...previous,
       categoryId: value,
     }));
   };

   const handleAddCategorySubmit = async (
     event: React.FormEvent<HTMLFormElement>,
   ): Promise<void> => {
     event.preventDefault();
     if (!newCategoryLabel.trim()) {
       setCreateCategoryError('Category label is required');
       return;
     }
     setCreateCategoryError(null);
     setIsCreatingCategory(true);
     try {
       const createdCategory = await createCategory({
         label: newCategoryLabel.trim(),
       });
       setCategories((previous) => [...previous, createdCategory]);
       setExpenseForm((previous) => ({
         ...previous,
         categoryId: createdCategory.id,
       }));
       setNewCategoryLabel('');
       setIsAddCategoryDialogOpen(false);
     } catch (error) {
       const message = error instanceof Error ? error.message : 'Failed to create category';
       setCreateCategoryError(message);
     } finally {
       setIsCreatingCategory(false);
     }
   };

   return (
     <>
       <form className="space-y-4" onSubmit={handleSubmit}>
         <section className="space-y-3 rounded-md border bg-muted/50 p-4">
           <div className="space-y-1">
             <Label htmlFor="expense-label">Label</Label>
             <Input
               id="expense-label"
               value={expenseForm.label}
               onChange={(event): void =>
                 setExpenseForm((previous) => ({
                   ...previous,
                   label: event.target.value,
                 }))
               }
               placeholder="Coffee"
               required
             />
           </div>
           <div className="grid gap-3 sm:grid-cols-2">
             <div className="space-y-1">
               <Label htmlFor="expense-date">Date</Label>
               <Input
                 id="expense-date"
                 type="date"
                 value={expenseForm.date}
                 onChange={(event): void =>
                   setExpenseForm((previous) => ({
                     ...previous,
                     date: event.target.value,
                   }))
                 }
                 required
               />
             </div>
             <div className="space-y-1">
               <Label htmlFor="expense-value">Amount</Label>
               <Input
                 id="expense-value"
                 type="number"
                 min="0"
                 step="0.01"
                 value={expenseForm.value}
                 onChange={(event): void =>
                   setExpenseForm((previous) => ({
                     ...previous,
                     value: event.target.value,
                   }))
                 }
                 placeholder="5.50"
                 required
               />
             </div>
           </div>
           <div className="space-y-1">
             <Label htmlFor="expense-category">Category (optional)</Label>
             <select
               id="expense-category"
               className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               value={expenseForm.categoryId}
               onChange={handleCategoryChange}
               disabled={isCategoriesLoading}
             >
               <option value="">No category</option>
               {categories.map((category) => (
                 <option key={category.id} value={category.id}>
                   {category.label}
                 </option>
               ))}
               <option value={ADD_CATEGORY_VALUE}>+ Add new category</option>
             </select>
             {categoriesError && <p className="text-sm text-destructive">{categoriesError}</p>}
           </div>
         </section>
         {submitError && <p className="text-sm text-destructive">{submitError}</p>}
         <div className="flex justify-end gap-2">
           <Button variant="outline" type="button" onClick={onCancel}>
             Cancel
           </Button>
           <Button type="submit" disabled={isSubmitting}>
             {isSubmitting ? 'Saving...' : 'Save expense'}
           </Button>
         </div>
       </form>

       <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
         <DialogContent className="sm:max-w-[400px]">
           <DialogHeader>
             <DialogTitle>Add category</DialogTitle>
             <DialogDescription>
               Create a new category to reuse for your future expenses.
             </DialogDescription>
           </DialogHeader>
           <form className="space-y-4" onSubmit={handleAddCategorySubmit}>
             <div className="space-y-1">
               <Label htmlFor="new-category-label">Category name</Label>
               <Input
                 id="new-category-label"
                 value={newCategoryLabel}
                 onChange={(event): void => {
                   setNewCategoryLabel(event.target.value);
                   if (createCategoryError) {
                     setCreateCategoryError(null);
                   }
                 }}
                 placeholder="Groceries"
                 autoFocus
               />
             </div>
             {createCategoryError && (
               <p className="text-sm text-destructive">{createCategoryError}</p>
             )}
             <div className="flex justify-end gap-2">
               <Button
                 type="button"
                 variant="outline"
                 onClick={(): void => {
                   setIsAddCategoryDialogOpen(false);
                   setNewCategoryLabel('');
                   setCreateCategoryError(null);
                 }}
               >
                 Cancel
               </Button>
               <Button type="submit" disabled={isCreatingCategory}>
                 {isCreatingCategory ? 'Saving...' : 'Save category'}
               </Button>
             </div>
           </form>
         </DialogContent>
       </Dialog>
     </>
   );
 }
