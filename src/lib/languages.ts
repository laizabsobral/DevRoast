export const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    shikiId: 'javascript',
    hljsId: 'javascript',
    aliases: ['js', 'jsx'],
  },
  typescript: {
    name: 'TypeScript',
    shikiId: 'typescript',
    hljsId: 'typescript',
    aliases: ['ts', 'tsx'],
  },
  python: {
    name: 'Python',
    shikiId: 'python',
    hljsId: 'python',
    aliases: ['py'],
  },
  go: {
    name: 'Go',
    shikiId: 'go',
    hljsId: 'go',
    aliases: ['golang'],
  },
  rust: {
    name: 'Rust',
    shikiId: 'rust',
    hljsId: 'rust',
    aliases: ['rs'],
  },
  java: {
    name: 'Java',
    shikiId: 'java',
    hljsId: 'java',
    aliases: [],
  },
  ruby: {
    name: 'Ruby',
    shikiId: 'ruby',
    hljsId: 'ruby',
    aliases: ['rb'],
  },
  php: {
    name: 'PHP',
    shikiId: 'php',
    hljsId: 'php',
    aliases: [],
  },
  sql: {
    name: 'SQL',
    shikiId: 'sql',
    hljsId: 'sql',
    aliases: [],
  },
  bash: {
    name: 'Bash',
    shikiId: 'bash',
    hljsId: 'bash',
    aliases: ['sh', 'shell', 'zsh'],
  },
  html: {
    name: 'HTML',
    shikiId: 'html',
    hljsId: 'xml',
    aliases: [],
  },
  css: {
    name: 'CSS',
    shikiId: 'css',
    hljsId: 'css',
    aliases: [],
  },
  json: {
    name: 'JSON',
    shikiId: 'json',
    hljsId: 'json',
    aliases: [],
  },
  yaml: {
    name: 'YAML',
    shikiId: 'yaml',
    hljsId: 'yaml',
    aliases: ['yml'],
  },
  markdown: {
    name: 'Markdown',
    shikiId: 'markdown',
    hljsId: 'markdown',
    aliases: ['md'],
  },
  c: {
    name: 'C',
    shikiId: 'c',
    hljsId: 'c',
    aliases: [],
  },
  cpp: {
    name: 'C++',
    shikiId: 'cpp',
    hljsId: 'cpp',
    aliases: ['c++'],
  },
  csharp: {
    name: 'C#',
    shikiId: 'csharp',
    hljsId: 'csharp',
    aliases: ['cs', 'c#'],
  },
  swift: {
    name: 'Swift',
    shikiId: 'swift',
    hljsId: 'swift',
    aliases: [],
  },
  kotlin: {
    name: 'Kotlin',
    shikiId: 'kotlin',
    hljsId: 'kotlin',
    aliases: ['kt'],
  },
  dart: {
    name: 'Dart',
    shikiId: 'dart',
    hljsId: 'dart',
    aliases: [],
  },
  plaintext: {
    name: 'Plain Text',
    shikiId: 'plaintext',
    hljsId: 'plaintext',
    aliases: ['text', 'txt'],
  },
} as const;

export type LanguageId = keyof typeof LANGUAGES;

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(([id, lang]) => ({
  value: id,
  label: lang.name,
}));

export function getLanguageByHljsId(hljsId: string): LanguageId | null {
  const entry = Object.entries(LANGUAGES).find(
    ([, lang]) => lang.hljsId === hljsId
  );
  return entry ? (entry[0] as LanguageId) : null;
}

export function getLanguageName(id: string): string {
  return LANGUAGES[id as LanguageId]?.name ?? id;
}
