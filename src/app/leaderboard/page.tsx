import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/code-block';

export const metadata: Metadata = {
  title: 'shame_leaderboard | devroast',
  description:
    'The most roasted code on the internet. Browse the worst submissions ranked by shame.',
};

const STATIC_LEADERBOARD = [
  {
    rank: 1,
    score: 2.1,
    code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    language: 'javascript',
  },
  {
    rank: 2,
    score: 2.8,
    code: `const result = arr.map(x => {
  return x * 2
}).filter(x => x > 10)`,
    language: 'javascript',
  },
  {
    rank: 3,
    score: 3.4,
    code: `let i = 0;
while(i < 10) {
  console.log(i);
  i++;
}`,
    language: 'javascript',
  },
  {
    rank: 4,
    score: 4.1,
    code: `function getData() {
  const data = fetch('/api/data').then(res => res.json());
  return data;
}`,
    language: 'javascript',
  },
  {
    rank: 5,
    score: 4.8,
    code: `class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}`,
    language: 'javascript',
  },
];

export default function LeaderboardPage() {
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
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="flex flex-col gap-5">
        {STATIC_LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
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
              <div className="flex h-10 items-center gap-3 border-b border-border-primary bg-bg-input px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
                <span className="ml-auto text-xs text-text-tertiary">
                  snippet.
                  {entry.language === 'javascript' ? 'js' : entry.language}
                </span>
              </div>
              <CodeBlock code={entry.code} language={entry.language} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
