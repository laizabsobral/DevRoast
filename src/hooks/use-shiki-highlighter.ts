'use client';

import { useEffect, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

const THEME = 'vesper';
const INITIAL_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'html',
  'css',
  'json',
];

interface UseShikiHighlighterReturn {
  highlight: (code: string, lang: string) => Promise<string>;
  isReady: boolean;
  loadLanguage: (lang: string) => Promise<void>;
}

let highlighterPromise: Promise<Highlighter> | null = null;
let highlighterInstance: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: INITIAL_LANGUAGES,
    });
  }

  highlighterInstance = await highlighterPromise;
  return highlighterInstance;
}

export function useShikiHighlighter(): UseShikiHighlighterReturn {
  const [isReady, setIsReady] = useState(false);
  const highlighterRef = useRef<Highlighter | null>(null);

  useEffect(() => {
    getHighlighter().then((highlighter) => {
      highlighterRef.current = highlighter;
      setIsReady(true);
    });
  }, []);

  const highlight = async (code: string, lang: string): Promise<string> => {
    const highlighter = await getHighlighter();

    try {
      const html = highlighter.codeToHtml(code || '', {
        lang,
        theme: THEME,
      });
      return html;
    } catch {
      const plaintextHtml = highlighter.codeToHtml(code || '', {
        lang: 'plaintext',
        theme: THEME,
      });
      return plaintextHtml;
    }
  };

  const loadLanguage = async (lang: string): Promise<void> => {
    const highlighter = await getHighlighter();
    const loadedLanguages = highlighter.getLoadedLanguages();

    if (!loadedLanguages.includes(lang)) {
      try {
        await highlighter.loadLanguage(
          lang as Parameters<typeof highlighter.loadLanguage>[0]
        );
      } catch {
        // Language not available, use plaintext fallback
      }
    }
  };

  return { highlight, isReady, loadLanguage };
}
