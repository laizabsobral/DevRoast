# Padrões de Componentes UI

## Estrutura

- Componentes em `src/components/ui/`
- Um arquivo por componente

## Padrões

### Tailwind Variants

Usar `tailwind-variants` (tv) para variantes.

### Exports

Named exports apenas.

### Props

- `ComponentPropsWithoutRef` para estender propriedades nativas
- `VariantProps` do tv para variantes

### Boas Práticas

- focus-visible para teclado
- enabled: para hover/active (não funciona em disabled)
- Design tokens do tema

## Estilos

- Preferir classes utilitárias Tailwind
- Usar tokens do tema (cores no tailwind config)

## CodeBlock

- Props: `code`, `lang` (não `language`), `filename?`, `className?`
- Usar `lang` como nome da prop para linguagem
- Suporta `BundledLanguage` do Shiki

## CodeEditor

- Props: `value`, `onChange`, `language`, `onLanguageChange?`, `className?`
- `language` deve ser `string | null`
- Usar `language as keyof typeof LANGUAGES` para indexar objetos de linguagens
