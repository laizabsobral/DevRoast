import type { Metadata } from 'next';
import { CodeBlock, CodeBlockHeader } from '@/components/ui/code-block';
import { createCaller } from '@/trpc/caller';

export const metadata: Metadata = {
  title: 'shame_leaderboard | devroast',
  description:
    'The most roasted code on the internet. Browse the worst submissions ranked by shame.',
};

async function getLeaderboard() {
  const caller = await createCaller();
  return caller.roast.getLeaderboard({ page: 1, limit: 20 });
}

export default async function LeaderboardPage() {
  const { entries, pagination } = await getLeaderboard();

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
                  entry.language === 'javascript' ? 'js' : entry.language
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
