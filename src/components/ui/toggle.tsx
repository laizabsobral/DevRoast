'use client';

import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const toggle = tv({
  base: ['inline-flex items-center gap-3 font-mono text-sm transition-colors'],
  variants: {
    checked: {
      true: 'text-accent-green',
      false: 'text-text-secondary',
    },
  },
});

const track = tv({
  base: [
    'relative w-10 h-[22px] rounded-full p-[3px] transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus',
  ],
  variants: {
    checked: {
      true: 'bg-accent-green',
      false: 'bg-border-primary',
    },
  },
});

const knob = tv({
  base: [
    'block w-4 h-4 rounded-full shadow-sm transition-transform duration-150',
  ],
  variants: {
    checked: {
      true: 'translate-x-[18px] bg-bg-page',
      false: 'translate-x-0 bg-text-tertiary',
    },
  },
});

type ToggleVariants = VariantProps<typeof toggle>;

type ToggleProps = Omit<
  ComponentPropsWithoutRef<typeof BaseToggle>,
  'className'
> &
  ToggleVariants & {
    className?: string;
  };

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, defaultPressed, disabled, id, ...restProps }, ref) => {
    const isChecked = pressed ?? defaultPressed ?? false;
    const generatedId = useId();
    const toggleId = id || generatedId;
    return (
      <div className={toggle({ checked: isChecked, className })}>
        <BaseToggle
          ref={ref}
          id={toggleId}
          pressed={pressed}
          defaultPressed={defaultPressed}
          disabled={disabled}
          className={track({ checked: isChecked })}
        >
          <span className={knob({ checked: isChecked })} />
        </BaseToggle>
        {restProps['aria-label'] && (
          <label htmlFor={toggleId} className="cursor-pointer">
            {restProps['aria-label']}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { toggle, type ToggleVariants };
