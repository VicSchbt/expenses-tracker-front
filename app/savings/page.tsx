'use client';

import React, { useEffect } from 'react';

import { AppNavbar } from '@/components/app-navbar';
import { AuthGuard } from '@/components/auth-guard';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { Button } from '@/components/ui/button';
import { useSavingsStore } from '@/store/useSavingsStore';

const SavingsPage = () => {
  const { savingsGoals, fetchSavingsGoals } = useSavingsStore();

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
            <p className="text-2xl font-bold">24,000€</p>
            <p>in my total goals</p>
          </header>

          <section className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">My Goals</h1>
            <Button variant="outline">Add A Goal</Button>
          </section>

          <SavingsGoalsList savingsGoals={savingsGoals} />
        </main>
      </div>
    </AuthGuard>
  );
};

export default SavingsPage;
