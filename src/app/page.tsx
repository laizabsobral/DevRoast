'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
import { Toggle } from '@/components/ui/toggle';
import { TRPCReactProvider } from '@/trpc/client';

const Stats = dynamic(
  () => import('@/components/stats').then((mod) => mod.Stats),
  {
    ssr: false,
  }
);

const Leaderboard = dynamic(
  () => import('@/components/leaderboard').then((mod) => mod.Leaderboard),
  {
    ssr: false,
  }
);

const LeaderboardSkeleton = dynamic(
  () =>
    import('@/components/leaderboard').then((mod) => mod.LeaderboardSkeleton),
  {
    ssr: false,
  }
);

function RoastForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [roastMode, setRoastMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/trpc/roast.createRoast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: language || 'javascript',
          roastMode,
        }),
      });
      if (!response.ok) throw new Error('Failed to create roast');
      const data = await response.json();
      router.push(`/roast/${data.result.data.json.id}`);
    } catch (error) {
      console.error('Failed to create roast:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
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
        <Button
          variant="green"
          size="lg"
          disabled={!code || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? '$ roasting...' : '$ roast_my_code'}
        </Button>
      </div>
    </>
  );
}

export default function HomePage() {
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

      <TRPCReactProvider>
        <RoastForm />
        <Stats />
      </TRPCReactProvider>

      {/* Spacer */}
      <div className="h-16" />

      {/* Leaderboard */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
