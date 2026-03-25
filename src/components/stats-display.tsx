'use client';

import NumberFlow from '@number-flow/react';

export function StatsDisplay({
  totalRoasts,
  avgScore,
}: {
  totalRoasts: number;
  avgScore: number;
}) {
  return (
    <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
      <span>
        <NumberFlow value={totalRoasts} format={{ notation: 'compact' }} />{' '}
        codes roasted
      </span>
      <span>·</span>
      <span>
        avg score:{' '}
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </div>
  );
}
