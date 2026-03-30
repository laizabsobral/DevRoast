# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate `/leaderboard` page with tRPC backend to display 20 real entries from database

**Architecture:** Convert page to client component, use tRPC `getLeaderboard` query, maintain stacked card layout

**Tech Stack:** Next.js 15, tRPC, React Query, Drizzle

---

### Task 1: Convert page to client component with tRPC

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Add imports and convert to client**

Replace the entire file content with:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { CodeBlock, CodeBlockHeader } from '@/components/ui/code-block';
import { useTRPC } from '@/trpc/client';

const TRPCProvider = dynamic(
  () => import('@/trpc/client').then(mod => mod.TRPCReactProvider),
  { ssr: false }
);

function LeaderboardContent() {
  const trpc = useTRPC();
  const query = useQuery(
    trpc.roast.getLeaderboard.queryOptions({ page: 1, limit: 20 })
  );

  if (query.isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <span className="font-mono text-sm text-accent-red">
          Failed to load leaderboard
        </span>
      </div>
    );
  }

  const { entries, pagination } = query.data;
  const avgScore =
    entries.length > 0
      ? entries.reduce((sum, e) => sum + e.score, 0) / entries.length
      : 0;

  return (
    <div className="flex w-full flex-col gap-10 pb-16">
      {/* Hero Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green">
            ›
          </span>
          <h1 className="font-mono text-[28px] font-bold text-text-primary">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-mono text-sm text-text-secondary">
          {'// the most roasted code on the internet'}
        </p>
        <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
          <span>{pagination.totalCount.toLocaleString()} submissions</span>
          <span>·</span>
          <span>avg score: {avgScore.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="flex flex-col gap-5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col border border-border-primary"
          >
            {/* Meta Row */}
            <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-text-tertiary">
                  #{entry.rank}
                </span>
                <span
                  className={`font-mono text-sm font-bold ${
                    entry.score >= 7
                      ? 'text-accent-green'
                      : entry.score >= 4
                        ? 'text-accent-amber'
                        : 'text-accent-red'
                  }`}
                >
                  {entry.score.toFixed(1)}
                </span>
              </div>
              <span className="font-mono text-xs text-text-tertiary">
                {entry.language}
              </span>
            </div>

            {/* Code Block */}
            <div className="w-[560px]">
              <CodeBlockHeader
                filename={`snippet.${
                  entry.language === 'javascript'
                    ? 'js'
                    : entry.language
                }`}
              />
              <CodeBlock
                code={entry.code}
                lang={entry.language as 'javascript'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green animate-pulse">
            ›
          </span>
          <div className="h-9 w-64 animate-pulse rounded bg-bg-input" />
        </div>
        <div className="h-4 w-72 animate-pulse rounded bg-bg-input" />
        <div className="h-3 w-48 animate-pulse rounded bg-bg-input" />
      </div>

      {/* Entries Skeleton */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col border border-border-primary"
          >
            <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
              <div className="flex items-center gap-4">
                <div className="h-4 w-8 animate-pulse rounded bg-bg-input" />
                <div className="h-4 w-12 animate-pulse rounded bg-bg-input" />
              </div>
              <div className="h-3 w-16 animate-pulse rounded bg-bg-input" />
            </div>
            <div className="w-[560px] animate-pulse rounded bg-bg-input" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <TRPCProvider>
      <LeaderboardContent />
    </TRPCProvider>
  );
}
```

- [ ] **Step 2: Run build to verify**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 3: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: integrate leaderboard page with tRPC backend"
```

---

### Task 2: Verify endpoint works

**Files:**
- Test: `npm run dev` + navigate to `/leaderboard`

- [ ] **Step 1: Start dev server and test**

Run: `npm run dev`
Navigate to `http://localhost:3000/leaderboard`
Expected: Page loads with data from database (or empty if no data seeded)

- [ ] **Step 2: Verify 20 entries displayed**

Check that up to 20 entries appear in the leaderboard

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: leaderboard page displays 20 entries from database"
```
