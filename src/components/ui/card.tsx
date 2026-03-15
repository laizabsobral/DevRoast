import { tv } from 'tailwind-variants';

const card = tv({
  base: [
    'w-[480px] rounded-md border border-border-primary p-5',
    'bg-bg-surface transition-colors',
  ],
});

const cardHeader = tv({
  base: ['flex items-center gap-2'],
});

const cardTitle = tv({
  base: ['font-mono text-sm'],
});

const cardDescription = tv({
  base: ['font-mono text-xs leading-relaxed', 'text-text-secondary'],
});

const cardIndicator = tv({
  base: ['block h-2 w-2 rounded-full'],
  variants: {
    status: {
      critical: ['bg-accent-red'],
      warning: ['bg-accent-amber'],
      good: ['bg-accent-green'],
    },
  },
});

export function CardRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={card({ className })}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cardHeader({ className })}>{children}</div>;
}

export function CardIndicator({
  status,
}: {
  status?: 'critical' | 'warning' | 'good';
}) {
  return <span className={cardIndicator({ status })} />;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cardTitle({ className })}>{children}</span>;
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cardDescription({ className })}>{children}</p>;
}

export { card, cardHeader, cardTitle, cardDescription, cardIndicator };
