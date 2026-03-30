# Leaderboard Page - Dynamic Data Integration

## Overview

Integrate the `/leaderboard` page with the existing tRPC backend to display real data from the database. Keep the existing stacked card layout.

## Current State

- Page: `src/app/leaderboard/page.tsx`
- Data: Static array `STATIC_LEADERBOARD` (5 entries)
- Components: `CodeBlock`, `CodeBlockHeader`

## Target State

- Page fetches data from `trpc.roast.getLeaderboard` 
- Displays top 20 entries (no pagination)
- Shows total count and average score in header
- Loading and error states

## Implementation

### Backend (Already exists)

File: `src/trpc/routers/roast.ts`

```typescript
getLeaderboard: baseProcedure
  .input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }))
  .query(...)
```

Call with `{ page: 1, limit: 20 }`.

### Frontend

File: `src/app/leaderboard/page.tsx`

**Changes:**
1. Add `'use client'` at top
2. Import `TRPCReactProvider` (dynamic), `useTRPC`, `useQuery`
3. Replace static data with tRPC query
4. Keep existing stacked card layout with `CodeBlock` + `CodeBlockHeader`
5. Add skeleton/loading state

**Structure:**

```typescript
'use client';

import dynamic from 'next/dynamic';
import { CodeBlock, CodeBlockHeader } from '@/components/ui/code-block';

const TRPCProvider = dynamic(
  () => import('@/trpc/client').then(mod => mod.TRPCReactProvider),
  { ssr: false }
);

function LeaderboardContent() {
  const trpc = useTRPC();
  const query = useQuery(trpc.roast.getLeaderboard.queryOptions({ 
    page: 1, 
    limit: 20 
  }));

  if (query.isLoading) return <LeaderboardSkeleton />;
  if (query.isError) return <div>Error loading leaderboard</div>;
  
  const { entries, pagination } = query.data;
  // render entries with CodeBlock
}

export default function LeaderboardPage() {
  return (
    <TRPCProvider>
      <LeaderboardContent />
    </TRPCProvider>
  );
}
```

**Header Stats:**
- Display `pagination.totalCount.toLocaleString()` for submissions
- Calculate avg score from entries or fetch separately

**Entry Card:**
- Use existing layout with `CodeBlockHeader` + `CodeBlock`
- Rank, score with color coding (same as current)
- Language badge

## Components Reused

- `CodeBlock`
- `CodeBlockHeader`

## Acceptance Criteria

- [ ] Page loads and displays 20 entries
- [ ] Shows total count and avg score in header
- [ ] Loading state displays while fetching
- [ ] Error state displays on failure
- [ ] Cards maintain stacked layout with collapsible code
