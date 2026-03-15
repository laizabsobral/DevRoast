'use client';

import { type TextareaHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CodeInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
}

export function CodeInput({
  value,
  onChange,
  className,
  ...props
}: CodeInputProps) {
  const lines = ((value as string) || '').split('\n').length;

  return (
    <div
      className={twMerge(
        'w-[780px] overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm',
        className
      )}
    >
      {/* Window Header */}
      <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
        <span className="h-3 w-3 rounded-full bg-accent-red" />
        <span className="h-3 w-3 rounded-full bg-accent-amber" />
        <span className="h-3 w-3 rounded-full bg-accent-green" />
      </div>

      {/* Code Area */}
      <div className="flex">
        {/* Line Numbers */}
        <div className="flex w-12 flex-col items-end border-r border-border-primary bg-bg-surface py-3 pr-3 text-xs text-text-tertiary">
          {Array.from({ length: Math.max(lines, 15) }, (_, i) => (
            <span key={i} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={onChange}
          placeholder="// paste your code here..."
          className="flex-1 resize-none bg-transparent py-3 pl-4 pr-4 text-sm leading-6 text-text-primary placeholder:text-text-tertiary focus:outline-none"
          spellCheck={false}
          {...props}
        />
      </div>
    </div>
  );
}
