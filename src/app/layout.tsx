import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/navbar';

export const metadata: Metadata = {
  title: 'devroast | roast your code',
  description: 'Paste your code. Get roasted.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-page font-mono antialiased">
        <Navbar />
        <main className="mx-auto flex max-w-[960px] flex-col items-center px-10 pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
