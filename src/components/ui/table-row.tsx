import { tv } from 'tailwind-variants';

const tableRow = tv({
  base: ['flex w-full items-center border-b border-border-primary px-5 py-4'],
});

const rankCell = tv({
  base: ['w-[50px] font-mono text-xs text-text-secondary'],
});

const scoreCell = tv({
  base: ['w-[70px] font-mono text-xs font-bold text-accent-red'],
});

const codeCell = tv({
  base: ['flex flex-1 flex-col gap-0.5 font-mono text-xs text-text-primary'],
});

const langCell = tv({
  base: ['w-[100px] font-mono text-xs text-text-secondary'],
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

export { codeCell, langCell, rankCell, scoreCell, tableRow };
