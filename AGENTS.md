# DevRoast - AGENTS

## Projeto

Next.js 15 com App Router, Tailwind CSS, TypeScript.

## Estrutura

- `src/app/` - rotas e páginas
- `src/components/ui/` - componentes reutilizáveis

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

## Editor

- Syntax highlighting com Shiki (tema Vesper)
- CodeEditor usa padrão de composição (CodeEditorRoot, CodeEditorHeader, CodeEditorContent)
- Textarea overlay com highlight em tempo real
- Auto-detecção de linguagem via highlight.js (pendente)
- Scroll sync entre textarea e div de highlight
