import { tv } from 'tailwind-variants';

const badge = tv({
  base: ['inline-flex items-center gap-2 font-mono text-xs transition-colors'],
});

export function BadgeRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={badge({ className })}>{children}</span>;
}

export function BadgeIndicator({
  variant,
}: {
  variant?: 'critical' | 'warning' | 'good';
}) {
  const colorClass =
    variant === 'critical'
      ? 'bg-accent-red'
      : variant === 'warning'
        ? 'bg-accent-amber'
        : 'bg-accent-green';

  return <span className={`block h-2 w-2 rounded-full ${colorClass}`} />;
}

export { badge };
