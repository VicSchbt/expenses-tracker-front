'use client';

import React, { useEffect } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import AddSavingsGoalForm from '@/components/forms/AddSavingsGoalForm';
import AppNavbar from '@/components/navigation/AppNavbar';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { formatCurrency } from '@/lib/utils';
import { useSavingsStore } from '@/store/useSavingsStore';

const SavingsPage = () => {
  const { savingsGoals, fetchSavingsGoals, getTotalSavings } = useSavingsStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchSavingsGoals();
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="col-center">
            <p>I have</p>
            <p className="text-2xl font-bold">{formatCurrency(getTotalSavings())}</p>
            <p>in my total goals</p>
          </header>

          <section className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">My Goals</h1>
            <AddSavingsGoalForm onSuccess={() => {}} />
          </section>

          <SavingsGoalsList savingsGoals={savingsGoals} />
        </main>
      </div>
    </AuthGuard>
  );
};

export default SavingsPage;
