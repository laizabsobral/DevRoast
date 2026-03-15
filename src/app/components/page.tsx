import { Suspense } from 'react';
import { BadgeIndicator, BadgeRoot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CardDescription,
  CardHeader,
  CardIndicator,
  CardRoot,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import {
  DiffLineCode,
  DiffLinePrefix,
  DiffLineRoot,
} from '@/components/ui/diff-line';
import {
  ScoreRingMax,
  ScoreRingRoot,
  ScoreRingSvg,
  ScoreRingValue,
} from '@/components/ui/score-ring';
import {
  TableRowCode,
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from '@/components/ui/table-row';
import { Toggle } from '@/components/ui/toggle';

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-text-primary">
            UI Components
          </h1>
          <p className="text-text-secondary mt-2">
            Showcase de todos os componentes de UI
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Button</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">
                Colors (based on design system)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="green">Green</Button>
                <Button variant="red">Red</Button>
                <Button variant="amber">Amber</Button>
                <Button variant="orange">Orange</Button>
                <Button variant="blue">Blue</Button>
                <Button variant="cyan">Cyan</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">
                Styles
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">
                States
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Toggle</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="flex flex-wrap items-center gap-8">
              <Toggle aria-label="Roast mode" defaultPressed />
              <Toggle aria-label="Roast mode" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Badge</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="flex flex-wrap gap-4">
              <BadgeRoot>
                <BadgeIndicator variant="critical" />
                critical
              </BadgeRoot>
              <BadgeRoot>
                <BadgeIndicator variant="warning" />
                warning
              </BadgeRoot>
              <BadgeRoot>
                <BadgeIndicator variant="good" />
                good
              </BadgeRoot>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">CodeBlock</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <Suspense
              fallback={
                <div className="h-[200px] w-[560px] animate-pulse bg-bg-input rounded-md" />
              }
            >
              <CodeBlock
                code={sampleCode}
                language="javascript"
                filename="calculate.js"
              />
            </Suspense>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">DiffLine</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="w-[560px] overflow-hidden rounded-md border border-border-primary">
              <DiffLineRoot type="removed">
                <DiffLinePrefix type="removed" />
                <DiffLineCode>var total = 0;</DiffLineCode>
              </DiffLineRoot>
              <DiffLineRoot type="added">
                <DiffLinePrefix type="added" />
                <DiffLineCode>const total = 0;</DiffLineCode>
              </DiffLineRoot>
              <DiffLineRoot type="context">
                <DiffLinePrefix type="context" />
                <DiffLineCode>
                  {'for (let i = 0; i < items.length; i++) {'}
                </DiffLineCode>
              </DiffLineRoot>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Card</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <CardRoot>
              <CardHeader>
                <CardIndicator status="critical" />
                <CardTitle>using var instead of const/let</CardTitle>
              </CardHeader>
              <CardDescription>
                The var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs. Modern
                JavaScript uses const for immutable bindings and let for mutable
                ones.
              </CardDescription>
            </CardRoot>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">TableRow</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="w-[560px] overflow-hidden rounded-md border border-border-primary bg-bg-surface">
              <TableRowRoot>
                <TableRowRank>#1</TableRowRank>
                <TableRowScore className="text-accent-green">8.5</TableRowScore>
                <TableRowCode>
                  function calculateTotal(items) {'...'}
                </TableRowCode>
                <TableRowLang>javascript</TableRowLang>
              </TableRowRoot>
              <TableRowRoot>
                <TableRowRank>#2</TableRowRank>
                <TableRowScore className="text-accent-amber">6.2</TableRowScore>
                <TableRowCode>
                  const getSum = (arr) ={'>'} arr.reduce()
                </TableRowCode>
                <TableRowLang>javascript</TableRowLang>
              </TableRowRoot>
              <TableRowRoot>
                <TableRowRank>#3</TableRowRank>
                <TableRowScore className="text-accent-red">3.1</TableRowScore>
                <TableRowCode>
                  let result = items.map(x ={'>'} {'...'}
                </TableRowCode>
                <TableRowLang>javascript</TableRowLang>
              </TableRowRoot>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">ScoreRing</h2>

          <div className="space-y-6 p-6 bg-bg-elevated rounded-lg border border-border-primary">
            <div className="flex flex-wrap items-center justify-center gap-12 py-8">
              <ScoreRingRoot>
                <ScoreRingSvg score={3.5} />
                <ScoreRingValue score={3.5} />
                <ScoreRingMax />
              </ScoreRingRoot>
              <ScoreRingRoot>
                <ScoreRingSvg score={6.8} />
                <ScoreRingValue score={6.8} />
                <ScoreRingMax />
              </ScoreRingRoot>
              <ScoreRingRoot>
                <ScoreRingSvg score={9.2} />
                <ScoreRingValue score={9.2} />
                <ScoreRingMax />
              </ScoreRingRoot>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
