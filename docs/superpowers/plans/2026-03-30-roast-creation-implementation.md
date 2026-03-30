# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to submit code for AI analysis and view results

**Architecture:** tRPC mutation → Groq LLM → Database → Redirect to result page

**Tech Stack:** Next.js 16, tRPC, Groq SDK, Drizzle

---

### Task 1: Install Groq SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add groq dependency**

Run: `npm install groq`

- [ ] **Step 2: Commit**

```bash
npm install groq
git add package.json package-lock.json
git commit -m "chore: add groq SDK dependency"
```

---

### Task 2: Create Groq roast service

**Files:**
- Create: `src/lib/ai/roast.ts`

- [ ] **Step 1: Create roast service**

```typescript
import Groq from 'groq';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisIssue {
  severity: 'critical' | 'warning' | 'good';
  title: string;
  description: string;
}

export interface RoastAnalysis {
  score: number;
  summary: string;
  verdict: 'needs_serious_help' | 'rough_around_edges' | 'decent_code' | 'solid_work' | 'exceptional';
  issues: AnalysisIssue[];
  suggestedFix: string;
}

const SYSTEM_PROMPT_ROAST = `You are a brutal code reviewer who roasts code mercilessly. 
Analyze the code and provide a score from 0-10 (0 being terrible, 10 being perfect).
Be sarcastic and mean in your summary.
Return a JSON with:
- score: number (0-10)
- summary: string (sarcastic roast quote)
- verdict: one of "needs_serious_help", "rough_around_edges", "decent_code", "solid_work", "exceptional"
- issues: array of {severity: "critical"|"warning"|"good", title, description}
- suggestedFix: string with improved code (not sarcastic, actual fix)`;

const SYSTEM_PROMPT_HONEST = `You are a professional code reviewer providing constructive feedback.
Analyze the code and provide a score from 0-10 (0 being terrible, 10 being perfect).
Be helpful and constructive in your summary.
Return a JSON with:
- score: number (0-10)
- summary: string (constructive feedback)
- verdict: one of "needs_serious_help", "rough_around_edges", "decent_code", "solid_work", "exceptional"
- issues: array of {severity: "critical"|"warning"|"good", title, description}
- suggestedFix: string with improved code`;

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean
): Promise<RoastAnalysis> {
  const systemPrompt = roastMode ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_HONEST;
  
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Analyze this ${language} code:\n\n${code}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: roastMode ? 0.9 : 0.3,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from Groq API');
  }

  const result = JSON.parse(content) as RoastAnalysis;
  return result;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/roast.ts
git commit -m "feat: add Groq roast service"
```

---

### Task 3: Add tRPC mutation for createRoast

**Files:**
- Modify: `src/trpc/routers/roast.ts`

- [ ] **Step 1: Add imports and createRoast mutation**

Add after existing imports:

```typescript
import { analysisItems, roasts, verdictEnum } from '@/db/schema';
import { analyzeCode } from '@/lib/ai/roast';
import { cacheTag } from 'next/cache';
```

Add at end of roastRouter:

```typescript
createRoast: baseProcedure
  .input(
    z.object({
      code: z.string().min(1).max(10000),
      language: z.string().min(1),
      roastMode: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const lineCount = input.code.split('\n').length;

    const analysis = await analyzeCode(
      input.code,
      input.language,
      input.roastMode
    );

    const [roast] = await ctx.db
      .insert(roasts)
      .values({
        code: input.code,
        language: input.language,
        lineCount,
        roastMode: input.roastMode,
        score: analysis.score,
        verdict: analysis.verdict,
        roastQuote: analysis.summary,
        suggestedFix: analysis.suggestedFix,
      })
      .returning();

    await ctx.db.insert(analysisItems).values(
      analysis.issues.map((issue, index) => ({
        roastId: roast.id,
        severity: issue.severity === 'critical' ? 'critical' : issue.severity === 'warning' ? 'warning' : 'good',
        title: issue.title,
        description: issue.description,
        order: index,
      }))
    );

    return { id: roast.id };
  }),
```

- [ ] **Step 2: Add getRoastById query**

Add after getLeaderboard:

```typescript
getRoastById: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    'use cache';
    cacheTag(`roast-${input.id}`);

    const [roast] = await ctx.db
      .select()
      .from(roasts)
      .where(({ id }) => id.equals(input.id));

    if (!roast) {
      throw new Error('Roast not found');
    }

    const items = await ctx.db
      .select()
      .from(analysisItems)
      .where(({ roastId }) => roastId.equals(input.id))
      .orderBy(analysisItems.order);

    return {
      id: roast.id,
      code: roast.code,
      language: roast.language,
      score: Number(roast.score),
      summary: roast.roastQuote,
      verdict: roast.verdict,
      suggestedFix: roast.suggestedFix,
      issues: items.map((item) => ({
        severity: item.severity,
        title: item.title,
        description: item.description,
      })),
    };
  }),
```

- [ ] **Step 3: Commit**

```bash
git add src/trpc/routers/roast.ts
git commit -m "feat: add createRoast mutation and getRoastById query"
```

---

### Task 4: Update homepage to use mutation

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add imports and state**

Replace imports and add:

```typescript
'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
import { Toggle } from '@/components/ui/toggle';
import { TRPCReactProvider, useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
```

Add inside HomePage component, before return:

```typescript
const router = useRouter();
const trpc = useTRPC();

const createRoastMutation = useMutation({
  mutationFn: async () => {
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
    return response.json();
  },
  onSuccess: (data) => {
    router.push(`/roast/${data.result.data.json.id}`);
  },
});
```

Replace Button with:

```typescript
<Button 
  variant="green" 
  size="lg"
  disabled={!code || createRoastMutation.isPending}
  onClick={() => createRoastMutation.mutate()}
>
  {createRoastMutation.isPending ? '$ roasting...' : '$ roast_my_code'}
</Button>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add createRoast mutation to homepage"
```

---

### Task 5: Update roast result page to fetch from DB

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Refactor to fetch from DB via caller**

Replace entire file:

```typescript
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cacheTag } from 'next/cache';
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
                snippet.{roast.language === 'javascript' ? 'js' : roast.language}
              </span>
            </div>
            <CodeBlock code={roast.code} lang={roast.language as any} />
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
            <CodeBlock code={roast.suggestedFix} lang="typescript" />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: update roast page to fetch from database"
```

---

### Task 6: Add GROQ_API_KEY to env

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Add API key**

Add to `.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

- [ ] **Step 2: Commit**

```bash
git add .env.local
git commit -m "chore: add GROQ_API_KEY to env"
```

---

### Task 7: Build and test

**Files:**
- Test: `npm run dev`

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 2: Test in browser**

Run: `npm run dev`
Navigate to `http://localhost:3000`
Submit code with roast mode on/off
Expected: Redirect to /roast/[id] with analysis results

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete roast creation feature"
```
