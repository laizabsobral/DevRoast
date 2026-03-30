# tRPC Patterns

## Estrutura de Arquivos

```
src/trpc/
├── init.ts           # initTRPC, createTRPCContext, baseProcedure
├── query-client.ts   # makeQueryClient factory
├── client.tsx        # TRPCReactProvider, useTRPC
├── server.tsx        # createTRPCOptionsProxy, HydrateClient (server-only)
├── caller.ts        # createCaller para chamadas diretas no server
└── routers/
    ├── _app.ts       # appRouter (merge de todos os sub-routers)
    └── roast.ts      # procedures de roast
```

## Padrões de Uso

### Client Components

Para usar tRPC em client components, importar `TRPCReactProvider` com `dynamic` + `ssr: false`:

```typescript
import dynamic from 'next/dynamic';

const TRPCProvider = dynamic(
  () => import('@/trpc/client').then(mod => mod.TRPCReactProvider),
  { ssr: false }
);
```

### Componentes com Dados

Para componentes que buscam dados, usar `useQuery` diretamente com valor inicial `0`:

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import NumberFlow from '@number-flow/react';

export function Stats() {
  const trpc = useTRPC();
  const query = useQuery(trpc.roast.getStats.queryOptions());

  return (
    <NumberFlow value={query.data?.totalRoasts ?? 0} />
  );
}
```

### Provider no Componente

Quando o componente precisa do provider, envolver com `TRPCReactProvider`:

```typescript
<TRPCReactProvider>
  <Stats />
</TRPCReactProvider>
```

## API Route

Criar handler em `src/app/api/trpc/[trpc]/route.ts`:

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

## Router

Criar procedures com Drizzle:

```typescript
import { count, avg } from 'drizzle-orm';
import { roasts } from '@/db/schema';
import { createTRPCRouter, baseProcedure } from '../init';

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: Number(stats?.totalRoasts) ?? 0,
      avgScore: Number(stats?.avgScore) ?? 0,
    };
  }),
});
```

### Múltiplas Queries

Usar `Promise.all` para executar queries em paralelo:

```typescript
getLeaderboard: baseProcedure
  .input(z.object({ limit: z.number().default(3) }))
  .query(async ({ ctx, input }) => {
    const [stats, entries] = await Promise.all([
      ctx.db.select({ totalCount: count() }).from(roasts),
      ctx.db.select(...).from(roasts).orderBy(...).limit(input.limit),
    ]);

    return {
      totalCount: Number(stats[0]?.totalCount) ?? 0,
      entries: entries.map(e => ({ ... })),
    };
  }),
```

## Erros Comuns

1. **"server-only" import error**: Não importar `server-only` modules em client components
2. **pg driver no browser**: Não usar caller (que depende de `pg`) em client components
3. **Uncached data outside Suspense**: Usar `dynamic` com `ssr: false` para componentes com tRPC
