'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';
import { tv } from 'tailwind-variants';

const codeEditor = tv({
  base: [
    'w-full min-h-[200px] overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm',
  ],
});

const languageOptions = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'xml',
  'markdown',
  'sql',
  'bash',
  'shell',
  'powershell',
  'dockerfile',
  'graphql',
  'lua',
  'perl',
  'r',
  'matlab',
  'julia',
  'elixir',
  'erlang',
  'haskell',
  'clojure',
  'fsharp',
  'ocaml',
  'dart',
  'lua',
];

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  className?: string;
}

export function CodeEditorRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={codeEditor({ className })}>{children}</div>;
}

export function CodeEditorHeader({
  language,
  onLanguageChange,
  showLanguageSelector = true,
}: {
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
}) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
      </div>
      {showLanguageSelector && (
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="bg-transparent font-mono text-xs text-text-tertiary focus:outline-none"
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function CodeEditorContent({
  value,
  onChange,
  language = 'javascript',
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  className?: string;
}) {
  const [highlightedCode, setHighlightedCode] = useState('');
  const highlighterRef = useRef<Highlighter | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const lines = (value || '').split('\n').length;

  useEffect(() => {
    async function initHighlighter() {
      if (!highlighterRef.current) {
        highlighterRef.current = await createHighlighter({
          themes: ['vesper'],
          langs: languageOptions,
        });
      }
    }
    initHighlighter();
  }, []);

  const highlightCode = useCallback(async (code: string, lang: string) => {
    if (!highlighterRef.current) return code;

    try {
      const html = highlighterRef.current.codeToHtml(code, {
        lang,
        theme: 'vesper',
      });
      return html;
    } catch {
      return code;
    }
  }, []);

  useEffect(() => {
    const code = value || '';
    highlightCode(code, language).then(setHighlightedCode);
  }, [value, language, highlightCode]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className={`relative flex ${className}`}>
      {/* Line Numbers */}
      <div className="flex w-12 flex-col items-end border-r border-border-primary bg-bg-surface py-3 pr-3 text-xs text-text-tertiary">
        {Array.from({ length: Math.max(lines, 15) }, (_, i) => (
          <span key={i} className="leading-6">
            {i + 1}
          </span>
        ))}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Highlighted Code Layer */}
        <pre
          ref={preRef}
          className="absolute inset-0 overflow-auto p-3 text-sm leading-6 [&_pre]:!bg-transparent [&_span]:!text-text-secondary"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Textarea Layer */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={handleScroll}
          placeholder="// paste your code here..."
          spellCheck={false}
          className="absolute inset-0 h-full w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 text-transparent caret-text-primary placeholder:text-text-tertiary focus:outline-none"
          style={{ whiteSpace: 'pre' }}
        />
      </div>
    </div>
  );
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  onLanguageChange,
  showLanguageSelector = true,
  className,
}: CodeEditorProps) {
  return (
    <CodeEditorRoot className={className}>
      <CodeEditorHeader
        language={language}
        onLanguageChange={onLanguageChange}
        showLanguageSelector={showLanguageSelector}
      />
      <CodeEditorContent
        value={value}
        onChange={onChange}
        language={language}
      />
    </CodeEditorRoot>
  );
}
