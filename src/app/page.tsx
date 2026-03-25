'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
import {
  TableRowCode,
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from '@/components/ui/table-row';
import { Toggle } from '@/components/ui/toggle';
import { TRPCReactProvider } from '@/trpc/client';

const Stats = dynamic(
  () => import('@/components/stats').then((mod) => mod.Stats),
  {
    ssr: false,
  }
);

const STATIC_LEADERBOARD = [
  {
    rank: 1,
    score: 2.1,
    code: 'function calculateTotal(items) { var total = 0; ...',
    language: 'javascript',
  },
  {
    rank: 2,
    score: 2.8,
    code: 'const result = arr.map(x ={' > '} x * 2).filter()',
    language: 'javascript',
  },
  {
    rank: 3,
    score: 3.4,
    code: 'let i = 0; while(i {' < '} 10) { console.log(i); ...',
    language: 'javascript',
  },
];

export default function HomePage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [roastMode, setRoastMode] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-8 pb-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex items-center gap-3 font-mono text-3xl font-bold">
          <span className="text-accent-green">$</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          // drop your code below and we&apos;ll rate it — brutally honest or
          full roast mode
        </p>
      </div>

      {/* Code Editor */}
      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        onLanguageChange={setLanguage}
        className="w-[780px]"
      />

      {/* Actions Bar */}
      <div className="flex w-[780px] items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            aria-label="Roast mode"
            pressed={roastMode}
            onPressedChange={setRoastMode}
          />
          <span className="font-mono text-xs text-text-tertiary">
            // maximum sarcasm enabled
          </span>
        </div>
        <Button variant="green" size="lg">
          $ roast_my_code
        </Button>
      </div>

      {/* Stats Footer */}
      <TRPCReactProvider>
        <Stats />
      </TRPCReactProvider>

      {/* Spacer */}
      <div className="h-16" />

      {/* Leaderboard Preview - Inline */}
      <div className="flex w-full max-w-[960px] flex-col gap-4 border border-border-primary bg-bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              //
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              shame_leaderboard
            </span>
          </div>
          <Link
            href="/leaderboard"
            className="font-mono text-xs text-text-secondary hover:text-text-primary"
          >
            $ view_all &gt;&gt;
          </Link>
        </div>

        {/* Subtitle */}
        <p className="px-5 font-mono text-xs text-text-tertiary">
          // the worst code on the internet, ranked by shame
        </p>

        {/* Table Header */}
        <div className="flex h-10 items-center border-b border-border-primary bg-bg-input px-5">
          <div className="w-10 font-mono text-xs text-text-tertiary">#</div>
          <div className="w-[60px] font-mono text-xs text-text-tertiary">
            score
          </div>
          <div className="flex-1 font-mono text-xs text-text-tertiary">
            code
          </div>
          <div className="w-[100px] text-right font-mono text-xs text-text-tertiary">
            lang
          </div>
        </div>

        {/* Rows */}
        {STATIC_LEADERBOARD.map((row) => (
          <TableRowRoot key={row.rank}>
            <TableRowRank>#{row.rank}</TableRowRank>
            <TableRowScore
              className={
                row.score >= 7
                  ? 'text-accent-green'
                  : row.score >= 4
                    ? 'text-accent-amber'
                    : 'text-accent-red'
              }
            >
              {row.score.toFixed(1)}
            </TableRowScore>
            <TableRowCode>{row.code}</TableRowCode>
            <TableRowLang>{row.language}</TableRowLang>
          </TableRowRoot>
        ))}

        {/* Footer */}
        <p className="px-5 py-4 text-center font-mono text-xs text-text-tertiary">
          showing top 3 of 2,847 ·{' '}
          <Link
            href="/leaderboard"
            className="text-text-secondary hover:text-text-primary"
          >
            view full leaderboard &gt;&gt;
          </Link>
        </p>
      </div>
    </div>
  );
}
