# DevRoast - AGENTS

## Projeto

Next.js 15 com App Router, Tailwind CSS, TypeScript.

## Estrutura

- `src/app/` - rotas e páginas
- `src/components/ui/` - componentes reutilizáveis
- `src/trpc/` - configuração tRPC e routers
- `src/db/` - schema e configuração Drizzle
- `specs/` - especificações de features

## Padrões

- **Styling**: Tailwind com `tailwind-variants` para variantes de componentes
- **Composição**: Componentes拆分 em sub-componentes (ex: CardRoot, CardTitle, CardDescription)
- **Hooks**: use client apenas quando necessário
- **Acessibilidade**: focus-visible e enabled: para hover states

## Comandos

- `npm run dev` - desenvolvimento
- `npm run build` - build produção
- `npm run lint` - lint
- `npm run format` - formatação
- `npm run db:generate` - gerar migrations Drizzle
- `npm run db:migrate` - aplicar migrations

## Editor

- Syntax highlighting com Shiki (tema Vesper)
- CodeEditor usa padrão de composição (CodeEditorRoot, CodeEditorHeader, CodeEditorContent)
- Textarea overlay com highlight em tempo real
- Auto-detecção de linguagem via highlight.js (pendente)
- Scroll sync entre textarea e div de highlight

## tRPC

- Usar `src/trpc/` para toda configuração
- Estrutura: `init.ts`, `routers/`, `client.tsx`, `server.tsx`
- Provider deve ser importado com `dynamic` + `ssr: false` para evitar erros de SSR
- Consultas simples podem usar `0` como valor inicial + NumberFlow para animação
- Usar `useQuery` diretamente no cliente (não prefetch em server)
