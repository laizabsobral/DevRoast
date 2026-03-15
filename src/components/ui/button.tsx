import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'font-mono font-medium cursor-pointer',
    'transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  variants: {
    variant: {
      primary: [
        'bg-accent-green text-bg-page',
        'enabled:hover:bg-green-primary',
        'enabled:active:bg-accent-green/80',
      ],
      secondary: [
        'bg-transparent text-text-primary',
        'border border-border-primary',
        'enabled:hover:bg-bg-elevated',
        'enabled:active:bg-bg-surface',
      ],
      ghost: [
        'bg-transparent text-text-secondary',
        'enabled:hover:text-text-primary',
        'enabled:hover:bg-bg-elevated',
        'enabled:active:bg-bg-surface',
      ],
      danger: [
        'bg-accent-red text-white',
        'enabled:hover:bg-destructive',
        'enabled:active:bg-accent-red/80',
      ],
      green: [
        'bg-accent-green text-bg-page',
        'enabled:hover:bg-green-primary',
        'enabled:active:bg-accent-green/80',
      ],
      red: [
        'bg-accent-red text-white',
        'enabled:hover:brightness-110',
        'enabled:active:brightness-90',
      ],
      amber: [
        'bg-accent-amber text-bg-page',
        'enabled:hover:brightness-110',
        'enabled:active:brightness-90',
      ],
      orange: [
        'bg-accent-orange text-white',
        'enabled:hover:brightness-110',
        'enabled:active:brightness-90',
      ],
      blue: [
        'bg-accent-blue text-white',
        'enabled:hover:brightness-110',
        'enabled:active:brightness-90',
      ],
      cyan: [
        'bg-accent-cyan text-bg-page',
        'enabled:hover:brightness-110',
        'enabled:active:brightness-90',
      ],
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-xs',
      lg: 'px-6 py-2.5 text-[13px]',
    },
  },
  defaultVariants: {
    variant: 'green',
    size: 'lg',
  },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={button({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { button, type ButtonProps, type ButtonVariants };
