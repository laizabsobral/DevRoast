# Roast Creation Feature Design

## Overview

Create endpoint tRPC to receive user code, send for Groq LLM analysis, save to database and redirect to result page.

## Flow

```
CodeEditor (homepage) 
  → tRPC Mutation (createRoast)
  → Groq API (LLM analysis)
  → Save to DB (roasts + analysisItems)
  → Redirect to /roast/[id]
```

## Architecture

### 1. tRPC Mutation (`src/trpc/routers/roast.ts`)

```typescript
createRoast: baseProcedure
  .input(z.object({
    code: z.string().min(1).max(10000),
    language: z.string(),
    roastMode: z.boolean(),
  }))
  .mutation(async ({ ctx, input }) => {
    // 1. Call Groq API
    const analysis = await analyzeCode(input.code, input.language, input.roastMode);
    
    // 2. Insert roast to DB
    const [roast] = await ctx.db.insert(roasts).values({...}).returning();
    
    // 3. Insert analysis items
    await ctx.db.insert(analysisItems).values(...);
    
    return { id: roast.id };
  }),
```

### 2. Groq Service (`src/lib/ai/roast.ts`)

- Use Groq API with `llama-3.3-70b-versatile` model
- Prompt based on `roastMode`:
  - `true`: Sarcastic, brutal analysis
  - `false`: Professional, constructive feedback
- Returns structured analysis:
  - `score`: number (0-10)
  - `summary`: string
  - `verdict`: enum
  - `issues`: array with severity, title, description
  - `suggestedFix`: string with improved code

### 3. Homepage Update (`src/app/page.tsx`)

- Add `useTRPC` hook
- Create mutation with `useMutation`
- On button click: call `createRoast.mutate({ code, language, roastMode })`
- On success: `router.push(/roast/${result.id})`

### 4. Roast Result Page (`src/app/roast/[id]/page.tsx`)

- Server Component
- Fetch from DB via tRPC caller
- Use `'use cache'` + `cacheTag('roast-${id}')`
- Display:
  - Score circle with color coding
  - Summary/roast quote
  - Submitted code with syntax highlight
  - Issues list with severity indicators
  - Suggested fix with diff view

## Schema (already exists)

- `roasts`: id, code, language, lineCount, roastMode, score, verdict, roastQuote, suggestedFix, createdAt
- `analysisItems`: id, roastId, severity, title, description, order

## Environment

- Add `GROQ_API_KEY` to `.env.local`

## Acceptance Criteria

- [ ] User can submit code from homepage
- [ ] Loading state shown during analysis
- [ ] On success, redirect to /roast/[id]
- [ ] Roast mode toggle affects analysis tone
- [ ] Result page displays score, summary, code, issues, suggested fix
- [ ] Data persisted to database
