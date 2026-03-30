export default function LeaderboardLoading() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green animate-pulse">
            ›
          </span>
          <div className="h-9 w-64 animate-pulse rounded-md bg-bg-input" />
        </div>
        <div className="h-4 w-72 animate-pulse rounded-md bg-bg-input" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 animate-pulse rounded-md bg-bg-input" />
          <span className="text-text-tertiary">·</span>
          <div className="h-3 w-20 animate-pulse rounded-md bg-bg-input" />
        </div>
      </div>

      {/* Entries Skeleton - 20 cards */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex flex-col border border-border-primary">
            {/* Meta Row */}
            <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
              <div className="flex items-center gap-4">
                <div className="h-4 w-8 animate-pulse rounded bg-bg-input" />
                <div className="h-4 w-12 animate-pulse rounded bg-bg-input" />
              </div>
              <div className="h-3 w-16 animate-pulse rounded bg-bg-input" />
            </div>

            {/* Code Block Skeleton */}
            <div className="w-[560px]">
              <div className="flex h-8 items-center border-b border-border-primary bg-bg-surface px-3">
                <div className="h-3 w-24 animate-pulse rounded bg-bg-input" />
              </div>
              <div className="flex flex-col gap-0 bg-bg-input p-3">
                {Array.from({ length: 5 }).map((__, lineIndex) => (
                  <div key={lineIndex} className="flex items-center gap-2">
                    <div className="flex w-8 justify-end">
                      <div className="h-3 w-5 animate-pulse rounded bg-bg-surface" />
                    </div>
                    <div
                      className={`h-3 animate-pulse rounded bg-bg-surface ${
                        lineIndex % 2 === 0 ? 'w-3/4' : 'w-1/2'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
