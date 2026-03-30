'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTRPC } from '@/trpc/client';
import { CollapsibleCodeBlock } from './ui/collapsible-code-block';
import {
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from './ui/table-row';

export function Leaderboard() {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.roast.getLeaderboard.queryOptions({ limit: 3 }),
    staleTime: 3600 * 1000,
  });

  if (query.isLoading || !query.data) {
    return <LeaderboardSkeleton />;
  }

  const { entries, pagination } = query.data;
  const totalCount = pagination.totalCount;

  return (
    <div className="flex w-full max-w-[960px] flex-col gap-6 border border-border-primary bg-bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-primary px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {`{/*}`}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            shame_leaderboard
          </span>
        </div>
        <Link
          href="/leaderboard"
          className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary hover:text-text-primary"
        >
          $ view_all &gt;&gt;
        </Link>
      </div>

      {/* Subtitle */}
      <p className="px-5 font-ibm-plex-mono text-xs text-text-tertiary">
        {'// the worst code on the internet, ranked by shame'}
      </p>

      {/* Table Header */}
      <div className="flex h-10 w-full items-center border-b border-border-primary bg-bg-surface px-5">
        <div className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
          #
        </div>
        <div className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
          score
        </div>
        <div className="flex-1 font-mono text-xs font-medium text-text-tertiary">
          code
        </div>
        <div className="w-[100px] font-mono text-xs font-medium text-text-tertiary">
          lang
        </div>
      </div>

      {/* Rows */}
      {entries.map((entry, index) => (
        <TableRowRoot key={entry.id}>
          <TableRowRank
            className={
              index === 0 ? 'text-accent-amber' : 'text-text-secondary'
            }
          >
            {index + 1}
          </TableRowRank>
          <TableRowScore>{entry.score.toFixed(1)}</TableRowScore>
          <div className="flex-1">
            <CollapsibleCodeBlock
              code={entry.code}
              lang={entry.language as any}
              maxLines={5}
            />
          </div>
          <TableRowLang>{entry.language}</TableRowLang>
        </TableRowRoot>
      ))}

      {/* Footer */}
      <div className="flex justify-center px-0 py-4 font-ibm-plex-mono text-xs text-text-tertiary">
        showing top 3 of {totalCount.toLocaleString()} ·{' '}
        <Link
          href="/leaderboard"
          className="text-text-secondary hover:text-text-primary"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex w-full max-w-[960px] flex-col gap-6 border border-border-primary bg-bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-primary px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green animate-pulse">
            {`{/*}`}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary animate-pulse">
            shame_leaderboard
          </span>
        </div>
        <div className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary animate-pulse">
          $ view_all &gt;&gt;
        </div>
      </div>

      <p className="px-5 font-ibm-plex-mono text-xs text-text-tertiary animate-pulse">
        {'// the worst code on the internet, ranked by shame'}
      </p>

      <div className="flex h-10 w-full items-center border-b border-border-primary bg-bg-surface px-5">
        <div className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
          #
        </div>
        <div className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
          score
        </div>
        <div className="flex-1 font-mono text-xs font-medium text-text-tertiary">
          code
        </div>
        <div className="w-[100px] font-mono text-xs font-medium text-text-tertiary">
          lang
        </div>
      </div>

      {/* Skeleton Rows */}
      {Array.from({ length: 3 }).map(
        (
          _,
          i // biome-ignore lint/suspicious/noArrayIndexKey: skeleton is static
        ) => (
          <div
            key={i}
            className="flex w-full items-center border-b border-border-primary px-5 py-4"
          >
            <div className="w-[50px] font-mono text-xs text-text-secondary animate-pulse">
              #
            </div>
            <div className="w-[70px] font-mono text-xs font-bold text-accent-red animate-pulse">
              .
            </div>
            <div className="flex flex-1 flex-col gap-0.5 font-mono text-xs text-text-primary">
              <span className="block animate-pulse h-4 w-3/4 bg-bg-input rounded" />
              <span className="block animate-pulse h-4 w-1/2 bg-bg-input rounded mt-1" />
            </div>
            <div className="w-[100px] font-mono text-xs text-text-secondary animate-pulse">
              .
            </div>
          </div>
        )
      )}

      {/* Footer */}
      <div className="flex justify-center px-0 py-4 font-ibm-plex-mono text-xs text-text-tertiary animate-pulse">
        showing top 3 of --- · view full leaderboard &gt;&gt;
      </div>
    </div>
  );
}
