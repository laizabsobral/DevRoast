'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { BundledLanguage } from 'shiki';

type CollapsibleCodeBlockProps = {
  code: string;
  lang: BundledLanguage;
  maxLines?: number;
};

export function CollapsibleCodeBlock({
  code,
  lang,
  maxLines = 5,
}: CollapsibleCodeBlockProps) {
  const [open, setOpen] = useState(false);
  const lines = code.split('\n');
  const isTruncated = lines.length > maxLines;

  const displayCode = open ? code : lines.slice(0, maxLines).join('\n');

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-2">
        <div
          className={`overflow-hidden rounded-md border border-border-primary ${
            !open && isTruncated ? 'max-h-[120px]' : ''
          }`}
        >
          <CodeBlockContent code={displayCode} lang={lang} />
        </div>

        {isTruncated && (
          <Collapsible.Trigger className="flex items-center gap-1 self-start rounded border border-border-primary bg-bg-surface px-2 py-1 font-mono text-xs text-text-tertiary hover:bg-bg-input hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-accent-green">
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
            {open ? 'Show less' : `Show ${lines.length - maxLines} more lines`}
          </Collapsible.Trigger>
        )}
      </div>
    </Collapsible.Root>
  );
}

function CodeBlockContent({
  code,
  lang,
}: {
  code: string;
  lang: BundledLanguage;
}) {
  const lines = code.split('\n');

  return (
    <div className="flex bg-bg-input">
      <div className="flex flex-col items-end gap-1.5 py-3 px-2.5 w-10 border-r border-border-primary bg-bg-surface select-none">
        {lines.map((_, i) => (
          <span
            key={i}
            className="font-mono text-[13px] leading-tight text-text-tertiary"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div className="flex-1 p-3 overflow-x-auto font-mono text-[13px] leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent [&_.line]:leading-[1.65]">
        <code>{code}</code>
      </div>
    </div>
  );
}
