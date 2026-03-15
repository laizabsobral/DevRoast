import { tv, type VariantProps } from 'tailwind-variants';

const diffLine = tv({
  base: [
    'flex items-center gap-2 px-4 py-2 font-mono text-sm',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  variants: {
    type: {
      removed: ['bg-diff-removed', 'text-text-secondary'],
      added: ['bg-diff-added', 'text-text-primary'],
      context: ['bg-transparent', 'text-text-secondary'],
    },
  },
  defaultVariants: {
    type: 'context',
  },
});

type DiffLineVariants = VariantProps<typeof diffLine>;

const prefixSymbols = {
  removed: '-',
  added: '+',
  context: ' ',
};

export function DiffLineRoot({
  children,
  type,
  className,
}: {
  children: React.ReactNode;
  type?: 'removed' | 'added' | 'context';
  className?: string;
}) {
  return <div className={diffLine({ type, className })}>{children}</div>;
}

export function DiffLinePrefix({
  type,
}: {
  type?: 'removed' | 'added' | 'context';
}) {
  return (
    <span className="w-3 select-none">{prefixSymbols[type ?? 'context']}</span>
  );
}

export function DiffLineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <code className={className}>{children}</code>;
}

export { diffLine, type DiffLineVariants };
