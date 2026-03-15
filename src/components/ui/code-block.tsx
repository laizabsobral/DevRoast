import { unstable_cache } from 'next/cache';
import { codeToHtml } from 'shiki';
import { twMerge } from 'tailwind-merge';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

const cachedCodeToHtml = unstable_cache(
  async (code: string, lang: string) => {
    return codeToHtml(code, {
      lang,
      theme: 'vesper',
      transformers: [
        {
          line(node, line) {
            node.properties['data-line'] = String(line);
          },
        },
      ],
    });
  },
  ['shiki-code-block'],
  { revalidate: 3600 }
);

export async function CodeBlock({
  code,
  language = 'javascript',
  filename,
  className,
}: CodeBlockProps) {
  const html = await cachedCodeToHtml(code, language);

  return (
    <div
      className={twMerge(
        'w-[560px] overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm',
        className
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        {filename && (
          <span className="ml-auto text-xs text-text-tertiary">{filename}</span>
        )}
      </div>
      {/* eslint-disable-next-line react/no-dangerously-set-inner-html */}
      <div
        className="[&_pre]:!bg-transparent [&_pre]:!p-3 [&_span]:!text-text-secondary"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
