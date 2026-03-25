import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/code-block';

export const metadata: Metadata = {
  title: 'Roast Result | devroast',
  description: 'Your code has been roasted. See the results.',
};

const STATIC_ROAST = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  score: 4.2,
  summary:
    'This code is a masterpiece of confusion. Variable names are meaningless, logic is convoluted, and error handling is nonexistent. The ternary operator abuse alone deserves a medal.',
  language: 'javascript',
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  issues: [
    {
      severity: 'high',
      title: 'Variable Naming',
      description:
        'Single-letter variable names make the code unreadable. Use descriptive names like "itemIndex" instead of "i".',
    },
    {
      severity: 'high',
      title: 'No Error Handling',
      description:
        'This function will crash if items is null/undefined or if any item lacks a price property.',
    },
    {
      severity: 'medium',
      title: 'Outdated Syntax',
      description:
        'Using "var" instead of "const" or "let" leads to hoisting issues and confusing scope.',
    },
    {
      severity: 'low',
      title: 'Missing Type Safety',
      description:
        'No TypeScript types defined. Consider adding interfaces for better maintainability.',
    },
  ],
  suggestedFix: `function calculateTotal(items: { price: number }[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}`,
};

export default async function RoastPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col gap-10 pb-16">
        {/* Hero Section */}
        <div className="flex items-center justify-center gap-12">
          <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full border-[12px] border-border-primary">
            <span
              className={`font-mono text-5xl font-bold ${
                STATIC_ROAST.score >= 7
                  ? 'text-accent-green'
                  : STATIC_ROAST.score >= 4
                    ? 'text-accent-amber'
                    : 'text-accent-red'
              }`}
            >
              {STATIC_ROAST.score.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-mono text-2xl font-bold text-text-primary">
              Roast Complete
            </h1>
            <p className="max-w-lg font-mono text-sm text-text-secondary">
              {STATIC_ROAST.summary}
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
                {STATIC_ROAST.language === 'javascript'
                  ? 'js'
                  : STATIC_ROAST.language}
              </span>
            </div>
            <CodeBlock
              code={STATIC_ROAST.code}
              lang={STATIC_ROAST.language as any}
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
            {STATIC_ROAST.issues.map((issue, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-md border border-border-primary p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      issue.severity === 'high'
                        ? 'bg-accent-red'
                        : issue.severity === 'medium'
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
            <CodeBlock code={STATIC_ROAST.suggestedFix} lang="typescript" />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
