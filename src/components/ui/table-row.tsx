import { tv } from 'tailwind-variants';

const tableRow = tv({
  base: ['flex items-center border-b border-border-primary px-5 py-4'],
});

const rankCell = tv({
  base: ['w-10 font-mono text-sm text-text-tertiary'],
});

const scoreCell = tv({
  base: ['w-[60px] font-mono text-sm font-bold'],
});

const codeCell = tv({
  base: ['flex-1 font-mono text-xs text-text-secondary truncate'],
});

const langCell = tv({
  base: ['w-[100px] font-mono text-xs text-text-tertiary text-right'],
});

export function TableRowRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={tableRow({ className })}>{children}</div>;
}

export function TableRowRank({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={rankCell({ className })}>{children}</div>;
}

export function TableRowScore({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={scoreCell({ className })}>{children}</div>;
}

export function TableRowCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={codeCell({ className })}>{children}</div>;
}

export function TableRowLang({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={langCell({ className })}>{children}</div>;
}

export { tableRow, rankCell, scoreCell, codeCell, langCell };
