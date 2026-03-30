import { asc, avg, count, eq } from 'drizzle-orm';
import { z } from 'zod';
import { analysisItems, roasts } from '@/db/schema';
import { analyzeCode } from '@/lib/ai/roast';
import { baseProcedure, createTRPCRouter } from '../init';

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: Number(stats?.totalRoasts) ?? 0,
      avgScore: Number(stats?.avgScore) ?? 0,
    };
  }),

  getLeaderboard: baseProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const [stats, entries] = await Promise.all([
        ctx.db.select({ totalCount: count() }).from(roasts),
        ctx.db
          .select({
            id: roasts.id,
            code: roasts.code,
            language: roasts.language,
            score: roasts.score,
          })
          .from(roasts)
          .orderBy(asc(roasts.score))
          .limit(input.limit)
          .offset(offset),
      ]);

      const totalCount = Number(stats[0]?.totalCount) ?? 0;
      const totalPages = Math.ceil(totalCount / input.limit);

      return {
        entries: entries.map((e, index) => ({
          rank: offset + index + 1,
          id: e.id,
          code: e.code,
          language: e.language,
          score: Number(e.score),
        })),
        pagination: {
          page: input.page,
          limit: input.limit,
          totalCount,
          totalPages,
        },
      };
    }),

  createRoast: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string().min(1),
        roastMode: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lineCount = input.code.split('\n').length;

      const analysis = await analyzeCode(
        input.code,
        input.language,
        input.roastMode
      );

      const [roast] = await ctx.db
        .insert(roasts)
        .values({
          code: input.code,
          language: input.language,
          lineCount,
          roastMode: input.roastMode,
          score: analysis.score,
          verdict: analysis.verdict,
          roastQuote: analysis.summary,
          suggestedFix: analysis.suggestedFix,
        })
        .returning();

      await ctx.db.insert(analysisItems).values(
        analysis.issues.map((issue, index) => ({
          roastId: roast.id,
          severity: issue.severity as 'critical' | 'warning' | 'good',
          title: issue.title,
          description: issue.description,
          order: index,
        }))
      );

      return { id: roast.id };
    }),

  getRoastById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [roast] = await ctx.db
        .select()
        .from(roasts)
        .where(eq(roasts.id, input.id));

      if (!roast) {
        throw new Error('Roast not found');
      }

      const items = await ctx.db
        .select()
        .from(analysisItems)
        .where(eq(analysisItems.roastId, input.id))
        .orderBy(analysisItems.order);

      return {
        id: roast.id,
        code: roast.code,
        language: roast.language,
        score: Number(roast.score),
        summary: roast.roastQuote,
        verdict: roast.verdict,
        suggestedFix: roast.suggestedFix,
        issues: items.map((item) => ({
          severity: item.severity,
          title: item.title,
          description: item.description,
        })),
      };
    }),
});
