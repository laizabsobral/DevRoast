# Especificação: Editor de Código com Syntax Highlighting

## Objetivo

Criar um editor de código na home page onde usuários podem colar código e receber syntax highlighting em tempo real, com detecção automática de linguagem e opção de seleção manual.

## Referência

O app ray.so (https://github.com/raycast/ray-so) usa **Shiki** para syntax highlighting.

## Opções de Biblioteca

### 1. Shiki (Recomendado)

- **O que é**: Syntax highlighter baseado em TextMate grammars
- **Prós**: 
  - Alta qualidade de highlighting (mesmo que VS Code)
  - Suporta +100 linguagens
  - Temas do VS Code
  - Renderiza HTML puro (sem JS runtime pesado)
- **Contras**: 
  - Maior bundle size inicial
  - require bundling específico (Next.js compatible)
- **Exemplo de uso**: Já utilizado em `CodeBlock` existente

### 2. PrismJS

- **O que é**: Biblioteca leve de syntax highlighting
- **Prós**: 
  - Bundle pequeno
  - Muito popular e testado
  - Fácil de estender
- **Contras**: 
  - Qualidade inferior ao Shiki
  - Requer manipulação manual de temas

### 3. Highlight.js

- **O que é**: Syntax highlighter com auto-detecção
- **Prós**: 
  - Auto-detecção de linguagem
  - Suporta +190 linguagens
- **Contras**: 
  - Bundle grande (~910KB)
  - Qualidade média de highlighting

### 4. Monaco Editor

- **O que é**: Editor completo (mesmo do VS Code)
- **Prós**: 
  - Experiência profissional
  - Intellisense, minimap, etc.
- **Contras**: 
  - Muito pesado para nosso caso de uso
  - Overkill para simples input

## Decisão Recomendada

**Shiki** - mesmo mecanismo usado pelo ray.so, já temos no projeto, e oferece a melhor qualidade visual.

## Arquitetura

### Componentes Propostos

```
src/components/ui/
  code-editor.tsx    # Componente principal (editable)
  code-block.tsx     # Já existe (readonly, para exibir)
```

### Features

1. **Syntax Highlighting em tempo real**
   - Aplica cores conforme o usuário digita/cola
   - Suporte a JS/TS (prioridade), Python, Go, Rust, etc.

2. **Detecção Automática de Linguagem**
   - Analisar código detectado automaticamente
   - Fallback para "plaintext" se não reconhecer

3. **Seleção Manual de Linguagem**
   - Dropdown para selecionar linguagem
   - Opções: JavaScript, TypeScript, Python, Go, Rust, etc.
   - Default: JavaScript

4. **Line Numbers** (opcional)
   - Mostrar números de linha

5. **Tema**
   - Usar tema existente do projeto (dark/terminal)

## To-Dos

- [x] Criar componente `CodeEditor` em `src/components/ui/code-editor.tsx`
- [x] Integrar Shiki para highlighting em tempo real
- [x] Adicionar dropdown de seleção de linguagem
- [ ] Implementar detecção automática de linguagem
- [x] Atualizar home page para usar o novo editor
- [ ] Adicionar testes

## Perguntas Abertas

1. **Quais linguagens são prioritárias?** (JS/TS wajib, outras?)
2. **Line numbers devem ser habilitadas por padrão?**
3. **O editor deve ter altura fixa ou redimensionável?**

## Decisões

- **Linguagens**: Todas as suportadas pelo Shiki
- **Line numbers**: Sim, habilitadas por padrão
- **Altura**: Responsiva, ajusta-se ao conteúdo
