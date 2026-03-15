import Link from 'next/link';
import { Button } from './button';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={`flex h-14 items-center justify-between border-b border-border-primary bg-bg-page px-10 ${className}`}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent-green">›</span>
        <span className="font-mono text-lg font-medium text-text-primary">
          devroast
        </span>
      </Link>

      <Link href="/leaderboard">
        <span className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
          leaderboard
        </span>
      </Link>
    </nav>
  );
}
