'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { useLanguageDetection } from '@/hooks/use-language-detection';
import { useShikiHighlighter } from '@/hooks/use-shiki-highlighter';
import {
  getLanguageByHljsId,
  getLanguageName,
  LANGUAGE_OPTIONS,
} from '@/lib/languages';

const codeEditor = tv({
  base: [
    'w-full min-h-[200px] max-h-[400px] overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm',
  ],
});

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  showDetectedBadge?: boolean;
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
  detectedLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  showDetectedBadge = true,
}: {
  language?: string;
  detectedLanguage?: string | null;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  showDetectedBadge?: boolean;
}) {
  const displayLanguage = language || detectedLanguage || 'plaintext';
  const isAutoDetected = !language && !!detectedLanguage;

  return (
    <div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        {showDetectedBadge && isAutoDetected && (
          <span className="ml-2 rounded bg-accent-green/20 px-2 py-0.5 font-mono text-[10px] text-accent-green">
            {getLanguageName(detectedLanguage || 'plaintext')}
          </span>
        )}
        {showDetectedBadge &&
          !isAutoDetected &&
          displayLanguage !== 'plaintext' && (
            <span className="ml-2 rounded bg-bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-tertiary">
              {getLanguageName(displayLanguage)}
            </span>
          )}
      </div>
      {showLanguageSelector && (
        <div className="relative">
          <select
            value={language || ''}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="appearance-none rounded border border-border-primary bg-bg-elevated px-3 py-1.5 pr-8 font-mono text-xs text-text-secondary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
          >
            <option value="">Auto-detect</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>
      )}
    </div>
  );
}

export function CodeEditorContent({
  value,
  onChange,
  language = 'plaintext',
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  className?: string;
}) {
  const { highlight, isReady, loadLanguage } = useShikiHighlighter();
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const lines = (value || '').split('\n').length;

  const doHighlight = useCallback(
    async (code: string, lang: string) => {
      if (!isReady || !code) {
        setHighlightedCode('');
        setIsHighlighted(false);
        return;
      }

      await loadLanguage(lang);
      const html = await highlight(code, lang);
      setHighlightedCode(html);
      setIsHighlighted(true);
    },
    [highlight, isReady, loadLanguage]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      doHighlight(value || '', language);
    }, 0);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, language, doHighlight]);

  useEffect(() => {
    if (value && isReady && !isHighlighted) {
      doHighlight(value, language);
    }
  }, [isReady, value, language, isHighlighted, doHighlight]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className={`relative flex max-h-[400px] overflow-hidden ${className}`}>
      {/* Line Numbers */}
      <div className="flex w-12 flex-none flex-col items-end border-r border-border-primary bg-bg-surface py-3 pr-3 text-xs text-text-tertiary">
        {Array.from({ length: Math.max(lines, 15) }, (_, i) => (
          <span key={i} className="leading-6">
            {i + 1}
          </span>
        ))}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-auto">
        {/* Highlighted Code Layer (only visible when ready) */}
        <pre
          ref={preRef}
          className={`absolute inset-0 overflow-auto p-3 text-sm leading-6 [&_pre]:!bg-transparent [&_span]:!text-text-secondary ${
            isHighlighted ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Plain text fallback (visible when not highlighted) */}
        <pre
          className={`absolute inset-0 overflow-auto p-3 text-sm leading-6 text-text-secondary ${
            isHighlighted ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          {value || ''}
        </pre>

        {/* Textarea Layer */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setIsHighlighted(false);
            onChange?.(e.target.value);
          }}
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
  language,
  onLanguageChange,
  showLanguageSelector = true,
  showDetectedBadge = true,
  className,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);
  const { language: detectedLanguage } = useLanguageDetection(
    mounted ? value || '' : ''
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveLanguage = useMemo(() => {
    if (language) {
      return language;
    }
    if (detectedLanguage) {
      const mapped = getLanguageByHljsId(detectedLanguage);
      return mapped || 'plaintext';
    }
    return 'plaintext';
  }, [language, detectedLanguage]);

  return (
    <CodeEditorRoot className={className}>
      <CodeEditorHeader
        language={language}
        detectedLanguage={mounted ? detectedLanguage : null}
        onLanguageChange={onLanguageChange}
        showLanguageSelector={showLanguageSelector}
        showDetectedBadge={showDetectedBadge}
      />
      <CodeEditorContent
        value={value}
        onChange={onChange}
        language={effectiveLanguage}
      />
    </CodeEditorRoot>
  );
}
