import { unstable_cache } from 'next/cache';
import { codeToHtml } from 'shiki';
import { twMerge } from 'tailwind-merge';

interface CodeBlockProps {
  code: string;
  language?: string;
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
  className,
}: CodeBlockProps) {
  const html = await cachedCodeToHtml(code, language);

  return (
    <div
      className={twMerge(
        'overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm',
        className
      )}
    >
      {/* eslint-disable-next-line react/no-dangerously-set-inner-html */}
      <div
        className="[&_pre]:!bg-transparent [&_pre]:!p-3 [&_span]:!text-text-secondary"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
