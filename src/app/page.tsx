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
    score: 1.2,
    code: ['eval(prompt("enter code"))', 'document.write(response)'],
    language: 'javascript',
  },
  {
    rank: 2,
    score: 1.8,
    code: [
      'if (x == true) { return true; }',
      'else if (x == false) { return false; }',
      'else { return !false; }',
    ],
    language: 'typescript',
  },
  {
    rank: 3,
    score: 2.1,
    code: ['SELECT * FROM users WHERE 1=1', '-- TODO: add authentication'],
    language: 'sql',
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
      <div className="flex w-full max-w-[960px] flex-col gap-6 border border-border-primary bg-bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {/**/}
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
        {STATIC_LEADERBOARD.map((row) => (
          <TableRowRoot key={row.rank}>
            <TableRowRank
              className={
                row.rank === 1 ? 'text-accent-amber' : 'text-text-secondary'
              }
            >
              {row.rank}
            </TableRowRank>
            <TableRowScore>{row.score.toFixed(1)}</TableRowScore>
            <TableRowCode>
              {row.code.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </TableRowCode>
            <TableRowLang>{row.language}</TableRowLang>
          </TableRowRoot>
        ))}

        {/* Footer */}
        <div className="flex justify-center px-0 py-4 font-ibm-plex-mono text-xs text-text-tertiary">
          showing top 3 of 2,847 ·{' '}
          <Link
            href="/leaderboard"
            className="text-text-secondary hover:text-text-primary"
          >
            view full leaderboard &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
