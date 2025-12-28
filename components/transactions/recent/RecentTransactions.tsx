import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import RecentDataTable from './RecentDataTable';

const RecentTransactions = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold">Recent Transactions</h2>
      <RecentDataTable />
    </section>
  );
};

export default RecentTransactions;
