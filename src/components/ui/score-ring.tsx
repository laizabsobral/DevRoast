import { tv } from 'tailwind-variants';

const scoreRing = tv({
  base: ['relative inline-flex items-center justify-center'],
});

const scoreValue = tv({
  base: ['font-mono text-5xl font-bold'],
  variants: {
    score: {
      good: ['text-accent-green'],
      warning: ['text-accent-amber'],
      critical: ['text-accent-red'],
    },
  },
});

const scoreMax = tv({
  base: ['font-mono text-base text-text-tertiary'],
});

export function ScoreRingRoot({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={scoreRing({ className })} style={style}>
      {children}
    </div>
  );
}

export function ScoreRingSvg({
  score,
  maxScore = 10,
  className,
}: {
  score: number;
  maxScore?: number;
  className?: string;
}) {
  const size = 180;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColor =
    score >= 7
      ? 'stroke-accent-green'
      : score >= 4
        ? 'stroke-accent-amber'
        : 'stroke-accent-red';

  return (
    <svg
      role="img"
      aria-label={`Score: ${score} out of ${maxScore}`}
      className={`absolute inset-0 -rotate-90 ${className}`}
      width={size}
      height={size}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-border-primary"
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={`transition-all duration-500 ${strokeColor}`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
}

export function ScoreRingValue({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const scoreLevel = score >= 7 ? 'good' : score >= 4 ? 'warning' : 'critical';
  return (
    <span
      className={scoreValue({ score: scoreLevel, className })}
      style={{ lineHeight: 1 }}
    >
      {score.toFixed(1)}
    </span>
  );
}

export function ScoreRingMax({
  maxScore = 10,
  className,
}: {
  maxScore?: number;
  className?: string;
}) {
  return (
    <span className={scoreMax({ className })} style={{ lineHeight: 1 }}>
      /{maxScore}
    </span>
  );
}

export { scoreRing, scoreValue, scoreMax };
