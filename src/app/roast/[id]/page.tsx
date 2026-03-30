import type { Metadata } from 'next';
import { cacheTag } from 'next/cache';
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/code-block';
import { createCaller } from '@/trpc/caller';

export const metadata: Metadata = {
  title: 'Roast Result | devroast',
  description: 'Your code has been roasted. See the results.',
};

async function getRoast(id: string) {
  'use cache';
  cacheTag(`roast-${id}`);

  const caller = await createCaller();
  return caller.roast.getRoastById({ id });
}

export default async function RoastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roast = await getRoast(id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col gap-10 pb-16">
        {/* Hero Section */}
        <div className="flex items-center justify-center gap-12">
          <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[12px] border-border-primary">
            <span
              className={`font-mono text-5xl font-bold ${
                roast.score >= 7
                  ? 'text-accent-green'
                  : roast.score >= 4
                    ? 'text-accent-amber'
                    : 'text-accent-red'
              }`}
            >
              {roast.score.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-mono text-2xl font-bold text-text-primary">
              Roast Complete
            </h1>
            <p className="max-w-lg font-mono text-sm text-text-secondary">
              {roast.summary}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Submitted Code Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-text-primary">
              Submitted Code
            </span>
          </div>
          <div className="w-[560px]">
            <div className="flex h-10 items-center gap-3 border-b border-border-primary bg-bg-input px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
              <span className="ml-auto text-xs text-text-tertiary">
                snippet.
                {roast.language === 'javascript' ? 'js' : roast.language}
              </span>
            </div>
            <CodeBlock
              code={roast.code}
              lang={(roast.language || 'javascript') as any}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Analysis Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-text-primary">
              Issues Found
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {roast.issues.map((issue, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-md border border-border-primary p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      issue.severity === 'critical'
                        ? 'bg-accent-red'
                        : issue.severity === 'warning'
                          ? 'bg-accent-amber'
                          : 'bg-accent-green'
                    }`}
                  />
                  <span className="font-mono text-sm font-bold text-text-primary">
                    {issue.title}
                  </span>
                </div>
                <p className="font-mono text-xs text-text-secondary">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Diff Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-text-primary">
              Suggested Fix
            </span>
          </div>
          <div className="w-[560px]">
            <div className="flex h-10 items-center gap-3 border-b border-border-primary bg-bg-input px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
              <span className="ml-auto text-xs text-text-tertiary">
                snippet.ts
              </span>
            </div>
            <CodeBlock
              code={roast.suggestedFix || '// No suggested fix available'}
              lang="typescript"
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
