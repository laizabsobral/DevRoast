'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { StatsDisplay } from './stats-display';

export function Stats() {
  const trpc = useTRPC();
  const query = useQuery(trpc.roast.getStats.queryOptions());

  return (
    <StatsDisplay
      totalRoasts={query.data?.totalRoasts ?? 0}
      avgScore={query.data?.avgScore ?? 0}
    />
  );
}
