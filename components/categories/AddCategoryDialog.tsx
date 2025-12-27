import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

import { useCategoriesStore } from '@/store/useCategoriesStore';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import CategoryForm from './CategoryForm';

const AddCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createNewCategory, isCreatingCategory, createCategoryError } = useCategoriesStore();

  const handleSubmit = async (data: {
    label: string;
    color?: string | null;
    icon?: string | null;
    budget?: number | null;
  }) => {
    try {
      await createNewCategory(data);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new category to reuse for your future expenses.
        </DialogDescription>
        <CategoryForm
          mode="create"
          isSubmitting={false}
          error={null}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
